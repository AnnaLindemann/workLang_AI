import { ActivityKind, Language } from "@/types";
import type { ActivityKind as ActivityKindType } from "@/types";

const activityKinds: Record<Language, Record<ActivityKindType, string>> = {
  [Language.German]: {
    [ActivityKind.Review]: "Wiederholung",
    [ActivityKind.GrammarTheory]: "Grammatiktheorie",
    [ActivityKind.Vocabulary]: "Wortschatz",
    [ActivityKind.Reading]: "Lesen",
    [ActivityKind.GrammarPractice]: "Übung",
    [ActivityKind.Writing]: "Schreiben",
  },
  [Language.English]: {
    [ActivityKind.Review]: "Review",
    [ActivityKind.GrammarTheory]: "Grammar theory",
    [ActivityKind.Vocabulary]: "Vocabulary",
    [ActivityKind.Reading]: "Reading",
    [ActivityKind.GrammarPractice]: "Practice",
    [ActivityKind.Writing]: "Writing",
  },
};

const copy = {
  [Language.German]: {
    activityKinds: activityKinds[Language.German],
    learn: "Lernen",
    target: "Ziel",
    lessonProgress: "Lektionsfortschritt",
    step: "Schritt",
    of: "von",
    previous: "Zurück",
    next: "Weiter",
    finish: "Beenden",
    lessonComplete: "Lektion abgeschlossen",
    completion: (title: string) =>
      `Du hast alle Abschnitte von „${title}“ bearbeitet. Bewertete Antworten wurden gespeichert und dein Fehlerverlauf sowie deine Themenkenntnisse aktualisiert. Offene Übungen und Schreibaufgaben dienen der Selbstkontrolle und wurden nicht bewertet.`,
    startOver: "Neu starten",
    backToLessons: "Zurück zu den Lektionen",
    exercises: "Aufgaben",
    previousExercises: "Vorherige Aufgaben",
    yourAnswer: "Deine Antwort",
    answerForExercise: (n: number) => `Antwort für Aufgabe ${n}`,
    checkAnswer: "Antwort prüfen",
    checkAgain: "Erneut prüfen",
    correct: "Richtig",
    notQuite: "Noch nicht ganz",
    correctAnswer: "Richtige Antwort:",
    saveFailed:
      "Deine Antwort wurde geprüft, aber der Versuch konnte nicht gespeichert werden.",
    nothingToReview:
      "Noch nichts zu wiederholen. Fahre mit der Lektion fort, um Übungsverlauf aufzubauen.",
    reviewIntro:
      "Basierend auf wiederholten Fehlern und Themen mit geringerem Kenntnisstand.",
    matchMeaning: "Wähle die Bedeutung:",
    wrongMeaning: "Falsche Bedeutung",
    aiChecking: "KI prüft…",
    checkWithAi: "Mit KI prüfen",
    showSample: "Beispiel anzeigen",
    aiCheckNote:
      "Die Antwort wird von einem Sprachmodell (KI) geprüft, das mehrere richtige Formulierungen akzeptiert.",
    hasErrors: "Enthält Fehler",
    confidence: "Sicherheit",
    acceptedAlternative: "Akzeptierte Alternative:",
    correctedAnswer: "Korrigierte Antwort:",
    checkFailed: "Die Prüfung ist fehlgeschlagen. Bitte versuche es erneut.",
    sampleAnswer: "Beispielantwort",
    openExerciseNote:
      "Offene Aufgabe: Mehrere Formulierungen können richtig sein.",
    submitFailed:
      "Der Text konnte nicht zur Prüfung gesendet werden. Bitte versuche es erneut.",
    requirements: "Das sollte enthalten sein",
    writingPlaceholder: "Schreibe deine Antwort hier…",
    yourWriting: "Dein Text",
    word: "Wort",
    words: "Wörter",
    targetWordCount: "Ziel",
    submitting: "Wird geprüft…",
    submitWriting: "Text prüfen",
    draftNote:
      "Der Entwurf wird nur vorübergehend im Browser gespeichert. Beim Absenden wird der Text gespeichert und du erhältst Feedback, eine CEFR-Einschätzung und eine verbesserte Version.",
    error: "Fehler",
    feedbackUnavailable: "Feedback nicht verfügbar",
    levelEstimate: "Niveaueinschätzung",
    strengths: "Stärken",
    improvements: "Wichtigste Verbesserungen",
    mistakes: "Fehler",
    improvedVersion: "Verbesserte Version",
    pronounce: (text: string) => `${text} aussprechen`,
  },
  [Language.English]: {
    activityKinds: activityKinds[Language.English],
    learn: "Learn",
    target: "Target",
    lessonProgress: "Lesson progress",
    step: "Step",
    of: "of",
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    lessonComplete: "Lesson complete",
    completion: (title: string) =>
      `You worked through every screen of “${title}”. Saving graded answers also updated your mistake history and topic mastery. Open exercises and writing remain self-check activities and were not graded.`,
    startOver: "Start over",
    backToLessons: "Back to lessons",
    exercises: "Exercises",
    previousExercises: "Previous exercises",
    yourAnswer: "Your answer",
    answerForExercise: (n: number) => `Answer for exercise ${n}`,
    checkAnswer: "Check answer",
    checkAgain: "Check again",
    correct: "Correct",
    notQuite: "Not quite",
    correctAnswer: "Correct answer:",
    saveFailed: "Your answer was checked, but saving this attempt failed.",
    nothingToReview:
      "Nothing to review yet. Continue to the lesson to build your practice history.",
    reviewIntro: "Based on your repeated mistakes and lower-mastery topics.",
    matchMeaning: "Choose the meaning:",
    wrongMeaning: "Wrong meaning",
    aiChecking: "AI is checking…",
    checkWithAi: "Check with AI",
    showSample: "Show sample",
    aiCheckNote:
      "The answer is checked by a language model (AI), which accepts multiple correct formulations.",
    hasErrors: "Has errors",
    confidence: "confidence",
    acceptedAlternative: "Accepted alternative:",
    correctedAnswer: "Corrected answer:",
    checkFailed: "The check failed. Please try again.",
    sampleAnswer: "Sample answer",
    openExerciseNote: "Open exercise: Multiple formulations may be correct.",
    submitFailed:
      "The text could not be submitted for review. Please try again.",
    requirements: "What to include",
    writingPlaceholder: "Write your response here…",
    yourWriting: "Your writing",
    word: "word",
    words: "words",
    targetWordCount: "target",
    submitting: "Checking…",
    submitWriting: "Check writing",
    draftNote:
      "The draft is stored only as temporary browser state. When submitted, the text is saved and you receive feedback, a CEFR estimate, and an improved version.",
    error: "Error",
    feedbackUnavailable: "Feedback unavailable",
    levelEstimate: "Level estimate",
    strengths: "Strengths",
    improvements: "What to improve first",
    mistakes: "Mistakes",
    improvedVersion: "Improved version",
    pronounce: (text: string) => `Pronounce ${text}`,
  },
};

export type LessonCopy = (typeof copy)[Language];

export function getLessonCopy(language: Language): LessonCopy {
  return copy[language];
}
