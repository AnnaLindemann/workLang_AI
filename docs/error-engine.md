# WorkLang AI — Error & Mastery Engine

> **Status:** design only. Implemented across Phases 5–6 (Error Engine &
> Mastery Engine, then Adaptive Review — see [roadmap.md](roadmap.md)). Lives in
> `src/domain/errors` and `src/domain/mastery`.

The error engine is **deterministic**. It records mistakes, categorizes them,
schedules reviews, and computes mastery. It does not call the LLM (the LLM may
later _explain_ a mistake, but it never decides scheduling or mastery).

## Responsibilities

### Mistake tracking

- Receive incorrect results from the lesson engine (see
  [lesson-engine.md](lesson-engine.md)).
- Categorize each mistake deterministically (language, skill/grammar topic,
  error category).
- Persist each as a `Mistake` row in PostgreSQL.

### Review queue (spaced repetition)

- Maintain a per-user queue of `ReviewQueueItem` rows due for review.
- Schedule reviews with a deterministic spaced-repetition rule (due date,
  interval, ease/streak). No LLM, no randomness beyond the defined algorithm.
- Surface due items back to the practice flow.

### Mastery calculation

- Compute a per-topic `MasteryRecord` score from the learner's history
  (correct vs. incorrect, recency, sample size).
- Recompute deterministically whenever new results arrive.
- Mastery drives what to practice next and informs recommendations.

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
