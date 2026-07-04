# WorkLang AI — LLM Integration

> **Status:** design only. Not implemented. Implemented in Phase 7 (LLM Writing
> Feedback), with per-request cost tracking in Phase 8 (see
> [roadmap.md](roadmap.md)). Lives in `src/services/llm`.

The LLM layer handles the tasks that genuinely need natural-language
understanding and generation. It sits **on top of** the deterministic engines
and never replaces them.

## Guiding rule

**Do not use the LLM where deterministic logic is sufficient.** Answer checking
for `GradedExercise` content (multiple choice, fill-in-the-blank, short
controlled answers, tightly defined word order), mistake categorization, review
scheduling, and mastery are deterministic (see
[lesson-engine.md](lesson-engine.md) and [error-engine.md](error-engine.md)).
The LLM is reserved for open-ended language work — including `OpenExercise`
content and free/semi-free writing that deterministic string matching cannot
fairly grade because more than one answer can be correct.

## Responsibilities

- **Free-writing feedback** — evaluate a learner's written text in a work
  context. Free and semi-free writing is graded here, not by deterministic
  matching, and the model returns a **structured JSON** result that is validated
  against a fixed schema before anything is persisted.
- **Open grammar checking** — a lightweight, **universal** mini-check for open
  grammar exercises (one prompt for all of them, never one per topic): decide
  whether a semi-free answer is a grammatically valid solution to the exercise,
  accepting alternative correct formulations. It returns short structured JSON,
  prefers the cheaper fallback model, and is kept strictly separate from
  free-writing feedback (no business style, tone, CEFR, or long-form judgement).
  See Phase 7.2 in [roadmap.md](roadmap.md).
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

The provider is **Groq** (OpenAI-compatible API). Two models are used, both of
which support Groq's **strict structured outputs** — constrained decoding that
guarantees the response matches the supplied JSON schema:

- **Primary — `openai/gpt-oss-120b`.** Preferred for grammar correction (English
  and German), CEFR estimation, business-writing feedback, and JSON reliability.
- **Fallback — `openai/gpt-oss-20b`.** Cheaper and faster, on the same strict
  structured-output path, used when the primary is rate-limited or errors.

Model IDs are configured via environment variables (`GROQ_MODEL_PRIMARY`,
`GROQ_MODEL_FALLBACK`) with the API key in `GROQ_API_KEY` (see
[LLM Environment Variables](#llm-environment-variables)). Even though strict mode
guarantees the schema, every response is still validated with **Zod** before it
is persisted. All calls are **server-side only**.

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

## LLM Environment Variables

LLM provider configuration is introduced in **Phase 7** — the first phase where a
real LLM request is allowed, and not before. The variables are:

```txt
GROQ_API_KEY          # secret, server-side only; real value only in local .env
GROQ_MODEL_PRIMARY    # openai/gpt-oss-120b
GROQ_MODEL_FALLBACK   # openai/gpt-oss-20b
```

Only blank/placeholder values live in `.env.example`; the real `GROQ_API_KEY` is
never committed. The key must never be exposed to the client (no `NEXT_PUBLIC_`
prefix) and is read only in server code.
