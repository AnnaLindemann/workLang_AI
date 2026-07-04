-- Phase 5: persisted attempt processing, grouped mistake occurrences, and
-- idempotent mastery updates. Existing mistakes receive collision-safe legacy
-- grouping values before the unique index is added.
CREATE TYPE "MistakeSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

ALTER TABLE "ExerciseAttempt"
ADD COLUMN "topic" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "subcategory" TEXT,
ADD COLUMN "severity" "MistakeSeverity",
ADD COLUMN "exerciseFormat" TEXT,
ADD COLUMN "processedAt" TIMESTAMP(3);

ALTER TABLE "Mistake"
ADD COLUMN "lessonId" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "subcategory" TEXT,
ADD COLUMN "severity" "MistakeSeverity" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "exerciseFormat" TEXT,
ADD COLUMN "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "lastOccurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Phase 0 allowed Mistake rows before semantic grouping metadata existed.
-- A per-row legacy namespace preserves every row and guarantees that no two
-- existing rows collide under the new grouping constraint.
UPDATE "Mistake"
SET "lessonId" = 'legacy:' || "id",
    "category" = 'legacy:' || "id",
    "subcategory" = 'general';

ALTER TABLE "Mistake"
ALTER COLUMN "lessonId" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "subcategory" SET NOT NULL,
ALTER COLUMN "subcategory" SET DEFAULT 'general';

CREATE UNIQUE INDEX "Mistake_userId_language_lessonId_skillArea_topic_category_subcategory_severity_source_key"
ON "Mistake"(
  "userId",
  "language",
  "lessonId",
  "skillArea",
  "topic",
  "category",
  "subcategory",
  "severity",
  "source"
);
