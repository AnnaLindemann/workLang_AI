// Deterministic session selection for the Vocabulary Trainer.
//
// Each session is exactly five term↔meaning pairs, mixed from: brand-new words,
// previously failed words, low-mastery words, and words not practiced recently.
// Selection is deterministic (no randomness): it ranks items by a priority
// computed purely from stored progress and the current time.
//
// Mastered items (more than 10 successful matches) normally drop out of
// training. They become eligible again only after a revisit window, and even
// then rank low, so they resurface occasionally without dominating the queue.

import type { CatalogVocabularyItem } from "./catalog";

export const TRAINER_SESSION_SIZE = 5;
/** "More than 10 successful matches" ⇒ mastered. */
export const VOCAB_MASTERED_SUCCESSES = 10;
/** Days after which a mastered item may resurface. */
export const MASTERED_REVISIT_DAYS = 14;

const DAY_MS = 86_400_000;
const NEW_ITEM_PRIORITY = 70;
const RECENCY_CAP_DAYS = 30;

/** Per-term progress the selector reads (derived from persisted attempts). */
export interface VocabularyProgress {
  successCount: number;
  failureCount: number;
  /** Deterministic mastery score in [0, 1]. */
  masteryScore: number;
  lastPracticedAt: Date | null;
}

export interface TrainerSelectionOptions {
  now?: Date;
  sessionSize?: number;
}

/**
 * Pick the session's items (up to `sessionSize`, default 5) from the full
 * catalog, ranked by priority. Weak/new/stale items rise; mastered items are
 * excluded unless stale past the revisit window, where they rank low.
 */
export function selectTrainerCards(
  items: readonly CatalogVocabularyItem[],
  progressByTerm: ReadonlyMap<string, VocabularyProgress>,
  options?: TrainerSelectionOptions,
): CatalogVocabularyItem[] {
  const now = options?.now ?? new Date();
  const size = options?.sessionSize ?? TRAINER_SESSION_SIZE;

  return items
    .map((item) => {
      const progress = progressByTerm.get(item.term);
      return {
        item,
        eligible: isEligible(progress, now),
        priority: priorityOf(progress, now),
      };
    })
    .filter((entry) => entry.eligible)
    .sort(
      (a, b) =>
        b.priority - a.priority || a.item.term.localeCompare(b.item.term),
    )
    .slice(0, size)
    .map((entry) => entry.item);
}

function isMastered(progress: VocabularyProgress | undefined): boolean {
  return (
    progress !== undefined && progress.successCount > VOCAB_MASTERED_SUCCESSES
  );
}

function daysSince(at: Date | null, now: Date): number {
  if (!at) return RECENCY_CAP_DAYS;
  return Math.min((now.getTime() - at.getTime()) / DAY_MS, RECENCY_CAP_DAYS);
}

// A mastered item is excluded until it has gone unpracticed past the revisit
// window; everything else is always eligible.
function isEligible(
  progress: VocabularyProgress | undefined,
  now: Date,
): boolean {
  if (!isMastered(progress)) return true;
  return daysSince(progress!.lastPracticedAt, now) > MASTERED_REVISIT_DAYS;
}

function priorityOf(
  progress: VocabularyProgress | undefined,
  now: Date,
): number {
  if (!progress) return NEW_ITEM_PRIORITY;
  const recency = daysSince(progress.lastPracticedAt, now);
  const score =
    progress.failureCount * 40 + (1 - progress.masteryScore) * 30 + recency;
  // Even when a mastered item resurfaces, keep it from dominating.
  return isMastered(progress) ? score * 0.1 : score;
}
