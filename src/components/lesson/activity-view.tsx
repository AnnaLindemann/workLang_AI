"use client";

// Renders a single lesson activity, switching on its `kind`.
//
// Presentation of each learning-loop screen:
//   - Review        → placeholder (the adaptive review queue arrives later)
//   - GrammarTheory → titled sections (Russian explanation, target-language
//                     examples)
//   - Vocabulary    → term / Russian translation / target-language example
//   - Reading       → passage
//   - GrammarPractice → graded exercises are checked locally with immediate
//                       feedback and the attempt is persisted to PostgreSQL;
//                       semi-free production exercises are self-checked against
//                       a sample answer and never graded (see ExerciseEvaluation
//                       and docs/lesson-engine.md).
//   - Writing       → the scenario, a requirements checklist, and a draft box
//                     with a live word counter (transient UI state only; LLM
//                     feedback arrives in a later phase)
//
// No LLM here. The only persistence is the deterministic graded exercise
// attempt, written through the server action — never to localStorage.

import { useState, useTransition } from "react";

import { ActivityKind, ExerciseEvaluation } from "@/types";
import type {
  Activity,
  AnswerCheck,
  GradedExercise,
  LessonId,
  OpenExercise,
  WritingTask,
} from "@/types";
import { checkAnswer } from "@/domain/practice";
import { recordExerciseAnswer } from "@/app/learn/actions";

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
      return (
        <div className={styles.theory}>
          {activity.sections.map((section, index) => (
            <section key={index} className={styles.theorySection}>
              <h3 className={styles.theoryHeading}>{section.heading}</h3>
              {section.body && <p className={styles.prose}>{section.body}</p>}
              {section.items && section.items.length > 0 && (
                <ul className={styles.theoryList}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.theoryItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      );

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
          {activity.exercises.map((exercise, index) =>
            exercise.evaluation === ExerciseEvaluation.Graded ? (
              <GradedExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={index}
                lessonId={lessonId}
              />
            ) : (
              <OpenExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={index}
              />
            ),
          )}
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

// The status of persisting one attempt to PostgreSQL. Feedback never waits on
// this: the answer is checked locally and shown immediately, while the attempt
// saves in the background. `error` surfaces a quiet note so a failed write is
// honest rather than silent.
type SaveState = "idle" | "saving" | "saved" | "error";

function GradedExerciseItem({
  exercise,
  index,
  lessonId,
}: {
  exercise: GradedExercise;
  index: number;
  lessonId: LessonId;
}) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<AnswerCheck | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Deterministic local check → immediate feedback (same checker the server
    // re-runs authoritatively before persisting).
    const check = checkAnswer(exercise, value);
    setResult(check);
    setSaveState("saving");
    startTransition(async () => {
      try {
        await recordExerciseAnswer({
          lessonId,
          exerciseId: exercise.id,
          given: value,
        });
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    });
  }

  const feedbackId = `${exercise.id}-feedback`;

  return (
    <form className={styles.exercise} onSubmit={handleSubmit}>
      <p className={styles.exercisePrompt}>
        <span className={styles.exerciseNumber}>{index + 1}.</span>{" "}
        {exercise.prompt}
      </p>
      <input
        type="text"
        className={styles.exerciseInput}
        placeholder="Your answer"
        aria-label={`Answer for exercise ${index + 1}`}
        aria-describedby={result ? feedbackId : undefined}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        className={styles.checkButton}
        disabled={value.trim().length === 0}
      >
        {result ? "Check again" : "Check answer"}
      </button>

      {result && (
        <div
          id={feedbackId}
          className={
            result.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          }
          aria-live="polite"
        >
          <p className={styles.feedbackHead}>
            {result.isCorrect ? "Correct" : "Not quite"}
          </p>
          {!result.isCorrect && (
            <p className={styles.feedbackAnswer}>
              Correct answer: <strong>{result.expected}</strong>
            </p>
          )}
          {exercise.explanation && (
            <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          )}
          {saveState === "error" && (
            <p className={styles.feedbackSave}>
              Your answer was checked, but saving this attempt failed.
            </p>
          )}
        </div>
      )}
    </form>
  );
}

function OpenExerciseItem({
  exercise,
  index,
}: {
  exercise: OpenExercise;
  index: number;
}) {
  // The learner's own draft is transient and local — this is a self-check task,
  // never graded by string comparison and never persisted in Phase 4.
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const sampleId = `${exercise.id}-sample`;

  return (
    <div className={styles.exercise}>
      <p className={styles.exercisePrompt}>
        <span className={styles.exerciseNumber}>{index + 1}.</span>{" "}
        {exercise.prompt}
      </p>
      <textarea
        className={styles.writingInput}
        rows={2}
        placeholder="Your answer"
        aria-label={`Answer for exercise ${index + 1}`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="button"
        className={styles.checkButton}
        aria-expanded={revealed}
        aria-controls={sampleId}
        onClick={() => setRevealed(true)}
      >
        Show sample answer
      </button>

      {revealed && (
        <div id={sampleId} className={styles.feedbackSample} aria-live="polite">
          <p className={styles.feedbackHead}>Sample answer</p>
          <p className={styles.feedbackAnswer}>{exercise.sampleAnswer}</p>
          {exercise.explanation && (
            <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          )}
          <p className={styles.feedbackSave}>
            Свободное задание: несколько формулировок могут быть верными.
            Сравните свой ответ с образцом — оно не проверяется автоматически.
          </p>
        </div>
      )}
    </div>
  );
}

function WritingView({
  activity,
  lessonId,
}: {
  activity: WritingTask;
  lessonId: LessonId;
}) {
  // The draft is transient UI state (an in-progress, unsent form). It is kept
  // in localStorage only — never a store of record. See use-transient-state.ts.
  const [draft, setDraft] = useTransientState(`${lessonId}:${activity.id}`);
  // The requirements checklist is a self-guide toggled locally; it is never
  // persisted and does not gate submission (there is no submission in Phase 4).
  const [checked, setChecked] = useState<boolean[]>(() =>
    (activity.requirements ?? []).map(() => false),
  );

  // A local word count to help the learner hit the task's target length. This is
  // presentation only — the writing task is semi-free production and is never
  // deterministically graded; real feedback arrives from the LLM in Phase 7.
  const wordCount = countWords(draft);
  const range = activity.wordRange;
  const inRange = range
    ? wordCount >= range.min && wordCount <= range.max
    : false;

  function toggle(index: number) {
    setChecked((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );
  }

  return (
    <div className={styles.writing}>
      <p className={styles.prose}>{activity.prompt}</p>

      {activity.requirements && activity.requirements.length > 0 && (
        <div className={styles.requirements}>
          <p className={styles.requirementsTitle}>Что включить</p>
          <ul className={styles.requirementsList}>
            {activity.requirements.map((requirement, index) => (
              <li key={index} className={styles.requirementItem}>
                <label className={styles.requirementLabel}>
                  <input
                    type="checkbox"
                    checked={checked[index] ?? false}
                    onChange={() => toggle(index)}
                  />
                  <span>{requirement}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        className={styles.writingInput}
        rows={8}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write your response here…"
        aria-label="Your writing"
      />
      <p
        className={range && inRange ? styles.wordCountOk : styles.wordCount}
        aria-live="polite"
      >
        {wordCount} {wordCount === 1 ? "word" : "words"}
        {range && ` · target ${range.min}–${range.max}`}
      </p>

      <p className={styles.note}>
        This draft is kept only as temporary UI state in your browser. LLM
        feedback, a CEFR estimate, and an improved version arrive in a later
        phase.
      </p>
    </div>
  );
}

// Count words in a free-writing draft: split on any whitespace run and drop the
// empty edges so leading/trailing spaces and a blank draft count as zero.
function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}
