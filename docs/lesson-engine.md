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

## What is checked deterministically

Practice uses a discriminated union with two explicit content models:

- `GradedExercise` is a closed or controlled exercise whose correct answers are
  known and finite. It has `evaluation: "GRADED"`, an `expectedAnswer`, and an
  optional `acceptedAnswers` list. It is checked and persisted
  deterministically.
- `OpenExercise` is semi-free production with multiple valid answers. It has
  `evaluation: "OPEN"` and a `sampleAnswer`, but no `expectedAnswer`. It is
  never sent to deterministic checking or persisted as an `ExerciseAttempt`.

`GradedExercise` is appropriate for:

- multiple choice,
- fill-in-the-blank,
- short controlled answers,
- tightly defined word-order tasks.

`OpenExercise` tasks and open production tasks (for example the writing task)
must **not**
be strictly marked wrong by deterministic string matching, because more than one
answer can be correct. For those tasks the engine shows a **sample answer and an
explanation** instead of a pass/fail grade, and a learner's answer is never
graded as incorrect only because it differs from `expectedAnswer`. Grading
free/semi-free writing is the LLM layer's job (Phase 7, structured JSON
validation — see [llm-integration.md](llm-integration.md)).

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
