# Case Study: Real Tool Use in a Support Agent

## Problem

Participants enrolled in the "My Grupolive" Work and Travel cultural exchange program face a complex post-enrollment journey: visa documentation, employer interviews, sponsor submission, consular interview, travel prep. They have frequent, repetitive questions:

- **Document-specific**: "Why was my certificate rejected?" "What format does the DNI need?" "How do I resubmit?"
- **Process-specific**: "What comes after this stage?" "When do I interview with the employer?" "What's the next step?"
- **Policy and edge cases**: "Can I change my assigned employer?" "Can I defer my visa date?" "What if I fail the interview?"

This volume falls into a "tyranny of a thousand small questions" — high-frequency, low-complexity per question, but collectively a significant time sink for the human support team.

## Product insight

An internal Opportunity Solution Tree exercise mapped this problem to a cluster of related outcomes:

- **Desired outcome**: Participants self-serve confidently through post-enrollment documentation and process steps; staff time is freed from repetitive status and how-to questions and can focus on exception handling and human-touch situations.
- **Opportunity**: Participants don't know their document/process status or how to fix rejections; there's no quick way to look up "what stage am I in" or "what's needed to move to the next one"; support staff spend time restating the same instructions across 50+ participants.
- **Solution direction**: A bot or agent that can answer "where am I in the process," "what went wrong," and "how do I fix it" — without hallucinating policy or making up rules.

## Why this prototype, not a production system

This is deliberately a **narrow slice** that validates the *agent pattern*, not a full rebuild of My Grupolive:

- **No real auth**: Participants identify by typing their name (free-text, no password/session) — sufficient to prove the concept works, not secure enough for production.
- **No real data layer**: Participant state is hardcoded in the repo — validates the tool contract and agent reasoning loop, not the data persistence and sync story.
- **No real file handling**: No document upload or verification — keeps scope small.
- **No staff dashboard**: Escalations are logged / posted to a webhook; there's no built-in UI for the support team to triage them.

The **one thing that is real**: tool use via the Claude API. The agent doesn't rely on retrieval, embedding similarity, or keyword matching. It has explicit tools and must decide when to call them.

## Architecture decisions

### 1. Tool use instead of RAG

Classic RAG (embedding-based document retrieval) is a poor fit here because:

- **Structured, mutable per-participant state** (document approval/rejection, current stage) is not semantically "similar text to retrieve." It's an exact lookup that changes per person. RAG can't reliably return "Maria's Certificado is rejected for this specific reason."
- **Action** (escalate to staff when confused) isn't a retrieval problem. RAG doesn't "decide to give up and escalate."
- **Hallucination risk**: Without explicit function boundaries, the model can invent documents, statuses, or policies.

Tool use is the right boundary:

- `get_participant_status` is a direct lookup: "give me Maria's current stage and all her items."
- `get_faq` is exact key/alias matching, not semantic search — precision over fuzzy recall.
- `escalate_to_staff` is an explicit action, not inferred post-hoc.

The tool definitions *are* the contract; the system prompt enforces strict discipline ("never assume state; always call the tool first").

### 2. Small model by default

Haiku 4.5 is cheap and sufficient for this workload: the agent's job is to route questions to tools, not reason deeply. The tools carry the structured reasoning weight. If the model later needs to handle ambiguous multi-step scenarios, it can be bumped to Sonnet 5 (env var, no code change).

### 3. Prompt caching and efficiency

Since this may be shown publicly or deployed, we bake in cost practices from day one:

- **Prompt caching**: System prompt + tool definitions are cached (cache_control on the system block). With Haiku 4.5's minimum cacheable size (~4096 tokens) and our ~700-1100 token prefix, hits may not happen consistently, but they cost nothing to set up correctly and will work if/when the prompt grows.
- **History truncation**: Only the last ~12 messages (6 turn-pairs) are sent to the API each request, not the full conversation. The frontend keeps the full transcript for display.
- **Bounded output**: Max 600 tokens per response (short, conversational) — not verbose essays.
- **Tool-use loop cap**: Maximum 5 tool calls per user message. If the agent can't resolve in 5 steps, it escalates directly (no extra model call burned).

### 4. Escalation as a model-driven tool call

When the agent can't resolve something (no FAQ entry, no clear next step, edge-case policy question), it **calls a tool** (`escalate_to_staff`) rather than:
- ❌ Making a guess ("probably it's policy X").
- ❌ Letting post-hoc heuristics detect uncertainty ("if the model output had too many 'I think's, escalate").

This keeps the "when to give up" judgment **inside the reasoning loop where it belongs**, and it's auditabled: the escalation log captures what question was asked and why the agent couldn't handle it.

### 5. Spanish (Rioplatense) by design

The system prompt enforces Argentine Spanish with voseo ("tenés," "podés," "fijate") — not neutral Spanish or a default "generic Spanish." Tone is casual and clear; no corporate-speak or boilerplate closings. Participants are already enrolled in the program, so the agent's voice should match that cultural context.

## Scope: v1

**Implemented**:
- Hardcoded mock data (3 test participants, all stages, item states).
- Name-based identification (no password).
- 4 explicit tools backed by direct server-side functions.
- Escalation webhook (optional; app doesn't fail if URL is empty).
- Rioplatense tone + strict tool-use system prompt.

**Not implemented** (by design; v2 candidates):
- Real authentication or user accounts.
- Database or Airtable integration.
- Real file upload/storage.
- Staff dashboard for escalation triage.
- Persistent chat history across sessions.
- Multi-language support.

## Next steps (v2, v3)

### v2: Replace mock data with Airtable via MCP

Once the agent pattern is validated, swap hardcoded `PARTICIPANTS` and `FAQ_DATA` for live Airtable tables via the n8n or Airtable MCP connector. No change to tool signatures; just the underlying data fetch.

### v3: Real n8n integration via MCP

Replace the manual `escalate_to_staff` webhook with direct invocation of an n8n workflow via MCP. Let the model trigger complex automation (send email, create Zendesk ticket, assign to queue) directly through Claude's MCP bridge.

### v4: Real auth + staff dashboard

Add real authentication (OAuth, email+password, etc.) and a dashboard for staff to view escalations, update participant status, and track resolution. This is where the business logic solidifies into a real product.

## Why this matters for a portfolio

This prototype demonstrates:

1. **Real tool use, not toy examples**: Not "chain of thought" or "retrieval summarization," but actual function calling in a production SDK.
2. **Thoughtful cost & performance**: Caching, history truncation, output bounds, loop caps — the kinds of details that make a deployed system sustainable.
3. **System prompt discipline**: The prompt is the contract; it enforces tool use, prevents hallucination, and drives behavior at scale.
4. **Boundary design**: What's a tool vs. what's system logic vs. what's mock data, and how to swap layers (e.g., mock → Airtable) without changing the agent's core loop.
5. **Cultural & linguistic fit**: Not generic chatbot tone, but localized to the user base (Rioplatense Spanish for an Argentine program).

In a sense, this is a "boring" agent story — not multi-hop reasoning or adversarial robustness, but boring in the way production systems need to be: predictable, auditable, cost-conscious, and culturally grounded.
