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

interface AdvancedSpec {
  slug: string;
  topic: string;
  title: string;
  scenario: string;
  rule: string;
  form: string;
  errors: string;
  words: ReadonlyArray<readonly [string, string]>;
  reading: string;
  drills: ReadonlyArray<readonly [string, string]>;
  open: ReadonlyArray<readonly [string, string]>;
  writing: string;
}

const advancedVocabularyExamples: Readonly<Record<string, readonly string[]>> =
  {
    "partizipien-als-attribute": [
      "Die laufende Verhandlung konzentriert sich auf Preisbindung und Vertragsdauer.",
      "Das überarbeitete Angebot berücksichtigt die saisonalen Schwankungen aller Standorte.",
      "Die vereinbarte Laufzeit gibt beiden Seiten Planungssicherheit für drei Jahre.",
      "Der steigende Listenpreis bleibt der wichtigste Einwand des Einkaufs.",
      "Die zugesagte Leistung umfasst zusätzliche Schulungen für die regionalen Teams.",
      "Der auslaufende Vertrag muss bis Ende des Monats verlängert werden.",
      "Die gewährte Gutschrift gleicht den Serviceausfall aus dem Vorquartal aus.",
      "Der entscheidende Einwand betrifft die fehlende Preisgarantie im zweiten Jahr.",
      "Die erwartete Nutzung rechtfertigt einen gestaffelten Mengenrabatt.",
      "Der verhandelnde Einkauf fordert eine verbindliche Obergrenze für Preiserhöhungen.",
      "Die vorgeschlagene Staffelung senkt den Preis bei wachsendem Buchungsvolumen.",
      "Der verbleibende Spielraum reicht für eine zusätzliche Schulungsgutschrift.",
      "Die bindende Zusage des Kunden gilt für mindestens zwölf Standorte.",
      "Das gemeinsam definierte Ziel ist eine Vertragsverlängerung vor Quartalsende.",
      "Die daraus entstehende Einsparung wird im finalen Angebot transparent ausgewiesen.",
    ],
    "infinitiv-mit-zu": [
      "Um den Fortschritt nachvollziehbar darzustellen, sind die Kennzahlen vor dem QBR aufzubereiten.",
      "Der Workshop dient dazu, messbare Ziele für das nächste Quartal festzulegen.",
      "Wir vergleichen die Nutzungsdaten, um Fortschritt gegenüber dem Vorquartal zu zeigen.",
      "Die Risiken sind offen zu benennen, ohne die erzielten Ergebnisse auszublenden.",
      "Statt Einzelfälle zu betonen, sollten wir den Entwicklungstrend erläutern.",
      "Das Dashboard ermöglicht es, die Nutzung nach Standort auszuwerten.",
      "Die Kundin erwartet von uns, vereinbarte Maßnahmen konsequent nachzuverfolgen.",
      "Es ist sinnvoll, den Executive Sponsor frühzeitig in die Priorisierung einzubinden.",
      "Auf Basis der aktuellen Pipeline ist eine belastbare Prognose abzugeben.",
      "Die Präsentation sollte helfen, Abweichungen vom Erfolgsplan klar zu erklären.",
      "Bitte planen Sie genügend Zeit ein, um die Agenda mit dem Kunden abzustimmen.",
      "Die Fallstudie dient dazu, den geschäftlichen Mehrwert der Lösung nachzuweisen.",
      "Am Ende des QBR ist der Sponsor zu bitten, die Prioritäten verbindlich zu bestätigen.",
      "Vor der Budgetplanung gilt es zu klären, welche Standorte im Pilot bleiben.",
      "Der Maßnahmenplan soll dazu dienen, Verantwortliche und Fristen sichtbar zu machen.",
    ],
    "erweiterte-passivformen": [
      "Der SLA-Verstoß muss anhand der Ticketdaten vollständig untersucht werden.",
      "Vor dem Kundentermin sollte die Ursache bereits geklärt sein.",
      "Die Zeitstempel könnten vor der Eskalation falsch geprüft worden sein.",
      "Der Routingfehler lässt sich anhand des Audit-Logs eindeutig nachvollziehen.",
      "Jede Abweichung ist mit Quelle, Zeitpunkt und Auswirkung zu dokumentieren.",
      "Der SLA-Verstoß wurde durch drei falsch priorisierte Tickets ausgelöst.",
      "Die vertragliche Reaktionsfrist ist bei zwei kritischen Fällen überschritten worden.",
      "Der Zeitstempel im Ticketsystem wurde nachträglich mit dem Telefonprotokoll abgeglichen.",
      "Die Priorisierung muss für Wochenendfälle verbindlich geregelt werden.",
      "Der Eskalationsweg ist im Servicehandbuch klar beschrieben.",
      "Der Bereitschaftsdienst hätte bei der ersten Warnung informiert werden müssen.",
      "Die Ursachenanalyse soll bis zum gemeinsamen Kundentermin abgeschlossen sein.",
      "Die SLA-Konformität kann erst nach einem erfolgreichen Kontrolllauf wiederhergestellt werden.",
      "Die Wirksamkeit der Korrektur muss durch eine unabhängige Stichprobe nachgewiesen werden.",
      "Alle Sofortmaßnahmen werden vor der Abschlussbesprechung umgesetzt und geprüft sein.",
    ],
    modalpartikeln: [
      "Wir sollten die beiden kritischen Kundenfälle doch zuerst priorisieren.",
      "Für die technische Freigabe dürfte wohl das Plattformteam zuständig sein.",
      "Der Fall ist ja bereits an die regionale Leitung eskaliert worden.",
      "Eine gemeinsame Entscheidung ist bei diesem Kunden eben notwendig.",
      "Wer übernimmt denn die Abstimmung mit dem Abrechnungsteam?",
      "Schauen wir doch zunächst, welche Übergabe den größten Zeitverlust verursacht.",
      "Am Übergabepunkt zwischen Support und Finance fehlen verbindliche Kriterien.",
      "Die Zuständigkeitslücke führte dazu, dass der Kunde drei widersprüchliche Antworten erhielt.",
      "Der Eskalationskreis trifft sich heute, um Owner und Sofortmaßnahmen festzulegen.",
      "Als Sofortmaßnahme erhält der Kunde bis morgen einen konsolidierten Statusbericht.",
      "Das Plattformteam muss den neuen Reaktionszeitpunkt verbindlich zusagen.",
      "Wir können den Fall gemeinsam lösen, wenn jede Abteilung einen Owner benennt.",
      "Das ist doch lösbar, sobald Finance die offene Gutschrift bestätigt.",
      "Für die erste Stabilisierung dürfte wohl eine tägliche Abstimmung reichen.",
      "Wie wäre es denn mit einer gemeinsamen Fallprüfung am Donnerstag?",
    ],
    "komplexe-satzklammer": [
      "Der wiederholte Nutzungsrückgang hätte bereits im letzten Quartal erkannt werden müssen.",
      "Das Customer-Success-Team hat nach dem zweiten Warnsignal sofort reagieren müssen.",
      "Die automatische Risikoerkennung wird vor der nächsten Verlängerung verbessert werden müssen.",
      "Die veränderte Entscheiderstruktur dürfte bei der letzten Bewertung übersehen worden sein.",
      "Das Abwanderungssignal wurde ausgelöst, nachdem drei Standorte ihre Nutzung reduziert hatten.",
      "Der Nutzungsrückgang hätte im monatlichen Account-Review besprochen werden müssen.",
      "Eine gezielte Bindungsmaßnahme könnte das Vertrauen der neuen Entscheiderin stärken.",
      "Das Kündigungsrisiko wird ohne einen belastbaren Maßnahmenplan weiter steigen.",
      "Die neue Entscheiderin hätte schon im Januar in die Wertgespräche einbezogen werden sollen.",
      "Der Wettbewerber dürfte dem Kunden ein flexibleres Preismodell angeboten haben.",
      "Das Team hätte nach dem ersten negativen Feedback frühzeitig nachfassen müssen.",
      "Jeder Standort wird künftig individuell angesprochen werden müssen.",
      "Wir werden den Mehrwert anhand konkreter Einsparungen belegen müssen.",
      "Bei einem weiteren Rückgang hätte die Geschäftsleitung unverzüglich handeln müssen.",
      "Die Kundenbeziehung kann nur durch sichtbare Ergebnisse langfristig stabilisiert werden.",
    ],
    "genitiv-alternativen": [
      "Aufgrund der Nachfrage empfiehlt das System höhere Wochenendpreise.",
      "Hinsichtlich des Umsatzes übertraf das Hotel die Prognose um sechs Prozent.",
      "Während der Hochsaison werden verfügbare Suiten nur gezielt rabattiert.",
      "Innerhalb eines Monats stieg die Konversionsrate für Zimmer-Upgrades deutlich.",
      "Die Prognose des Systems berücksichtigt Buchungstempo und lokale Veranstaltungen.",
      "Die Empfehlung von Modell A wird vor jeder Preisänderung manuell geprüft.",
      "Der Umsatz des Hotels wuchs vor allem durch personalisierte Zusatzangebote.",
      "Die Preisstrategie des Hauses unterscheidet zwischen Geschäfts- und Freizeitreisenden.",
      "Der Buchungsverlauf der letzten acht Wochen spricht für eine starke Nachfrage.",
      "Der Verkauf einer Zusatzleistung erhöht den Wert einer Direktbuchung.",
      "Angesichts steigender Nachfrage sollten die Wochenendraten angepasst werden.",
      "Außerhalb der Spitzenzeiten empfiehlt das Modell günstigere Upgrade-Pakete.",
      "Zwecks Optimierung der Direktbuchungen werden drei Angebotsvarianten getestet.",
      "Die Konversionsrate des personalisierten Angebots liegt bei siebzehn Prozent.",
      "Ein wichtiger Nachfrageindikator ist die Zahl kurzfristiger Gruppenanfragen.",
    ],
    "adjektivdeklination-advanced": [
      "Ein neuer Standort beginnt erst nach der technischen Bereitschaftsprüfung mit dem Onboarding.",
      "Der priorisierte Standort erhält zusätzliche Unterstützung durch das zentrale Projektteam.",
      "Mit klaren Kriterien lässt sich die Startbereitschaft aller Hotels einheitlich bewerten.",
      "Für lokale Teams stehen kurze Schulungen und regionale Sprechstunden bereit.",
      "Zentrale Zugangsdaten werden erst nach bestätigter Rollenprüfung versendet.",
      "Eine gemeinsame Vorlage dokumentiert Risiken, Owner und verbindliche Termine.",
      "Verbindliche Meilensteine machen Verzögerungen zwischen den Rollout-Wellen früh sichtbar.",
      "Begrenzte Ressourcen erfordern eine realistische Reihenfolge der neuen Standorte.",
      "Ein verantwortlicher Champion koordiniert Schulung und Kommunikation vor Ort.",
      "Die technische Freigabe erfolgt nach einem erfolgreichen Identitäts- und Schnittstellentest.",
      "Robuste Schulungspläne berücksichtigen Schichtbetrieb und saisonale Auslastung.",
      "Regionale Besonderheiten werden in jeder lokalen Einführungsplanung dokumentiert.",
      "Ein Beteiligter aus jeder Abteilung nimmt am abschließenden Go-live-Check teil.",
      "Nichts Ungeklärtes darf in die technische Freigabe übernommen werden.",
      "Für jeden betroffenen Standort wird ein eigener Maßnahmenplan gepflegt.",
    ],
    "konzessive-konstruktionen": [
      "Obwohl die Zahlen steigen, bleibt die Abhängigkeit vom Altsystem ein erhebliches Risiko.",
      "Trotz guter Ergebnisse empfiehlt das Team eine schrittweise Investitionsfreigabe.",
      "Auch wenn die Nutzung wächst, müssen die Sicherheitsauflagen vollständig erfüllt werden.",
      "Selbst wenn das Budget bestätigt wird, kann der Rollout nicht vor dem Schnittstellentest beginnen.",
      "Die Lösung ist zwar leistungsfähig, jedoch fehlen noch belastbare Daten zur Skalierung.",
      "Wenngleich der Pilot erfolgreich war, sollten die Betriebskosten weiter beobachtet werden.",
      "Der Vorstandstermin findet trotz der noch ausstehenden Finanzprüfung wie geplant statt.",
      "Die Entscheidungsvorlage nennt sowohl den erwarteten Nutzen als auch die verbleibenden Risiken.",
      "Der strategische Einwand bleibt relevant, obwohl die operative Leistung überzeugt.",
      "Die Investitionsfreigabe kann ungeachtet des Zeitdrucks erst nach der Risikoprüfung erfolgen.",
      "Trotz einer Ergebnisabweichung von fünf Prozent bleibt das Jahresziel erreichbar.",
      "Die Datenbasis ist noch klein; dennoch spricht der Trend für eine Ausweitung.",
      "Ungeachtet der positiven Rückmeldungen muss die technische Abhängigkeit gelöst werden.",
      "Einerseits beschleunigt die Investition den Rollout, andererseits erhöht sie den Schulungsbedarf.",
      "Eine belastbare Evidenz ist nötig, auch wenn die ersten Kundensignale positiv ausfallen.",
    ],
    partizipialkonstruktionen: [
      "Von aktuellen Daten ausgehend, rechnen wir mit einer vollständigen Wiederherstellung bis 18 Uhr.",
      "Technisch betrachtet, ist nur der mobile Check-in vom Systemausfall betroffen.",
      "Nach Priorität geordnet, werden Gruppenankünfte vor Einzelbuchungen manuell geprüft.",
      "Unter Einbeziehung der Standorte wurde ein realistischer Wiederanlaufplan erstellt.",
      "Um Sondereffekte bereinigt, liegt die aktuelle Fehlerquote bei knapp drei Prozent.",
      "Der Systemausfall unterbrach die automatische Bestätigung neuer Reservierungen.",
      "Die geschätzte Wiederherstellungszeit wird nach jedem technischen Test aktualisiert.",
      "Im Notbetrieb prüfen die Rezeptionsteams jede Gruppenbuchung im zentralen System.",
      "Die nächste Statusmeldung folgt nach Abschluss des Datenbanktests.",
      "Der betroffene Kanal bleibt bis zur vollständigen Validierung deaktiviert.",
      "Vorsichtig geschätzt, können alle mobilen Funktionen bis 19 Uhr wieder verfügbar sein.",
      "Zusammenfassend betrachtet, blieb die Auswirkung auf bestehende Reservierungen begrenzt.",
      "Verglichen mit dem letzten Ausfall wurde der Notbetrieb deutlich schneller aktiviert.",
      "Die ausgefallene Schnittstelle wurde für dringende Gruppenanfragen manuell überbrückt.",
      "Der Buchungskanal gilt erst nach erfolgreichem Abschlusstest als vollständig wiederhergestellt.",
    ],
    "stilverbesserung-buerodeutsch": [
      "Die Jahresbewertung zeigt höhere Nutzung, kürzere Lösungszeiten und eine offene Abhängigkeit.",
      "Das strategische Ziel lautet, den digitalen Gästeprozess über alle Standorte zu vereinheitlichen.",
      "Der gemeinsame Erfolgsplan verbindet jede Priorität mit einem messbaren Ergebnis.",
      "Die Nutzungs- und Umsatzdaten bilden die Entscheidungsgrundlage für das nächste Vertragsjahr.",
      "Bitte bestätigen Sie die Priorität für die Schnittstellenintegration bis Freitag.",
      "Für jede Maßnahme ist vor dem Lenkungskreis ein Owner zu benennen.",
      "Die regionalen Teams liefern ihre Zieltermine bis zum vereinbarten Stichtag.",
      "Vorbehaltlich der Zustimmung aktualisieren wir den Erfolgsplan in der kommenden Woche.",
      "Mit Blick auf das nächste Jahr empfehlen wir drei klar abgegrenzte Prioritäten.",
      "Konkret bedeutet das: IT schließt die Integration bis Ende März ab.",
      "Die Regionalleitung ist für die Schulung der lokalen Manager zuständig.",
      "Bitte geben Sie uns bis Donnerstag eine Rückmeldung zu den vorgeschlagenen Terminen.",
      "Der Lenkungskreis nahm die positiven Adoptionsergebnisse zur Kenntnis.",
      "Nach der Freigabe bringen wir die nächsten beiden Rollout-Wellen auf den Weg.",
      "Die offene Datenprüfung sollte ohne unnötige Verzögerung abgeschlossen werden.",
    ],
  };

const advancedSpec = (s: AdvancedSpec): LessonSpec => ({
  slug: s.slug,
  topic: s.topic,
  title: s.title,
  sources: commonSources,
  theory: [
    { heading: "Когда использовать", body: s.rule },
    { heading: "Форма", body: s.form },
    {
      heading: "Профессиональный контекст",
      body: `Эта структура позволяет точно и уместно обсуждать сценарий «${s.scenario}».`,
    },
    { heading: "Типичные ошибки", body: s.errors },
    {
      heading: "Вывод",
      body: "Определите значение, падеж и регистр до выбора формы.",
    },
  ],
  vocabulary: s.words.map(([term, translation], index) => {
    const examples = advancedVocabularyExamples[s.slug];
    if (!examples || examples.length !== s.words.length) {
      throw new Error(`Invalid vocabulary examples for ${s.slug}`);
    }
    return v(term, translation, examples[index]);
  }),
  readingTitle: s.scenario,
  reading: s.reading,
  graded: s.drills.map(([prompt, answer]) => ({
    prompt,
    answer,
    explanation:
      "Форма соответствует правилу урока и сохраняет профессиональный смысл.",
  })),
  open: s.open.map(([prompt, sample]) => ({
    prompt,
    sample,
    criteria:
      "целевая конструкция, грамматическая точность, сохранение смысла и профессиональный регистр.",
  })),
  writing: s.writing,
  wordRange: { min: 140, max: 180 },
  requirements: [
    "Используйте минимум пять целевых конструкций",
    "Включите минимум шесть слов и фраз урока",
    "Укажите конкретное действие, владельца и срок",
    "Сохраняйте профессиональный клиентский тон",
  ],
});

const advancedSpecs: LessonSpec[] = [
  advancedSpec({
    slug: "partizipien-als-attribute",
    topic: "partizipien-als-attribute",
    title: "Partizip I und II als Attribute",
    scenario: "Vertragsverlängerung verhandeln",
    rule: "Partizip I beschreibt aktive laufende Vorgänge, Partizip II abgeschlossene oder passive Ergebnisse; attributiv ersetzen sie längere Relativsätze.",
    form: "Infinitiv + d bzw. Partizip II plus Adjektivendung: die laufende Verhandlung, das überarbeitete Angebot.",
    errors:
      "Partizip und Endung müssen zu Bedeutung, Artikel, Kasus, Genus und Numerus passen.",
    words: [
      ["die laufende Verhandlung", "текущие переговоры"],
      ["das überarbeitete Angebot", "переработанное предложение"],
      ["die vereinbarte Laufzeit", "согласованный срок"],
      ["der steigende Listenpreis", "растущая базовая цена"],
      ["die zugesagte Leistung", "обещанная услуга"],
      ["der auslaufende Vertrag", "истекающий договор"],
      ["die gewährte Gutschrift", "предоставленная компенсация"],
      ["der entscheidende Einwand", "решающее возражение"],
      ["die erwartete Nutzung", "ожидаемое использование"],
      ["der verhandelnde Einkauf", "ведущий переговоры отдел закупок"],
      ["die vorgeschlagene Staffelung", "предложенная градация"],
      ["der verbleibende Spielraum", "оставшийся простор"],
      ["die bindende Zusage", "обязательное обещание"],
      ["das gemeinsam definierte Ziel", "совместно определённая цель"],
      ["die daraus entstehende Einsparung", "возникающая экономия"],
    ],
    reading:
      "Der auslaufende Vertrag enthält eine automatisch steigende Preisklausel. Im überarbeiteten Angebot verbindet das Hotel eine längere, verbindlich zugesagte Laufzeit mit gestaffelten Preisen. Der verhandelnde Einkauf fordert zusätzlich eine Servicegutschrift. Die bereits gewährten Rabatte lassen jedoch nur begrenzten Spielraum. Als entscheidenden Vorteil nennt das Customer-Success-Team die gemeinsam definierte Adoption und die daraus entstehende Einsparung.",
    drills: [
      ["die ___ Verhandlung (laufen)", "laufende"],
      ["das ___ Angebot (überarbeiten)", "überarbeitete"],
      ["mit den ___ Preisen (staffeln)", "gestaffelten"],
      ["ein ___ Vertrag (auslaufen)", "auslaufender"],
      ["die bereits ___ Rabatte (gewähren)", "gewährten"],
      ["der ___ Einkauf (verhandeln)", "verhandelnde"],
      ["das gemeinsam ___ Ziel (definieren)", "definierte"],
      [
        "Verdichten Sie: die Einsparung, die daraus entsteht.",
        "die daraus entstehende Einsparung",
      ],
    ],
    open: [
      [
        "Verdichten Sie zwei Aussagen zur Verlängerung mit Partizipialattributen.",
        "Das überarbeitete Angebot berücksichtigt die vom Einkauf geforderte Preisstaffel.",
      ],
      [
        "Formulieren Sie einen Vorteil mit erweitertem Partizipialattribut.",
        "Die durch eine längere Laufzeit entstehende Planungssicherheit nützt beiden Seiten.",
      ],
    ],
    writing:
      "Verfassen Sie eine Zusammenfassung der Vertragsverhandlung mit Positionen, Zugeständnissen und nächstem Schritt.",
  }),
  advancedSpec({
    slug: "infinitiv-mit-zu",
    topic: "infinitiv-mit-zu",
    title: "Infinitiv mit zu",
    scenario: "Quarterly Business Review vorbereiten",
    rule: "Infinitivgruppen bündeln Ziele, Pflichten und Empfehlungen, wenn der logische Träger aus dem Hauptsatz hervorgeht.",
    form: "zu + Infinitiv; festzulegen bei trennbaren Verben; um/ohne/statt + zu. Kommas markieren erweiterte Gruppen.",
    errors:
      "Nach Modalverben und lassen steht kein zu; der Bezug der Infinitivgruppe muss eindeutig sein.",
    words: [
      ["Kennzahlen aufzubereiten", "подготовить показатели"],
      ["Ziele festzulegen", "определить цели"],
      ["um Fortschritt zu zeigen", "чтобы показать прогресс"],
      ["ohne Risiken auszublenden", "не скрывая риски"],
      [
        "statt Einzelfälle zu betonen",
        "вместо подчёркивания отдельных случаев",
      ],
      ["die Nutzung auszuwerten", "проанализировать использование"],
      ["Maßnahmen nachzuverfolgen", "отслеживать меры"],
      ["den Sponsor einzubinden", "вовлечь спонсора"],
      ["eine Prognose abzugeben", "дать прогноз"],
      ["Abweichungen zu erklären", "объяснить отклонения"],
      ["die Agenda abzustimmen", "согласовать повестку"],
      ["Mehrwert nachzuweisen", "доказать ценность"],
      ["Prioritäten zu bestätigen", "подтвердить приоритеты"],
      ["es gilt zu klären", "следует прояснить"],
      ["dazu dienen", "служить для"],
    ],
    reading:
      "Für das QBR plant das Team, Nutzungsdaten und Supporttrends aufzubereiten. Um den erzielten Mehrwert nachzuweisen, sind die Werte mit den vereinbarten Zielen zu vergleichen. Statt einzelne Erfolgsgeschichten zu betonen, möchte die Leiterin auch Abweichungen erklären. Es gilt, offene Maßnahmen nachzuverfolgen, ohne operative Risiken auszublenden. Die finale Agenda dient dazu, Entscheidungen vorzubereiten und den Executive Sponsor gezielt einzubinden.",
    drills: [
      ["Wir planen, Kennzahlen ___. (aufbereiten)", "aufzubereiten"],
      ["um Fortschritt ___ (zeigen)", "zu zeigen"],
      ["ohne Risiken ___ (ausblenden)", "auszublenden"],
      ["statt Einzelfälle ___ (betonen)", "zu betonen"],
      ["Wir müssen Ziele ___. (festlegen)", "festlegen"],
      ["Es gilt, Maßnahmen ___. (nachverfolgen)", "nachzuverfolgen"],
      ["Die Agenda dient dazu, Entscheidungen ___.", "vorzubereiten"],
      ["Das Team scheint bereit ___. (sein)", "zu sein"],
    ],
    open: [
      [
        "Verbinden Sie Ziel und Einschränkung mit um und ohne.",
        "Wir analysieren die Nutzung, um Fortschritt zu zeigen, ohne Risiken auszublenden.",
      ],
      [
        "Formulieren Sie drei parallele QBR-Aufgaben mit zu.",
        "Es gilt, Kennzahlen aufzubereiten, Abweichungen zu erklären und Prioritäten festzulegen.",
      ],
    ],
    writing:
      "Schreiben Sie einen Vorbereitungsvermerk für ein QBR mit Zielen, Daten, Risiken und Entscheidungen.",
  }),
  advancedSpec({
    slug: "erweiterte-passivformen",
    topic: "erweiterte-passivformen",
    title: "Erweiterte Passivformen",
    scenario: "SLA-Verstoß untersuchen",
    rule: "Vorgangspassiv zeigt den Prozess, Zustandspassiv das Ergebnis; Modalpassiv und Passivalternativen markieren Pflicht oder Möglichkeit.",
    form: "werden/sein + Partizip II; muss geprüft werden; lässt sich prüfen; ist zu dokumentieren.",
    errors:
      "Im Perfekt Passiv heißt es worden, nicht geworden; im Nebensatz steht das Modalverb am Ende.",
    words: [
      ["untersucht werden", "быть расследованным"],
      ["bereits geklärt sein", "быть уже выясненным"],
      ["geprüft worden sein", "быть проверенным"],
      ["sich nachvollziehen lassen", "поддаваться отслеживанию"],
      ["zu dokumentieren sein", "подлежать документированию"],
      ["der SLA-Verstoß", "нарушение SLA"],
      ["die Reaktionsfrist", "срок реакции"],
      ["der Zeitstempel", "временная метка"],
      ["die Priorisierung", "приоритизация"],
      ["der Eskalationsweg", "путь эскалации"],
      ["der Bereitschaftsdienst", "дежурная служба"],
      ["die Ursachenanalyse", "анализ причин"],
      ["wiederhergestellt werden", "быть восстановленным"],
      ["nachgewiesen werden", "быть подтверждённым"],
      ["abgeschlossen sein", "быть завершённым"],
    ],
    reading:
      "Der SLA-Verstoß wird anhand der Zeitstempel untersucht. Die Priorisierung ist bereits geklärt, doch der Eskalationsweg muss noch geprüft werden. Aus den Protokollen lässt sich nachvollziehen, dass der Bereitschaftsdienst zu spät benachrichtigt wurde. Die korrekte Berechnung der Reaktionsfrist ist durch Quality zu bestätigen. Sobald die Ursachenanalyse abgeschlossen ist, werden Korrekturmaßnahmen vereinbart und monatlich überwacht.",
    drills: [
      ["Der Verstoß muss untersucht ___.", "werden"],
      ["Die Prüfung ist abgeschlossen ___.", "worden"],
      ["Die Ursache lässt sich ___.", "nachvollziehen"],
      ["Die Frist ist zu ___.", "bestätigen"],
      ["weil der Weg geprüft werden ___.", "muss"],
      ["Die Zeitstempel werden ___.", "ausgewertet"],
      ["Korrigieren Sie: ist geprüft geworden.", "ist geprüft worden"],
      [
        "Formulieren Sie Möglichkeit: Man kann den Verlauf rekonstruieren.",
        "Der Verlauf lässt sich rekonstruieren.",
      ],
    ],
    open: [
      [
        "Beschreiben Sie Prozess, Zustand und Pflicht in drei Passivformen.",
        "Der Verstoß wird untersucht, die Priorisierung ist geklärt und die Frist muss bestätigt werden.",
      ],
      [
        "Ersetzen Sie man durch zwei Passivalternativen.",
        "Der Verlauf lässt sich rekonstruieren; die Berechnung ist zu dokumentieren.",
      ],
    ],
    writing:
      "Verfassen Sie ein sachliches Update zur Untersuchung eines SLA-Verstoßes.",
  }),
  advancedSpec({
    slug: "modalpartikeln",
    topic: "modalpartikeln-im-berufsalltag",
    title: "Modalpartikeln im Berufsalltag",
    scenario: "Abteilungsübergreifende Eskalation koordinieren",
    rule: "doch, ja, wohl, eben und denn steuern Erwartung, Vermutung und Ton in Gesprächen, ohne die Kernaussage zu ändern.",
    form: "Modalpartikeln stehen meist im Mittelfeld; doch mildert, wohl vermutet, ja verweist auf Bekanntes, denn belebt Fragen.",
    errors:
      "In formellen Beschlüssen sparsam einsetzen; mal kann zu umgangssprachlich wirken.",
    words: [
      ["doch priorisieren", "всё же приоритизировать"],
      ["wohl zuständig sein", "вероятно отвечать"],
      ["ja bereits eskaliert", "ведь уже эскалировано"],
      ["eben notwendig", "просто необходимо"],
      ["Wer übernimmt denn?", "Кто же возьмёт?"],
      ["Schauen wir doch", "давайте посмотрим"],
      ["der Übergabepunkt", "точка передачи"],
      ["die Zuständigkeitslücke", "пробел ответственности"],
      ["der Eskalationskreis", "группа эскалации"],
      ["die Sofortmaßnahme", "немедленная мера"],
      ["verbindlich zusagen", "твёрдо обещать"],
      ["gemeinsam lösen", "решить совместно"],
      ["Das ist doch lösbar", "Это ведь решаемо"],
      ["Das dürfte wohl reichen", "Вероятно, этого хватит"],
      ["Wie wäre es denn?", "Как насчёт?"],
    ],
    reading:
      "Der Fall ist ja bereits an drei Abteilungen eskaliert worden. Trotzdem ist wohl noch nicht eindeutig, wer den nächsten Kundentermin übernimmt. Schauen wir doch zuerst auf den Übergabepunkt zwischen Billing und Operations. Dort fehlt eben eine verbindliche Zuständigkeit. Wie wäre es denn mit einem gemeinsamen Owner bis zur endgültigen Klärung? Im formellen Maßnahmenprotokoll werden anschließend nur Owner und Frist festgehalten.",
    drills: [
      ["Das ist ___ bereits bekannt.", "ja"],
      ["Wir sollten das ___ priorisieren.", "doch"],
      ["Wer übernimmt ___ den Termin?", "denn"],
      ["Das dürfte ___ reichen.", "wohl"],
      ["Die Maßnahme ist ___ notwendig.", "eben"],
      [
        "Mildern Sie: Prüfen Sie den Übergabepunkt.",
        "Prüfen Sie doch den Übergabepunkt.",
      ],
      ["Entfernen Sie Umgangssprache: Schauen wir mal.", "Prüfen wir das."],
      [
        "Formulieren Sie mit denn: Wer ist zuständig?",
        "Wer ist denn zuständig?",
      ],
    ],
    open: [
      [
        "Mildern Sie ein hartes Gegenargument mit doch.",
        "Wir könnten doch zunächst einen gemeinsamen Owner benennen.",
      ],
      [
        "Formulieren Sie eine vorsichtige Vermutung mit wohl.",
        "Die Verzögerung dürfte wohl am ungeklärten Übergabepunkt liegen.",
      ],
    ],
    writing:
      "Schreiben Sie einen Gesprächsauszug zur Eskalation und danach ein formelles Maßnahmenprotokoll.",
  }),
  advancedSpec({
    slug: "komplexe-satzklammer",
    topic: "komplexe-satzklammer",
    title: "Komplexe Satzklammer",
    scenario: "Kundenabwanderung verhindern",
    rule: "Mehrteilige Verbkomplexe ermöglichen präzise Aussagen über versäumte, notwendige und künftige Retention-Maßnahmen.",
    form: "hätte erkannt werden müssen; hat reagieren müssen; wird verbessert werden müssen; weil man hat handeln müssen.",
    errors:
      "Beim Modalverb im Perfekt steht häufig der Ersatzinfinitiv; komplexe Verbteile gehören in die rechte Klammer.",
    words: [
      ["hätte erkannt werden müssen", "следовало распознать"],
      ["hat reagieren müssen", "пришлось реагировать"],
      ["wird verbessert werden müssen", "нужно будет улучшить"],
      ["dürfte übersehen worden sein", "вероятно было упущено"],
      ["das Abwanderungssignal", "сигнал оттока"],
      ["der Nutzungsrückgang", "снижение использования"],
      ["die Bindungsmaßnahme", "мера удержания"],
      ["das Kündigungsrisiko", "риск расторжения"],
      ["die Entscheiderin", "лицо, принимающее решение"],
      ["der Wettbewerber", "конкурент"],
      ["frühzeitig nachfassen", "заранее связаться"],
      ["individuell ansprechen", "обратиться индивидуально"],
      ["den Mehrwert belegen", "доказать ценность"],
      ["unverzüglich handeln", "действовать немедленно"],
      ["langfristig stabilisieren", "стабилизировать долгосрочно"],
    ],
    reading:
      "Der starke Nutzungsrückgang hätte früher als Abwanderungssignal erkannt werden müssen. Das Account-Team hat unverzüglich reagieren müssen, nachdem die Entscheiderin ein Angebot des Wettbewerbers erwähnt hatte. Die fehlende Schulung dürfte in der letzten Übergabe übersehen worden sein. Künftig wird der Mehrwert regelmäßiger belegt werden müssen. Zusätzlich sollen lokale Nutzer individuell angesprochen und die Beziehung langfristig stabilisiert werden.",
    drills: [
      ["Das Signal hätte erkannt werden ___.", "müssen"],
      ["Das Team hat reagieren ___.", "müssen"],
      ["Der Mehrwert wird belegt werden ___.", "müssen"],
      ["weil das Team hat handeln ___.", "müssen"],
      ["Das Risiko dürfte übersehen worden ___.", "sein"],
      ["Korrigieren Sie: hat reagieren gemusst.", "hat reagieren müssen"],
      ["Die Schulung hätte angeboten werden ___.", "sollen"],
      [
        "Bilden Sie Futur: Man muss Adoption messen.",
        "Die Adoption wird gemessen werden müssen.",
      ],
    ],
    open: [
      [
        "Formulieren Sie eine versäumte Retention-Maßnahme.",
        "Der Nutzungsrückgang hätte früher mit der Entscheiderin besprochen werden müssen.",
      ],
      [
        "Begründen Sie eine schnelle Reaktion mit Ersatzinfinitiv.",
        "Da das Team sofort hat handeln müssen, wurde noch am selben Tag ein Recovery-Plan vereinbart.",
      ],
    ],
    writing:
      "Verfassen Sie eine Churn-Risk-Analyse mit versäumten Signalen und künftigen Maßnahmen.",
  }),
  advancedSpec({
    slug: "genitiv-alternativen",
    topic: "genitiv-und-genitivalternativen",
    title: "Genitiv und Genitivalternativen",
    scenario: "Umsatzoptimierung mit KI-Insights",
    rule: "Genitiv und Genitivpräpositionen markieren präzise Zugehörigkeit, Ursache und Bezugsrahmen; von-Gruppen und Komposita vermeiden schwere Ketten.",
    form: "aufgrund des Trends, während der Saison, hinsichtlich der Nachfrage; die Prognose des Systems / die Prognose von System A.",
    errors:
      "Maskulin und Neutrum Singular brauchen meist -s/-es; lange Genitivketten stilistisch auflösen.",
    words: [
      ["aufgrund der Nachfrage", "из-за спроса"],
      ["hinsichtlich des Umsatzes", "относительно выручки"],
      ["während der Hochsaison", "в высокий сезон"],
      ["innerhalb eines Monats", "в течение месяца"],
      ["die Prognose des Systems", "прогноз системы"],
      ["die Empfehlung von Modell A", "рекомендация модели A"],
      ["der Umsatz des Hotels", "выручка отеля"],
      ["die Preisstrategie", "ценовая стратегия"],
      ["der Buchungsverlauf", "динамика бронирований"],
      ["die Zusatzleistung", "дополнительная услуга"],
      ["angesichts steigender Nachfrage", "с учётом растущего спроса"],
      ["außerhalb der Spitzenzeiten", "вне пикового времени"],
      ["zwecks Optimierung", "в целях оптимизации"],
      ["die Konversionsrate", "коэффициент конверсии"],
      ["der Nachfrageindikator", "индикатор спроса"],
    ],
    reading:
      "Aufgrund der steigenden Wochenendnachfrage empfiehlt das System eine Anpassung der Upgrade-Angebote. Während der Hochsaison soll die Preisstrategie des Hotels täglich überprüft werden. Hinsichtlich der Konversionsrate zeigen personalisierte Zusatzleistungen den größten Effekt. Die Empfehlung von Modell A wird jedoch mit dem Buchungsverlauf des Vorjahres abgeglichen. Zwecks transparenter Steuerung erhält jedes Haus innerhalb eines Monats ein eigenes Umsatzdashboard.",
    drills: [
      ["aufgrund ___ Nachfrage", "der"],
      ["hinsichtlich ___ Umsatzes", "des"],
      ["innerhalb ___ Monats", "eines"],
      ["Bilden Sie: die Strategie / das Hotel.", "die Strategie des Hotels"],
      [
        "Alternative mit von: die Empfehlung / Modell A.",
        "die Empfehlung von Modell A",
      ],
      ["während ___ Hochsaison", "der"],
      ["angesichts ___ Nachfrage (steigend)", "steigender"],
      ["Verdichten Sie: Verlauf der Buchungen.", "Buchungsverlauf"],
    ],
    open: [
      [
        "Lösen Sie eine lange Genitivkette stilistisch auf.",
        "Die Analyse des Teams zur Entwicklung des Hotelumsatzes → Die Teamanalyse zur Hotelumsatzentwicklung.",
      ],
      [
        "Begründen Sie eine Preismaßnahme mit zwei Genitivpräpositionen.",
        "Aufgrund der hohen Nachfrage prüfen wir die Preise während der Hochsaison täglich.",
      ],
    ],
    writing:
      "Verfassen Sie eine Empfehlung zur Umsatzoptimierung mit KI-Insights und transparenten Annahmen.",
  }),
  advancedSpec({
    slug: "adjektivdeklination-advanced",
    topic: "adjektivdeklination-advanced",
    title: "Adjektivdeklination (Advanced)",
    scenario: "Enterprise-Onboarding mehrerer Standorte",
    rule: "Adjektivendungen kodieren Kasus, Genus und Numerus; in komplexen Rollout-Plänen müssen sie auch bei mehreren Attributen konsistent bleiben.",
    form: "der neue Standort; ein neuer Standort; neuer Standort; mit klaren, verbindlichen Kriterien.",
    errors:
      "Artikeltyp und Kasus zuerst bestimmen; parallele Adjektive erhalten dieselbe Endung.",
    words: [
      ["ein neuer Standort", "новая площадка"],
      ["der priorisierte Standort", "приоритетная площадка"],
      ["mit klaren Kriterien", "с ясными критериями"],
      ["für lokale Teams", "для местных команд"],
      ["zentrale Zugangsdaten", "центральные данные доступа"],
      ["eine gemeinsame Vorlage", "общий шаблон"],
      ["verbindliche Meilensteine", "обязательные вехи"],
      ["begrenzte Ressourcen", "ограниченные ресурсы"],
      ["ein verantwortlicher Champion", "ответственный представитель"],
      ["die technische Freigabe", "техническое одобрение"],
      ["robuste Schulungspläne", "надёжные учебные планы"],
      ["regionale Besonderheiten", "региональные особенности"],
      ["ein Beteiligter", "участник"],
      ["nichts Ungeklärtes", "ничего невыясненного"],
      ["für jeden betroffenen Standort", "для каждой затронутой площадки"],
    ],
    reading:
      "Ein zentraler Rollout-Plan koordiniert zwölf neue Standorte. Jeder priorisierte Standort erhält eine gemeinsame Vorlage, verbindliche Meilensteine und einen verantwortlichen lokalen Champion. Mit klaren technischen Kriterien prüft das Programmteam die Bereitschaft. Begrenzte regionale Ressourcen werden bei der Reihenfolge berücksichtigt. Nichts Ungeklärtes darf die technische Freigabe passieren.",
    drills: [
      ["ein neu___ Standort", "neuer"],
      ["der priorisiert___ Standort", "priorisierte"],
      ["mit klar___ Kriterien", "klaren"],
      ["für lokal___ Teams", "lokale"],
      ["zentral___ Zugangsdaten", "zentrale"],
      [
        "mit klar, verbindlich Kriterien",
        "mit klaren, verbindlichen Kriterien",
      ],
      ["ein verantwortlich___ Champion", "verantwortlicher"],
      ["Substantivieren Sie: eine beteiligte Person.", "eine Beteiligte"],
    ],
    open: [
      [
        "Beschreiben Sie drei Onboarding-Komponenten mit verschiedenen Deklinationstypen.",
        "Ein zentraler Plan unterstützt die lokalen Teams mit klaren Meilensteinen.",
      ],
      [
        "Formulieren Sie eine Regel mit substantiviertem Adjektiv.",
        "Ein Verantwortlicher bestätigt die technische Freigabe.",
      ],
    ],
    writing:
      "Schreiben Sie einen Rollout-Plan für das Onboarding mehrerer Standorte.",
  }),
  advancedSpec({
    slug: "konzessive-konstruktionen",
    topic: "konzessive-konstruktionen",
    title: "Konzessive Konstruktionen",
    scenario: "Kommunikation mit Executive Stakeholdern",
    rule: "Konzessive Strukturen anerkennen Einwände und halten dennoch eine Empfehlung aufrecht.",
    form: "obwohl/auch wenn + Nebensatz; trotz + Genitiv; zwar ..., jedoch ...; selbst wenn für starke Hypothesen.",
    errors:
      "Im Nebensatz steht das Verb am Ende; trotz verlangt standardsprachlich Genitiv.",
    words: [
      ["obwohl die Zahlen steigen", "хотя показатели растут"],
      ["trotz guter Ergebnisse", "несмотря на хорошие результаты"],
      ["auch wenn", "даже если"],
      ["selbst wenn", "даже в случае"],
      ["zwar … jedoch", "хотя … однако"],
      ["wenngleich", "хотя"],
      ["der Vorstandstermin", "встреча правления"],
      ["die Entscheidungsvorlage", "документ для решения"],
      ["der strategische Einwand", "стратегическое возражение"],
      ["die Investitionsfreigabe", "одобрение инвестиций"],
      ["die Ergebnisabweichung", "отклонение результата"],
      ["dennoch", "тем не менее"],
      ["ungeachtet", "невзирая на"],
      ["einerseits … andererseits", "с одной стороны…с другой"],
      ["die belastbare Evidenz", "надёжные данные"],
    ],
    reading:
      "Obwohl die Adoption deutlich gestiegen ist, bleibt die finanzielle Wirkung noch nicht vollständig belegt. Zwar zeigen drei Standorte klare Produktivitätsgewinne, jedoch fehlt für zwei Regionen eine belastbare Vergleichsbasis. Trotz dieser Einschränkung empfiehlt das Customer-Success-Team eine begrenzte Investitionsfreigabe. Auch wenn der Vorstand eine schnellere Ausweitung wünscht, sollten zuerst einheitliche Messregeln gelten.",
    drills: [
      ["___ die Adoption steigt, fehlen Daten.", "Obwohl"],
      ["___ guter Ergebnisse bleiben Fragen.", "Trotz"],
      ["zwar klar, ___ unvollständig", "jedoch"],
      [
        "Verbinden Sie: Zahlen steigen. Evidenz fehlt.",
        "Obwohl die Zahlen steigen, fehlt Evidenz.",
      ],
      ["___ wenn alles gelingt, messen wir weiter.", "Selbst"],
      [
        "Nominalisieren Sie: Obwohl Ergebnisse gut sind.",
        "Trotz guter Ergebnisse",
      ],
      ["Die Daten sind begrenzt; ___ empfehlen wir den Pilot.", "dennoch"],
      [
        "Formell: Obwohl der Ansatz reif ist.",
        "Wenngleich der Ansatz reif ist",
      ],
    ],
    open: [
      [
        "Formulieren Sie eine ausgewogene Empfehlung mit zwar ... jedoch.",
        "Die Ergebnisse sind zwar vielversprechend, jedoch sollte die Freigabe zunächst begrenzt bleiben.",
      ],
      [
        "Behandeln Sie einen starken Einwand mit selbst wenn.",
        "Selbst wenn der Vorstand schneller skalieren möchte, müssen einheitliche Messregeln gelten.",
      ],
    ],
    writing:
      "Schreiben Sie eine abwägende Executive-Vorlage mit Einwänden, Evidenz und Empfehlung.",
  }),
  advancedSpec({
    slug: "partizipialkonstruktionen",
    topic: "partizipialkonstruktionen",
    title: "Partizipialkonstruktionen",
    scenario: "Krisenkommunikation bei einem Systemausfall",
    rule: "Freie Partizipialkonstruktionen verdichten Zeit, Ursache, Bedingung und Perspektive in Statusmeldungen.",
    form: "Von aktuellen Daten ausgehend…; technisch betrachtet…; nach Priorität geordnet…",
    errors:
      "Der logische Bezug muss eindeutig sein; unklare Konstruktionen besser als Nebensatz formulieren.",
    words: [
      ["von aktuellen Daten ausgehend", "исходя из текущих данных"],
      ["technisch betrachtet", "с технической точки зрения"],
      ["nach Priorität geordnet", "в порядке приоритета"],
      ["unter Einbeziehung der Standorte", "с учётом площадок"],
      ["um Sondereffekte bereinigt", "с поправкой на разовые эффекты"],
      ["der Systemausfall", "системный сбой"],
      ["die Wiederherstellungszeit", "время восстановления"],
      ["der Notbetrieb", "аварийный режим"],
      ["die Statusmeldung", "статусное сообщение"],
      ["der betroffene Kanal", "затронутый канал"],
      ["vorsichtig geschätzt", "при осторожной оценке"],
      ["zusammenfassend betrachtet", "в целом"],
      ["verglichen mit", "по сравнению с"],
      ["manuell überbrückt", "перекрытый вручную"],
      ["vollständig wiederhergestellt", "полностью восстановленный"],
    ],
    reading:
      "Von den aktuellen Monitoring-Daten ausgehend, betrifft der Ausfall nur den mobilen Check-in. Technisch betrachtet, bleiben Reservierungen und Zahlungen intakt. Nach Priorität geordnet, werden zunächst Anreisen innerhalb der nächsten zwei Stunden manuell überbrückt. Vorsichtig geschätzt, ist der Dienst in neunzig Minuten wiederhergestellt. Unter Einbeziehung aller Standorte veröffentlicht das Krisenteam alle dreißig Minuten eine Statusmeldung.",
    drills: [
      ["___ aktuellen Daten ausgehend", "Von den"],
      ["Technisch ___, bleiben Daten sicher.", "betrachtet"],
      ["Nach Priorität ___", "geordnet"],
      ["Kosten ___, bleibt der Plan stabil.", "einbezogen"],
      ["Um Effekte ___", "bereinigt"],
      [
        "Korrigieren Sie den Bezug: Ausgehend von Daten, stieg die Prognose.",
        "Von den Daten ausgehend, erhöhte das Team die Prognose.",
      ],
      ["Mit gestern ___", "verglichen"],
      [
        "Lösen Sie auf: Vorsichtig geschätzt, dauert es eine Stunde.",
        "Wenn man vorsichtig schätzt, dauert es eine Stunde.",
      ],
    ],
    open: [
      [
        "Verdichten Sie Status und Einschränkung mit zwei Partizipialkonstruktionen.",
        "Technisch betrachtet und auf den Check-in begrenzt, ist der Ausfall beherrschbar.",
      ],
      [
        "Überarbeiten Sie eine unklare Konstruktion.",
        "Nachdem das Krisenteam alle Standorte einbezogen hatte, aktualisierte es die Prognose.",
      ],
    ],
    writing:
      "Verfassen Sie eine Krisenmeldung zu einem Systemausfall mit Auswirkung, Workaround und Update-Zeit.",
  }),
  advancedSpec({
    slug: "stilverbesserung-buerodeutsch",
    topic: "stilverbesserung-und-buerodeutsch",
    title: "Stilverbesserung und Bürodeutsch",
    scenario: "Strategische Jahresbewertung eines Key Accounts",
    rule: "Guter Bürostil macht Zweck, Ergebnis, Entscheidung, Owner und Termin sichtbar und ersetzt Floskeln durch präzise Verben.",
    form: "Kurzer Betreff; aktive Sätze; parallele Maßnahmen; höfliche Bitte mit Frist.",
    errors:
      "Vermeiden Sie Nominalketten, Passiv ohne Grund, Füllwörter und vage Zeitangaben.",
    words: [
      ["die Jahresbewertung", "годовая оценка"],
      ["das strategische Ziel", "стратегическая цель"],
      ["der gemeinsame Erfolgsplan", "совместный план успеха"],
      ["die Entscheidungsgrundlage", "основа решения"],
      ["die Priorität bestätigen", "подтвердить приоритет"],
      ["einen Owner benennen", "назначить ответственного"],
      ["bis zum Stichtag", "к контрольной дате"],
      ["vorbehaltlich der Zustimmung", "при условии согласия"],
      ["mit Blick auf", "с учётом"],
      ["konkret bedeutet das", "конкретно это означает"],
      ["zuständig sein für", "отвечать за"],
      ["eine Rückmeldung geben", "дать обратную связь"],
      ["zur Kenntnis nehmen", "принять к сведению"],
      ["auf den Weg bringen", "запустить"],
      ["ohne unnötige Verzögerung", "без лишней задержки"],
    ],
    reading:
      "Betreff: Entscheidung zu den Prioritäten des Key Accounts. Die Jahresbewertung zeigt höhere Adoption, schnellere Lösungszeiten und eine offene Integrationsabhängigkeit. Wir empfehlen drei Prioritäten: IT schließt die Integration ab, HR erweitert die Managerschulung und Customer Success führt quartalsweise Wertgespräche durch. Bitte bestätigen Sie bis Freitag den Executive Owner und die Zieltermine. Vorbehaltlich Ihrer Zustimmung aktualisieren wir den gemeinsamen Erfolgsplan nächste Woche.",
    drills: [
      [
        "Kürzen Sie: Wir möchten hiermit um Zustimmung bitten.",
        "Bitte stimmen Sie zu.",
      ],
      [
        "Aktivieren Sie: Die Integration erfolgt durch IT.",
        "IT integriert das System.",
      ],
      ["HR ist ___ Schulung zuständig.", "für die"],
      [
        "Machen Sie konkret: Rückmeldung wäre zeitnah hilfreich.",
        "Bitte geben Sie uns bis Freitag Rückmeldung.",
      ],
      ["Kürzen Sie: bereits schon abgeschlossen.", "bereits abgeschlossen"],
      ["Vorbehaltlich ___ Zustimmung", "Ihrer"],
      [
        "Aktivieren Sie: Die Freigabe wird vom Vorstand erteilt.",
        "Der Vorstand erteilt die Freigabe.",
      ],
      [
        "Parallelisieren Sie: integrieren, Schulung und wir messen.",
        "integrieren, schulen und messen",
      ],
    ],
    open: [
      [
        "Überarbeiten Sie eine vage Bitte mit Owner und Frist.",
        "Bitte bestätigen Sie den Executive Owner und die Zieltermine bis Freitag.",
      ],
      [
        "Ersetzen Sie Amtsdeutsch durch klare Sprache.",
        "Wir prüfen die Ergebnisse und entscheiden anschließend über die Prioritäten.",
      ],
    ],
    writing:
      "Schreiben Sie eine strategische Jahresbewertung eines Key Accounts mit Ergebnissen, Prioritäten und Entscheidungsbedarf.",
  }),
];

export const germanCustomerSuccessLessons: readonly Lesson[] = [
  ...specs,
  ...advancedSpecs,
].map(buildLesson);
