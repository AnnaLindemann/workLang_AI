# WorkLang AI — LLM Integration

> **Status:** design only. Not implemented. Implemented in Phase 7 (LLM Writing
> Feedback), with per-request cost tracking in Phase 8 (see
> [roadmap.md](roadmap.md)). Lives in `src/services/llm`.

The LLM layer handles the tasks that genuinely need natural-language
understanding and generation. It sits **on top of** the deterministic engines
and never replaces them.

## Guiding rule

**Do not use the LLM where deterministic logic is sufficient.** Answer checking,
mistake categorization, review scheduling, and mastery are deterministic (see
[lesson-engine.md](lesson-engine.md) and [error-engine.md](error-engine.md)).
The LLM is reserved for open-ended language work.

## Responsibilities

- **Free-writing feedback** — evaluate a learner's written text in a work
  context.
- **Mistake explanation** — produce a clear, human explanation for a recorded
  mistake (without changing scheduling or mastery).
- **CEFR estimation** — estimate the level of a writing sample (towards German
  C1 / English B2).
- **Improved text version** — offer a stronger rewrite that preserves the
  learner's intent.
- **Personalized recommendations** — suggest what to practice next, informed by
  mastery and mistake history.

The concrete prompt templates live in [prompts.md](prompts.md).

## Provider and models

The intended provider is **Anthropic Claude**. Model selection is deferred to
implementation and chosen per task by cost/quality trade-off — for example a
larger model (e.g. Claude Opus 4.8) for nuanced feedback and a smaller, cheaper
model (e.g. Claude Haiku 4.5) for lightweight tasks. Exact model IDs and
API details are finalized in Phase 7, not here.

## Cost tracking (database-first)

Every LLM call **must** be logged in PostgreSQL (see [database.md](database.md))
as an `LlmRequestLog` row (the operational record) with a one-to-one
`CostRecord` (the cost accounting):

- request type, model, status (on `LlmRequestLog`),
- input/output tokens,
- estimated cost,
- timestamp.

Cost history is core learning/operational data. It is never kept only in
memory or in `localStorage`. This makes LLM spend transparent and auditable.

## Boundaries

- The LLM layer reads context (mistakes, mastery, writing history) through the
  persistence service; it does not own that data.
- LLM output that is worth keeping (feedback, CEFR estimate, improved version)
  is persisted to the `WritingAttempt` row.
- Failures must degrade gracefully: a missing LLM response never corrupts
  deterministic progress, mistakes, or mastery.
