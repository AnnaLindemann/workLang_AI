-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('GERMAN', 'ENGLISH');

-- CreateEnum
CREATE TYPE "CareerTrack" AS ENUM ('AI_CONSULTANT', 'CUSTOMER_SUCCESS_HOSPITALITY');

-- CreateEnum
CREATE TYPE "CefrLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "SkillArea" AS ENUM ('GRAMMAR', 'VOCABULARY', 'WRITING', 'READING', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MistakeSource" AS ENUM ('EXERCISE', 'WRITING', 'REVIEW');

-- CreateEnum
CREATE TYPE "ReviewItemType" AS ENUM ('MISTAKE', 'TOPIC');

-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('NEW', 'LEARNING', 'REVIEW', 'LAPSED');

-- CreateEnum
CREATE TYPE "LlmRequestType" AS ENUM ('WRITING_FEEDBACK', 'MISTAKE_EXPLANATION', 'CEFR_ESTIMATION', 'TEXT_IMPROVEMENT', 'RECOMMENDATION');

-- CreateEnum
CREATE TYPE "LlmRequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryLanguage" "Language" NOT NULL DEFAULT 'GERMAN',
    "careerTrack" "CareerTrack" NOT NULL DEFAULT 'AI_CONSULTANT',
    "germanTargetLevel" "CefrLevel" NOT NULL DEFAULT 'C1',
    "englishTargetLevel" "CefrLevel" NOT NULL DEFAULT 'B2',
    "dailyGoalMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    "exerciseId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "skillArea" "SkillArea" NOT NULL,
    "promptText" TEXT,
    "expectedAnswer" TEXT NOT NULL,
    "givenAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "careerTrack" "CareerTrack",
    "prompt" TEXT,
    "submittedText" TEXT NOT NULL,
    "cefrEstimate" "CefrLevel",
    "feedback" TEXT,
    "improvedText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mistake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "skillArea" "SkillArea" NOT NULL,
    "topic" TEXT NOT NULL,
    "source" "MistakeSource" NOT NULL,
    "expected" TEXT,
    "given" TEXT,
    "context" TEXT,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseAttemptId" TEXT,
    "writingAttemptId" TEXT,

    CONSTRAINT "Mistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasteryRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "topic" TEXT NOT NULL,
    "skillArea" "SkillArea",
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sampleSize" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasteryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewQueueItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" "ReviewItemType" NOT NULL,
    "mistakeId" TEXT,
    "topic" TEXT,
    "language" "Language" NOT NULL,
    "state" "ReviewState" NOT NULL DEFAULT 'NEW',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmRequestLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "writingAttemptId" TEXT,
    "requestType" "LlmRequestType" NOT NULL,
    "status" "LlmRequestStatus" NOT NULL DEFAULT 'PENDING',
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "latencyMs" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "llmRequestId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "estimatedCost" DECIMAL(12,6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_language_idx" ON "LessonProgress"("userId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_userId_createdAt_idx" ON "ExerciseAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_userId_language_skillArea_idx" ON "ExerciseAttempt"("userId", "language", "skillArea");

-- CreateIndex
CREATE INDEX "WritingAttempt_userId_createdAt_idx" ON "WritingAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Mistake_userId_language_topic_idx" ON "Mistake"("userId", "language", "topic");

-- CreateIndex
CREATE INDEX "Mistake_userId_createdAt_idx" ON "Mistake"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MasteryRecord_userId_language_idx" ON "MasteryRecord"("userId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "MasteryRecord_userId_language_topic_key" ON "MasteryRecord"("userId", "language", "topic");

-- CreateIndex
CREATE INDEX "ReviewQueueItem_userId_dueAt_idx" ON "ReviewQueueItem"("userId", "dueAt");

-- CreateIndex
CREATE INDEX "ReviewQueueItem_userId_state_idx" ON "ReviewQueueItem"("userId", "state");

-- CreateIndex
CREATE INDEX "LlmRequestLog_userId_createdAt_idx" ON "LlmRequestLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LlmRequestLog_userId_requestType_idx" ON "LlmRequestLog"("userId", "requestType");

-- CreateIndex
CREATE UNIQUE INDEX "CostRecord_llmRequestId_key" ON "CostRecord"("llmRequestId");

-- CreateIndex
CREATE INDEX "CostRecord_userId_createdAt_idx" ON "CostRecord"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAttempt" ADD CONSTRAINT "ExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingAttempt" ADD CONSTRAINT "WritingAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_exerciseAttemptId_fkey" FOREIGN KEY ("exerciseAttemptId") REFERENCES "ExerciseAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_writingAttemptId_fkey" FOREIGN KEY ("writingAttemptId") REFERENCES "WritingAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryRecord" ADD CONSTRAINT "MasteryRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewQueueItem" ADD CONSTRAINT "ReviewQueueItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewQueueItem" ADD CONSTRAINT "ReviewQueueItem_mistakeId_fkey" FOREIGN KEY ("mistakeId") REFERENCES "Mistake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmRequestLog" ADD CONSTRAINT "LlmRequestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmRequestLog" ADD CONSTRAINT "LlmRequestLog_writingAttemptId_fkey" FOREIGN KEY ("writingAttemptId") REFERENCES "WritingAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostRecord" ADD CONSTRAINT "CostRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostRecord" ADD CONSTRAINT "CostRecord_llmRequestId_fkey" FOREIGN KEY ("llmRequestId") REFERENCES "LlmRequestLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

