// Static lesson content — German / AI Consultant (towards C1).
//
// Grammar focus: Vorgangspassiv (process passive) for describing project steps,
// data flows, and system behaviour without foregrounding an actor. Original
// content authored for WorkLang AI; see the content principles in
// docs/roadmap.md. No copyrighted text is reproduced.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
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
      content:
        "Das Vorgangspassiv rückt die Handlung in den Vordergrund und lässt " +
        "offen oder nebensächlich, wer sie ausführt. Gebildet wird es mit einer " +
        'Form von "werden" und dem Partizip II des Vollverbs: "Die Daten ' +
        'werden anonymisiert." In der Beratung ist das nützlich, weil oft der ' +
        "Prozess wichtiger ist als die handelnde Person — ein Modell, eine " +
        "Analyse oder ein Systemschritt steht im Zentrum, nicht das Team " +
        'dahinter. Wird der Urheber doch genannt, geschieht das mit "von" ' +
        '(+ Dativ) für den Handelnden oder "durch" (+ Akkusativ) für das ' +
        'Mittel: "Der Bericht wird vom Berater geprüft; die Auswertung wird ' +
        'durch ein Skript erstellt." Im Nebensatz wandert die konjugierte Form ' +
        'von "werden" ans Ende: "..., bevor das Modell trainiert wird."',
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: KI-Beratung",
      items: [
        {
          term: "die Anforderungsanalyse",
          translation: "requirements analysis",
          example:
            "Vor der Umsetzung wird eine gründliche Anforderungsanalyse " +
            "durchgeführt.",
        },
        {
          term: "der Machbarkeitsnachweis",
          translation: "proof of concept",
          example:
            "Der Machbarkeitsnachweis wird in zwei Wochen fertiggestellt.",
        },
        {
          term: "die Schnittstelle",
          translation: "interface / API",
          example:
            "Die Schnittstelle wird an das bestehende System angebunden.",
        },
        {
          term: "der Anwendungsfall",
          translation: "use case",
          example: "Für jeden Anwendungsfall werden klare Kriterien definiert.",
        },
        {
          term: "der Datenschutz",
          translation: "data protection",
          example: "Der Datenschutz wird bei jedem Schritt berücksichtigt.",
        },
        {
          term: "die Wirtschaftlichkeit",
          translation: "cost-effectiveness",
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
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Wir speichern die ' +
            'Kundendaten verschlüsselt."',
          expectedAnswer: "Die Kundendaten werden verschlüsselt gespeichert.",
          acceptedAnswers: ["Die Kundendaten werden verschlüsselt gespeichert"],
          explanation:
            'Das Objekt "die Kundendaten" wird zum Subjekt; "werden" + ' +
            'Partizip II "gespeichert" bilden das Passiv.',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex2"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Ergänzen Sie die richtige Form von "werden": "Bevor das ' +
            'Modell trainiert ___, werden die Daten bereinigt."',
          expectedAnswer: "wird",
          explanation:
            'Im Nebensatz steht das konjugierte "werden" am Satzende; ' +
            'Subjekt "das Modell" ist Singular: "wird".',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex3"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Ergänzen Sie "von" oder "durch": "Der Bericht wird ___ dem ' +
            'Berater geprüft."',
          expectedAnswer: "von",
          explanation:
            'Der handelnde Urheber (eine Person) wird mit "von" + Dativ ' +
            "angeschlossen.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex4"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Ergänzen Sie "von" oder "durch": "Die Auswertung wird ___ ' +
            'ein Skript erstellt."',
          expectedAnswer: "durch",
          explanation:
            'Das Mittel oder Werkzeug einer Handlung wird mit "durch" + ' +
            "Akkusativ angeschlossen.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex5"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Das Team stellt die ' +
            'Ergebnisse vor."',
          expectedAnswer: "Die Ergebnisse werden vorgestellt.",
          acceptedAnswers: ["Die Ergebnisse werden vorgestellt"],
          explanation:
            "Trennbares Verb: Im Partizip II bleibt die Vorsilbe verbunden — " +
            '"vorgestellt".',
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde bittet um eine kurze Beschreibung, wie ein KI-Projekt " +
        "abläuft. Beschreiben Sie den Ablauf in 120–150 Wörtern und verwenden " +
        "Sie mindestens fünf Passivkonstruktionen. Achten Sie auf einen " +
        "sachlichen, professionellen Ton.",
    },
  ],
};
