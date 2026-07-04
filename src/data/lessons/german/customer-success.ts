// Static lesson content — German / Customer Success & Hospitality (towards C1).
//
// Grammar focus: Konjunktiv II for polite requests, cautious offers, and
// hypothetical goodwill — the register that keeps guest and customer
// communication courteous. Original content authored for WorkLang AI; see the
// content principles in docs/roadmap.md. No copyrighted text is reproduced.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
  Language,
  SkillArea,
} from "@/types";
import type { Lesson } from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

export const germanCustomerSuccessKonjunktiv: Lesson = {
  id: lessonId("de-customer-success-konjunktiv-ii"),
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
      content:
        "Der Konjunktiv II macht Aussagen vorsichtiger und höflicher — genau " +
        "das, was im Umgang mit Gästen und Kunden zählt. Bei den meisten " +
        'Verben verwendet man die Umschreibung mit "würde" + Infinitiv: ' +
        '"Ich würde Ihnen gern helfen." Häufige Hilfs- und Modalverben haben ' +
        'eigene, kurze Formen, die man auswendig kennen sollte: "hätte" ' +
        '(haben), "wäre" (sein), "könnte" (können), "würde" (werden). ' +
        'Mit ihnen werden aus direkten Bitten freundliche Angebote: "Können ' +
        'Sie warten?" wird zu "Könnten Sie einen Moment warten?", und ' +
        '"Ich will ein ruhiges Zimmer" wird zu "Ich hätte gern ein ruhiges ' +
        'Zimmer." Der Konjunktiv II drückt außerdem Hypothetisches aus: ' +
        '"An Ihrer Stelle würde ich das Upgrade wählen."',
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Kundenbetreuung & Gastgewerbe",
      items: [
        {
          term: "das Anliegen",
          translation: "request / concern",
          example: "Ich kümmere mich gern um Ihr Anliegen.",
        },
        {
          term: "die Beschwerde",
          translation: "complaint",
          example: "Wir würden Ihre Beschwerde gern umgehend klären.",
        },
        {
          term: "die Kulanz",
          translation: "goodwill gesture",
          example: "Aus Kulanz könnten wir Ihnen ein Upgrade anbieten.",
        },
        {
          term: "die Rückerstattung",
          translation: "refund",
          example: "Die Rückerstattung würde innerhalb einer Woche erfolgen.",
        },
        {
          term: "die Verfügbarkeit",
          translation: "availability",
          example: "Ich würde gern die Verfügbarkeit für Sie prüfen.",
        },
        {
          term: "die Zufriedenheit",
          translation: "satisfaction",
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
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "können"): ' +
            '"Können Sie mir helfen?"',
          expectedAnswer: "Könnten Sie mir helfen?",
          acceptedAnswers: ["Könnten Sie mir helfen"],
          explanation:
            'Die Konjunktiv-II-Form von "können" ist "könnten" und wirkt ' +
            "als Bitte deutlich freundlicher.",
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex2"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "haben"): ' +
            '"Ich habe gern ein Zimmer mit Blick."',
          expectedAnswer: "Ich hätte gern ein Zimmer mit Blick.",
          acceptedAnswers: ["Ich hätte gern ein Zimmer mit Blick"],
          explanation:
            '"hätte" ist die Konjunktiv-II-Form von "haben" und drückt ' +
            "einen höflichen Wunsch aus.",
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex3"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Ergänzen Sie die "würde"-Form: "Ich ___ mich über eine ' +
            'Rückmeldung freuen."',
          expectedAnswer: "würde",
          explanation:
            'Bei Vollverben bildet man den Konjunktiv II meist mit "würde" ' +
            '+ Infinitiv: "würde ... freuen".',
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex4"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form von "sein": "Falls Ihnen ' +
            'ein späterer Termin lieber ___, sagen Sie gern Bescheid."',
          expectedAnswer: "wäre",
          explanation: '"wäre" ist die Konjunktiv-II-Form von "sein".',
        },
        {
          id: exerciseId("de-customer-success-konjunktiv-ii-ex5"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Formulieren Sie höflicher (Konjunktiv II von "werden"): ' +
            '"Wir bieten Ihnen aus Kulanz ein Upgrade an."',
          expectedAnswer: "Wir würden Ihnen aus Kulanz ein Upgrade anbieten.",
          acceptedAnswers: ["Wir würden Ihnen aus Kulanz ein Upgrade anbieten"],
          explanation:
            'Mit "würden ... anbieten" wird aus der festen Zusage ein ' +
            "höfliches, zurückhaltendes Angebot.",
        },
      ],
    },
    {
      id: activityId("de-customer-success-konjunktiv-ii-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Gast beschwert sich, dass sein Zimmer bei der Ankunft noch nicht " +
        "bereit war. Schreiben Sie eine höfliche Antwort (100–130 Wörter): " +
        "entschuldigen Sie sich, bieten Sie aus Kulanz eine Lösung an und " +
        "verwenden Sie mindestens vier Konjunktiv-II-Formen.",
    },
  ],
};
