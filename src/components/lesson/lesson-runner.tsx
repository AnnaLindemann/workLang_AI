"use client";

// The in-lesson stepper: walks through a lesson's activities one screen at a
// time with Prev/Next controls and a progress indicator.
//
// Reaching the end shows a completion screen. Graded attempts, grouped
// mistakes, and mastery have already been persisted as answers were checked;
// lesson-completion progress itself belongs to a separate change.

import { useState } from "react";
import Link from "next/link";

import { ActivityKind } from "@/types";
import type { Lesson } from "@/types";
import type { SelectedReviewTask } from "@/domain/review";
import { Breadcrumbs } from "@/components/breadcrumbs";

import { ActivityView } from "./activity-view";
import { getLessonCopy } from "./lesson-copy";
import styles from "./lesson-runner.module.css";

interface CrumbTarget {
  label: string;
  slug: string;
}

export function LessonRunner({
  lesson,
  language,
  track,
  reviewTasks,
}: {
  lesson: Lesson;
  language: CrumbTarget;
  track: CrumbTarget;
  reviewTasks: SelectedReviewTask[];
}) {
  const total = lesson.activities.length;
  const copy = getLessonCopy(lesson.language);
  // `step` runs 0..total-1 over the activities, then `total` for the
  // completion screen.
  const [step, setStep] = useState(0);
  const [practicePageComplete, setPracticePageComplete] = useState(false);

  function goToStep(nextStep: number) {
    setPracticePageComplete(false);
    setStep(nextStep);
  }

  const backHref = `/learn/${language.slug}/${track.slug}`;
  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: copy.learn, href: "/learn" },
        { label: language.label, href: `/learn/${language.slug}` },
        { label: track.label, href: backHref },
        { label: lesson.title },
      ]}
    />
  );

  if (step >= total) {
    return (
      <>
        {breadcrumbs}
        <div className={styles.complete}>
          <h1 className={styles.completeTitle}>{copy.lessonComplete}</h1>
          <p className={styles.completeText}>{copy.completion(lesson.title)}</p>
          <div className={styles.completeActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => goToStep(0)}
            >
              {copy.startOver}
            </button>
            <Link href={backHref} className={styles.primaryLink}>
              {copy.backToLessons}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const activity = lesson.activities[step];
  const heading = activity.title ?? copy.activityKinds[activity.kind];
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const canAdvanceFromPractice =
    activity.kind !== ActivityKind.GrammarPractice ||
    activity.exercises.length <= 5 ||
    practicePageComplete;

  return (
    <>
      {breadcrumbs}

      <div className={styles.lessonHeader}>
        <h1 className={styles.lessonTitle}>{lesson.title}</h1>
        <p className={styles.lessonMeta}>
          {language.label} · {track.label} · {copy.target} {lesson.targetLevel}
        </p>
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={copy.lessonProgress}
        >
          <span
            className={styles.progressFill}
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
        <p className={styles.progressLabel}>
          {copy.step} {step + 1} {copy.of} {total} ·{" "}
          {copy.activityKinds[activity.kind]}
        </p>
      </div>

      <section className={styles.activityCard} aria-live="polite">
        <span className={styles.activityKind}>
          {copy.activityKinds[activity.kind]}
        </span>
        <h2 className={styles.activityTitle}>{heading}</h2>
        <ActivityView
          activity={activity}
          lessonId={lesson.id}
          language={lesson.language}
          reviewTasks={reviewTasks}
          onPracticePageChange={setPracticePageComplete}
        />
      </section>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => goToStep(Math.max(0, step - 1))}
          disabled={isFirst}
        >
          {copy.previous}
        </button>
        {canAdvanceFromPractice && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => goToStep(step + 1)}
          >
            {isLast ? copy.finish : copy.next}
          </button>
        )}
      </div>
    </>
  );
}
