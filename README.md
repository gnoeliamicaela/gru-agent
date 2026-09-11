# My Grupolive Agent

A portfolio prototype demonstrating real AI agent tool use (function calling) via the Claude API, rather than classic RAG. The agent helps participants in a Work and Travel cultural exchange program (My Grupolive) resolve post-enrollment questions: document status, sponsor submission, employer interviews, consular interview, and travel prep.

## Architecture highlights

- **Tool use, not RAG**: The model decides which tools to invoke and in what order, examining results before each next step.
- **Mock data, no real DB or auth**: Participant state and 3 test users are hardcoded; identification is by free-text name entry (not secure auth).
- **Escalation via tool call**: The model calls `escalate_to_staff` when it can't resolve something, triggering a webhook POST (optional).
- **Cost & efficiency from day one**: Small model (Haiku 4.5), prompt caching, truncated history, bounded output, tool-use loop turn caps.

## Setup

1. Copy `.env.example` to `.env.local` and fill in your `ANTHROPIC_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser.

## Test users

Enter any of these names at the name gate to start chatting:

- **María**: Currently in "Carga y validación...". One document (Certificado) rejected with a specific motivo; DNI approved.
- **Juan**: Same stage. CV is pending; Certificado is approved (different from María).
- **Lucía**: Already past documentation, in "Presentación de documentación ante el sponsor". DS-2019 form is pending (no reject).

Test the agent by asking:

- "¿Por qué me rechazaron el certificado?" (María) → Must call `get_participant_status`, cite the exact motivo.
- "¿Qué me falta?" (María) → Calls `get_participant_status` + `get_stage_requirements`, distinguishes states.
- "¿Cómo subo el CV?" (Juan) → Calls `get_faq("Curriculum Vitae/Resume")`, doesn't invent steps.
- "¿Qué sigue?" (Lucía) → Calls `get_stage_requirements()` (no argument), looks up next stage by orden_etapa.
- "Can I change my assigned employer?" → No FAQ coverage → calls `escalate_to_staff`, marks conversation as escalated.

## Tools

The agent has 4 tools:

1. **get_participant_status**: Returns current stage and item states (aprobado/rechazado/pendiente + motivo).
2. **get_stage_requirements**: Returns the full ordered catalog of items for a stage (or all 6 stages if no stage arg).
3. **get_faq**: Returns FAQ entry (proposito, que_implica, dudas_comunes) for a document or milestone.
4. **escalate_to_staff**: POSTs to `N8N_WEBHOOK_ESCALATION_URL` (if set); safe to call even if webhook URL is empty.

The system prompt enforces strict tool-use discipline: the agent must call the appropriate tool before answering, never inventing state or instructions.

## Key files

- **`app/api/chat/route.ts`**: The tool-use loop endpoint. Sends system + tools with cache_control, executes tool calls in a loop (max 5 turns), escalates on cap exceed.
- **`lib/mock-data.ts`**, **`lib/stage-requirements.ts`**, **`lib/faq-data.ts`**: Hardcoded state and content.
- **`lib/tools/tool-executors.ts`**: Server-side tool implementations (fetch state, execute escalation webhook, etc.).
- **`app/page.tsx`**, **`components/`**: Simple client UI (name gate + chat window).

## Environment variables

See `.env.example`. The key ones:

- `ANTHROPIC_API_KEY`: Required. Your Claude API key.
- `ANTHROPIC_MODEL_ID`: Default `claude-haiku-4-5-20251001`. Can swap to `claude-sonnet-5` for higher reasoning capacity.
- `N8N_WEBHOOK_ESCALATION_URL`: Optional. If set, escalations will POST here; if empty or invalid, the app logs and continues.
- `CHAT_MAX_TOOL_TURNS`: Default 5. Hard cap on tool-use loop iterations before forcing escalation.
- `CHAT_MAX_TOKENS`: Default 600. Max tokens per response (short, conversational replies).

## Deployment

The app is a standard Next.js project. Deploy to Vercel, self-hosted Node, or any Next.js-compatible runtime. Remember to set environment variables in your deployment platform.

## Next steps (v2, not implemented)

- **Real authentication & session**: Instead of free-text name + client-side match.
- **Real participant database** (Airtable, PostgreSQL, etc.) **via MCP**: Replace hardcoded mock data.
- **Direct n8n workflow invocation via MCP**: Instead of a manual webhook POST.
- **Staff dashboard**: To view and triage escalations.
- **Persistent conversation history**: Store chat across sessions (currently ephemeral per session).

## Documentation

- **`docs/case-study.md`**: Problem statement, product decisions, and scope.
- **`docs/decisions/0001-real-tool-use-over-rag.md`**: Architecture decision record explaining tool use vs. RAG.

## Notes

- **Prompt caching**: The system prompt + tool definitions are cached via Claude API (cache_control on the system block). With Haiku 4.5, the prefix (~700-1100 tokens) is below the minimum cacheable size (~4096 tokens), so cache hits may not appear. This is expected and doesn't break functionality; switching to Claude Sonnet 5 would enable consistent caching.
- **Spanish tone**: Rioplatense (Argentina) Spanish with voseo. System prompt enforces clear, casual language for program participants.
- **No hallucination**: The agent refuses to invent state, instructions, or policies. When unsure, it escalates.
