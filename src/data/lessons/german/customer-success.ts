// German Customer Success / Hospitality curriculum (C1).
// Theory and explanations are in Russian; target-language material is German.
// Each lesson contains 8 deterministic and 2 open grammar exercises. Open
// exercises use the existing universal LLM checker; no infrastructure lives here.

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
import type { Lesson, TheorySection, VocabularyItem } from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

interface GradedSpec {
  prompt: string;
  answer: string;
  alternatives?: string[];
  explanation: string;
}

interface OpenSpec {
  prompt: string;
  sample: string;
  criteria: string;
}

interface LessonSpec {
  slug: string;
  topic: string;
  title: string;
  theory: TheorySection[];
  vocabulary: VocabularyItem[];
  readingTitle: string;
  reading: string;
  graded: GradedSpec[];
  open: OpenSpec[];
  writing: string;
  wordRange: { min: number; max: number };
  requirements: string[];
  sources: string[];
}

const v = (
  term: string,
  translation: string,
  example: string,
): VocabularyItem => ({
  term,
  translation,
  example,
});

function buildLesson(spec: LessonSpec): Lesson {
  const base = `de-customer-success-${spec.slug}`;
  return {
    id: lessonId(base),
    topic: spec.topic,
    language: Language.German,
    careerTrack: CareerTrack.CustomerSuccessHospitality,
    title: spec.title,
    targetLevel: CefrLevel.C1,
    sources: spec.sources,
    activities: [
      {
        id: activityId(`${base}-review`),
        kind: ActivityKind.Review,
        title: "Wiederholung",
      },
      {
        id: activityId(`${base}-theory`),
        kind: ActivityKind.GrammarTheory,
        title: spec.title,
        sections: spec.theory,
      },
      {
        id: activityId(`${base}-vocabulary`),
        kind: ActivityKind.Vocabulary,
        title: "Fachwortschatz und Business-Phrasen",
        items: spec.vocabulary,
      },
      {
        id: activityId(`${base}-reading`),
        kind: ActivityKind.Reading,
        title: spec.readingTitle,
        text: spec.reading,
      },
      {
        id: activityId(`${base}-practice`),
        kind: ActivityKind.GrammarPractice,
        title: "Grammatik im Berufskontext",
        exercises: [
          ...spec.graded.map((item, index) => ({
            id: exerciseId(`${base}-ex${index + 1}`),
            skillArea: SkillArea.Grammar,
            format: ExerciseFormat.FillBlank,
            evaluation: ExerciseEvaluation.Graded,
            topic: spec.topic,
            category: "grammar",
            subcategory: spec.topic,
            severity: MistakeSeverity.Medium,
            prompt: item.prompt,
            expectedAnswer: item.answer,
            acceptedAnswers: item.alternatives,
            explanation: item.explanation,
          })),
          ...spec.open.map((item, index) => ({
            id: exerciseId(`${base}-ex${index + 9}`),
            skillArea: SkillArea.Grammar,
            format: ExerciseFormat.Rewrite,
            evaluation: ExerciseEvaluation.Open,
            prompt: item.prompt,
            sampleAnswer: item.sample,
            explanation: `Критерии оценки: ${item.criteria} Допустимы другие корректные формулировки.`,
          })),
        ],
      },
      {
        id: activityId(`${base}-writing`),
        kind: ActivityKind.Writing,
        title: "Schreibaufgabe",
        prompt: spec.writing,
        wordRange: spec.wordRange,
        requirements: spec.requirements,
      },
    ],
  };
}

const commonSources = [
  "Duden — Die Grammatik",
  "Goethe-Institut — Grammatik-Referenz",
  "Deutsche Welle — Deutsch lernen, Grammatik",
];

const specs: LessonSpec[] = [
  {
    slug: "verbklammer",
    topic: "verbklammer",
    title: "Hauptsatz und Verbklammer im Gäste-Onboarding",
    theory: [
      {
        heading: "Где это нужно",
        body: "В главном предложении спрягаемая часть сказуемого стоит на второй позиции, а отделяемая приставка, инфинитив или Partizip II закрывает рамку. Такая структура делает инструкции гостю точными.",
      },
      {
        heading: "Форма",
        items: [
          "Wir richten Ihr Profil heute ein.",
          "Das Team wird die Zugangsdaten morgen senden.",
          "Bitte geben Sie Ihre Wünsche im Portal an.",
        ],
      },
      {
        heading: "Типичная ошибка",
        body: "Нельзя ставить обе части глагола рядом: «Wir einrichten das Profil» неверно. Внутри рамки обычно располагаются дополнения и обстоятельства.",
      },
      {
        heading: "Итог",
        body: "Сначала определите спрягаемую часть на позиции 2, затем вынесите вторую часть сказуемого в конец.",
      },
    ],
    vocabulary: [
      v(
        "das Gästeprofil",
        "профиль гостя",
        "Wir legen das Gästeprofil heute an.",
      ),
      v(
        "die Anreisepräferenz",
        "предпочтение по приезду",
        "Bitte geben Sie Ihre Anreisepräferenz an.",
      ),
      v(
        "der Buchungscode",
        "код бронирования",
        "Wir senden den Buchungscode erneut zu.",
      ),
      v(
        "die Willkommensnachricht",
        "приветственное сообщение",
        "Das System verschickt eine Willkommensnachricht.",
      ),
      v(
        "die Zugangsdaten",
        "данные доступа",
        "Sie erhalten die Zugangsdaten per E-Mail.",
      ),
      v("einrichten", "настраивать", "Wir richten den mobilen Check-in ein."),
      v(
        "freischalten",
        "активировать",
        "Die Rezeption schaltet den Zugang frei.",
      ),
      v(
        "hinterlegen",
        "вносить в систему",
        "Wir hinterlegen Ihre Präferenzen im CRM.",
      ),
      v("abgleichen", "сверять", "Das Team gleicht die Kontaktdaten ab."),
      v(
        "Willkommen heißen",
        "приветствовать",
        "Wir heißen die Gruppe persönlich willkommen.",
      ),
      v(
        "in die Wege leiten",
        "запустить процесс",
        "Ich leite die Zimmerzuteilung in die Wege.",
      ),
      v(
        "Bescheid geben",
        "сообщить",
        "Bitte geben Sie uns rechtzeitig Bescheid.",
      ),
      v(
        "zur Verfügung stellen",
        "предоставить",
        "Wir stellen einen digitalen Guide zur Verfügung.",
      ),
      v(
        "den Aufenthalt vorbereiten",
        "подготовить пребывание",
        "Unser Team bereitet Ihren Aufenthalt vor.",
      ),
      v(
        "Darf ich kurz zusammenfassen?",
        "позвольте кратко подытожить",
        "Darf ich kurz zusammenfassen, was wir vereinbart haben?",
      ),
    ],
    readingTitle: "Digitales Onboarding einer Tagungsgruppe",
    reading:
      "Das Customer-Success-Team bereitet die Anreise einer internationalen Tagungsgruppe vor. Heute gleicht es die Teilnehmerliste mit dem CRM ab und richtet für die Organisatorin ein Gästeportal ein. Die Rezeption wird die digitalen Schlüssel am Anreisetag freischalten. Vorher sendet das Team allen Gästen eine Willkommensnachricht zu und stellt einen kurzen Hotelguide zur Verfügung. Besondere Ernährungswünsche trägt die Veranstaltungskoordination direkt im Profil ein. So kann das Hotel die Gruppe persönlich willkommen heißen und den Check-in zügig durchführen.",
    graded: [
      {
        prompt: "Ergänzen Sie: Wir ___ das Gästeprofil heute ein. (richten)",
        answer: "richten",
        explanation:
          "Спрягаемая часть занимает позицию 2; «ein» закрывает рамку.",
      },
      {
        prompt: "Ergänzen Sie: Das Team gleicht die Teilnehmerliste ___.",
        answer: "ab",
        explanation: "Отделяемая приставка «ab» стоит в конце.",
      },
      {
        prompt: "Ergänzen Sie: Wir werden die Zugangsdaten morgen ___.",
        answer: "senden",
        explanation: "При Futur I инфинитив завершает рамку.",
      },
      {
        prompt: "Ergänzen Sie: Die Rezeption hat den Zugang ___.",
        answer: "freigeschaltet",
        explanation: "В Perfekt Partizip II стоит в конце.",
      },
      {
        prompt: "Ergänzen Sie: Bitte geben Sie uns rechtzeitig ___.",
        answer: "Bescheid",
        explanation: "Устойчивое сочетание «Bescheid geben» образует рамку.",
      },
      {
        prompt: "Ergänzen Sie: Das Hotel stellt einen Guide zur ___ .",
        answer: "Verfügung",
        explanation: "Верно: «zur Verfügung stellen».",
      },
      {
        prompt:
          "Ergänzen Sie: Heute ___ wir die Zimmerzuteilung in die Wege. (leiten)",
        answer: "leiten",
        explanation: "Спрягаемый глагол стоит вторым.",
      },
      {
        prompt: "Ergänzen Sie: Wann kommt die Tagungsgruppe ___?",
        answer: "an",
        explanation: "В вопросе приставка «an» завершает предложение.",
      },
    ],
    open: [
      {
        prompt:
          "Formulieren Sie mit Verbklammer: Wir / heute / das Gästeportal / einrichten.",
        sample: "Wir richten das Gästeportal heute ein.",
        criteria:
          "главное предложение, глагол на позиции 2, приставка «ein» в конце, сохранение смысла.",
      },
      {
        prompt:
          "Formulieren Sie als klare Zukunftsaussage: Das Team / morgen / die Präferenzen / im CRM / hinterlegen.",
        sample: "Das Team wird die Präferenzen morgen im CRM hinterlegen.",
        criteria:
          "Futur I с рамкой «wird … hinterlegen», естественный порядок дополнений.",
      },
    ],
    writing:
      "Schreiben Sie eine interne Onboarding-Nachricht für die Anreise einer MICE-Gruppe. Beschreiben Sie mindestens vier vorbereitende Schritte und Zuständigkeiten.",
    wordRange: { min: 120, max: 150 },
    requirements: [
      "Используйте минимум четыре Verbklammer",
      "Упомяните CRM, Gästeportal и Anreise",
      "Чётко распределите обязанности",
    ],
    sources: commonSources,
  },
  {
    slug: "perfekt-praeteritum",
    topic: "perfekt-praeteritum",
    title: "Perfekt und Präteritum in der Service-Dokumentation",
    theory: [
      {
        heading: "Выбор времени",
        body: "Perfekt типично для устного отчёта и разговора с коллегами. Präteritum характерен для письменной хронологии; формы war, hatte и модальных глаголов частотны в обоих регистрах.",
      },
      {
        heading: "Форма",
        items: [
          "Wir haben sofort reagiert.",
          "Der Gast meldete den Defekt um 18 Uhr.",
          "Das Zimmer war noch nicht bezugsfertig.",
        ],
      },
      {
        heading: "Типичная ошибка",
        body: "Не смешивайте времена без функциональной причины. В отчёте выберите основное время, а предшествование при необходимости выражайте Plusquamperfekt.",
      },
      {
        heading: "Итог",
        body: "Для беседы используйте Perfekt; для краткого письменного инцидент-лога — Präteritum.",
      },
    ],
    vocabulary: [
      v("der Vorfall", "инцидент", "Der Vorfall ereignete sich am Abend."),
      v(
        "die Schichtübergabe",
        "передача смены",
        "Wir haben den Vorfall bei der Schichtübergabe erwähnt.",
      ),
      v(
        "der Mangel",
        "недостаток",
        "Der Gast meldete einen technischen Mangel.",
      ),
      v("die Eskalation", "эскалация", "Die Eskalation war nicht mehr nötig."),
      v(
        "die Abhilfemaßnahme",
        "корректирующая мера",
        "Das Team leitete eine Abhilfemaßnahme ein.",
      ),
      v("beheben", "устранять", "Die Haustechnik hat den Defekt behoben."),
      v(
        "dokumentieren",
        "документировать",
        "Wir dokumentierten alle Schritte im CRM.",
      ),
      v(
        "weiterleiten",
        "перенаправлять",
        "Ich habe das Ticket weitergeleitet.",
      ),
      v(
        "nachfassen",
        "повторно связаться",
        "Die Leitung fasste am Morgen nach.",
      ),
      v(
        "sich ereignen",
        "произойти",
        "Der Ausfall ereignete sich während des Dinners.",
      ),
      v(
        "eine Lösung finden",
        "найти решение",
        "Wir haben schnell eine Lösung gefunden.",
      ),
      v(
        "den Fall abschließen",
        "закрыть обращение",
        "Die Kollegin schloss den Fall ab.",
      ),
      v(
        "laut Schichtbericht",
        "согласно отчёту смены",
        "Laut Schichtbericht reagierte das Team sofort.",
      ),
      v(
        "im Nachgang",
        "после события",
        "Im Nachgang haben wir den Gast kontaktiert.",
      ),
      v(
        "Wie bereits besprochen",
        "как уже обсуждалось",
        "Wie bereits besprochen, haben wir die Gebühr erstattet.",
      ),
    ],
    readingTitle: "Ein Vorfall im Abenddienst",
    reading:
      "Um 19:10 Uhr meldete ein Gast, dass die Klimaanlage ausgefallen war. Die Rezeption informierte sofort die Haustechnik und bot ein Ersatzzimmer an. Der Gast wollte zunächst im Zimmer bleiben. Um 19:35 Uhr hat die Technikerin den Defekt behoben und die Funktionsprüfung dokumentiert. Später rief die Schichtleitung den Gast an und fragte nach seinem Befinden. Er war mit der schnellen Lösung zufrieden. Im Nachgang haben wir den Fall im CRM abgeschlossen und eine persönliche Follow-up-Nachricht versendet.",
    graded: [
      {
        prompt: "Setzen Sie ins Präteritum: Der Gast ___ den Mangel. (melden)",
        answer: "meldete",
        explanation: "Слабый глагол получает окончание -te.",
      },
      {
        prompt: "Ergänzen Sie im Perfekt: Wir haben sofort ___. (reagieren)",
        answer: "reagiert",
        explanation: "Perfekt: haben + reagiert.",
      },
      {
        prompt:
          "Ergänzen Sie: Das Zimmer ___ noch nicht bereit. (sein, Präteritum)",
        answer: "war",
        explanation: "Präteritum от «sein» — war.",
      },
      {
        prompt: "Ergänzen Sie: Die Technikerin hat den Defekt ___. (beheben)",
        answer: "behoben",
        explanation: "Partizip II от «beheben» — behoben.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Leitung ___ am Morgen nach. (nachfassen, Präteritum)",
        answer: "fasste",
        explanation: "Отделяемая приставка стоит в конце: fasste … nach.",
      },
      {
        prompt:
          "Ergänzen Sie: Wir ___ den Fall im CRM abgeschlossen. (Perfekt)",
        answer: "haben",
        explanation: "Вспомогательный глагол для «abschließen» — haben.",
      },
      {
        prompt:
          "Ergänzen Sie: Der Gast ___ kein Ersatzzimmer. (wollen, Präteritum)",
        answer: "wollte",
        explanation: "Модальные глаголы часто употребляются в Präteritum.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Kollegin ___ das Ticket weiter. (leiten, Präteritum)",
        answer: "leitete",
        explanation: "Верная форма: leitete … weiter.",
      },
    ],
    open: [
      {
        prompt:
          "Berichten Sie mündlich im Perfekt: Die Rezeption bot ein Upgrade an und dokumentierte es.",
        sample: "Die Rezeption hat ein Upgrade angeboten und es dokumentiert.",
        criteria:
          "обе формы в Perfekt, корректные Partizip-II-формы, исходный смысл.",
      },
      {
        prompt:
          "Formulieren Sie als sachlichen Vorfallsbericht im Präteritum: Wir haben den Gast angerufen und eine Lösung gefunden.",
        sample: "Wir riefen den Gast an und fanden eine Lösung.",
        criteria:
          "Präteritum обоих глаголов, письменный нейтральный регистр, сохранение смысла.",
      },
    ],
    writing:
      "Verfassen Sie einen internen Vorfallsbericht zu einer verspäteten Zimmerbereitstellung und der anschließenden Service-Recovery.",
    wordRange: { min: 130, max: 160 },
    requirements: [
      "Основная хронология в Präteritum",
      "Краткий устный итог в Perfekt",
      "Укажите время, меры и реакцию гостя",
    ],
    sources: commonSources,
  },
  {
    slug: "praepositionen-kasus",
    topic: "praepositionen-kasus",
    title: "Präpositionen, Kasus und Artikel bei Eventabsprachen",
    theory: [
      {
        heading: "Управление",
        body: "Предлоги определяют падеж: mit, nach, bei, von, zu требуют Dativ; für, durch, gegen, ohne, um — Akkusativ. Wechselpräpositionen различают местонахождение и направление.",
      },
      {
        heading: "Профессиональные модели",
        items: [
          "Wir sprechen mit der Veranstalterin.",
          "Das Angebot gilt für die gesamte Gruppe.",
          "Die Technik steht in dem Konferenzraum.",
        ],
      },
      {
        heading: "Артикли",
        body: "Следите за слияниями: zu dem → zum, bei dem → beim, in das → ins. Род существительного нужно учить вместе с артиклем.",
      },
      {
        heading: "Итог",
        body: "Проверяйте связку «предлог + падеж + род», а не отдельное окончание.",
      },
    ],
    vocabulary: [
      v(
        "die Veranstalterin",
        "организатор",
        "Wir stimmen uns mit der Veranstalterin ab.",
      ),
      v(
        "der Tagungsraum",
        "конференц-зал",
        "Die Technik steht im Tagungsraum.",
      ),
      v(
        "das Rahmenprogramm",
        "сопроводительная программа",
        "Für das Rahmenprogramm gilt ein Festpreis.",
      ),
      v(
        "die Bestuhlung",
        "расстановка стульев",
        "Bei der Bestuhlung beachten wir Fluchtwege.",
      ),
      v(
        "der Ablaufplan",
        "план мероприятия",
        "Änderungen am Ablaufplan sind markiert.",
      ),
      v(
        "sich abstimmen mit",
        "согласовывать с",
        "Ich stimme mich mit dem Bankettteam ab.",
      ),
      v(
        "zuständig sein für",
        "отвечать за",
        "Sie ist für die Gästeliste zuständig.",
      ),
      v(
        "teilnehmen an",
        "участвовать в",
        "Zwanzig Personen nehmen an dem Workshop teil.",
      ),
      v(
        "abhängen von",
        "зависеть от",
        "Die Raumwahl hängt von der Gruppengröße ab.",
      ),
      v("bitten um", "просить о", "Wir bitten um eine finale Bestätigung."),
      v(
        "im Auftrag von",
        "по поручению",
        "Ich schreibe im Auftrag der Eventleitung.",
      ),
      v(
        "in Bezug auf",
        "в отношении",
        "In Bezug auf die Technik gibt es eine Änderung.",
      ),
      v(
        "zur Abstimmung",
        "на согласование",
        "Anbei erhalten Sie den Plan zur Abstimmung.",
      ),
      v(
        "unter Berücksichtigung",
        "с учётом",
        "Wir planen unter Berücksichtigung der Allergien.",
      ),
      v(
        "Vielen Dank für Ihre Rückmeldung zu",
        "спасибо за ответ по",
        "Vielen Dank für Ihre Rückmeldung zur Bestuhlung.",
      ),
    ],
    readingTitle: "Letzte Abstimmung für eine Konferenz",
    reading:
      "Bei der finalen Abstimmung mit der Veranstalterin ging es um die Bestuhlung im großen Tagungsraum. Für die Podiumsdiskussion werden sechs Sessel benötigt. Das Catering richtet sich nach der bestätigten Personenzahl und nach den Angaben zu Allergien. Die Technikfirma liefert zusätzliche Mikrofone in den Saal. Wegen einer parallelen Veranstaltung steht der Nebenraum erst ab 14 Uhr zur Verfügung. Alle Änderungen am Ablaufplan senden wir bis Freitag zur Freigabe an die Kundin.",
    graded: [
      {
        prompt: "Ergänzen Sie den Artikel: mit ___ Veranstalterin",
        answer: "der",
        explanation: "«mit» требует Dativ; женский род: der.",
      },
      {
        prompt: "Ergänzen Sie: für ___ gesamte Gruppe",
        answer: "die",
        explanation: "«für» требует Akkusativ; женский род: die.",
      },
      {
        prompt: "Ergänzen Sie die Kurzform: in ___ Tagungsraum",
        answer: "dem",
        alternatives: ["im"],
        explanation: "Местонахождение: Dativ; in dem = im.",
      },
      {
        prompt: "Ergänzen Sie: Wir bitten ___ eine Bestätigung.",
        answer: "um",
        explanation: "Управление: bitten um + Akkusativ.",
      },
      {
        prompt: "Ergänzen Sie: Die Raumwahl hängt ___ der Gruppengröße ab.",
        answer: "von",
        explanation: "Управление: abhängen von + Dativ.",
      },
      {
        prompt: "Ergänzen Sie: Sie nimmt ___ dem Workshop teil.",
        answer: "an",
        explanation: "Управление: teilnehmen an + Dativ.",
      },
      {
        prompt: "Ergänzen Sie: Wir gehen ___ den Konferenzraum.",
        answer: "in",
        alternatives: ["in den"],
        explanation: "Направление требует Akkusativ: in den Raum.",
      },
      {
        prompt: "Ergänzen Sie: Änderungen ___ Ablaufplan",
        answer: "am",
        alternatives: ["an dem"],
        explanation: "«an» + Dativ: an dem/am Ablaufplan.",
      },
    ],
    open: [
      {
        prompt:
          "Formulieren Sie einen Satz mit «sich abstimmen mit» und «Bankettteam».",
        sample: "Wir stimmen uns heute mit dem Bankettteam ab.",
        criteria:
          "«mit» + Dativ (dem Bankettteam), korrektes reflexives Verb und Berufskontext.",
      },
      {
        prompt: "Formulieren Sie höflich mit «in Bezug auf» und «Bestuhlung».",
        sample:
          "In Bezug auf die Bestuhlung bitten wir um Ihre finale Freigabe.",
        criteria:
          "«auf» + Akkusativ, passender Artikel, formeller Eventkontext.",
      },
    ],
    writing:
      "Schreiben Sie eine Abstimmungs-E-Mail an eine MICE-Kundin zu Raum, Bestuhlung, Catering und Technik.",
    wordRange: { min: 120, max: 150 },
    requirements: [
      "Используйте минимум шесть предложных конструкций",
      "Соблюдайте управление и артикли",
      "Запросите финальное подтверждение",
    ],
    sources: commonSources,
  },
  {
    slug: "nebensaetze",
    topic: "nebensaetze",
    title: "Nebensätze in der internen Koordination",
    theory: [
      {
        heading: "Позиция глагола",
        body: "В придаточном предложении с dass, weil, obwohl, wenn или damit спрягаемый глагол стоит в конце. Придаточное можно поставить перед главным; тогда главное начинается с глагола.",
      },
      {
        heading: "Модели",
        items: [
          "Wir informieren das Team, weil sich der Ablauf ändert.",
          "Wenn die Liste eintrifft, aktualisieren wir das CRM.",
          "Wir prüfen alles, damit der Check-in reibungslos verläuft.",
        ],
      },
      {
        heading: "Типичная ошибка",
        body: "После придаточного в начале нельзя сохранять обычный порядок: верно «Wenn …, aktualisieren wir …», а не «wir aktualisieren».",
      },
      {
        heading: "Итог",
        body: "Союз отправляет спрягаемый глагол в конец придаточного; начальное придаточное занимает первую позицию главного.",
      },
    ],
    vocabulary: [
      v(
        "die Schnittstelle",
        "точка взаимодействия",
        "Die Rezeption ist die zentrale Schnittstelle.",
      ),
      v(
        "die Zuständigkeit",
        "зона ответственности",
        "Wir klären die Zuständigkeit intern.",
      ),
      v("die Übergabe", "передача", "Die Übergabe erfolgt vor Schichtbeginn."),
      v("der Engpass", "узкое место", "Ein Engpass entstand im Housekeeping."),
      v(
        "die Rückfrage",
        "уточняющий вопрос",
        "Es gibt eine Rückfrage zur Gästeliste.",
      ),
      v("koordinieren", "координировать", "Wir koordinieren drei Abteilungen."),
      v(
        "priorisieren",
        "расставлять приоритеты",
        "Das Team priorisiert dringende Anreisen.",
      ),
      v(
        "sicherstellen",
        "обеспечить",
        "Wir stellen sicher, dass alle informiert sind.",
      ),
      v("sobald", "как только", "Sobald die Liste vorliegt, starten wir."),
      v(
        "sofern",
        "при условии что",
        "Sofern Kapazität besteht, öffnen wir den Raum.",
      ),
      v("obwohl", "хотя", "Obwohl wenig Zeit bleibt, prüfen wir alles."),
      v(
        "damit alles reibungslos läuft",
        "чтобы всё прошло гладко",
        "Wir stimmen uns ab, damit alles reibungslos läuft.",
      ),
      v(
        "wie intern vereinbart",
        "как согласовано внутри",
        "Wie intern vereinbart, übernimmt das Front Office.",
      ),
      v(
        "eine Rückfrage klären",
        "уточнить вопрос",
        "Ich kläre die Rückfrage mit dem Sales-Team.",
      ),
      v(
        "Ich melde mich, sobald …",
        "я свяжусь, как только…",
        "Ich melde mich, sobald die Freigabe vorliegt.",
      ),
    ],
    readingTitle: "Koordination vor einem Galaabend",
    reading:
      "Weil die finale Gästeliste später als geplant eingetroffen ist, muss das Eventteam mehrere Abläufe anpassen. Sobald das CRM aktualisiert ist, informiert Customer Success die Rezeption und das Bankett. Das Housekeeping priorisiert die VIP-Zimmer, damit alle Suiten rechtzeitig bezugsfertig sind. Obwohl der Zeitplan eng ist, bleibt die ursprüngliche Einlasszeit bestehen. Wenn weitere Allergiehinweise eingehen, leitet die Eventkoordinatorin sie sofort an die Küche weiter, sodass das Menü noch angepasst werden kann.",
    graded: [
      {
        prompt:
          "Ergänzen Sie: Wir informieren das Team, weil sich der Ablauf ___.",
        answer: "ändert",
        explanation: "В придаточном спрягаемый глагол стоит в конце.",
      },
      {
        prompt:
          "Ergänzen Sie: ___ die Liste eintrifft, aktualisieren wir das CRM.",
        answer: "Sobald",
        alternatives: ["Wenn"],
        explanation: "Sobald/Wenn вводит временное придаточное.",
      },
      {
        prompt:
          "Ergänzen Sie: Wir prüfen alles, ___ der Check-in reibungslos verläuft.",
        answer: "damit",
        explanation: "«damit» выражает цель.",
      },
      {
        prompt: "Ergänzen Sie: ___ wenig Zeit bleibt, prüfen wir alle Details.",
        answer: "Obwohl",
        explanation: "«obwohl» выражает уступку.",
      },
      {
        prompt:
          "Ergänzen Sie глагол: Wenn die Freigabe vorliegt, ___ wir den Raum. (öffnen)",
        answer: "öffnen",
        explanation:
          "После начального придаточного главное начинается со спрягаемого глагола.",
      },
      {
        prompt: "Ergänzen Sie: Wir wissen, ___ die VIP-Gäste früher anreisen.",
        answer: "dass",
        explanation: "«dass» вводит объектное придаточное.",
      },
      {
        prompt:
          "Ergänzen Sie: ___ Kapazität besteht, bieten wir einen Nebenraum an.",
        answer: "Sofern",
        alternatives: ["Wenn"],
        explanation: "«sofern» выражает условие.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Küche passt das Menü an, ___ neue Hinweise eingehen.",
        answer: "wenn",
        alternatives: ["sobald"],
        explanation:
          "Условное/временное придаточное оформляется с конечным глаголом.",
      },
    ],
    open: [
      {
        prompt:
          "Verbinden Sie mit «weil»: Die Gästeliste kam spät. Wir passen den Ablauf an.",
        sample: "Wir passen den Ablauf an, weil die Gästeliste spät kam.",
        criteria: "причинная связь, «weil», глагол в конце придаточного.",
      },
      {
        prompt:
          "Formulieren Sie mit vorangestelltem «damit»-Satz: Alle Teams sollen informiert sein. Wir aktualisieren den Verteiler.",
        sample:
          "Damit alle Teams informiert sind, aktualisieren wir den Verteiler.",
        criteria:
          "цель с «damit», конечная позиция глагола, инверсия в главном предложении.",
      },
    ],
    writing:
      "Schreiben Sie eine interne Koordinationsnachricht zu kurzfristigen Änderungen bei einem Galaabend.",
    wordRange: { min: 120, max: 150 },
    requirements: [
      "Используйте dass, weil, damit, obwohl и wenn/sobald",
      "Опишите обязанности минимум трёх отделов",
      "Соблюдайте порядок слов",
    ],
    sources: commonSources,
  },
  {
    slug: "relativsaetze",
    topic: "relativsaetze",
    title: "Relativsätze für präzise CRM-Profile",
    theory: [
      {
        heading: "Функция",
        body: "Относительное придаточное уточняет существительное без нового отдельного предложения. Род и число местоимения определяет существительное, падеж — его функция внутри придаточного.",
      },
      {
        heading: "Модели",
        items: [
          "Der Gast, der morgen anreist, ist Stammkunde.",
          "Die Kundin, der wir geschrieben haben, organisiert den Kongress.",
          "Das Anliegen, das wir priorisieren, ist dringend.",
        ],
      },
      {
        heading: "Предлоги",
        body: "Предлог ставится перед относительным местоимением: «das Team, mit dem wir arbeiten». Для мест и организаций возможны wo или präpositionale Formen в зависимости от регистра.",
      },
      {
        heading: "Итог",
        body: "Согласуйте род и число с опорным словом, затем выберите падеж по роли в придаточном.",
      },
    ],
    vocabulary: [
      v(
        "der Stammgast",
        "постоянный гость",
        "Der Stammgast bevorzugt ein ruhiges Zimmer.",
      ),
      v(
        "die Kontaktperson",
        "контактное лицо",
        "Die Kontaktperson koordiniert die Gruppe.",
      ),
      v(
        "das Kundenkonto",
        "аккаунт клиента",
        "Das Kundenkonto enthält alle Verträge.",
      ),
      v(
        "die Präferenz",
        "предпочтение",
        "Die Präferenz ist im Profil hinterlegt.",
      ),
      v(
        "der Interaktionsverlauf",
        "история взаимодействий",
        "Der Interaktionsverlauf zeigt frühere Beschwerden.",
      ),
      v(
        "segmentieren",
        "сегментировать",
        "Wir segmentieren Firmenkunden nach Bedarf.",
      ),
      v("verknüpfen", "связывать", "Das System verknüpft Buchung und Profil."),
      v(
        "aktualisieren",
        "обновлять",
        "Bitte aktualisieren Sie den CRM-Eintrag.",
      ),
      v(
        "der Ansprechpartner, der …",
        "контактное лицо, которое…",
        "Der Ansprechpartner, der uns schrieb, ist erreichbar.",
      ),
      v(
        "die Kundin, der …",
        "клиентка, которой…",
        "Die Kundin, der wir antworten, wartet.",
      ),
      v(
        "das Profil, in dem …",
        "профиль, в котором…",
        "Das Profil, in dem die Präferenzen stehen, ist aktuell.",
      ),
      v(
        "auf dessen Wunsch",
        "по желанию которого",
        "Der Gast, auf dessen Wunsch wir reagierten, dankte uns.",
      ),
      v(
        "für die weitere Betreuung",
        "для дальнейшего сопровождения",
        "Die Notiz ist für die weitere Betreuung wichtig.",
      ),
      v(
        "lückenlos dokumentieren",
        "полностью документировать",
        "Wir dokumentieren den Verlauf lückenlos.",
      ),
      v(
        "Damit wir Sie gezielt betreuen können",
        "чтобы мы могли адресно вас сопровождать",
        "Damit wir Sie gezielt betreuen können, aktualisieren wir Ihr Profil.",
      ),
    ],
    readingTitle: "Ein aussagekräftiger CRM-Eintrag",
    reading:
      "Frau Demir, die jährlich mehrere Führungskräftetagungen organisiert, ist die wichtigste Kontaktperson des Kunden. Im Profil, das mit allen Gruppenbuchungen verknüpft ist, stehen ihre bevorzugten Raumaufteilungen. Das Serviceteam sieht außerdem frühere Anliegen, auf die bereits reagiert wurde. Ein Kollege, dem Frau Demir gestern eine neue Teilnehmerliste geschickt hat, aktualisiert heute die Kontaktdaten. So erhalten alle Abteilungen, die an der Veranstaltung beteiligt sind, verlässliche Informationen.",
    graded: [
      {
        prompt: "Ergänzen Sie: Der Gast, ___ morgen anreist, ist Stammkunde.",
        answer: "der",
        explanation: "Мужской род, Nominativ: der.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Kundin, ___ wir geschrieben haben, antwortet heute.",
        answer: "der",
        explanation: "Женский род, Dativ после «jemandem schreiben»: der.",
      },
      {
        prompt:
          "Ergänzen Sie: Das Profil, ___ wir aktualisieren, ist veraltet.",
        answer: "das",
        explanation: "Средний род, Akkusativ: das.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Teams, ___ beteiligt sind, erhalten Zugriff.",
        answer: "die",
        explanation: "Множественное число, Nominativ: die.",
      },
      {
        prompt: "Ergänzen Sie: Das Team, mit ___ wir arbeiten, ist erfahren.",
        answer: "dem",
        explanation: "«mit» + Dativ, средний род: dem.",
      },
      {
        prompt:
          "Ergänzen Sie: Der Gast, auf ___ Wunsch wir reagierten, dankte uns.",
        answer: "dessen",
        explanation: "Genitiv мужского рода: dessen.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Organisatorin, ___ Firma den Kongress plant, ruft an.",
        answer: "deren",
        explanation: "Genitiv женского рода: deren.",
      },
      {
        prompt:
          "Ergänzen Sie: Das Hotel, in ___ die Tagung stattfindet, liegt zentral.",
        answer: "dem",
        explanation: "Местонахождение: in + Dativ, средний род.",
      },
    ],
    open: [
      {
        prompt:
          "Verbinden Sie: Frau Kaya ist Kontaktperson. Wir senden Frau Kaya den Ablaufplan.",
        sample:
          "Frau Kaya, der wir den Ablaufplan senden, ist die Kontaktperson.",
        criteria:
          "одно относительное придаточное, Dativ «der», глагол в конце.",
      },
      {
        prompt:
          "Verbinden Sie mit Präposition: Wir arbeiten mit einem Eventteam. Das Eventteam ist sehr erfahren.",
        sample: "Das Eventteam, mit dem wir arbeiten, ist sehr erfahren.",
        criteria:
          "«mit dem», корректное относительное придаточное и сохранение смысла.",
      },
    ],
    writing:
      "Erstellen Sie eine interne CRM-Zusammenfassung zu einer wichtigen MICE-Kundin, ihren Präferenzen und bisherigen Interaktionen.",
    wordRange: { min: 120, max: 150 },
    requirements: [
      "Используйте минимум пять Relativsätze",
      "Включите Nominativ, Akkusativ, Dativ и конструкцию с предлогом",
      "Не раскрывайте лишние персональные данные",
    ],
    sources: commonSources,
  },
  {
    slug: "vorgangspassiv",
    topic: "vorgangspassiv",
    title: "Passiv in AI-gestützten Hotelprozessen",
    theory: [
      {
        heading: "Фокус на процессе",
        body: "Vorgangspassiv образуется с werden + Partizip II и подчёркивает действие. Исполнитель добавляется через von или durch, только если он важен.",
      },
      {
        heading: "Времена",
        items: [
          "Anfragen werden automatisch kategorisiert.",
          "Die Daten wurden geprüft.",
          "Der Gast ist informiert worden.",
          "Die Anfrage muss bestätigt werden.",
        ],
      },
      {
        heading: "Passiv и состояние",
        body: "«Die Tür wird geöffnet» описывает процесс; «Die Tür ist geöffnet» — результативное состояние (Zustandspassiv).",
      },
      {
        heading: "Итог",
        body: "Выберите Passiv, когда процесс важнее исполнителя, но называйте человека ответственным там, где это нужно для ясности.",
      },
    ],
    vocabulary: [
      v(
        "die Anfrageklassifizierung",
        "классификация запросов",
        "Die Anfrageklassifizierung wird automatisiert.",
      ),
      v(
        "die Auslastungsprognose",
        "прогноз загрузки",
        "Eine Auslastungsprognose wird täglich erstellt.",
      ),
      v("der Chatbot", "чат-бот", "Der Chatbot wird regelmäßig geprüft."),
      v(
        "die menschliche Freigabe",
        "подтверждение человеком",
        "Kritische Antworten brauchen eine menschliche Freigabe.",
      ),
      v(
        "der Datenschutz",
        "защита данных",
        "Der Datenschutz wird konsequent berücksichtigt.",
      ),
      v(
        "automatisch zuordnen",
        "автоматически назначать",
        "Tickets werden automatisch zugeordnet.",
      ),
      v(
        "manuell prüfen",
        "проверять вручную",
        "Beschwerden werden manuell geprüft.",
      ),
      v(
        "anonymisieren",
        "анонимизировать",
        "Gästedaten werden vor der Analyse anonymisiert.",
      ),
      v(
        "eskalieren",
        "эскалировать",
        "Dringende Fälle werden sofort eskaliert.",
      ),
      v(
        "nachvollziehbar protokollieren",
        "прозрачно протоколировать",
        "Entscheidungen werden nachvollziehbar protokolliert.",
      ),
      v(
        "durch das System",
        "системой",
        "Die Anfrage wird durch das System markiert.",
      ),
      v(
        "von einer Fachkraft",
        "специалистом",
        "Die Empfehlung wird von einer Fachkraft geprüft.",
      ),
      v(
        "unter Einhaltung der Richtlinien",
        "с соблюдением правил",
        "Daten werden unter Einhaltung der Richtlinien verarbeitet.",
      ),
      v(
        "zur Prüfung weitergeleitet werden",
        "быть направленным на проверку",
        "Der Fall wird zur Prüfung weitergeleitet.",
      ),
      v(
        "Es wird sichergestellt, dass …",
        "обеспечивается, что…",
        "Es wird sichergestellt, dass kein Gast übersehen wird.",
      ),
    ],
    readingTitle: "KI-gestützte Bearbeitung von Gästeanfragen",
    reading:
      "Eingehende Nachrichten werden zunächst durch ein KI-System nach Thema und Dringlichkeit kategorisiert. Standardanfragen werden einem passenden Antwortentwurf zugeordnet. Beschwerden und sensible Anliegen werden dagegen sofort an eine Fachkraft weitergeleitet. Bevor eine Nachricht versendet wird, werden Namen, Buchungsdaten und vorgeschlagene Leistungen geprüft. Alle Änderungen werden im CRM protokolliert. Dadurch wird sichergestellt, dass die Bearbeitung effizient bleibt und zugleich eine menschliche Kontrolle stattfindet.",
    graded: [
      {
        prompt: "Ergänzen Sie: Anfragen ___ automatisch kategorisiert.",
        answer: "werden",
        explanation: "Präsens Passiv: werden + Partizip II.",
      },
      {
        prompt: "Ergänzen Sie: Die Daten ___ gestern geprüft.",
        answer: "wurden",
        explanation: "Präteritum Passiv, множественное число: wurden.",
      },
      {
        prompt: "Ergänzen Sie: Der Gast ist informiert ___.",
        answer: "worden",
        explanation: "Perfekt Passiv: ist … worden.",
      },
      {
        prompt: "Ergänzen Sie: Die Nachricht muss bestätigt ___.",
        answer: "werden",
        explanation: "Passiv с модальным глаголом: Partizip II + werden.",
      },
      {
        prompt: "Ergänzen Sie: Der Entwurf wird ___ einer Fachkraft geprüft.",
        answer: "von",
        explanation: "Исполнитель обозначается через «von».",
      },
      {
        prompt: "Ergänzen Sie: Daten werden vor der Analyse ___.",
        answer: "anonymisiert",
        explanation: "Partizip II от «anonymisieren» — anonymisiert.",
      },
      {
        prompt: "Ergänzen Sie: Kritische Fälle werden sofort ___.",
        answer: "eskaliert",
        explanation: "Passiv: werden + eskaliert.",
      },
      {
        prompt: "Ergänzen Sie: Die Tür ___ gerade geöffnet. (Prozess)",
        answer: "wird",
        explanation: "Процесс выражается Vorgangspassiv с «werden».",
      },
    ],
    open: [
      {
        prompt:
          "Formulieren Sie im Passiv: Das KI-System ordnet die Tickets automatisch zu.",
        sample: "Die Tickets werden vom KI-System automatisch zugeordnet.",
        criteria:
          "Präsens Vorgangspassiv, корректный Partizip II, объект становится подлежащим.",
      },
      {
        prompt:
          "Formulieren Sie als Prozessregel mit Modalverb: Eine Fachkraft muss sensible Antworten prüfen.",
        sample: "Sensible Antworten müssen von einer Fachkraft geprüft werden.",
        criteria:
          "Modalverb + Passivinfinitiv, согласование во множественном числе, сохранение обязанности.",
      },
    ],
    writing:
      "Beschreiben Sie einen sicheren KI-gestützten Workflow für Gästeanfragen, von der Klassifizierung bis zum Versand.",
    wordRange: { min: 130, max: 160 },
    requirements: [
      "Используйте минимум шесть пассивных конструкций",
      "Разграничьте автоматизацию и человеческую проверку",
      "Упомяните Datenschutz и CRM-Protokollierung",
    ],
    sources: commonSources,
  },
  {
    slug: "konjunktiv-ii",
    topic: "konjunktiv-ii",
    title: "Konjunktiv II in der Service-Recovery",
    theory: [
      {
        heading: "Вежливость и гипотеза",
        body: "Konjunktiv II смягчает просьбы, предложения и рекомендации. Для нереального прошлого используется hätte/wäre + Partizip II.",
      },
      {
        heading: "Модели",
        items: [
          "Könnten Sie uns kurz bestätigen …?",
          "Wir würden Ihnen gern ein Upgrade anbieten.",
          "Hätten wir früher reagiert, wäre die Wartezeit kürzer gewesen.",
        ],
      },
      {
        heading: "Формы",
        body: "Частотные формы hätte, wäre, könnte и sollte предпочтительнее würde-форм. Для остальных глаголов обычно используется würde + Infinitiv.",
      },
      {
        heading: "Итог",
        body: "Используйте Konjunktiv II не вместо конкретного решения, а чтобы вежливо его предложить и признать альтернативный сценарий.",
      },
    ],
    vocabulary: [
      v(
        "die Service-Recovery",
        "восстановление сервиса",
        "Eine schnelle Service-Recovery schafft Vertrauen.",
      ),
      v(
        "die Kulanzleistung",
        "компенсационная услуга",
        "Wir bieten eine Kulanzleistung an.",
      ),
      v(
        "die Unannehmlichkeit",
        "неудобство",
        "Wir bedauern die Unannehmlichkeit.",
      ),
      v("der Ausgleich", "компенсация", "Ein Ausgleich wäre angemessen."),
      v(
        "die Wiedergutmachung",
        "возмещение",
        "Die Wiedergutmachung sollte zum Fall passen.",
      ),
      v(
        "entgegenkommen",
        "идти навстречу",
        "Wir würden Ihnen gern entgegenkommen.",
      ),
      v("erstatten", "возмещать", "Wir könnten die Gebühr erstatten."),
      v(
        "nachbessern",
        "исправить недостатки",
        "Das Team würde sofort nachbessern.",
      ),
      v("bedauern", "сожалеть", "Wir bedauern, dass der Transfer ausfiel."),
      v(
        "an Ihrer Stelle",
        "на вашем месте",
        "An Ihrer Stelle würde ich den Termin verschieben.",
      ),
      v(
        "aus Kulanz",
        "в порядке доброй воли",
        "Aus Kulanz könnten wir das Frühstück übernehmen.",
      ),
      v(
        "Wäre es für Sie in Ordnung, wenn …?",
        "устроило бы вас, если…?",
        "Wäre es für Sie in Ordnung, wenn wir umbuchen?",
      ),
      v(
        "Wir würden Ihnen gern anbieten …",
        "мы хотели бы предложить…",
        "Wir würden Ihnen gern einen Transfer anbieten.",
      ),
      v(
        "Könnten Sie uns mitteilen …?",
        "не могли бы вы сообщить…?",
        "Könnten Sie uns Ihre Buchungsnummer mitteilen?",
      ),
      v(
        "Das hätte nicht passieren dürfen",
        "этого не должно было произойти",
        "Das hätte nicht passieren dürfen; wir entschuldigen uns.",
      ),
    ],
    readingTitle: "Reaktion auf eine Transferbeschwerde",
    reading:
      "Sehr geehrter Herr Nowak, das vereinbarte Shuttle hätte Sie pünktlich am Bahnhof abholen müssen. Dass Sie stattdessen warten mussten, bedauern wir sehr. Wir würden Ihnen die Taxikosten selbstverständlich erstatten und könnten Ihnen zusätzlich einen kostenfreien Late Check-out anbieten. Wäre diese Lösung für Sie passend, würden wir beide Leistungen sofort in Ihrer Buchung hinterlegen. Könnten Sie uns dafür bitte den Taxibeleg senden? Das hätte nicht passieren dürfen, und wir würden Ihren nächsten Aufenthalt gern zuverlässiger gestalten.",
    graded: [
      {
        prompt: "Ergänzen Sie: ___ Sie uns den Beleg senden? (können)",
        answer: "Könnten",
        explanation: "Вежливая форма от «können» — könnten.",
      },
      {
        prompt: "Ergänzen Sie: Wir ___ Ihnen gern entgegenkommen. (werden)",
        answer: "würden",
        explanation: "würden + Infinitiv выражает вежливое предложение.",
      },
      {
        prompt: "Ergänzen Sie: Ein Ausgleich ___ angemessen. (sein)",
        answer: "wäre",
        explanation: "Konjunktiv II от «sein» — wäre.",
      },
      {
        prompt: "Ergänzen Sie: Ich ___ gern eine Rückerstattung. (haben)",
        answer: "hätte",
        explanation: "Вежливое желание: hätte gern.",
      },
      {
        prompt: "Ergänzen Sie: Wir ___ die Gebühr erstatten. (können)",
        answer: "könnten",
        explanation: "Осторожное предложение выражается через könnten.",
      },
      {
        prompt: "Ergänzen Sie: Das ___ nicht passieren dürfen. (haben)",
        answer: "hätte",
        explanation: "Нереальное прошлое: hätte + Infinitivgruppe.",
      },
      {
        prompt:
          "Ergänzen Sie: An Ihrer Stelle ___ ich den Transfer bestätigen. (werden)",
        answer: "würde",
        explanation: "Рекомендация: würde + Infinitiv.",
      },
      {
        prompt: "Ergänzen Sie: ___ diese Lösung für Sie passend? (sein)",
        answer: "Wäre",
        explanation: "Вежливый вопрос с «wäre».",
      },
    ],
    open: [
      {
        prompt:
          "Formulieren Sie höflicher: Senden Sie uns sofort den Taxibeleg.",
        sample: "Könnten Sie uns bitte den Taxibeleg senden?",
        criteria:
          "Konjunktiv II, просьба вместо приказа, профессиональный тон.",
      },
      {
        prompt:
          "Formulieren Sie ein kulantes Angebot: Wir erstatten die Taxikosten und bieten Late Check-out an.",
        sample:
          "Wir würden Ihnen gern die Taxikosten erstatten und einen Late Check-out anbieten.",
        criteria: "würde-форма, обе услуги, вежливый сервисный регистр.",
      },
    ],
    writing:
      "Antworten Sie einem Gast, dessen vereinbarter Transfer ausgefallen ist. Entschuldigen Sie sich und bieten Sie eine konkrete Service-Recovery an.",
    wordRange: { min: 120, max: 150 },
    requirements: [
      "Используйте минимум пять форм Konjunktiv II",
      "Признайте проблему без оправданий",
      "Предложите компенсацию и следующий шаг",
    ],
    sources: commonSources,
  },
  {
    slug: "konnektoren",
    topic: "konnektoren",
    title: "Konnektoren in Follow-up-E-Mails",
    theory: [
      {
        heading: "Логика текста",
        body: "Konnektoren показывают добавление, причину, следствие, противопоставление и условие. Союзы и наречия влияют на порядок слов по-разному.",
      },
      {
        heading: "Модели",
        items: [
          "Wir entschuldigen uns, da die Antwort verspätet war.",
          "Die Ursache ist behoben; dennoch prüfen wir den Prozess.",
          "Sowohl der Transfer als auch das Upgrade sind bestätigt.",
        ],
      },
      {
        heading: "Позиция",
        body: "После deshalb, dennoch, außerdem или folglich спрягаемый глагол стоит сразу: «Dennoch prüfen wir …». После weil/obwohl глагол уходит в конец.",
      },
      {
        heading: "Итог",
        body: "Выбирайте коннектор по смысловой связи и затем проверяйте соответствующую модель порядка слов.",
      },
    ],
    vocabulary: [
      v(
        "die Nachverfolgung",
        "последующее отслеживание",
        "Die Nachverfolgung ist im CRM terminiert.",
      ),
      v(
        "die Rückmeldung",
        "обратная связь",
        "Vielen Dank für Ihre Rückmeldung.",
      ),
      v("die Ursache", "причина", "Die Ursache wurde behoben."),
      v(
        "die Folgemaßnahme",
        "последующее действие",
        "Eine Folgemaßnahme ist bereits geplant.",
      ),
      v(
        "die Verbindlichkeit",
        "обязательность",
        "Klare Termine schaffen Verbindlichkeit.",
      ),
      v("dennoch", "тем не менее", "Dennoch prüfen wir den Ablauf erneut."),
      v("daher", "поэтому", "Daher melden wir uns persönlich."),
      v("außerdem", "кроме того", "Außerdem aktualisieren wir Ihr Profil."),
      v(
        "folglich",
        "следовательно",
        "Folglich ist keine weitere Aktion nötig.",
      ),
      v("während", "тогда как", "Während Sales plant, koordiniert Operations."),
      v(
        "sowohl … als auch",
        "как… так и",
        "Sowohl Transfer als auch Zimmer sind bestätigt.",
      ),
      v("weder … noch", "ни… ни", "Weder Kosten noch Fristen ändern sich."),
      v(
        "zum einen … zum anderen",
        "с одной стороны… с другой",
        "Zum einen sparen wir Zeit, zum anderen steigt die Qualität.",
      ),
      v(
        "abschließend",
        "в завершение",
        "Abschließend bestätigen wir den Termin.",
      ),
      v(
        "Wie vereinbart, …",
        "как договорились,…",
        "Wie vereinbart, melden wir uns am Freitag erneut.",
      ),
    ],
    readingTitle: "Follow-up nach einem Onboarding-Gespräch",
    reading:
      "Vielen Dank für das konstruktive Gespräch. Sowohl die Ansprechpartner als auch die Eskalationswege sind nun im CRM hinterlegt. Da Ihr Team künftig mehrere Häuser betreut, richten wir außerdem einen gemeinsamen Monatsbericht ein. Die ersten Daten sind noch unvollständig; dennoch können wir den Pilotbetrieb am Montag starten. Während unser Operations-Team die Schnittstellen prüft, schult Customer Success Ihre Nutzerinnen und Nutzer. Abschließend senden wir Ihnen die offene Aufgabenliste, sodass alle nächsten Schritte transparent bleiben.",
    graded: [
      {
        prompt:
          "Ergänzen Sie: Die Daten sind unvollständig; ___ starten wir den Pilotbetrieb.",
        answer: "dennoch",
        explanation: "«dennoch» выражает уступительное противопоставление.",
      },
      {
        prompt:
          "Ergänzen Sie: Wir richten einen Bericht ein, ___ mehrere Häuser beteiligt sind.",
        answer: "da",
        alternatives: ["weil"],
        explanation: "Причина выражается через da/weil.",
      },
      {
        prompt:
          "Ergänzen Sie: ___ der Transfer ___ das Upgrade sind bestätigt.",
        answer: "Sowohl",
        explanation: "Парный коннектор: sowohl … als auch.",
      },
      {
        prompt:
          "Ergänzen Sie вторую часть: Weder Kosten ___ Fristen ändern sich.",
        answer: "noch",
        explanation: "Парный коннектор: weder … noch.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Ursache ist behoben; ___ ist keine Aktion nötig.",
        answer: "folglich",
        alternatives: ["daher"],
        explanation: "Следствие выражают folglich/daher.",
      },
      {
        prompt:
          "Ergänzen Sie: ___ Operations prüft, schult Customer Success die Nutzer.",
        answer: "Während",
        explanation: "«während» сопоставляет параллельные процессы.",
      },
      {
        prompt:
          "Ergänzen Sie: Wir aktualisieren das CRM. ___ senden wir den Bericht.",
        answer: "Außerdem",
        explanation: "«außerdem» добавляет следующий пункт.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Liste wird geteilt, ___ alle Schritte transparent bleiben.",
        answer: "sodass",
        alternatives: ["damit"],
        explanation: "sodass выражает следствие; damit — цель.",
      },
    ],
    open: [
      {
        prompt:
          "Verbinden Sie mit «dennoch»: Der Gast ist zufrieden. Wir analysieren die Beschwerde erneut.",
        sample:
          "Der Gast ist zufrieden; dennoch analysieren wir die Beschwerde erneut.",
        criteria:
          "корректное противопоставление, инверсия после «dennoch», оба исходных смысла.",
      },
      {
        prompt:
          "Formulieren Sie mit «zum einen … zum anderen»: Der Bericht spart Zeit. Er verbessert die Abstimmung.",
        sample:
          "Zum einen spart der Bericht Zeit, zum anderen verbessert er die Abstimmung.",
        criteria:
          "полная парная конструкция, параллельная структура, естественный порядок слов.",
      },
    ],
    writing:
      "Schreiben Sie eine strukturierte Follow-up-E-Mail nach dem Onboarding eines Hotelkunden und fassen Sie Entscheidungen sowie nächste Schritte zusammen.",
    wordRange: { min: 130, max: 160 },
    requirements: [
      "Используйте минимум шесть разных Konnektoren",
      "Свяжите причины, последствия и контраст",
      "Назовите владельцев и сроки следующих шагов",
    ],
    sources: commonSources,
  },
  {
    slug: "nominalisierung",
    topic: "nominalisierung-funktionsverbgefuege",
    title: "Nominalisierung und Funktionsverbgefüge im Qualitätsbericht",
    theory: [
      {
        heading: "Формальный стиль",
        body: "Номинализация уплотняет информацию в отчётах: prüfen → die Prüfung, verbessern → die Verbesserung. Funktionsverbgefüge объединяют существительное с общим глаголом.",
      },
      {
        heading: "Модели",
        items: [
          "Wir führen eine Auswertung durch.",
          "Die neue Regelung tritt morgen in Kraft.",
          "Nach der Bearbeitung der Beschwerden …",
        ],
      },
      {
        heading: "Риск",
        body: "Избыток номинализаций делает текст тяжёлым. Используйте их для заголовков, мер и процессов, а действия и ответственность иногда выражайте активным глаголом.",
      },
      {
        heading: "Итог",
        body: "Номинальный стиль полезен для структурированных отчётов, если сохраняется ясный исполнитель и конкретное действие.",
      },
    ],
    vocabulary: [
      v(
        "die Qualitätsauswertung",
        "анализ качества",
        "Die Qualitätsauswertung erfolgt monatlich.",
      ),
      v(
        "die Maßnahmenplanung",
        "планирование мер",
        "Die Maßnahmenplanung beginnt morgen.",
      ),
      v(
        "die Ursachenanalyse",
        "анализ причин",
        "Wir führen eine Ursachenanalyse durch.",
      ),
      v(
        "die Prozessoptimierung",
        "оптимизация процесса",
        "Die Prozessoptimierung senkt Wartezeiten.",
      ),
      v("die Umsetzung", "реализация", "Die Umsetzung wird überprüft."),
      v(
        "eine Analyse durchführen",
        "провести анализ",
        "Das Team führt eine Analyse durch.",
      ),
      v(
        "Maßnahmen ergreifen",
        "принять меры",
        "Wir ergreifen sofort Maßnahmen.",
      ),
      v(
        "zur Verfügung stehen",
        "быть в распоряжении",
        "Die Daten stehen zur Verfügung.",
      ),
      v(
        "in Kraft treten",
        "вступить в силу",
        "Die Regelung tritt am Montag in Kraft.",
      ),
      v(
        "in Betracht ziehen",
        "рассмотреть",
        "Wir ziehen eine Automatisierung in Betracht.",
      ),
      v(
        "eine Entscheidung treffen",
        "принять решение",
        "Die Leitung trifft eine Entscheidung.",
      ),
      v(
        "zur Kenntnis nehmen",
        "принять к сведению",
        "Wir nehmen das Feedback zur Kenntnis.",
      ),
      v(
        "im Rahmen der Auswertung",
        "в рамках анализа",
        "Im Rahmen der Auswertung prüfen wir Trends.",
      ),
      v(
        "mit dem Ziel der Verbesserung",
        "с целью улучшения",
        "Wir handeln mit dem Ziel der Verbesserung.",
      ),
      v(
        "Handlungsbedarf besteht bei …",
        "необходимы действия по…",
        "Handlungsbedarf besteht bei der Reaktionszeit.",
      ),
    ],
    readingTitle: "Monatlicher Bericht zur Gästezufriedenheit",
    reading:
      "Im Rahmen der monatlichen Qualitätsauswertung wurde eine Zunahme der Beschwerden zur Reaktionszeit festgestellt. Zur Klärung der Ursachen führte Customer Success eine Analyse der CRM-Daten durch. Dabei kamen Unterschiede zwischen den Schichten zur Sprache. Die Hotelleitung traf deshalb die Entscheidung zur Einführung einer verbindlichen Übergabecheckliste. Zusätzlich wird eine automatische Priorisierung dringender Anliegen in Betracht gezogen. Die neue Regelung tritt im kommenden Monat in Kraft; eine Überprüfung der Wirksamkeit findet nach sechs Wochen statt.",
    graded: [
      {
        prompt: "Nominalisieren Sie: verbessern → die ___",
        answer: "Verbesserung",
        explanation: "Существительное от «verbessern» — die Verbesserung.",
      },
      {
        prompt: "Nominalisieren Sie: prüfen → die ___",
        answer: "Prüfung",
        explanation: "Существительное от «prüfen» — die Prüfung.",
      },
      {
        prompt: "Ergänzen Sie: eine Analyse ___.",
        answer: "durchführen",
        explanation: "Funktionsverbgefüge: eine Analyse durchführen.",
      },
      {
        prompt: "Ergänzen Sie: Maßnahmen ___.",
        answer: "ergreifen",
        explanation: "Устойчивое сочетание: Maßnahmen ergreifen.",
      },
      {
        prompt: "Ergänzen Sie: Die Regelung tritt in ___ .",
        answer: "Kraft",
        explanation: "Funktionsverbgefüge: in Kraft treten.",
      },
      {
        prompt: "Ergänzen Sie: eine Entscheidung ___.",
        answer: "treffen",
        explanation: "Устойчивое сочетание: eine Entscheidung treffen.",
      },
      {
        prompt: "Ergänzen Sie: Feedback zur Kenntnis ___.",
        answer: "nehmen",
        explanation: "Устойчивое сочетание: zur Kenntnis nehmen.",
      },
      {
        prompt: "Ergänzen Sie: eine Automatisierung in Betracht ___.",
        answer: "ziehen",
        explanation: "Устойчивое сочетание: in Betracht ziehen.",
      },
    ],
    open: [
      {
        prompt:
          "Formulieren Sie nominal: Wir analysieren die Ursachen und verbessern den Ablauf.",
        sample:
          "Die Ursachenanalyse und die Verbesserung des Ablaufs stehen im Mittelpunkt.",
        criteria:
          "минимум две корректные номинализации, формальный регистр, сохранение смысла.",
      },
      {
        prompt:
          "Formulieren Sie mit Funktionsverbgefüge: Das Team entscheidet und setzt die Maßnahme um.",
        sample:
          "Das Team trifft eine Entscheidung und bringt die Maßnahme zur Umsetzung.",
        criteria:
          "минимум одно подходящее Funktionsverbgefüge, ясная ответственность, исходный смысл.",
      },
    ],
    writing:
      "Verfassen Sie einen kurzen Qualitätsbericht zu wiederkehrenden Beschwerden, Ursachen und geplanten Verbesserungsmaßnahmen.",
    wordRange: { min: 140, max: 170 },
    requirements: [
      "Используйте минимум пять номинализаций",
      "Включите минимум четыре Funktionsverbgefüge",
      "Укажите проблему, решение, срок и проверку результата",
    ],
    sources: commonSources,
  },
  {
    slug: "konjunktiv-i",
    topic: "konjunktiv-i-indirekte-rede",
    title: "Konjunktiv I und indirekte Rede in Eskalationsnotizen",
    theory: [
      {
        heading: "Нейтральная передача",
        body: "Konjunktiv I показывает, что автор передаёт чужое высказывание, не подтверждая его. Это важно в протоколах, CRM-заметках и эскалациях.",
      },
      {
        heading: "Формы",
        items: [
          "Der Gast sagt, das Zimmer sei zu laut.",
          "Die Kollegin erklärt, sie habe bereits angerufen.",
          "Der Anbieter teilt mit, der Transfer werde verspätet eintreffen.",
        ],
      },
      {
        heading: "Замена",
        body: "Если форма Konjunktiv I совпадает с Indikativ, для различимости употребляют Konjunktiv II: «Sie sagten, sie hätten gewartet». Местоимения и временные указатели меняются по контексту.",
      },
      {
        heading: "Итог",
        body: "Назовите источник, передайте содержание нейтрально и последовательно отделяйте факт от утверждения участника.",
      },
    ],
    vocabulary: [
      v(
        "die Aussage",
        "высказывание",
        "Die Aussage wird neutral dokumentiert.",
      ),
      v(
        "die Eskalationsnotiz",
        "эскалационная заметка",
        "Die Eskalationsnotiz enthält drei Perspektiven.",
      ),
      v(
        "der Sachverhalt",
        "обстоятельства дела",
        "Der Sachverhalt ist noch ungeklärt.",
      ),
      v(
        "die Stellungnahme",
        "официальный комментарий",
        "Der Dienstleister sendet eine Stellungnahme.",
      ),
      v(
        "die Zeugenaussage",
        "свидетельское показание",
        "Eine Zeugenaussage liegt im CRM vor.",
      ),
      v(
        "angeben",
        "указывать, заявлять",
        "Der Gast gab an, er habe lange gewartet.",
      ),
      v(
        "mitteilen",
        "сообщать",
        "Die Agentur teilte mit, der Bus verspäte sich.",
      ),
      v(
        "behaupten",
        "утверждать",
        "Der Anbieter behauptet, alles sei bestätigt.",
      ),
      v(
        "darauf hinweisen",
        "указывать на",
        "Die Kollegin wies darauf hin, sie habe angerufen.",
      ),
      v(
        "bestätigen",
        "подтверждать",
        "Die Leitung bestätigte, man werde nachfassen.",
      ),
      v(
        "laut Aussage von",
        "по словам",
        "Laut Aussage des Gastes sei niemand erreichbar gewesen.",
      ),
      v(
        "nach eigenen Angaben",
        "по собственным словам",
        "Nach eigenen Angaben habe der Fahrer gewartet.",
      ),
      v(
        "demnach",
        "следовательно, согласно этому",
        "Demnach sei die Nachricht verspätet eingegangen.",
      ),
      v(
        "unabhängig davon",
        "независимо от этого",
        "Unabhängig davon werde der Prozess geprüft.",
      ),
      v(
        "Wir halten fest, dass …",
        "мы фиксируем, что…",
        "Wir halten fest, dass die Aussagen voneinander abweichen.",
      ),
    ],
    readingTitle: "Neutrale Dokumentation einer Eskalation",
    reading:
      "Der Gast gab an, der bestellte Transfer sei nicht erschienen und er habe vierzig Minuten gewartet. Die Fahrdienstleitung teilte dagegen mit, der Fahrer sei pünktlich am vereinbarten Ausgang gewesen. Eine Kollegin wies darauf hin, in der Buchung habe eine andere Telefonnummer gestanden. Der Gast erklärte außerdem, niemand habe ihn über eine Änderung informiert. Die Operations-Leitung bestätigte, man werde die Kommunikationskette prüfen und dem Gast bis zum nächsten Tag eine Stellungnahme senden. Unabhängig von den unterschiedlichen Aussagen werde eine Kulanzlösung vorbereitet.",
    graded: [
      {
        prompt: "Ergänzen Sie: Der Gast sagt, das Zimmer ___ zu laut. (sein)",
        answer: "sei",
        explanation: "Konjunktiv I от «sein» — sei.",
      },
      {
        prompt: "Ergänzen Sie: Sie erklärt, sie ___ bereits angerufen. (haben)",
        answer: "habe",
        explanation: "3-е лицо ед. числа Konjunktiv I: habe.",
      },
      {
        prompt:
          "Ergänzen Sie: Der Anbieter teilt mit, der Bus ___ später eintreffen. (werden)",
        answer: "werde",
        explanation: "3-е лицо ед. числа от «werden» — werde.",
      },
      {
        prompt:
          "Ergänzen Sie: Er sagt, er ___ keine Nachricht erhalten. (haben)",
        answer: "habe",
        explanation: "Косвенная речь: er habe erhalten.",
      },
      {
        prompt: "Ergänzen Sie: Die Kundin erklärt, sie ___ zufrieden. (sein)",
        answer: "sei",
        explanation: "Форма Konjunktiv I: sei.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Gäste sagten, sie ___ lange gewartet. (Ersatzform)",
        answer: "hätten",
        explanation:
          "Во множественном числе Konjunktiv I совпал бы с Indikativ; используется hätten.",
      },
      {
        prompt:
          "Ergänzen Sie: Die Leitung bestätigt, man ___ nachfassen. (werden)",
        answer: "werde",
        explanation: "Местоимение «man» требует формы werde.",
      },
      {
        prompt:
          "Ergänzen Sie: Der Fahrer behauptet, er ___ pünktlich gewesen. (sein)",
        answer: "sei",
        explanation: "Perfekt Konjunktiv I с sein: sei … gewesen.",
      },
    ],
    open: [
      {
        prompt:
          "Geben Sie indirekt wieder: Der Gast sagt: «Ich habe keine Nachricht erhalten.»",
        sample: "Der Gast sagt, er habe keine Nachricht erhalten.",
        criteria:
          "глагол речи, смена местоимения, Konjunktiv I «habe», нейтральность.",
      },
      {
        prompt:
          "Geben Sie für eine Notiz wieder: Die Gäste sagen: «Wir warten seit einer Stunde.»",
        sample: "Die Gäste sagen, sie warteten seit einer Stunde.",
        criteria:
          "косвенная речь, смена местоимения, различимая Ersatzform Konjunktiv II из-за совпадения форм.",
      },
    ],
    writing:
      "Verfassen Sie eine neutrale Eskalationsnotiz zu widersprüchlichen Aussagen eines Gastes, der Rezeption und eines Transferanbieters.",
    wordRange: { min: 140, max: 170 },
    requirements: [
      "Передайте минимум пять утверждений в косвенной речи",
      "Используйте Konjunktiv I и необходимые Ersatzformen",
      "Отделите подтверждённые факты от заявлений",
    ],
    sources: commonSources,
  },
];

export const germanCustomerSuccessLessons: readonly Lesson[] =
  specs.map(buildLesson);
