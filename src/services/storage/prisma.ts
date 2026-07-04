// Prisma client singleton — the one connection to PostgreSQL (Phase 4).
//
// Database-first: PostgreSQL is the single source of truth for learner data
// (see docs/database.md). Prisma 7's `prisma-client` generator has no bundled
// query engine, so the client is constructed with the node-postgres driver
// adapter. The connection string comes from `DATABASE_URL` (see .env.example).
//
// This module is server-only. It is imported solely by storage repositories and
// server actions; it must never reach the client bundle. A single instance is
// cached on `globalThis` in development so Next.js hot-reloads do not open a new
// pool on every change.

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
