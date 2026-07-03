# WorkLang AI — Project Overview

## Product goal

WorkLang AI is an AI-powered professional language coach. It helps a working
professional improve **German (towards C1)** and **English (towards B2)** for
real work contexts — not general conversation, but the language needed to do a
job well.

The focus is on:

- grammar understanding,
- professional vocabulary,
- business writing,
- professional reading,
- written communication in real work situations.

### Career tracks

The content is anchored to two career tracks so practice stays relevant:

1. **AI Consultant**
2. **Customer Success / Hospitality** with an AI component

## Who it is for

A single motivated learner (the product owner) who already works in a
professional setting and wants targeted, measurable progress toward concrete
CEFR levels. The MVP is built for this user first; multi-user support is a
later concern.

## How it works

WorkLang AI is a **hybrid system**. It deliberately separates cheap,
deterministic logic from expensive, non-deterministic LLM calls. See
[architecture.md](architecture.md) for the full design.

- **Deterministic layer** — lessons, grammar exercises, answer checking,
  mistake tracking, review queue, and mastery calculation. No LLM required.
- **LLM layer** — free-writing feedback, mistake explanations, CEFR
  estimation, improved text versions, personalized recommendations, and cost
  tracking.

The guiding rule: **do not use the LLM where deterministic logic is
sufficient.**

## The learning loop

Every lesson runs the same end-to-end loop. All steps are deterministic except
**LLM feedback**; everything the learner produces is persisted to PostgreSQL.

1. **Language selection** — German or English.
2. **Career-track selection** — AI Consultant, or Customer Success /
   Hospitality.
3. **Lesson selection** — choose a lesson within the track.
4. **Review block** — adaptive review of items due from earlier mistakes and
   mastery (deterministic).
5. **Grammar theory** — the lesson's grammar explanation.
6. **Professional vocabulary** — track-relevant vocabulary.
7. **Professional reading** — a work-context reading passage.
8. **Deterministic grammar practice** — exercises with local answer checking.
9. **Writing task** — the learner writes in a real work context.
10. **LLM feedback** — the only LLM step: feedback, CEFR estimate, and an
    improved version of the writing.
11. **Mistake storage** — mistakes from practice and writing are recorded.
12. **Mastery update** — per-topic mastery is recomputed deterministically.
13. **Adaptive review in the next lesson** — updated mistakes and mastery feed
    the next lesson's review block, closing the loop.

The roadmap in [roadmap.md](roadmap.md) builds this loop across its phases.

## Database-first MVP

This is a core product decision.

**WorkLang AI is database-first for user data.** PostgreSQL is the single
source of truth for all core learning data:

- progress,
- mistakes,
- mastery,
- review queue,
- writing history,
- LLM cost history.

`localStorage` may only be used for **temporary UI state** (for example, the
currently open tab or an in-progress unsent form). It must **never** hold core
learning data. If the browser storage is cleared, no learning progress is lost.

The database is accessed through **Prisma** (the ORM). Note the split between
data and content: **static lesson content** (lessons, grammar, vocabulary,
reading) stays as **local project data** in `src/data/` for the MVP; only the
learner's interaction with it (progress, mistakes, mastery, and so on) lives in
PostgreSQL.

See [database.md](database.md) for the data model.

## What success looks like

- Measurable movement toward German C1 and English B2.
- A reliable record of mistakes and mastery that survives across devices and
  sessions.
- LLM usage that is both useful and cost-transparent.

## Non-goals for the MVP

- job interview training,
- speech / pronunciation,
- full RAG with embeddings,
- mobile app,
- complex gamification,
- authentication and multi-user accounts (single-user MVP).

Authentication and a database are frequently confused as "the same layer." In
WorkLang AI they are not: **the database is in scope and central to the MVP**;
authentication is deferred.
