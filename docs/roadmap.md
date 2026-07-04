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

## LLM environment configuration

LLM API keys and provider-specific environment variables must not be introduced
before Phase 7. Phase 7 is the first phase where a real LLM request is allowed.

Before Phase 7:

- no LLM provider API key of any kind;
- no LLM provider client;
- no hidden test calls to an LLM.

All LLM configuration must remain server-side and must be connected to
structured output validation and cost tracking.

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

## Phase 1 — Core Domain Model ✅ (done)

The shared, deterministic domain model and TypeScript types for lessons,
exercises, attempts, mistakes, mastery, and review — the common vocabulary the
engines and the persistence layer agree on. No UI, no LLM.

## Phase 2 — Lesson Repository & Static Content ✅ (done)

Static lesson content as **local project data** under `src/data/` (lessons,
grammar, professional vocabulary, professional reading) plus a repository that
loads it. Content stays local; only the learner's interaction with it is
persisted to PostgreSQL.

## Phase 3 — Main Lesson UI ✅ (done)

The lesson-taking flow: language selection → career-track selection → lesson
selection, and the in-lesson screens. `localStorage` may hold transient UI
state only.

## Phase 4 — Deterministic Practice Engine ✅ (done)

Grammar theory, professional vocabulary, professional reading, and
deterministic grammar practice with local answer checking (see
[lesson-engine.md](lesson-engine.md)). Results persist to PostgreSQL. No LLM.

Deterministic checking is **only for `GradedExercise` content** (closed or
controlled exercises with `expectedAnswer` and optional `acceptedAnswers`):

- multiple choice,
- fill-in-the-blank,
- short controlled answers,
- tightly defined word-order tasks.

`OpenExercise` content uses `sampleAnswer` instead of `expectedAnswer`.
Open-ended and semi-free production tasks must **not** be strictly auto-graded
with deterministic string matching, because multiple correct answers are
possible, and they do not produce `ExerciseAttempt` rows.

For Phase 4:

- `GradedExercise` tasks are checked locally and persisted;
- `OpenExercise` tasks show a sample answer and an explanation;
- `OpenExercise` tasks are neither graded nor persisted as deterministic
  attempts.

For Phase 5:

- the Error Engine stores deterministic mistakes first;
- later it also accepts LLM-derived mistakes from free/semi-free writing.

For Phase 7:

- the LLM evaluates free/semi-free writing using structured JSON validation.

## Phase 5 — Error Engine & Mastery Engine ✅ (done)

Mistake storage and categorization, and deterministic mastery calculation (see
[error-engine.md](error-engine.md)). All state persists to PostgreSQL. No LLM.
The Error Engine stores deterministic mistakes first (from closed/controlled
exercises); it later also accepts LLM-derived mistakes from free/semi-free
writing once Phase 7 lands.

## Phase 6 — Adaptive Review ✅ (done)

The spaced-repetition review queue and the review block that opens each lesson,
adapting to prior mistakes and mastery.

## Phase 7 — LLM Writing Feedback

The writing task → LLM feedback path (see
[llm-integration.md](llm-integration.md) and [prompts.md](prompts.md)):
free-writing feedback, CEFR estimation, improved text, mistake explanations, and
recommendations. The LLM evaluates free/semi-free writing using structured JSON
validation — the tasks that deterministic matching cannot fairly grade. LLM
output is persisted; deterministic data never depends on it.

## Phase 7.1 — Vocabulary Trainer (standalone mode)

### Goal

Vocabulary practice is a **separate learning mode**, not embedded in lessons.
Lessons stay focused on learning; the in-lesson vocabulary block is a study list
only (with a pronunciation button per term). Active matching practice lives in a
standalone **Vocabulary Trainer** opened explicitly from the main navigation
(`/vocabulary`).

### Source and session

- The trainer draws from **every** vocabulary item across **all** lesson files
  (deduplicated by language + term), not just one lesson. Lesson files remain the
  vocabulary source; PostgreSQL stores only progress.
- Each session is exactly **5** term↔meaning pairs, selected **deterministically**
  from a mix of: new, previously failed, low-mastery, and not-recently-practiced
  items. Mastered items normally drop out and only occasionally resurface.

### User Experience

Mobile-first, **tap-to-match** (no drag-and-drop): tap a term on the left, then
its meaning on the right. Correct → green + locked + success persisted; wrong →
red + retry allowed + failure persisted. Large touch targets, no horizontal
scrolling. A speaker button pronounces each term.

### Persistence, Error Engine, Mastery

Reuses the deterministic attempt pipeline (`recordVocabularyMatch` →
`ExerciseAttempt` → mastery + Error Engine): each term is its own mastery topic
(`SkillArea.Vocabulary`), wrong matches become `Vocabulary`/`Matching` mistakes,
and per-term success/failure/last-practiced are derived from the existing rows
(no schema redesign). An item is **mastered after more than 10 successful
matches**; wrong answers reduce mastery and raise future priority. Vocabulary
mastery is independent from grammar mastery.

### Adaptive Review

The Vocabulary Trainer is independent from lesson review. The lesson review
algorithm is unchanged and still surfaces vocabulary mistakes when appropriate
(repeated mistakes prioritized, mastered items less often, max 5 tasks, no LLM).

### Pronunciation

A speaker button (browser Web Speech API / `SpeechSynthesis`) pronounces terms in
the lesson vocabulary list and on trainer term cards. Client-side only — no LLM,
no paid TTS, no key. It picks a German/English voice when available, degrades
gracefully when unsupported, and never blocks the lesson or trainer. In the
trainer the speaker never triggers card selection. Optional `transcription` /
`pronunciationHint` fields are shown when present and never invented.

### Acceptance Criteria

✓ Vocabulary matching removed from lessons; the list is learning-only.
✓ Standalone Vocabulary Trainer page, reachable from navigation.
✓ Exactly 5 deterministic pairs per session, drawn from all lessons.
✓ Mobile-first tap-to-match with green/red feedback.
✓ Progress persisted; mastery after >10 successes; weak items repeat.
✓ Existing review and Error Engine keep working; no LLM calls.
✓ Pronunciation button in the lesson list and trainer, with graceful fallback.

## Phase 7.2 — LLM Check for Open Grammar Exercises

### Goal

Open grammar exercises (`OpenExercise`, `SkillArea.Grammar`) used to only show a
sample answer. This phase adds a lightweight, **universal** LLM checker (one
prompt for all open grammar exercises — never one per grammar topic) that judges
whether the learner's answer is a grammatically valid solution to the exercise.

### Behaviour

- Accepts alternative correct formulations; does not require an exact match with
  the sample answer.
- Judges grammar correctness and whether the instruction was fulfilled — **not**
  business style, tone, CEFR, or long-form quality (that stays in the WritingTask
  feedback path, which remains separate).
- Returns short structured JSON, validated with Zod before persistence; malformed
  responses degrade gracefully (the answer is not persisted, the call is logged
  as an error).
- Prefers the cheaper fallback model (`openai/gpt-oss-20b`), escalating to the
  primary only on failure.
- The UI clearly indicates when an AI check is used (no hidden calls). For German
  article/noun mistakes, the correction always names the correct article.

### Persistence

Reuses the deterministic attempt pipeline: the LLM verdict becomes an
`ExerciseAttempt` (`isCorrect`), so mastery and the Error Engine behave exactly
as for graded grammar exercises, and every call is logged (`LlmRequestLog` +
`CostRecord`, request type `GRAMMAR_CHECK`). Deterministic (graded) exercises
remain fully deterministic and are never sent to the LLM.

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
