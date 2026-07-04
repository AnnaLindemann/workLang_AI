"use client";

// Renders a single lesson activity, switching on its `kind`.
//
// Phase 3 responsibility is presentation of each learning-loop screen only:
//   - Review        → placeholder (the adaptive review queue arrives later)
//   - GrammarTheory → prose
//   - Vocabulary    → term / translation / example list
//   - Reading       → passage
//   - GrammarPractice → exercise prompts with inert inputs (answer checking is
//                       the deterministic practice engine in a later phase)
//   - Writing       → the scenario plus a draft box (transient UI state only;
//                     LLM feedback arrives in a later phase)
//
// No answer checking, no persistence of learner data, and no LLM here.

import { ActivityKind } from "@/types";
import type { Activity, LessonId } from "@/types";

import { useTransientState } from "./use-transient-state";
import styles from "./lesson-runner.module.css";

export function ActivityView({
  activity,
  lessonId,
}: {
  activity: Activity;
  lessonId: LessonId;
}) {
  switch (activity.kind) {
    case ActivityKind.Review:
      return (
        <div className={styles.note}>
          The lesson opens with an adaptive review of items due from earlier
          mistakes and mastery. The review queue is built in a later phase, so
          there is nothing due yet.
        </div>
      );

    case ActivityKind.GrammarTheory:
      return <p className={styles.prose}>{activity.content}</p>;

    case ActivityKind.Vocabulary:
      return (
        <ul className={styles.vocabList}>
          {activity.items.map((item) => (
            <li key={item.term} className={styles.vocabItem}>
              <div className={styles.vocabHead}>
                <span className={styles.vocabTerm}>{item.term}</span>
                <span className={styles.vocabTranslation}>
                  {item.translation}
                </span>
              </div>
              {item.example && (
                <p className={styles.vocabExample}>{item.example}</p>
              )}
            </li>
          ))}
        </ul>
      );

    case ActivityKind.Reading:
      return <p className={styles.prose}>{activity.text}</p>;

    case ActivityKind.GrammarPractice:
      return (
        <div className={styles.exerciseList}>
          {activity.exercises.map((exercise, index) => (
            <div key={exercise.id} className={styles.exercise}>
              <p className={styles.exercisePrompt}>
                <span className={styles.exerciseNumber}>{index + 1}.</span>{" "}
                {exercise.prompt}
              </p>
              <input
                type="text"
                className={styles.exerciseInput}
                placeholder="Your answer"
                aria-label={`Answer for exercise ${index + 1}`}
              />
            </div>
          ))}
          <p className={styles.note}>
            Answer checking and mistake tracking arrive with the deterministic
            practice engine in a later phase. Nothing you type here is checked
            or saved yet.
          </p>
        </div>
      );

    case ActivityKind.Writing:
      return <WritingView activity={activity} lessonId={lessonId} />;

    default: {
      // Exhaustiveness guard: every activity kind is handled above.
      const _exhaustive: never = activity;
      return _exhaustive;
    }
  }
}

function WritingView({
  activity,
  lessonId,
}: {
  activity: Extract<Activity, { kind: typeof ActivityKind.Writing }>;
  lessonId: LessonId;
}) {
  // The draft is transient UI state (an in-progress, unsent form). It is kept
  // in localStorage only — never a store of record. See use-transient-state.ts.
  const [draft, setDraft] = useTransientState(`${lessonId}:${activity.id}`);

  return (
    <div className={styles.writing}>
      <p className={styles.prose}>{activity.prompt}</p>
      <textarea
        className={styles.writingInput}
        rows={8}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write your response here…"
        aria-label="Your writing"
      />
      <p className={styles.note}>
        This draft is kept only as temporary UI state in your browser. LLM
        feedback, a CEFR estimate, and an improved version arrive in a later
        phase.
      </p>
    </div>
  );
}
