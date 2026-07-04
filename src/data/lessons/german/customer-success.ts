// Static lesson content — German / Customer Success & Hospitality (towards C1).
//
// Grammar focus: Konjunktiv II for polite requests, cautious offers, and
// hypothetical goodwill — the register that keeps guest and customer
// communication courteous. Original content authored for WorkLang AI; see the
// content principles in docs/roadmap.md. No copyrighted text is reproduced.
//
// Explanations are in Russian; example sentences and vocabulary usage stay in
// German. Fill-in-the-blank exercises are graded deterministically; polite
// rephrasings are semi-free (Open) and shown against a sample answer.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
  ExerciseEvaluation,
  ExerciseFormat,
  Language,
  MistakeSeverity,
  SkillArea,
} from "@/types";
import type { Lesson } from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

const subjunctiveMistake = {
  topic: "konjunktiv-ii",
  category: "subjunctive-mood",
  severity: MistakeSeverity.Medium,
} as const;

export const germanCustomerSuccessKonjunktiv: Lesson = {
  id: lessonId("de-customer-success-konjunktiv-ii"),
  topic: "konjunktiv-ii",
  language: Language.German,
  careerTrack: CareerTrack.CustomerSuccessHospitality,
  title: "Höflich formulieren: der Konjunktiv II",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Konjunktiv II)",
    "Goethe-Institut — Grammatik-Referenz (Konjunktiv II)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-customer-success-konjunktiv-ii-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Der Konjunktiv II",
      sections: [
        {
          heading: "Зачем нужен",
          body:
            "Konjunktiv II делает высказывания более осторожными и вежливыми " +
            "— именно это важно в общении с гостями и клиентами. Прямые " +
            "просьбы превращаются в дружелюбные предложения.",
        },
        {
          heading: "Как образуется",
          body:
            "У большинства глаголов используют описательную форму «würde» + " +
            "инфинитив. У частых вспомогательных и модальных глаголов есть " +
            "собственные короткие формы, которые стоит знать наизусть.",
        },
        {
          heading: "Важные формы",
          items: [
            "hätte — von «haben»",
            "wäre — von «sein»",
            "könnte — von «können»",
            "würde — von «werden»",
          ],
        },
        {
          heading: "Примеры",
          items: [
            "Ich würde Ihnen gern helfen.",
            "Könnten Sie einen Moment warten?",
            "Ich hätte gern ein ruhiges Zimmer.",
            "An Ihrer Stelle würde ich das Upgrade wählen.",
          ],
        },
      ],
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Kundenbetreuung & Gastgewerbe",
      items: [
        {
          term: "das Anliegen",
          translation: "просьба / обращение (запрос клиента)",
          example: "Ich kümmere mich gern um Ihr Anliegen.",
        },
        {
          term: "die Beschwerde",
          translation: "жалоба",
          example: "Wir würden Ihre Beschwerde gern umgehend klären.",
        },
        {
          term: "die Kulanz",
          translation: "жест доброй воли (уступка клиенту)",
          example: "Aus Kulanz könnten wir Ihnen ein Upgrade anbieten.",
        },
        {
          term: "die Rückerstattung",
          translation: "возврат средств",
          example: "Die Rückerstattung würde innerhalb einer Woche erfolgen.",
        },
        {
          term: "die Verfügbarkeit",
          translation: "доступность / наличие",
          example: "Ich würde gern die Verfügbarkeit für Sie prüfen.",
        },
        {
          term: "die Zufriedenheit",
          translation: "удовлетворённость",
          example: "Ihre Zufriedenheit hätte für uns oberste Priorität.",
        },
      ],
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-reading"),
      kind: ActivityKind.Reading,
      title: "Eine Gästeanfrage beantworten",
      text:
        "Sehr geehrte Frau Berger, vielen Dank für Ihre Nachricht. Gern " +
        "würde ich mich um Ihr Anliegen kümmern. Für den gewünschten Zeitraum " +
        "hätten wir noch ein ruhiges Zimmer zum Innenhof frei; bei Bedarf " +
        "könnten wir zusätzlich einen späteren Check-out einrichten. Falls " +
        "Ihnen ein Zimmer mit Balkon lieber wäre, würde ich die Verfügbarkeit " +
        "umgehend für Sie prüfen. Über eine kurze Rückmeldung würde ich mich " +
        "freuen. Mit freundlichen Grüßen",
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Konjunktiv II",
      exercises: [
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "können"): ' +
            '"Können Sie mir helfen?"',
          sampleAnswer: "Könnten Sie mir helfen?",
          explanation:
            'Форма Konjunktiv II от "können" — "könnten"; как просьба она ' +
            "звучит заметно вежливее.",
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "haben"): ' +
            '"Ich habe gern ein Zimmer mit Blick."',
          sampleAnswer: "Ich hätte gern ein Zimmer mit Blick.",
          explanation:
            '"hätte" — форма Konjunktiv II от "haben"; выражает вежливое ' +
            "пожелание.",
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...subjunctiveMistake,
          subcategory: "wuerde-form",
          prompt:
            'Ergänzen Sie die "würde"-Form: "Ich ___ mich über eine ' +
            'Rückmeldung freuen."',
          expectedAnswer: "würde",
          explanation:
            'У смысловых глаголов Konjunktiv II чаще образуют с "würde" + ' +
            'инфинитив: "würde … freuen".',
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...subjunctiveMistake,
          subcategory: "irregular-form",
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form von "sein": "Falls Ihnen ' +
            'ein späterer Termin lieber ___, sagen Sie gern Bescheid."',
          expectedAnswer: "wäre",
          explanation: '"wäre" — форма Konjunktiv II от "sein".',
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "werden"): ' +
            '"Wir bieten Ihnen aus Kulanz ein Upgrade an."',
          sampleAnswer: "Wir würden Ihnen aus Kulanz ein Upgrade anbieten.",
          explanation:
            'С "würden … anbieten" твёрдое обещание превращается в вежливое, ' +
            "сдержанное предложение.",
        },
      ],
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Gast beschwert sich, dass sein Zimmer bei der Ankunft noch nicht " +
        "bereit war. Schreiben Sie eine höfliche Antwort: entschuldigen Sie " +
        "sich, bieten Sie aus Kulanz eine Lösung an und verwenden Sie " +
        "mindestens vier Konjunktiv-II-Formen.",
      wordRange: { min: 100, max: 130 },
      requirements: [
        "Извинитесь перед гостем",
        "Предложите решение как жест доброй воли (Kulanz)",
        "Используйте не менее четырёх форм Konjunktiv II",
        "Сохраняйте вежливый тон",
      ],
    },
  ],
};
