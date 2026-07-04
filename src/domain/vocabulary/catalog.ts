// The application-wide vocabulary catalog (Vocabulary Trainer).
//
// The trainer draws from EVERY vocabulary item in EVERY lesson, not just the
// current lesson. This flattens all lessons' vocabulary blocks into a single
// deterministic list, deduplicated by (language, term) so a word shared across
// lessons is one trainable concept (mastery is keyed by term). Lesson files stay
// the source of vocabulary; only progress lives in PostgreSQL.

import { getAllLessons } from "@/domain/lessons";
import { ActivityKind } from "@/types";
import type { CareerTrack, Language } from "@/types";

/** One trainable vocabulary item with its lesson context. */
export interface CatalogVocabularyItem {
  term: string;
  translation: string;
  definition?: string;
  transcription?: string;
  pronunciationHint?: string;
  example?: string;
  language: Language;
  /** A lesson that contains this term — used to resolve/persist the attempt. */
  lessonId: string;
  careerTrack: CareerTrack;
}

/**
 * Every vocabulary item across all lessons, optionally filtered by language.
 * Deterministic: lessons and items keep their authored order, and the first
 * occurrence of a (language, term) wins on duplicates.
 */
export function getAllVocabulary(language?: Language): CatalogVocabularyItem[] {
  const items: CatalogVocabularyItem[] = [];
  const seen = new Set<string>();

  for (const lesson of getAllLessons()) {
    if (language && lesson.language !== language) continue;
    for (const activity of lesson.activities) {
      if (activity.kind !== ActivityKind.Vocabulary) continue;
      for (const item of activity.items) {
        const key = `${lesson.language}:${item.term}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({
          term: item.term,
          translation: item.translation,
          definition: item.definition,
          transcription: item.transcription,
          pronunciationHint: item.pronunciationHint,
          example: item.example,
          language: lesson.language,
          lessonId: lesson.id,
          careerTrack: lesson.careerTrack,
        });
      }
    }
  }

  return items;
}
