// The Mastery entity, its score value object, and its transfer DTO.
//
// Mastery is computed deterministically per topic by the mastery engine
// (Phase 5); see docs/error-engine.md.

import type { Language, SkillArea } from "./enums";
import type { Brand, ISODateString, MasteryRecordId, UserId } from "./ids";

/**
 * A per-topic mastery estimate in the range [0, 1]. Branded to mark intent;
 * the bound is a domain invariant enforced by the engine, not the type system.
 */
export type MasteryScore = Brand<number, "MasteryScore">;

/** A per-topic mastery estimate for a user. */
export interface Mastery {
  id: MasteryRecordId;
  userId: UserId;
  language: Language;
  topic: string;
  skillArea?: SkillArea;
  score: MasteryScore;
  /** How many observations the score is based on. */
  sampleSize: number;
  lastPracticedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Data required to create or update a mastery record. Unique per
 * (user, language, topic), which is how the persistence layer upserts it.
 */
export interface MasteryDTO {
  userId: UserId;
  language: Language;
  topic: string;
  skillArea?: SkillArea;
  score: MasteryScore;
  sampleSize: number;
  lastPracticedAt?: ISODateString;
}
