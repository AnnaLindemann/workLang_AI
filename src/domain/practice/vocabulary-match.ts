// Deterministic vocabulary matching checks (Phase 7.1).
//
// Vocabulary matching is closed and locally checkable — a term maps to exactly
// one meaning (its Russian translation) in the static content. Like grammar
// answer checking, this is pure and LLM-free, and runs identically on the
// client (immediate green/red feedback) and the server (authoritative check
// before persisting an attempt). No LLM ever touches vocabulary matching.

import { ActivityKind } from "@/types";
import type { Lesson, VocabularyItem } from "@/types";

import { normalizeAnswer } from "./answer-check";

/** Find a vocabulary item by its term within a lesson's vocabulary blocks. */
export function findVocabularyItem(
  lesson: Lesson,
  term: string,
): VocabularyItem | undefined {
  for (const activity of lesson.activities) {
    if (activity.kind !== ActivityKind.Vocabulary) continue;
    const match = activity.items.find((item) => item.term === term);
    if (match) return match;
  }
  return undefined;
}

/** The result of checking one term↔meaning match. */
export interface VocabularyMatchCheck {
  isCorrect: boolean;
  term: string;
  expectedMeaning: string;
  givenMeaning: string;
}

/**
 * Check whether `givenMeaning` is the correct meaning for a vocabulary item,
 * using the same conservative normalization as grammar answer checking.
 */
export function checkVocabularyMatch(
  item: VocabularyItem,
  givenMeaning: string,
): VocabularyMatchCheck {
  return {
    isCorrect:
      normalizeAnswer(item.translation) === normalizeAnswer(givenMeaning),
    term: item.term,
    expectedMeaning: item.translation,
    givenMeaning,
  };
}
