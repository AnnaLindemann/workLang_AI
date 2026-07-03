# WorkLang AI

AI-powered professional language coach for **German (towards C1)** and
**English (towards B2)**. It helps improve grammar understanding, professional
vocabulary, business writing, professional reading, and written communication in
real work contexts.

**Career tracks:** AI Consultant · Customer Success / Hospitality with AI.

> **Current status: Phase 0 complete — Prisma + PostgreSQL setup done.**
> Foundation, documentation, and the database schema are in place. Next up is
> Phase 1 (Core Domain Model). No lesson logic, LLM integration, UI flow, or
> authentication yet. See [`docs/roadmap.md`](docs/roadmap.md).

WorkLang AI is **database-first**: PostgreSQL (via Prisma) is the source of
truth for all core learning data. `localStorage` is only ever used for temporary
UI state. See [`docs/project-overview.md`](docs/project-overview.md).

## Tech stack

- Next.js (App Router)
- TypeScript
- PostgreSQL with Prisma (ORM)
- ESLint + Prettier

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the local development server |
| `npm run build`        | Production build                   |
| `npm run start`        | Serve the production build         |
| `npm run lint`         | Run ESLint                         |
| `npm run format`       | Format the codebase with Prettier  |
| `npm run format:check` | Check formatting without writing   |

## Documentation

- [`docs/project-overview.md`](docs/project-overview.md) — product goal and scope
- [`docs/roadmap.md`](docs/roadmap.md) — phases and constraints
- [`docs/development-guide.md`](docs/development-guide.md) — setup and AI working rules
- [`docs/architecture.md`](docs/architecture.md) — hybrid design and folder structure
- [`docs/database.md`](docs/database.md) — database-first data model
- [`docs/lesson-engine.md`](docs/lesson-engine.md) — deterministic lessons
- [`docs/error-engine.md`](docs/error-engine.md) — mistakes, review queue, mastery
- [`docs/llm-integration.md`](docs/llm-integration.md) — LLM layer and cost tracking
- [`docs/prompts.md`](docs/prompts.md) — LLM prompt catalog
