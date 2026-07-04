// Transactional persistence orchestration for the Phase 5 error and mastery
// engines. The engine always reloads an ExerciseAttempt from PostgreSQL and
// claims it through `processedAt`, making processing safe to retry.

import { buildExerciseMistakeGroup } from "@/domain/errors";
import { calculateNextMastery } from "@/domain/mastery";

import { prisma } from "./prisma";
import { upsertMistake } from "./mistake-repository";

/**
 * Apply one persisted graded attempt to mistake aggregation and mastery.
 * Returns false when another call already processed this attempt.
 */
export async function processExerciseAttempt(
  attemptId: string,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.exerciseAttempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) {
      throw new Error(`Unknown exercise attempt: ${attemptId}`);
    }

    const claimed = await tx.exerciseAttempt.updateMany({
      where: { id: attemptId, processedAt: null },
      data: { processedAt: new Date() },
    });
    if (claimed.count === 0) {
      return false;
    }

    // Mastery can still consume legacy Phase 4 rows that predate metadata.
    const topic = attempt.topic ?? attempt.lessonId ?? attempt.exerciseId;
    const practicedAt = attempt.createdAt;

    const current = await tx.masteryRecord.findUnique({
      where: {
        userId_language_topic: {
          userId: attempt.userId,
          language: attempt.language,
          topic,
        },
      },
    });
    const sampleSize = current?.sampleSize ?? 0;
    const score = calculateNextMastery(
      current?.score ?? 0.5,
      sampleSize,
      attempt.isCorrect,
    );

    await tx.masteryRecord.upsert({
      where: {
        userId_language_topic: {
          userId: attempt.userId,
          language: attempt.language,
          topic,
        },
      },
      create: {
        userId: attempt.userId,
        language: attempt.language,
        skillArea: attempt.skillArea,
        topic,
        score,
        sampleSize: 1,
        lastPracticedAt: practicedAt,
      },
      update: {
        skillArea: attempt.skillArea,
        score,
        sampleSize: { increment: 1 },
        lastPracticedAt: practicedAt,
      },
    });

    if (!attempt.isCorrect) {
      await upsertMistake(tx, buildExerciseMistakeGroup(attempt), {
        exerciseFormat: attempt.exerciseFormat,
        expected: attempt.expectedAnswer,
        given: attempt.givenAnswer,
        context: attempt.promptText,
        exerciseAttemptId: attempt.id,
        lastOccurredAt: practicedAt,
      });
    }

    return true;
  });
}
