# WorkLang AI

AI-powered professional language coach for **German (towards C1)** and
**English (towards B2)**. It helps improve grammar understanding, professional
vocabulary, business writing, professional reading, and written communication in
real work contexts.

**Career tracks:** AI Consultant · Customer Success / Hospitality with AI.

> **Current status: Phase 0.1 — Project Bootstrap.**
> Project foundation and folder structure only. No lesson logic, LLM
> integration, database, or authentication yet.

## Tech stack

- Next.js (App Router)
- TypeScript
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

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the hybrid
deterministic + LLM design and the full folder structure.
