# WorkLang AI — Database

> **Status:** implemented in **Phase 0.3** (see [roadmap.md](roadmap.md)). The
> authoritative schema lives in [`prisma/schema.prisma`](../prisma/schema.prisma);
> the first migration is in `prisma/migrations/`. This document explains the
> intent and naming behind that schema. Only the data foundation exists —
> repositories, services, and application logic come in later phases.

## Principle: database-first

PostgreSQL is the **single source of truth** for all core learning data. Every
engine (deterministic and LLM) reads and writes through a persistence service
backed by PostgreSQL, planned via Prisma.

**Core learning data — always in PostgreSQL, never in the browser:**

- progress
- mistakes
- mastery
- review queue
- writing history
- LLM cost history

**`localStorage` — temporary UI state only.** For example: the active tab, a
draft not yet submitted, or a collapsed/expanded panel. Clearing `localStorage`
must never lose any learning data. If a value would be sad to lose, it belongs
in PostgreSQL, not `localStorage`.

**Static lesson content — local project data.** For the MVP, lesson content
(lessons, grammar, professional vocabulary, professional reading) lives as
versioned files under `src/data/`, not in the database. PostgreSQL stores only
the learner's interaction with that content (progress, mistakes, mastery, review
queue, writing history, LLM cost history). **Prisma** is the ORM used to access
PostgreSQL.

## Implemented models

The Phase 0.3 schema realizes the conceptual entities below. A few names and
shapes differ from the original sketch, for the reasons noted:

| Concept (this doc) | Prisma model(s)                | Note                                    |
| ------------------ | ------------------------------ | --------------------------------------- |
| User               | `User` + `UserPreference`      | settings/targets split 1-1 for tidiness |
| Progress           | `LessonProgress`               | one row per user + lesson               |
| (exercise results) | `ExerciseAttempt`              | deterministic attempt + local check     |
| WritingHistory     | `WritingAttempt`               | LLM fields nullable until Phase 7       |
| Mistake            | `Mistake`                      | links back to the attempt that made it  |
| Mastery            | `MasteryRecord`                | unique per user + language + topic      |
| ReviewQueue        | `ReviewQueueItem`              | spaced-repetition scheduling fields     |
| LlmCostHistory     | `LlmRequestLog` + `CostRecord` | request log vs. cost accounting, 1-1    |

Design decisions worth flagging:

- **LLM cost history is two normalized tables.** `LlmRequestLog` records the
  operational fact of a call (type, model, status, tokens, latency);
  `CostRecord` holds the money (input/output tokens, currency, `estimatedCost`)
  one-to-one with its request. This keeps request logging and cost accounting
  independent while still tying every cost to exactly one call.
- **Enums** encode closed sets: `Language`, `CareerTrack`, `CefrLevel`,
  `SkillArea`, `ProgressStatus`, `MistakeSource`, `ReviewItemType`,
  `ReviewState`, `LlmRequestType`, `LlmRequestStatus`.
- **Timestamps.** Mutable rows carry `createdAt` + `updatedAt`; append-only rows
  (attempts, request/cost logs) carry `createdAt` only.
- **Referential integrity.** User-owned rows cascade on user delete; optional
  back-links (e.g. a mistake's originating attempt) use `SetNull`.

The field lists below are the conceptual summary; consult the schema for the
exact, authoritative definition.

## Core entities (conceptual)

### User

The learner. Single-user MVP, but modeled explicitly so multi-user is a later,
additive change rather than a rewrite.

- `id`, `createdAt`
- target levels (e.g. German C1, English B2)
- active career track

### Progress

Per-lesson / per-skill progress for a user.

- `userId`, `lessonId` / `skillId`
- status, completion, timestamps

### Mistake

An individual recorded error, produced by the deterministic error engine (and
enriched by the LLM layer). See [error-engine.md](error-engine.md).

- `userId`
- language, skill/grammar topic, error category
- prompt/expected/given
- `createdAt`

### Mastery

Per-topic mastery estimate for a user, computed deterministically.

- `userId`, `topicId`
- score, sample size, `updatedAt`

### ReviewQueue

Spaced-repetition scheduling entries.

- `userId`, `itemId` (mistake or topic)
- due date, interval, ease/streak

### WritingHistory

Free-writing submissions and their LLM feedback.

- `userId`, submitted text
- feedback, CEFR estimate, improved version
- `createdAt`

### LlmCostHistory

One row per LLM call for full cost transparency. See
[llm-integration.md](llm-integration.md).

- `userId`, task type, model
- input/output tokens, estimated cost
- `createdAt`

## Non-goals for the data layer (MVP)

- authentication tables / sessions (auth is deferred)
- analytics warehousing
- storing core learning data anywhere other than PostgreSQL
