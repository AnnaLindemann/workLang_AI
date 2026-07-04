# WorkLang AI — Error & Mastery Engine

> **Status:** Phase 5 mistake aggregation and mastery updates and Phase 6
> adaptive review are implemented. Deterministic logic lives in
> `src/domain/errors`, `src/domain/mastery`, and `src/domain/review`;
> transactional persistence lives in `src/services/storage`.

The error engine is **deterministic**. It records mistakes, categorizes them,
schedules reviews, and computes mastery. It does not call the LLM (the LLM may
later _explain_ a mistake, but it never decides scheduling or mastery).

## Responsibilities

### Mistake tracking

- Receive incorrect results from the lesson engine (see
  [lesson-engine.md](lesson-engine.md)).
- Categorize each mistake deterministically (language, skill/grammar topic,
  error category).
- Persist it in PostgreSQL, grouped by user, language, lesson, skill area,
  grammar topic, semantic category/subcategory, severity, and source.
- Increment `occurrenceCount` and retain the latest occurrence details when the
  same group recurs.

The Error Engine stores **deterministic mistakes first** — the incorrect answers
from `GradedExercise` content. `OpenExercise` content cannot create a
deterministic mistake. Once the LLM writing layer lands (Phase 7), the engine
**also** accepts **LLM-derived mistakes** from free/semi-free writing:
those flow in through the same `Mistake` storage, but scheduling and mastery stay
deterministic regardless of a mistake's origin.

### Review queue (spaced repetition)

Phase 6 selects at most five graded exercises from local lesson content using
persisted mistakes and mastery records. Repeated mistakes rank first, followed
by low mastery; current-lesson and current-track content resolve otherwise
equal candidates. Open exercises are excluded. Review answers use the existing
attempt, mistake, and mastery transaction and are marked with source `REVIEW`.

- Maintain a per-user queue of `ReviewQueueItem` rows due for review.
- Schedule reviews with a deterministic spaced-repetition rule (due date,
  interval, ease/streak). No LLM, no randomness beyond the defined algorithm.
- Surface due items back to the practice flow.

### Mastery calculation

- Compute a per-topic `MasteryRecord` score from the learner's history
  (correct vs. incorrect, recency, sample size).
- Recompute deterministically whenever new results arrive.
- Mastery drives what to practice next and informs recommendations.

The Phase 5 score uses a neutral two-observation prior. Each correct attempt
moves the score upward, each incorrect attempt moves it downward, and
`sampleSize` records confidence. Processing claims each persisted attempt once,
so retries cannot increment mistakes or mastery twice.

Graded exercise content declares its topic, category, optional subcategory,
and severity. Exercise format is stored separately for diagnostics and never
acts as the main error category. The error domain completes and validates the
stable grouping key before the repository persists it.

## Persistence (database-first)

Mistakes, review-queue entries, and mastery scores are **always** stored in
PostgreSQL through the persistence service. None of this data lives in
`localStorage`; it must survive a cleared browser and follow the user across
devices.

## Boundaries

- **Deterministic only.** Categorization, scheduling, and mastery are rule-based
  and reproducible.
- The LLM layer may attach a human-friendly **explanation** to a mistake (see
  [llm-integration.md](llm-integration.md)), but explanations never change
  scheduling or mastery.
- This engine consumes lesson results; it does not present exercises itself.
