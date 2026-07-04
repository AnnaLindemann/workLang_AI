// Vocabulary progress derived from existing persisted data (Vocabulary Trainer).
//
// No new tables: per-term success/failure counts and last-practiced come from
// the append-only `ExerciseAttempt` rows the matching flow already writes
// (skillArea VOCABULARY, topic = term), and the mastery score comes from the
// `MasteryRecord` the shared pipeline already maintains. This is read-only; the
// trainer persists through the existing `recordVocabularyMatch` path.

import type { Language, UserId } from "@/types";
import type { VocabularyProgress } from "@/domain/vocabulary";

import { prisma } from "./prisma";

/** Per-term progress for the trainer's deterministic selection, keyed by term. */
export async function loadVocabularyProgress(
  userId: UserId,
  language: Language,
): Promise<Map<string, VocabularyProgress>> {
  const [counts, mastery] = await Promise.all([
    prisma.exerciseAttempt.groupBy({
      by: ["topic", "isCorrect"],
      where: { userId, language, skillArea: "VOCABULARY" },
      _count: { _all: true },
      _max: { createdAt: true },
    }),
    prisma.masteryRecord.findMany({
      where: { userId, language, skillArea: "VOCABULARY" },
      select: { topic: true, score: true, lastPracticedAt: true },
    }),
  ]);

  const progress = new Map<string, VocabularyProgress>();

  function entryFor(term: string): VocabularyProgress {
    let entry = progress.get(term);
    if (!entry) {
      entry = {
        successCount: 0,
        failureCount: 0,
        masteryScore: 0.5,
        lastPracticedAt: null,
      };
      progress.set(term, entry);
    }
    return entry;
  }

  for (const row of counts) {
    if (!row.topic) continue;
    const entry = entryFor(row.topic);
    if (row.isCorrect) {
      entry.successCount += row._count._all;
    } else {
      entry.failureCount += row._count._all;
    }
    const at = row._max.createdAt;
    if (at && (!entry.lastPracticedAt || at > entry.lastPracticedAt)) {
      entry.lastPracticedAt = at;
    }
  }

  for (const record of mastery) {
    const entry = entryFor(record.topic);
    entry.masteryScore = record.score;
    if (
      record.lastPracticedAt &&
      (!entry.lastPracticedAt || record.lastPracticedAt > entry.lastPracticedAt)
    ) {
      entry.lastPracticedAt = record.lastPracticedAt;
    }
  }

  return progress;
}
