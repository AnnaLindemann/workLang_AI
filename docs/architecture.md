# WorkLang AI — Architecture

AI-powered professional language coach for German (towards C1) and English
(towards B2), focused on grammar, professional vocabulary, business writing,
professional reading, and written communication in real work contexts.

## Career tracks

1. AI Consultant
2. Customer Success / Hospitality with an AI component

## Hybrid system

The system deliberately separates deterministic logic from LLM usage. Do not use
the LLM where deterministic logic is sufficient.

### Deterministic layer

- lessons
- grammar exercises
- local answer checking
- mistake tracking
- review queue
- mastery calculation

### LLM layer

- free writing feedback
- explanation of mistakes
- CEFR estimation
- improved text version
- personalized recommendations
- cost tracking

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
    errors/
    mastery/
    cost/
  lib/         Framework-agnostic utilities
  services/    Integrations
    llm/       LLM provider integration (not implemented yet)
    storage/   Persistence layer (not implemented yet)
  types/       Shared TypeScript types
docs/          Project documentation
```

## Out of scope for MVP

- job interview training
- authentication
- database
- speech / pronunciation
- full RAG with embeddings
- mobile app
- complex gamification

## Phase status

- **Phase 0.1 — Project Bootstrap (current):** Next.js + TypeScript foundation,
  folder structure, and a placeholder homepage. No lesson logic, no LLM
  integration, no database, no authentication.
