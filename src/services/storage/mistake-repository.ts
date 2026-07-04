// Shared mistake upsert used by every mistake source (Phase 7 reuse).
//
// The Error Engine stores each distinct mistake once, keyed by its stable
// grouping (see docs/error-engine.md), and increments `occurrenceCount` on
// repeats. Both the deterministic exercise path (Phase 5) and the LLM writing
// path (Phase 7) write through this one helper so the unique key, the increment
// rule, and the "latest details win" behaviour stay identical across sources.

import type { $Enums, Prisma } from "@/generated/prisma/client";

/** The stable grouping that identifies one mistake (the compound unique key). */
export interface MistakeGroupKey {
  userId: string;
  lessonId: string;
  language: $Enums.Language;
  skillArea: $Enums.SkillArea;
  topic: string;
  category: string;
  subcategory: string;
  severity: $Enums.MistakeSeverity;
  source: $Enums.MistakeSource;
}

/**
 * The mutable details carried on a mistake row. Fields left `undefined` are not
 * written; on repeat occurrences the newest values overwrite the old ones. The
 * back-links are source-specific: exercise mistakes set `exerciseAttemptId`,
 * writing mistakes set `writingAttemptId` and may carry an `explanation`.
 */
export interface MistakeWriteDetails {
  expected?: string | null;
  given?: string | null;
  context?: string | null;
  explanation?: string | null;
  exerciseFormat?: string | null;
  exerciseAttemptId?: string | null;
  writingAttemptId?: string | null;
  lastOccurredAt: Date;
}

/**
 * Insert a new mistake or, if one with the same grouping already exists,
 * increment its occurrence count and refresh its details. Must run inside a
 * transaction so the mistake write commits atomically with the rest of the
 * source's persistence.
 */
export async function upsertMistake(
  tx: Prisma.TransactionClient,
  group: MistakeGroupKey,
  details: MistakeWriteDetails,
): Promise<void> {
  await tx.mistake.upsert({
    where: {
      userId_language_lessonId_skillArea_topic_category_subcategory_severity_source:
        group,
    },
    create: { ...group, ...details },
    update: {
      occurrenceCount: { increment: 1 },
      ...details,
    },
  });
}
