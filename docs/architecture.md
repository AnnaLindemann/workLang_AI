# WorkLang AI — Architecture

AI-powered professional language coach for German (towards C1) and English
(towards B2), focused on grammar, professional vocabulary, business writing,
professional reading, and written communication in real work contexts. See
[project-overview.md](project-overview.md) for the product goal.

## Career tracks

1. AI Consultant
2. Customer Success / Hospitality with an AI component

## Hybrid system

The system deliberately separates deterministic logic from LLM usage. Do not use
the LLM where deterministic logic is sufficient. These two layers combine into
the end-to-end learning loop described in
[project-overview.md](project-overview.md#the-learning-loop) — deterministic
review, theory, vocabulary, reading, and practice, with a single LLM step for
writing feedback.

### Deterministic layer

- lessons
- grammar exercises
- local answer checking
- mistake tracking
- review queue
- mastery calculation

See [lesson-engine.md](lesson-engine.md) and [error-engine.md](error-engine.md).

### LLM layer

- free writing feedback
- explanation of mistakes
- CEFR estimation
- improved text version
- personalized recommendations
- cost tracking

See [llm-integration.md](llm-integration.md) and [prompts.md](prompts.md).

## Database-first architecture

WorkLang AI is **database-first for user data**. PostgreSQL is the single source
of truth for all core learning data: progress, mistakes, mastery, review queue,
writing history, and LLM cost history.

- The deterministic and LLM layers read and write this data through a
  persistence service; they never treat the browser as the store of record.
- `localStorage` may hold **temporary UI state only** (e.g. an open tab, an
  in-progress unsent form). Clearing it must never lose learning progress.
- Access to PostgreSQL is through **Prisma** (the ORM), added in Phase 0.3.
  Static lesson content stays as local project data in `src/data/`; only user
  data lives in PostgreSQL. See [database.md](database.md) and
  [roadmap.md](roadmap.md).

## Data flow

```
UI (src/app, src/components)
      │  transient view state → localStorage (only)
      ▼
Domain engines (src/domain: lessons, practice, errors, mastery, cost)
      │  deterministic reads/writes
      ▼
Persistence service (src/services/storage → Prisma → PostgreSQL)  ← source of truth
      ▲
LLM service (src/services/llm) ── writes cost rows ──┘
```

## Folder structure

```
src/
  app/         Next.js App Router routes and layouts
  components/  Reusable UI components
  data/        Static content
    lessons/
    grammar/
    vocabulary/
  domain/      Deterministic business logic
    lessons/
    practice/
    errors/     Deterministic mistake metadata validation/grouping
    mastery/
    cost/
  lib/         Framework-agnostic utilities
  services/    Integrations
    llm/       LLM provider integration (not implemented yet)
    storage/   Persistence layer → Prisma + PostgreSQL (repositories not
               implemented yet; schema/client exist)
  types/       Shared TypeScript types
  generated/   Generated code (Prisma Client → generated/prisma; gitignored)
prisma/        Prisma schema and migrations
docs/          Project documentation
```

## In scope for the MVP

- the database (PostgreSQL) as the source of truth for user data
- the deterministic lesson, practice, error, and mastery engines
- the LLM layer for feedback, estimation, and recommendations
- LLM cost tracking

## Out of scope for the MVP

- authentication and multi-user accounts (single-user MVP)
- job interview training
- speech / pronunciation
- full RAG with embeddings
- mobile app
- complex gamification

> Note: the **database is in scope** and central to the MVP. Only
> **authentication** is deferred. These are separate concerns.

## Phase status

See [roadmap.md](roadmap.md) for the full Phase 0–11 plan.

- **Phase 0 — Foundation:** done. Project bootstrap (0.1), documentation (0.2),
  and Prisma + PostgreSQL setup (0.3) — initial schema, generated client, and
  first migration in place. No repositories/services yet.
- **Phases 0–5:** foundation, domain/content/UI, deterministic practice, and
  persisted error/mastery processing are implemented.
- **Phase 6 — Adaptive Review:** next; review-queue generation is not yet
  implemented.
