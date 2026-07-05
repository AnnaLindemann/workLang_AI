"use client";

// Renders a single lesson activity, switching on its `kind`.
//
// Presentation of each learning-loop screen:
//   - Review        → deterministic tasks selected from persisted learning data
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
//                     with a live word counter; on submit, a server action runs
//                     the single LLM step (Phase 7) and returns feedback, a CEFR
//                     estimate, an improved version, and mistakes
//
// The draft stays transient UI state; submission persists through server actions
// only (deterministic attempts and the LLM writing attempt), never localStorage.

import { useState, useTransition } from "react";

import { ActivityKind, ExerciseEvaluation, SkillArea } from "@/types";
import type {
  Activity,
  AnswerCheck,
  GradedExercise,
  Language,
  LessonId,
  OpenExercise,
  PracticeTask,
  VocabularyBlock,
  WritingTask,
} from "@/types";
import { checkAnswer } from "@/domain/practice";
import {
  checkOpenGrammarAnswer,
  recordExerciseAnswer,
  recordReviewAnswer,
  recordVocabularyMatch,
  submitWriting,
} from "@/app/learn/actions";
import type { SelectedReviewTask, VocabularyReviewTask } from "@/domain/review";
import { shuffle } from "@/lib/shuffle";
import { PronounceButton } from "@/components/vocabulary/pronounce-button";

import { useTransientState } from "./use-transient-state";
import { getLessonCopy } from "./lesson-copy";
import type { LessonCopy } from "./lesson-copy";
import styles from "./lesson-runner.module.css";

// Feedback shapes taken from the server actions' return types, so the client
// never imports server-only storage code.
type WritingFeedback = Awaited<ReturnType<typeof submitWriting>>;
type OpenGrammarCheck = Awaited<ReturnType<typeof checkOpenGrammarAnswer>>;

export function ActivityView({
  activity,
  lessonId,
  language,
  reviewTasks,
  onPracticePageChange,
}: {
  activity: Activity;
  lessonId: LessonId;
  language: Language;
  reviewTasks: SelectedReviewTask[];
  onPracticePageChange?: (isLastPage: boolean) => void;
}) {
  const copy = getLessonCopy(language);
  switch (activity.kind) {
    case ActivityKind.Review:
      return <ReviewView tasks={reviewTasks} lessonId={lessonId} copy={copy} />;

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
      return <VocabularyView activity={activity} language={language} />;

    case ActivityKind.Reading:
      return <p className={styles.prose}>{activity.text}</p>;

    case ActivityKind.GrammarPractice:
      return (
        <PracticeView
          activity={activity}
          lessonId={lessonId}
          copy={copy}
          onPageChange={onPracticePageChange}
        />
      );

    case ActivityKind.Writing:
      return (
        <WritingView activity={activity} lessonId={lessonId} copy={copy} />
      );

    default: {
      // Exhaustiveness guard: every activity kind is handled above.
      const _exhaustive: never = activity;
      return _exhaustive;
    }
  }
}

// The number of exercises shown per practice page. Ten exercises are split into
// two pages (1–5, then 6–10) so the learner is never faced with all ten at once:
// the first five appear, then a "Weiter" button reveals the rest before the
// lesson advances to the Writing task. This is presentation only — each exercise
// still checks and persists exactly as before, regardless of which page it is on.
const PRACTICE_PAGE_SIZE = 5;

// Paginated grammar-practice view. Renders one page of exercises at a time and
// keeps a stable global index so numbering (and the LLM/graded split) is
// unaffected by paging. The page cursor is transient UI state only.
function PracticeView({
  activity,
  lessonId,
  copy,
  onPageChange,
}: {
  activity: PracticeTask;
  lessonId: LessonId;
  copy: LessonCopy;
  onPageChange?: (isLastPage: boolean) => void;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(
    1,
    Math.ceil(activity.exercises.length / PRACTICE_PAGE_SIZE),
  );
  const clampedPage = Math.min(page, totalPages - 1);
  const start = clampedPage * PRACTICE_PAGE_SIZE;
  const visible = activity.exercises.slice(start, start + PRACTICE_PAGE_SIZE);
  const isFirstPage = clampedPage === 0;
  const isLastPage = clampedPage === totalPages - 1;

  return (
    <div className={styles.exerciseList}>
      {totalPages > 1 && (
        <p className={styles.reviewIntro}>
          {copy.exercises} {start + 1}–{start + visible.length} {copy.of}{" "}
          {activity.exercises.length}
        </p>
      )}

      {visible.map((exercise, offset) => {
        const index = start + offset;
        return exercise.evaluation === ExerciseEvaluation.Graded ? (
          <GradedExerciseItem
            key={exercise.id}
            exercise={exercise}
            index={index}
            lessonId={lessonId}
            copy={copy}
          />
        ) : (
          <OpenExerciseItem
            key={exercise.id}
            exercise={exercise}
            index={index}
            lessonId={lessonId}
            copy={copy}
          />
        );
      })}

      {totalPages > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              const nextPage = clampedPage - 1;
              setPage(nextPage);
              onPageChange?.(nextPage === totalPages - 1);
            }}
            disabled={isFirstPage}
          >
            {copy.previousExercises}
          </button>
          {!isLastPage && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                const nextPage = clampedPage + 1;
                setPage(nextPage);
                onPageChange?.(nextPage === totalPages - 1);
              }}
            >
              {copy.next}
            </button>
          )}
        </div>
      )}
    </div>
  );
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
  sourceLessonId,
  isReview = false,
  copy,
}: {
  exercise: GradedExercise;
  index: number;
  lessonId: LessonId;
  sourceLessonId?: string;
  isReview?: boolean;
  copy: LessonCopy;
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
        if (isReview && sourceLessonId) {
          await recordReviewAnswer({
            lessonId,
            sourceLessonId,
            exerciseId: exercise.id,
            given: value,
          });
        } else {
          await recordExerciseAnswer({
            lessonId,
            exerciseId: exercise.id,
            given: value,
          });
        }
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
        placeholder={copy.yourAnswer}
        aria-label={copy.answerForExercise(index + 1)}
        aria-describedby={result ? feedbackId : undefined}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        className={styles.checkButton}
        disabled={value.trim().length === 0}
      >
        {result ? copy.checkAgain : copy.checkAnswer}
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
            {result.isCorrect ? copy.correct : copy.notQuite}
          </p>
          {!result.isCorrect && (
            <p className={styles.feedbackAnswer}>
              {copy.correctAnswer} <strong>{result.expected}</strong>
            </p>
          )}
          {exercise.explanation && (
            <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          )}
          {saveState === "error" && (
            <p className={styles.feedbackSave}>{copy.saveFailed}</p>
          )}
        </div>
      )}
    </form>
  );
}

function ReviewView({
  tasks,
  lessonId,
  copy,
}: {
  tasks: SelectedReviewTask[];
  lessonId: LessonId;
  copy: LessonCopy;
}) {
  if (tasks.length === 0) {
    return <div className={styles.note}>{copy.nothingToReview}</div>;
  }

  return (
    <div className={styles.exerciseList}>
      <p className={styles.reviewIntro}>{copy.reviewIntro}</p>
      {tasks.map((task, index) =>
        task.kind === "grammar" ? (
          <GradedExerciseItem
            key={`${task.sourceLessonId}:${task.exercise.id}`}
            exercise={task.exercise}
            index={index}
            lessonId={lessonId}
            sourceLessonId={task.sourceLessonId}
            isReview
            copy={copy}
          />
        ) : (
          <VocabularyReviewCard
            key={`${task.sourceLessonId}:vocab:${task.term}`}
            task={task}
            index={index}
            copy={copy}
          />
        ),
      )}
    </div>
  );
}

// A vocabulary recall card shown in the review block: pick the meaning of the
// term. Deterministic and LLM-free — the learner selects an option, can change
// the selection freely, then presses "Check answer". The client checks
// optimistically against the task's correct meaning while the server re-derives
// it and persists the attempt (as a REVIEW-sourced vocabulary match) through the
// same pipeline as the in-lesson matching exercise.
function VocabularyReviewCard({
  task,
  index,
  copy,
}: {
  task: VocabularyReviewTask;
  index: number;
  copy: LessonCopy;
}) {
  const [options] = useState(() =>
    shuffle(task.options, `${task.term}:review`),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [, startTransition] = useTransition();

  const isCorrect = checked && selected === task.correctMeaning;
  const feedbackId = `${task.sourceLessonId}-${task.term}-feedback`;

  function select(option: string) {
    if (checked) return;
    setSelected(option);
  }

  function handleCheck() {
    if (selected === null || checked) return;
    // Deterministic local check → immediate feedback. The server re-derives the
    // correct meaning authoritatively before persisting this single attempt.
    setChecked(true);
    setSaveError(false);
    const given = selected;
    startTransition(async () => {
      try {
        await recordVocabularyMatch({
          lessonId: task.sourceLessonId,
          term: task.term,
          given,
          isReview: true,
        });
      } catch {
        setSaveError(true);
      }
    });
  }

  return (
    <div className={styles.exercise}>
      <p className={styles.exercisePrompt}>
        <span className={styles.exerciseNumber}>{index + 1}.</span>{" "}
        {copy.matchMeaning} <strong>{task.term}</strong>
      </p>
      <div className={styles.matchOptions}>
        {options.map((option) => {
          let className = styles.matchOption;
          if (checked && option === task.correctMeaning) {
            className = `${styles.matchOption} ${styles.matchCellMatched}`;
          } else if (checked && option === selected) {
            className = `${styles.matchOption} ${styles.matchCellWrong}`;
          } else if (!checked && option === selected) {
            className = `${styles.matchOption} ${styles.matchCellSelected}`;
          }
          return (
            <button
              key={option}
              type="button"
              className={className}
              aria-pressed={!checked && option === selected}
              onClick={() => select(option)}
              disabled={checked}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!checked && (
        <button
          type="button"
          className={styles.checkButton}
          onClick={handleCheck}
          disabled={selected === null}
        >
          {copy.checkAnswer}
        </button>
      )}

      {checked && (
        <div
          id={feedbackId}
          className={
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          }
          aria-live="polite"
        >
          <p className={styles.feedbackHead}>
            {isCorrect ? copy.correct : copy.wrongMeaning}
          </p>
          {!isCorrect && (
            <p className={styles.feedbackAnswer}>
              {copy.correctAnswer} <strong>{task.correctMeaning}</strong>
            </p>
          )}
        </div>
      )}
      {saveError && <p className={styles.feedbackSave}>{copy.saveFailed}</p>}
    </div>
  );
}

function OpenExerciseItem({
  exercise,
  index,
  lessonId,
  copy,
}: {
  exercise: OpenExercise;
  index: number;
  lessonId: LessonId;
  copy: LessonCopy;
}) {
  // The learner's own draft is transient and local. Open grammar exercises can
  // be checked by the LLM mini-checker (which accepts alternative correct
  // answers); other open exercises keep the self-check-against-sample flow.
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [check, setCheck] = useState<OpenGrammarCheck | null>(null);
  const [checkError, setCheckError] = useState(false);
  const [isChecking, startChecking] = useTransition();
  const sampleId = `${exercise.id}-sample`;
  const canAiCheck = exercise.skillArea === SkillArea.Grammar;

  function runCheck() {
    setCheckError(false);
    startChecking(async () => {
      try {
        const result = await checkOpenGrammarAnswer({
          lessonId,
          exerciseId: exercise.id,
          answer: value,
        });
        setCheck(result);
      } catch {
        setCheckError(true);
      }
    });
  }

  return (
    <div className={styles.exercise}>
      <p className={styles.exercisePrompt}>
        <span className={styles.exerciseNumber}>{index + 1}.</span>{" "}
        {exercise.prompt}
      </p>
      <textarea
        className={styles.writingInput}
        rows={2}
        placeholder={copy.yourAnswer}
        aria-label={copy.answerForExercise(index + 1)}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className={styles.matchOptions}>
        {canAiCheck && (
          <button
            type="button"
            className={styles.checkButton}
            onClick={runCheck}
            disabled={isChecking || value.trim().length === 0}
          >
            {isChecking ? copy.aiChecking : copy.checkWithAi}
          </button>
        )}
        <button
          type="button"
          className={styles.matchOption}
          aria-expanded={revealed}
          aria-controls={sampleId}
          onClick={() => setRevealed(true)}
        >
          {copy.showSample}
        </button>
      </div>

      {canAiCheck && <p className={styles.feedbackSave}>{copy.aiCheckNote}</p>}

      {check?.status === "ok" && (
        <div
          className={
            check.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          }
          aria-live="polite"
        >
          <p className={styles.feedbackHead}>
            {check.isCorrect ? copy.correct : copy.hasErrors}
            {check.confidence
              ? ` · ${copy.confidence}: ${check.confidence}`
              : ""}
          </p>
          {check.isCorrect && check.acceptedAlternative && (
            <p className={styles.feedbackAnswer}>
              {copy.acceptedAlternative} {check.acceptedAlternative}
            </p>
          )}
          {!check.isCorrect && check.correctedAnswer && (
            <p className={styles.feedbackAnswer}>
              {copy.correctedAnswer} <strong>{check.correctedAnswer}</strong>
            </p>
          )}
          {check.explanationRu && (
            <p className={styles.feedbackExplanation}>{check.explanationRu}</p>
          )}
          {check.mistakes && check.mistakes.length > 0 && (
            <ul className={styles.theoryList}>
              {check.mistakes.map((mistake, mistakeIndex) => (
                <li key={mistakeIndex} className={styles.theoryItem}>
                  {mistake.original && mistake.correction ? (
                    <>
                      <strong>{mistake.original}</strong> → {mistake.correction}
                      <br />
                    </>
                  ) : null}
                  <span className={styles.feedbackExplanation}>
                    {mistake.explanationRu}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {check?.status === "failed" && (
        <p className={styles.feedbackSave}>{copy.feedbackUnavailable}</p>
      )}
      {checkError && <p className={styles.feedbackSave}>{copy.checkFailed}</p>}

      {revealed && (
        <div id={sampleId} className={styles.feedbackSample} aria-live="polite">
          <p className={styles.feedbackHead}>{copy.sampleAnswer}</p>
          <p className={styles.feedbackAnswer}>{exercise.sampleAnswer}</p>
          {exercise.explanation && (
            <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          )}
          <p className={styles.feedbackSave}>{copy.openExerciseNote}</p>
        </div>
      )}
    </div>
  );
}

function WritingView({
  activity,
  lessonId,
  copy,
}: {
  activity: WritingTask;
  lessonId: LessonId;
  copy: LessonCopy;
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

  // LLM feedback state. The draft remains transient; feedback is derived from
  // the server action's response and is not persisted client-side.
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, startSubmitting] = useTransition();

  function handleSubmit() {
    setSubmitError(null);
    startSubmitting(async () => {
      try {
        const result = await submitWriting({
          lessonId,
          activityId: activity.id,
          text: draft,
        });
        setFeedback(result);
      } catch {
        setSubmitError(copy.submitFailed);
      }
    });
  }

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
          <p className={styles.requirementsTitle}>{copy.requirements}</p>
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
        placeholder={copy.writingPlaceholder}
        aria-label={copy.yourWriting}
      />
      <p
        className={range && inRange ? styles.wordCountOk : styles.wordCount}
        aria-live="polite"
      >
        {wordCount} {wordCount === 1 ? copy.word : copy.words}
        {range && ` · ${copy.targetWordCount} ${range.min}–${range.max}`}
      </p>

      <button
        type="button"
        className={styles.checkButton}
        onClick={handleSubmit}
        disabled={isSubmitting || draft.trim().length === 0}
      >
        {isSubmitting ? copy.submitting : copy.submitWriting}
      </button>

      <p className={styles.note}>{copy.draftNote}</p>

      {submitError && (
        <div className={styles.feedbackIncorrect} aria-live="polite">
          <p className={styles.feedbackHead}>{copy.error}</p>
          <p className={styles.feedbackAnswer}>{submitError}</p>
        </div>
      )}

      {feedback?.status === "failed" && (
        <div className={styles.feedbackIncorrect} aria-live="polite">
          <p className={styles.feedbackHead}>{copy.feedbackUnavailable}</p>
        </div>
      )}

      {feedback?.status === "ok" && (
        <div className={styles.feedbackSample} aria-live="polite">
          <p className={styles.feedbackHead}>
            {copy.levelEstimate}: {feedback.cefr}
            {feedback.cefrConfidence
              ? ` · ${copy.confidence}: ${feedback.cefrConfidence}`
              : ""}
          </p>

          {feedback.strengths && feedback.strengths.length > 0 && (
            <>
              <p className={styles.requirementsTitle}>{copy.strengths}</p>
              <ul className={styles.theoryList}>
                {feedback.strengths.map((item, index) => (
                  <li key={index} className={styles.theoryItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {feedback.summary && (
            <>
              <p className={styles.requirementsTitle}>{copy.improvements}</p>
              <p className={styles.feedbackExplanation}>{feedback.summary}</p>
            </>
          )}

          {feedback.mistakes && feedback.mistakes.length > 0 && (
            <>
              <p className={styles.requirementsTitle}>{copy.mistakes}</p>
              <ul className={styles.theoryList}>
                {feedback.mistakes.map((mistake, index) => (
                  <li key={index} className={styles.theoryItem}>
                    <strong>{mistake.given}</strong> → {mistake.expected}
                    <br />
                    <span className={styles.feedbackExplanation}>
                      {mistake.explanation}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {feedback.improvedText && (
            <>
              <p className={styles.requirementsTitle}>{copy.improvedVersion}</p>
              <p className={styles.feedbackAnswer}>{feedback.improvedText}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// The vocabulary screen: a learning-only reference list. Each term has a speaker
// button to hear it. Active matching practice lives in the standalone Vocabulary
// Trainer (a separate mode), not in the lesson flow.
function VocabularyView({
  activity,
  language,
}: {
  activity: VocabularyBlock;
  language: Language;
}) {
  return (
    <ul className={styles.vocabList}>
      {activity.items.map((item) => (
        <li key={item.term} className={styles.vocabItem}>
          <div className={styles.vocabHead}>
            <span className={styles.vocabTermGroup}>
              <span className={styles.vocabTerm}>{item.term}</span>
              <PronounceButton text={item.term} language={language} />
            </span>
            <span className={styles.vocabTranslation}>{item.translation}</span>
          </div>
          {item.transcription && (
            <p className={styles.vocabTranscription}>{item.transcription}</p>
          )}
          {item.definition && (
            <p className={styles.vocabExample}>{item.definition}</p>
          )}
          {item.example && (
            <p className={styles.vocabExample}>{item.example}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

// Count words in a free-writing draft: split on any whitespace run and drop the
// empty edges so leading/trailing spaces and a blank draft count as zero.
function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}
