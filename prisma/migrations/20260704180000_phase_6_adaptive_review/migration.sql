-- Phase 6: distinguish review attempts while retaining the shared deterministic
-- attempt, mistake, and mastery processing pipeline.
ALTER TABLE "ExerciseAttempt"
ADD COLUMN "source" "MistakeSource" NOT NULL DEFAULT 'EXERCISE';
