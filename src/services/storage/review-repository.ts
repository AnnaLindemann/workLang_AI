import type { Language, UserId } from "@/types";

import { prisma } from "./prisma";

/** Load only persisted signals needed by the pure review selector. */
export async function loadReviewSourceData(userId: UserId, language: Language) {
  const [mistakes, mastery] = await Promise.all([
    prisma.mistake.findMany({
      where: { userId, language },
      select: {
        lessonId: true,
        language: true,
        topic: true,
        occurrenceCount: true,
        lastOccurredAt: true,
        source: true,
      },
    }),
    prisma.masteryRecord.findMany({
      where: { userId, language },
      select: {
        language: true,
        topic: true,
        skillArea: true,
        score: true,
        sampleSize: true,
      },
    }),
  ]);

  return { mistakes, mastery };
}
