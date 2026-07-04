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
import type { ActivityKind as ActivityKindType, Lesson } from "@/types";
import type { SelectedReviewTask } from "@/domain/review";
import { Breadcrumbs } from "@/components/breadcrumbs";

import { ActivityView } from "./activity-view";
import styles from "./lesson-runner.module.css";

const kindLabels: Record<ActivityKindType, string> = {
  [ActivityKind.Review]: "Review",
  [ActivityKind.GrammarTheory]: "Grammar theory",
  [ActivityKind.Vocabulary]: "Vocabulary",
  [ActivityKind.Reading]: "Reading",
  [ActivityKind.GrammarPractice]: "Practice",
  [ActivityKind.Writing]: "Writing",
};

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
  // `step` runs 0..total-1 over the activities, then `total` for the
  // completion screen.
  const [step, setStep] = useState(0);

  const backHref = `/learn/${language.slug}/${track.slug}`;
  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: "Learn", href: "/learn" },
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
          <h1 className={styles.completeTitle}>Lesson complete</h1>
          <p className={styles.completeText}>
            You worked through every screen of “{lesson.title}”. Saving graded
            answers also updated your mistake history and topic mastery. Open
            exercises and writing remain self-check activities and were not
            graded.
          </p>
          <div className={styles.completeActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setStep(0)}
            >
              Start over
            </button>
            <Link href={backHref} className={styles.primaryLink}>
              Back to lessons
            </Link>
          </div>
        </div>
      </>
    );
  }

  const activity = lesson.activities[step];
  const heading = activity.title ?? kindLabels[activity.kind];
  const isFirst = step === 0;
  const isLast = step === total - 1;

  return (
    <>
      {breadcrumbs}

      <div className={styles.lessonHeader}>
        <h1 className={styles.lessonTitle}>{lesson.title}</h1>
        <p className={styles.lessonMeta}>
          {language.label} · {track.label} · Target {lesson.targetLevel}
        </p>
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Lesson progress"
        >
          <span
            className={styles.progressFill}
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
        <p className={styles.progressLabel}>
          Step {step + 1} of {total} · {kindLabels[activity.kind]}
        </p>
      </div>

      <section className={styles.activityCard} aria-live="polite">
        <span className={styles.activityKind}>{kindLabels[activity.kind]}</span>
        <h2 className={styles.activityTitle}>{heading}</h2>
        <ActivityView
          activity={activity}
          lessonId={lesson.id}
          language={lesson.language}
          reviewTasks={reviewTasks}
        />
      </section>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={isFirst}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setStep((current) => current + 1)}
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </>
  );
}
