# WorkLang AI — Lesson Engine

> **Status:** design only. Implemented across Phases 2–4 (Lesson Repository &
> Static Content, Main Lesson UI, and the Deterministic Practice Engine — see
> [roadmap.md](roadmap.md)). Lives in `src/domain/lessons` and
> `src/domain/practice`.

The lesson engine is **deterministic**. It does not call the LLM. It runs
lessons and grammar exercises, checks answers locally, and emits results that
the error and mastery engines consume.

## Responsibilities

- Load lessons, grammar exercises, and vocabulary from static content in
  `src/data/`.
- Present exercises to the UI in a stable, typed shape.
- Check answers **locally and deterministically** (exact match, normalized
  match, accepted-alternatives lists, and rule-based grammar checks).
- Emit structured results: which exercise, expected answer, given answer, and
  whether it was correct.

## Content model

Static content is data, not code, and lives under `src/data/`:

- `src/data/lessons/` — lessons grouped by track and skill.
- `src/data/grammar/` — grammar exercises and their accepted answers.
- `src/data/vocabulary/` — professional vocabulary sets.

Content is versioned in the repo. It is deterministic input; it is not stored in
the database (only the learner's interaction with it is).

## Persistence (database-first)

All learner-facing outcomes are written to PostgreSQL through the persistence
service, never to `localStorage`:

- lesson/exercise **progress** → `LessonProgress`
- incorrect answers → handed to the error engine, stored as `Mistake`
- correct/incorrect outcomes → feed `MasteryRecord`

`localStorage` may hold only transient state such as the current exercise index
in an unsubmitted session.

## Boundaries

- **No LLM.** If a check can be done with rules or lists, it is done here.
- The lesson engine does **not** compute mastery or schedule reviews — it emits
  results and hands them to the error/mastery engines. See
  [error-engine.md](error-engine.md).
- The lesson engine does **not** talk to the UI framework directly; it exposes
  plain typed functions/data consumed by `src/app` and `src/components`.
