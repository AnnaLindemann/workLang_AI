# WorkLang AI — Roadmap

This roadmap tracks phases from bootstrap to a usable MVP. Each phase is small,
verifiable, and does not depend on future phases being designed in detail.

## Guiding constraints

- **Database-first.** PostgreSQL is the source of truth for all core learning
  data (progress, mistakes, mastery, review queue, writing history, LLM cost
  history). This is decided and does not change across phases.
- **`localStorage` is for temporary UI state only.** It is never a store for
  core learning data. There is no phase in which learning progress lives in
  `localStorage`; the roadmap must not imply otherwise.
- **Deterministic before LLM.** Deterministic engines are built and persisted
  before LLM features are layered on top.

Together the phases build the complete learning loop described in
[project-overview.md](project-overview.md#the-learning-loop): deterministic
lesson content and practice first, then LLM writing feedback, then the data,
dashboard, and content that close the loop.

## Phase 0 — Foundation ✅ (done)

The groundwork the rest of the MVP builds on.

- **0.1 Project Bootstrap** ✅ — Next.js (App Router) + TypeScript foundation,
  folder structure, tooling (ESLint + Prettier), and a placeholder homepage.
- **0.2 Documentation** ✅ — core project docs created and aligned; the
  database-first decision recorded.
- **0.3 Prisma + PostgreSQL Setup** ✅ — Prisma + `@prisma/client`, the
  PostgreSQL connection via `DATABASE_URL` (`prisma.config.ts`, `.env.example`),
  the initial schema (`prisma/schema.prisma`), the generated client, and the
  first migration. No repositories/services, lessons, LLM, or UI.

## Phase 1 — Core Domain Model (next)

The shared, deterministic domain model and TypeScript types for lessons,
exercises, attempts, mistakes, mastery, and review — the common vocabulary the
engines and the persistence layer agree on. No UI, no LLM.

## Phase 2 — Lesson Repository & Static Content

Static lesson content as **local project data** under `src/data/` (lessons,
grammar, professional vocabulary, professional reading) plus a repository that
loads it. Content stays local; only the learner's interaction with it is
persisted to PostgreSQL.

## Phase 3 — Main Lesson UI

The lesson-taking flow: language selection → career-track selection → lesson
selection, and the in-lesson screens. `localStorage` may hold transient UI
state only.

## Phase 4 — Deterministic Practice Engine

Grammar theory, professional vocabulary, professional reading, and
deterministic grammar practice with local answer checking (see
[lesson-engine.md](lesson-engine.md)). Results persist to PostgreSQL. No LLM.

## Phase 5 — Error Engine & Mastery Engine

Mistake storage and categorization, and deterministic mastery calculation (see
[error-engine.md](error-engine.md)). All state persists to PostgreSQL. No LLM.

## Phase 6 — Adaptive Review

The spaced-repetition review queue and the review block that opens each lesson,
adapting to prior mistakes and mastery.

## Phase 7 — LLM Writing Feedback

The writing task → LLM feedback path (see
[llm-integration.md](llm-integration.md) and [prompts.md](prompts.md)):
free-writing feedback, CEFR estimation, improved text, mistake explanations, and
recommendations. LLM output is persisted; deterministic data never depends on
it.

## Phase 8 — Cost Tracking & Observability

Every LLM request records a request log and a cost record in PostgreSQL, making
LLM spend transparent and auditable.

## Phase 9 — Progress Dashboard

A learner-facing view of progress, mistakes, mastery, and LLM cost, read from
PostgreSQL.

## Phase 10 — Content Expansion

Broaden lessons, grammar, vocabulary, and reading across both career tracks and
toward the German C1 / English B2 targets.
## Content Creation Principles

All lesson content must be original.

Grammar explanations:
- Based on reputable references (Cambridge, Oxford, British Council, Goethe, DW, Duden, etc.).
- Written in original wording.
- Never copied from external sources.

Professional reading texts:
- Always original.
- Written specifically for WorkLang AI.
- Relevant to the selected career track.

Practice exercises:
- Deterministic.
- Must include exact answer keys.
- Must be locally verifiable.

Writing tasks:
- Original business scenarios.
- Relevant to the lesson grammar and vocabulary.

Metadata:
Each lesson should reference the grammar sources used for validation (if applicable), but must not reproduce copyrighted text.

## Phase 11 — Portfolio Release

Polish, documentation, and release as a portfolio-ready MVP.

## Later (post-MVP)

Authentication and multi-user accounts, job interview training, speech /
pronunciation, full RAG with embeddings, mobile app, and richer gamification.
See the non-goals in [project-overview.md](project-overview.md).
