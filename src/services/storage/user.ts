// Default-user resolution for the single-user MVP.
//
// Authentication is deferred (see docs/project-overview.md), but the data model
// still owns every row through a `User`. Until real accounts exist, learner data
// is attached to one implicit user. This helper returns that user's id, creating
// the row on first use so persistence works out of the box. When authentication
// arrives, callers switch to the authenticated user's id and this helper is
// removed — the schema does not change.

import type { UserId } from "@/types";

import { prisma } from "./prisma";

// A fixed id keeps the single MVP learner stable and idempotent to upsert.
const DEFAULT_USER_ID = "default-user";

/** Return the single MVP learner's id, creating the user row if absent. */
export async function getOrCreateDefaultUser(): Promise<UserId> {
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: { id: DEFAULT_USER_ID, displayName: "Default learner" },
  });
  return user.id as UserId;
}
