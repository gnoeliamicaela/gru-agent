# ADR-0001: Real Tool Use Over Classic RAG

**Status**: Accepted  
**Date**: 2025-09-10  
**Author**: Claude (via portfolio project)  

## Context

The agent needs to answer two distinct categories of questions:

1. **Structured, mutable, per-participant state**: "What's my current stage?" "Is my DNI approved?" "Why was my document rejected?"
2. **Canonical, explanatory content**: "How do I fill out the DS-160?" "What does a consular interview involve?" "What is the SEVIS fee?"

Classic RAG (embedding-based semantic search over a document corpus) is often proposed as a general solution. However, it's a poor fit for structured state and explicitly-actionable scenarios.

### Why RAG alone falls short

**For structured state**:
- **Exact lookup, not similarity search**: "What's Maria's Certificado status?" is not answered better by finding semantically similar text. It's an exact record that either exists or doesn't. Embeddings can hallucinate near-hits ("similar-sounding documents"), leading to wrong advice.
- **Mutable, per-request state**: Participant states change hourly (documents approved, etapas progress). RAG systems are optimized for slowly-changing corpora, not live per-request lookups.
- **Risk of aggregation**: If the system retrieves "Certificado de alumno regular" documentation across 50 participants, it may average or blend statuses, confidently stating something half-true to one participant.

**For actions**:
- **Escalation is not a retrieval problem**: When the agent is confused and should "hand off to a human," that's a decision and an action, not a search query. RAG has no native notion of "I don't know" or "trigger a workflow." Post-hoc heuristics (e.g., "if confidence < 0.7, escalate") are brittle and invisible.

### Why RAG works elsewhere

RAG is excellent for:
- Large, slowly-changing corpora (e.g., "summarize our 1000-page employee handbook").
- Retrieval-dominant workflows ("find the policy section about time off").
- Scenarios where approximate/fuzzy matches are acceptable ("similar to the user's question").

None of those apply here.

## Decision

Use **explicit tool definitions** backed by deterministic server-side functions, rather than RAG or hybrid retrieval.

### The 4 tools

1. **`get_participant_status(participant_id)`** → structured JSON: { current_stage, items: [{ name, estado, motivo_rechazo? }] }
   - Direct lookup, no retrieval.
   - Source of truth for "where am I?"

2. **`get_stage_requirements(etapa?)`** → JSON catalog of the full ordered set of documents/milestones for a stage (or all 6 stages if `etapa` is omitted).
   - Direct lookup.
   - Source of truth for "what's supposed to come next?"

3. **`get_faq(topic)`** → JSON: { proposito, que_implica, dudas_comunes }
   - Exact key/alias matching (not embedding retrieval).
   - Topics are drawn from the item catalog, so no new topics can surprise the system.
   - Source of truth for "how do I do this?"

4. **`escalate_to_staff(participant_id, question, reason)`** → action: POST to webhook with structured payload.
   - Explicit decision point: when the agent can't resolve with tools 1–3, it calls this.
   - Auditable: every escalation is logged with the question and the agent's reason.

### System prompt discipline

The system prompt enforces:

1. "Before answering ANY question about state/progress, call `get_participant_status` first. Never assume or invent."
2. "Before answering about the full set/order of a stage, call `get_stage_requirements`. Never complete from memory."
3. "Before explaining how to do something, call `get_faq`. Never invent instructions."
4. "When you can't resolve with tools 1–3, call `escalate_to_staff`. Never guess or give a half-answer."

This is the **contract** between the system prompt and the tools. The prompt's job is to enforce it.

## Consequences

### Pros

✅ **Exact, auditable answers**: No hallucination about state. Maria gets told her Certificado is rejected for the exact reason (from the mock data), not a plausible-sounding guess.

✅ **Explicit boundaries**: The tool signatures are the API contract. If we want to swap the mock data for Airtable in v2, we change the tool's internals, not its signature or the agent's behavior.

✅ **Clear escalation logic**: Not a hidden decision made post-hoc by heuristics, but an explicit tool call. Escalations are auditable: "Agent couldn't find an FAQ entry for this topic, so it escalated."

✅ **No retrieval overhead**: No embeddings to compute, no vector DB to maintain. Tool executors are simple functions.

✅ **Extensible via MCP**: In v2, these tools can invoke Airtable via MCP (for live data) or n8n workflows (for complex actions), without changing the agent loop.

### Cons

❌ **Upfront schema design**: Each tool requires a precise input/output contract. You can't just "add a document" to a corpus and have it automatically available; you have to update the tool and the FAQ data.

❌ **No fuzzy recall**: If a participant says "Resume" instead of "Curriculum Vitae/Resume," the FAQ lookup might miss it unless we add aliases upfront. (Mitigated by having aliases in the FAQ schema, but still requires thought.)

❌ **Brittleness if the catalog changes**: If we add or rename a stage, the stage-requirements tool needs an update. This is actually a *benefit* for auditability, but it's more rigid than "just add a document to the corpus."

## Alternatives considered

### 1. Hybrid: RAG + structured tools

Use RAG for FAQ and structured tools for status.

**Why not**: Splits the abstraction in a confusing way. If the FAQ tool sometimes retrieves (fuzzy) and sometimes doesn't (exact), the agent's mental model breaks down. Better to pick one boundary per category.

### 2. Keyword/pattern matching

Route questions via simple heuristics ("if 'rechazado' is in the query, call get_participant_status").

**Why not**: Doesn't scale to ambiguous queries ("I don't know what's wrong with my certificate"). The model's reasoning is the dispatcher, not regex or keyword filters.

### 3. No tools; pure RAG

Embed the participant handbooks, FAQ, mock data into a vector store and let the model retrieve whatever it needs.

**Why not**: See "Context" section. Escalation becomes guesswork. State is unreliable. Hallucinations compound.

## Related decisions

- [Case Study](../case-study.md): Problem framing and product context.
- Later ADRs will cover: "Real auth vs. mock" (v2), "Airtable via MCP" (v2/v3).

## Questions for future implementation

- Should tools return confidence scores or only return on exact match? (Answer: only on exact match; tool failure is a signal for escalation, not a probability.)
- Should the system prompt include example conversations? (Answer: outside this ADR, but examples in the prompt can make tool-use discipline more reliable; test before shipping.)
