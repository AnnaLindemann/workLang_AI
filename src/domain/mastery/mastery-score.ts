import type { MasteryScore } from "@/types";

const INITIAL_MASTERY = 0.5;

/**
 * Update mastery with a small neutral prior (one success, one failure).
 * This keeps early scores honest while repeated observations steadily carry
 * more weight. The result is deterministic and always remains in [0, 1].
 */
export function calculateNextMastery(
  currentScore: number,
  sampleSize: number,
  isCorrect: boolean,
): MasteryScore {
  const score = sampleSize === 0 ? INITIAL_MASTERY : currentScore;
  const outcome = isCorrect ? 1 : 0;
  return ((score * (sampleSize + 2) + outcome) /
    (sampleSize + 3)) as MasteryScore;
}
