// The Mistake entity and its transfer DTO.
//
// A mistake is produced deterministically by the error engine (Phase 5) and may
// later be enriched with an LLM `explanation` that never affects scheduling or
// mastery (see docs/error-engine.md).

import type { Language, MistakeSource, SkillArea } from "./enums";
import type {
  ExerciseAttemptId,
  ISODateString,
  MistakeId,
  UserId,
  WritingAttemptId,
} from "./ids";

/** An individual recorded error. */
export interface Mistake {
  id: MistakeId;
  userId: UserId;
  language: Language;
  skillArea: SkillArea;
  /** The grammar/vocabulary topic this mistake belongs to. */
  topic: string;
  source: MistakeSource;
  expected?: string;
  given?: string;
  context?: string;
  /** Optional human explanation added by the LLM layer; never deterministic. */
  explanation?: string;
  /** Back-links to the attempt that produced the mistake, if any. */
  exerciseAttemptId?: ExerciseAttemptId;
  writingAttemptId?: WritingAttemptId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Data required to record a new mistake. Omits server-generated identity and
 * timestamps, and the LLM-only `explanation`, since the deterministic engine
 * creates the row before any enrichment.
 */
export interface MistakeDTO {
  userId: UserId;
  language: Language;
  skillArea: SkillArea;
  topic: string;
  source: MistakeSource;
  expected?: string;
  given?: string;
  context?: string;
  exerciseAttemptId?: ExerciseAttemptId;
  writingAttemptId?: WritingAttemptId;
}
