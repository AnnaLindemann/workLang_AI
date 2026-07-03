# WorkLang AI — Development Guide

## Prerequisites

- Node.js 20+
- npm
- (From Phase 0.3 onward) a PostgreSQL instance. The database is accessed
  through **Prisma** (the ORM); the schema lives in `prisma/schema.prisma` and
  the connection is configured via `DATABASE_URL` (see `.env.example`).

## Setup

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

## Definition of done for any change

A change is not done until all three pass locally:

```bash
npm run lint
npm run format:check
npm run build
```

If `format:check` fails, run `npm run format` and commit the result.

## Working rules for AI agents (Claude / Codex)

These rules apply to Claude Code, Codex, and any other AI assistant working in
this repository. They are binding.

### 1. This is not the Next.js you know

The installed Next.js version has breaking changes — APIs, conventions, and
file structure may differ from training data. **Read the relevant guide in
`node_modules/next/dist/docs/` before writing Next.js code.** Heed deprecation
notices. This mirrors [`AGENTS.md`](../AGENTS.md).

### 2. Respect the database-first decision

PostgreSQL (via **Prisma**, the ORM) is the source of truth for all core
learning data. Never persist progress, mistakes, mastery, review queue, writing
history, or LLM cost history to `localStorage`. `localStorage` is for temporary
UI state only. Static lesson content stays as local project data in `src/data/`.
See [database.md](database.md).

### 3. Deterministic before LLM

Do not use the LLM where deterministic logic is sufficient. Answer checking,
mistake tracking, review scheduling, and mastery are deterministic. See
[architecture.md](architecture.md).

### 4. Put code where it belongs

Follow the folder structure in [architecture.md](architecture.md):

- `src/domain/` — deterministic business logic (no React, no framework, no I/O
  side effects beyond the persistence port).
- `src/services/` — integrations (LLM provider, persistence/database).
- `src/data/` — static content (lessons, grammar, vocabulary).
- `src/app/` — Next.js routes and layouts.
- `src/components/` — reusable UI.
- `src/lib/` — framework-agnostic utilities.
- `src/types/` — shared TypeScript types.

### 5. Stay within the current phase

Implement only the phase you were asked to. Do not pull work forward from
future phases (see [roadmap.md](roadmap.md)). If a task seems to require
future-phase work, flag it instead of silently implementing it.

### 6. Keep the docs in sync

If a change alters the product goal, architecture, data model, or phase plan,
update the corresponding doc in the same change. Documentation and code must not
contradict each other.

### 7. Verify before reporting done

Run lint, `format:check`, and build. Report honestly: if something fails or was
skipped, say so with the evidence.

## Code style

- TypeScript throughout.
- Prettier config: semicolons, double quotes, trailing commas, 80-column width,
  2-space indent (see `.prettierrc.json`). Do not fight the formatter.
