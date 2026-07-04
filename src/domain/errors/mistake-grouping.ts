import { MistakeSource, SkillArea } from "@/types";
import type { Language, MistakeSeverity } from "@/types";

export const DEFAULT_MISTAKE_SUBCATEGORY = "general";

export interface MistakeGroupingInput {
  userId: string;
  lessonId?: string | null;
  exerciseId: string;
  language: Language;
  skillArea: SkillArea;
  topic?: string | null;
  category?: string | null;
  subcategory?: string | null;
  severity?: MistakeSeverity | null;
  source?: MistakeSource;
}

/** Complete, stable grouping metadata for one persisted graded attempt. */
export function buildExerciseMistakeGroup(input: MistakeGroupingInput) {
  if (!input.lessonId || !input.topic || !input.category || !input.severity) {
    throw new Error(
      `Graded attempt "${input.exerciseId}" is missing mistake metadata`,
    );
  }

  return {
    userId: input.userId,
    lessonId: input.lessonId,
    language: input.language,
    skillArea: input.skillArea,
    topic: input.topic,
    category: input.category,
    subcategory: input.subcategory ?? DEFAULT_MISTAKE_SUBCATEGORY,
    severity: input.severity,
    source: input.source ?? MistakeSource.Exercise,
  } as const;
}

export interface WritingMistakeGroupingInput {
  userId: string;
  lessonId: string;
  language: Language;
  /** The lesson's stable learning topic; writing mistakes group under it. */
  topic: string;
  /** A closed writing category (grammar, vocabulary, register, clarity). */
  category: string;
  severity: MistakeSeverity;
}

/**
 * Grouping metadata for a writing mistake, produced by the LLM layer (Phase 7)
 * and stored through the same Error Engine unique key as deterministic
 * mistakes. Writing mistakes are always `WRITING` skill/source; the LLM decides
 * category and severity, everything else comes from the lesson. Subcategory
 * stays `general` so writing mistakes collapse onto one stable key per
 * lesson+topic+category+severity, matching the exercise grouping shape.
 */
export function buildWritingMistakeGroup(input: WritingMistakeGroupingInput) {
  return {
    userId: input.userId,
    lessonId: input.lessonId,
    language: input.language,
    skillArea: SkillArea.Writing,
    topic: input.topic,
    category: input.category,
    subcategory: DEFAULT_MISTAKE_SUBCATEGORY,
    severity: input.severity,
    source: MistakeSource.Writing,
  } as const;
}
