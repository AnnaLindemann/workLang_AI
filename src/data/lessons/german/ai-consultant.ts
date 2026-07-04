// Static lesson content — German / AI Consultant (towards C1).
//
// Grammar focus: Vorgangspassiv (process passive) for describing project steps,
// data flows, and system behaviour without foregrounding an actor. Original
// content authored for WorkLang AI; see the content principles in
// docs/roadmap.md. No copyrighted text is reproduced.
//
// Explanations (theory prose, headings, exercise notes) are in Russian for the
// learner; example sentences and vocabulary usage stay in the target language
// (German). Fill-in-the-blank exercises are graded deterministically; sentence
// transformations are semi-free (Open) and shown against a sample answer.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
  ExerciseEvaluation,
  ExerciseFormat,
  Language,
  SkillArea,
} from "@/types";
import type { Lesson } from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

export const germanAiConsultantPassive: Lesson = {
  id: lessonId("de-ai-consultant-vorgangspassiv"),
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Prozesse beschreiben: das Vorgangspassiv",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Passiv)",
    "Goethe-Institut — Grammatik-Referenz (Vorgangspassiv)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-vorgangspassiv-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Das Vorgangspassiv",
      sections: [
        {
          heading: "Что это",
          body:
            "Vorgangspassiv (пассив действия) выдвигает на первый план само " +
            "действие и оставляет неважным или неназванным того, кто его " +
            "выполняет. В консалтинге это удобно: часто важнее процесс, а не " +
            "исполнитель — в центре стоит модель, анализ или шаг системы, а не " +
            "команда за ними.",
        },
        {
          heading: "Как образуется",
          body:
            "Форма глагола «werden» + партицип II смыслового глагола. В " +
            "придаточном предложении спрягаемая форма «werden» уходит в конец " +
            "предложения.",
        },
        {
          heading: "Кто исполнитель",
          body:
            "Если исполнителя всё же называют, используют «von» (+ Dativ) для " +
            "действующего лица и «durch» (+ Akkusativ) для средства или " +
            "инструмента.",
        },
        {
          heading: "Примеры",
          items: [
            "Die Daten werden anonymisiert.",
            "Der Bericht wird vom Berater geprüft.",
            "Die Auswertung wird durch ein Skript erstellt.",
            "…, bevor das Modell trainiert wird.",
          ],
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: KI-Beratung",
      items: [
        {
          term: "die Anforderungsanalyse",
          translation: "анализ требований",
          example:
            "Vor der Umsetzung wird eine gründliche Anforderungsanalyse " +
            "durchgeführt.",
        },
        {
          term: "der Machbarkeitsnachweis",
          translation: "подтверждение осуществимости (proof of concept)",
          example:
            "Der Machbarkeitsnachweis wird in zwei Wochen fertiggestellt.",
        },
        {
          term: "die Schnittstelle",
          translation: "интерфейс / API",
          example:
            "Die Schnittstelle wird an das bestehende System angebunden.",
        },
        {
          term: "der Anwendungsfall",
          translation: "сценарий использования",
          example: "Für jeden Anwendungsfall werden klare Kriterien definiert.",
        },
        {
          term: "der Datenschutz",
          translation: "защита данных",
          example: "Der Datenschutz wird bei jedem Schritt berücksichtigt.",
        },
        {
          term: "die Wirtschaftlichkeit",
          translation: "экономическая целесообразность",
          example: "Die Wirtschaftlichkeit der Lösung wird laufend geprüft.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-reading"),
      kind: ActivityKind.Reading,
      title: "Ein KI-Projekt beim Kunden",
      text:
        "Zu Beginn eines Projekts wird gemeinsam mit dem Kunden der " +
        "Anwendungsfall festgelegt. Anschließend werden die vorhandenen Daten " +
        "gesichtet und auf Qualität geprüft. Personenbezogene Angaben werden " +
        "anonymisiert, bevor ein erstes Modell trainiert wird. Die Ergebnisse " +
        "werden in einem Machbarkeitsnachweis zusammengefasst und dem " +
        "Fachbereich vorgestellt. Erst wenn die Wirtschaftlichkeit bestätigt " +
        "ist, wird die Lösung über eine Schnittstelle in das bestehende System " +
        "integriert und schrittweise ausgerollt.",
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Vorgangspassiv",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Wir speichern die ' +
            'Kundendaten verschlüsselt."',
          sampleAnswer: "Die Kundendaten werden verschlüsselt gespeichert.",
          explanation:
            'Дополнение "die Kundendaten" становится подлежащим; "werden" + ' +
            'партицип II "gespeichert" образуют пассив. Возможны варианты ' +
            "порядка слов — сравните свой ответ с образцом.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          prompt:
            'Ergänzen Sie die richtige Form von "werden": "Bevor das ' +
            'Modell trainiert ___, werden die Daten bereinigt."',
          expectedAnswer: "wird",
          explanation:
            'В придаточном предложении спрягаемое "werden" стоит в конце; ' +
            'подлежащее "das Modell" в единственном числе — "wird".',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          prompt:
            'Ergänzen Sie "von" oder "durch": "Der Bericht wird ___ dem ' +
            'Berater geprüft."',
          expectedAnswer: "von",
          explanation:
            'Действующее лицо (человек) присоединяется предлогом "von" + ' +
            "Dativ.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          prompt:
            'Ergänzen Sie "von" oder "durch": "Die Auswertung wird ___ ' +
            'ein Skript erstellt."',
          expectedAnswer: "durch",
          explanation:
            "Средство или инструмент действия присоединяется предлогом " +
            '"durch" + Akkusativ.',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Das Team stellt die ' +
            'Ergebnisse vor."',
          sampleAnswer: "Die Ergebnisse werden vorgestellt.",
          explanation:
            "Отделяемый глагол: в партиципе II приставка остаётся " +
            'присоединённой — "vorgestellt".',
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde bittet um eine kurze Beschreibung, wie ein KI-Projekt " +
        "abläuft. Beschreiben Sie den Ablauf und verwenden Sie mindestens " +
        "fünf Passivkonstruktionen. Achten Sie auf einen sachlichen, " +
        "professionellen Ton.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Опишите ход проекта по шагам",
        "Используйте не менее пяти пассивных конструкций (Vorgangspassiv)",
        "Сохраняйте деловой, нейтральный тон",
      ],
    },
  ],
};
