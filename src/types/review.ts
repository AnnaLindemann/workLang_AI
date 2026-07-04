// The spaced-repetition review-queue entity.
//
// Review items are scheduled deterministically by the error engine (Phase 6);
// see docs/error-engine.md. An item points at either a specific mistake or a
// topic, per `itemType`.

import type { Language, ReviewItemType, ReviewState } from "./enums";
import type {
  ISODateString,
  MistakeId,
  ReviewQueueItemId,
  UserId,
} from "./ids";

/** A spaced-repetition scheduling entry for a user. */
export interface ReviewQueueItem {
  id: ReviewQueueItemId;
  userId: UserId;
  itemType: ReviewItemType;
  /** Set when `itemType` is MISTAKE. */
  mistakeId?: MistakeId;
  /** Set when `itemType` is TOPIC. */
  topic?: string;
  language: Language;
  state: ReviewState;
  dueAt: ISODateString;
  intervalDays: number;
  easeFactor: number;
  streak: number;
  lapses: number;
  lastReviewedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
