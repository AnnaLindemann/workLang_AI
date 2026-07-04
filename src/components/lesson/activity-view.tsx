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
}: {
  activity: Activity;
  lessonId: LessonId;
  language: Language;
  reviewTasks: SelectedReviewTask[];
}) {
  switch (activity.kind) {
    case ActivityKind.Review:
      return <ReviewView tasks={reviewTasks} lessonId={lessonId} />;

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
                lessonId={lessonId}
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
  sourceLessonId,
  isReview = false,
}: {
  exercise: GradedExercise;
  index: number;
  lessonId: LessonId;
  sourceLessonId?: string;
  isReview?: boolean;
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

function ReviewView({
  tasks,
  lessonId,
}: {
  tasks: SelectedReviewTask[];
  lessonId: LessonId;
}) {
  if (tasks.length === 0) {
    return (
      <div className={styles.note}>
        Nothing to review yet. Continue to the lesson to build your practice
        history.
      </div>
    );
  }

  return (
    <div className={styles.exerciseList}>
      <p className={styles.reviewIntro}>
        Based on your repeated mistakes and lower-mastery topics.
      </p>
      {tasks.map((task, index) =>
        task.kind === "grammar" ? (
          <GradedExerciseItem
            key={`${task.sourceLessonId}:${task.exercise.id}`}
            exercise={task.exercise}
            index={index}
            lessonId={lessonId}
            sourceLessonId={task.sourceLessonId}
            isReview
          />
        ) : (
          <VocabularyReviewCard
            key={`${task.sourceLessonId}:vocab:${task.term}`}
            task={task}
            index={index}
          />
        ),
      )}
    </div>
  );
}

// A vocabulary recall card shown in the review block: pick the meaning of the
// term. Deterministic and LLM-free — the client checks optimistically against
// the task's correct meaning while the server re-derives it and persists the
// attempt (as a REVIEW-sourced vocabulary match) through the same pipeline as
// the in-lesson matching exercise.
function VocabularyReviewCard({
  task,
  index,
}: {
  task: VocabularyReviewTask;
  index: number;
}) {
  const [options] = useState(() =>
    shuffle(task.options, `${task.term}:review`),
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [, startTransition] = useTransition();

  function choose(option: string) {
    if (solved) return;
    setPicked(option);
    const isCorrect = option === task.correctMeaning;
    if (isCorrect) setSolved(true);
    setSaveError(false);
    startTransition(async () => {
      try {
        await recordVocabularyMatch({
          lessonId: task.sourceLessonId,
          term: task.term,
          given: option,
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
        <span className={styles.exerciseNumber}>{index + 1}.</span> Подберите
        значение: <strong>{task.term}</strong>
      </p>
      <div className={styles.matchOptions}>
        {options.map((option) => {
          const isPicked = picked === option;
          const className =
            solved && option === task.correctMeaning
              ? `${styles.matchOption} ${styles.matchCellMatched}`
              : isPicked && option !== task.correctMeaning
                ? `${styles.matchOption} ${styles.matchCellWrong}`
                : styles.matchOption;
          return (
            <button
              key={option}
              type="button"
              className={className}
              onClick={() => choose(option)}
              disabled={solved}
            >
              {option}
            </button>
          );
        })}
      </div>
      {picked !== null && picked !== task.correctMeaning && !solved && (
        <p className={styles.feedbackSave}>
          Не то значение — попробуйте ещё раз.
        </p>
      )}
      {saveError && (
        <p className={styles.feedbackSave}>
          Ответ засчитан, но сохранить попытку не удалось.
        </p>
      )}
    </div>
  );
}

function OpenExerciseItem({
  exercise,
  index,
  lessonId,
}: {
  exercise: OpenExercise;
  index: number;
  lessonId: LessonId;
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
        placeholder="Your answer"
        aria-label={`Answer for exercise ${index + 1}`}
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
            {isChecking ? "ИИ проверяет…" : "Проверить с ИИ"}
          </button>
        )}
        <button
          type="button"
          className={styles.matchOption}
          aria-expanded={revealed}
          aria-controls={sampleId}
          onClick={() => setRevealed(true)}
        >
          Показать образец
        </button>
      </div>

      {canAiCheck && (
        <p className={styles.feedbackSave}>
          Проверка ответа выполняется языковой моделью (ИИ): она допускает
          несколько верных формулировок.
        </p>
      )}

      {check?.status === "ok" && (
        <div
          className={
            check.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          }
          aria-live="polite"
        >
          <p className={styles.feedbackHead}>
            {check.isCorrect ? "Верно" : "Есть ошибки"}
            {check.confidence ? ` · уверенность: ${check.confidence}` : ""}
          </p>
          {check.isCorrect && check.acceptedAlternative && (
            <p className={styles.feedbackAnswer}>
              Принятый вариант: {check.acceptedAlternative}
            </p>
          )}
          {!check.isCorrect && check.correctedAnswer && (
            <p className={styles.feedbackAnswer}>
              Исправленный вариант: <strong>{check.correctedAnswer}</strong>
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
        <p className={styles.feedbackSave}>{check.message}</p>
      )}
      {checkError && (
        <p className={styles.feedbackSave}>
          Не удалось выполнить проверку. Попробуйте ещё раз.
        </p>
      )}

      {revealed && (
        <div id={sampleId} className={styles.feedbackSample} aria-live="polite">
          <p className={styles.feedbackHead}>Образец ответа</p>
          <p className={styles.feedbackAnswer}>{exercise.sampleAnswer}</p>
          {exercise.explanation && (
            <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          )}
          <p className={styles.feedbackSave}>
            Свободное задание: несколько формулировок могут быть верными.
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
        setSubmitError(
          "Не удалось отправить текст на проверку. Попробуйте ещё раз.",
        );
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

      <button
        type="button"
        className={styles.checkButton}
        onClick={handleSubmit}
        disabled={isSubmitting || draft.trim().length === 0}
      >
        {isSubmitting ? "Проверяем…" : "Проверить письмо"}
      </button>

      <p className={styles.note}>
        Черновик хранится только как временное состояние в браузере. При
        отправке текст сохраняется в базе, и вы получаете обратную связь, оценку
        уровня CEFR и улучшенную версию.
      </p>

      {submitError && (
        <div className={styles.feedbackIncorrect} aria-live="polite">
          <p className={styles.feedbackHead}>Ошибка</p>
          <p className={styles.feedbackAnswer}>{submitError}</p>
        </div>
      )}

      {feedback?.status === "failed" && (
        <div className={styles.feedbackIncorrect} aria-live="polite">
          <p className={styles.feedbackHead}>Обратная связь недоступна</p>
          <p className={styles.feedbackAnswer}>{feedback.message}</p>
        </div>
      )}

      {feedback?.status === "ok" && (
        <div className={styles.feedbackSample} aria-live="polite">
          <p className={styles.feedbackHead}>
            Оценка уровня: {feedback.cefr}
            {feedback.cefrConfidence
              ? ` · уверенность: ${feedback.cefrConfidence}`
              : ""}
          </p>

          {feedback.strengths && feedback.strengths.length > 0 && (
            <>
              <p className={styles.requirementsTitle}>Сильные стороны</p>
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
              <p className={styles.requirementsTitle}>
                Что улучшить в первую очередь
              </p>
              <p className={styles.feedbackExplanation}>{feedback.summary}</p>
            </>
          )}

          {feedback.mistakes && feedback.mistakes.length > 0 && (
            <>
              <p className={styles.requirementsTitle}>Ошибки</p>
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
              <p className={styles.requirementsTitle}>Улучшенная версия</p>
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
