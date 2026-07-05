// Static lesson content — English / AI Consultant track (towards B2).
//
// Ten lessons follow the curriculum order in docs/content-catalog.md. Every
// lesson contains sectioned theory in Russian, 15 mixed vocabulary/business
// phrase items, an original reading, eight deterministic exercises, two open
// grammar exercises for the existing universal LLM checker, and a writing task.

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
import type {
  ExerciseFormat as ExerciseFormatType,
  Lesson,
  TheorySection,
  VocabularyItem,
} from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

interface GradedSpec {
  format: ExerciseFormatType;
  prompt: string;
  answer: string;
  accepted?: string[];
  explanation: string;
  subcategory: string;
}

interface OpenSpec {
  format: ExerciseFormatType;
  prompt: string;
  sample: string;
  criteria: string;
}

interface LessonSpec {
  slug: string;
  topic: string;
  title: string;
  practiceTitle: string;
  theory: TheorySection[];
  vocabulary: VocabularyItem[];
  readingTitle: string;
  reading: string;
  graded: GradedSpec[];
  open: OpenSpec[];
  writingPrompt: string;
  writingRequirements: string[];
  sources: string[];
}

function vocabulary(
  entries: ReadonlyArray<readonly [string, string, string]>,
): VocabularyItem[] {
  return entries.map(([term, translation, example]) => ({
    term,
    translation,
    example,
  }));
}

function createLesson(spec: LessonSpec): Lesson {
  const prefix = `en-ai-consultant-${spec.slug}`;
  return {
    id: lessonId(prefix),
    topic: spec.topic,
    language: Language.English,
    careerTrack: CareerTrack.AiConsultant,
    title: spec.title,
    targetLevel: CefrLevel.B2,
    sources: spec.sources,
    activities: [
      {
        id: activityId(`${prefix}-review`),
        kind: ActivityKind.Review,
        title: "Review",
      },
      {
        id: activityId(`${prefix}-theory`),
        kind: ActivityKind.GrammarTheory,
        title: spec.title,
        sections: spec.theory,
      },
      {
        id: activityId(`${prefix}-vocabulary`),
        kind: ActivityKind.Vocabulary,
        title: "Professional vocabulary and business phrases",
        items: spec.vocabulary,
      },
      {
        id: activityId(`${prefix}-reading`),
        kind: ActivityKind.Reading,
        title: spec.readingTitle,
        text: spec.reading,
      },
      {
        id: activityId(`${prefix}-practice`),
        kind: ActivityKind.GrammarPractice,
        title: spec.practiceTitle,
        exercises: [
          ...spec.graded.map((exercise, index) => ({
            id: exerciseId(`${prefix}-ex${index + 1}`),
            evaluation: ExerciseEvaluation.Graded,
            skillArea: SkillArea.Grammar,
            format: exercise.format,
            topic: spec.topic,
            category: "grammar",
            subcategory: exercise.subcategory,
            severity: MistakeSeverity.Medium,
            prompt: exercise.prompt,
            expectedAnswer: exercise.answer,
            acceptedAnswers: exercise.accepted,
            explanation: exercise.explanation,
          })),
          ...spec.open.map((exercise, index) => ({
            id: exerciseId(`${prefix}-ex${spec.graded.length + index + 1}`),
            evaluation: ExerciseEvaluation.Open,
            skillArea: SkillArea.Grammar,
            format: exercise.format,
            prompt: exercise.prompt,
            sampleAnswer: exercise.sample,
            explanation: `Критерии оценки: ${exercise.criteria} Несколько формулировок могут быть правильными.`,
          })),
        ],
      },
      {
        id: activityId(`${prefix}-writing`),
        kind: ActivityKind.Writing,
        title: "Writing task",
        prompt: spec.writingPrompt,
        wordRange: { min: 120, max: 160 },
        requirements: spec.writingRequirements,
      },
    ],
  };
}

const cambridgeTenses = [
  "Cambridge Dictionary — English Grammar (present and past tenses)",
  "British Council — LearnEnglish Grammar (present and perfect forms)",
  "Oxford Learner's Dictionaries — grammar reference",
];
const cambridgeStructures = [
  "Cambridge Dictionary — English Grammar",
  "British Council — LearnEnglish Grammar",
  "Oxford Learner's Dictionaries — grammar reference",
];

const presentSimpleContinuous = createLesson({
  slug: "present-simple-continuous",
  topic: "present-simple-vs-present-continuous",
  title: "Present Simple vs Present Continuous",
  practiceTitle: "Practice: discovery calls and current work",
  sources: cambridgeTenses,
  theory: [
    {
      heading: "Когда использовать",
      body: "Present Simple описывает постоянные процессы, факты и регулярные действия. Present Continuous показывает временную ситуацию, действие сейчас или меняющийся процесс. На discovery call это различие отделяет обычный workflow клиента от текущего эксперимента.",
    },
    {
      heading: "Форма",
      items: [
        "Present Simple: subject + base verb; he/she/it + -s.",
        "Present Continuous: subject + am/is/are + verb-ing.",
        "We process invoices automatically. / We are testing a new extraction model this month.",
      ],
    },
    {
      heading: "Маркеры и глаголы состояния",
      body: "Usually, every week и generally часто сопровождают Present Simple; currently, this week и at the moment — Continuous. Глаголы состояния know, need, understand, belong обычно не ставятся в Continuous.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не пропускайте be: не «we testing», а «we are testing».",
        "Не используйте Continuous для постоянного факта: «The platform supports SSO».",
        "После does основной глагол теряет -s: «How does the team handle requests?»",
      ],
    },
    {
      heading: "Запомните",
      body: "Спросите: это обычный процесс или временная работа сейчас? Ответ определяет время.",
    },
  ],
  vocabulary: vocabulary([
    [
      "discovery call",
      "вводная встреча для выявления потребностей",
      "We use the discovery call to map the current process.",
    ],
    [
      "current workflow",
      "текущий рабочий процесс",
      "How does the current workflow handle exceptions?",
    ],
    [
      "pain point",
      "проблемная точка",
      "The team is currently investigating its main pain point.",
    ],
    [
      "manual handoff",
      "ручная передача задачи",
      "A manual handoff usually delays approval.",
    ],
    [
      "process owner",
      "владелец процесса",
      "The process owner reviews every change.",
    ],
    ["bottleneck", "узкое место", "We are measuring the bottleneck this week."],
    ["use case", "сценарий применения", "This use case requires human review."],
    [
      "baseline",
      "исходный показатель",
      "The baseline shows the current processing time.",
    ],
    [
      "exception handling",
      "обработка исключений",
      "Exception handling remains partly manual.",
    ],
    [
      "map a process",
      "описать процесс по шагам",
      "We are mapping the claims process today.",
    ],
    [
      "capture requirements",
      "зафиксировать требования",
      "The consultant captures requirements during each workshop.",
    ],
    [
      "at the moment",
      "в настоящий момент",
      "At the moment, the client is testing two tools.",
    ],
    [
      "on a regular basis",
      "на регулярной основе",
      "The operations team checks quality on a regular basis.",
    ],
    [
      "How do you currently…?",
      "Как вы сейчас…?",
      "How do you currently prioritise incoming requests?",
    ],
    [
      "We are currently looking at…",
      "Сейчас мы рассматриваем…",
      "We are currently looking at approval delays.",
    ],
  ]),
  readingTitle: "A discovery call about invoice processing",
  reading:
    "The finance team processes about 4,000 invoices each month. Two coordinators usually check supplier details and route each invoice for approval. The system flags duplicate numbers, but it does not recognise unusual payment terms. At the moment, the client is testing an AI extraction tool with one business unit. The consultants are measuring accuracy and are interviewing process owners about exceptions. They are not replacing the approval workflow yet; they are building a reliable baseline. The discovery call therefore focuses on both the permanent process and the temporary pilot.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "The finance team usually ___ (review) exceptions manually."',
      answer: "reviews",
      explanation:
        "Usually обозначает регулярный процесс; с team как единственным числом нужен reviews.",
      subcategory: "present-simple",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We ___ (test) the extraction model this week."',
      answer: "are testing",
      explanation:
        "This week — временная текущая работа, поэтому Present Continuous.",
      subcategory: "present-continuous",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "The platform is supporting SSO." B) "The platform supports SSO."',
      answer: "B",
      accepted: ["b"],
      explanation:
        "Постоянная характеристика продукта выражается Present Simple.",
      subcategory: "stative-and-factual",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "How ___ the team currently handle urgent requests?" (do)',
      answer: "does",
      explanation:
        "В вопросе с team используется does, основной глагол остаётся handle.",
      subcategory: "present-simple-question",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with one word: "At the moment, the process owners ___ documenting exceptions."',
      answer: "are",
      explanation: "Present Continuous требует вспомогательный глагол are.",
      subcategory: "continuous-auxiliary",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "We need access to the logs." B) "We are needing access to the logs."',
      answer: "A",
      accepted: ["a"],
      explanation:
        "Need — глагол состояния и обычно употребляется в Present Simple.",
      subcategory: "stative-verbs",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "The pilot ___ (not replace) the existing workflow yet."',
      answer: "is not replacing",
      accepted: ["isn't replacing"],
      explanation: "Yet здесь относится к временной текущей фазе пилота.",
      subcategory: "present-continuous-negative",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Correct the verb: "The tool currently process 300 documents a day."',
      answer: "processes",
      explanation: "В Present Simple подлежащее tool требует окончания -es.",
      subcategory: "third-person-s",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rewrite to contrast the normal process with the temporary pilot: "We check invoices manually. We test AI this month."',
      sample:
        "We usually check invoices manually, but we are testing AI this month.",
      criteria:
        "Present Simple для обычного процесса, Present Continuous для временного пилота, исходный смысл сохранён.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rephrase as a professional discovery-call question using Present Simple: "Tell me about handling exceptions."',
      sample: "How does your team currently handle exceptions?",
      criteria:
        "корректный вопрос в Present Simple, профессиональный нейтральный тон и запрос о текущем постоянном процессе.",
    },
  ],
  writingPrompt:
    "Write a discovery-call follow-up that describes the client's normal workflow and the temporary AI pilot now in progress.",
  writingRequirements: [
    "Используйте Present Simple минимум три раза.",
    "Используйте Present Continuous минимум три раза.",
    "Отделите постоянный процесс от временного пилота.",
    "Укажите один pain point и следующий шаг.",
  ],
});

const pastSimplePresentPerfect = createLesson({
  slug: "past-simple-present-perfect",
  topic: "past-simple-vs-present-perfect",
  title: "Past Simple vs Present Perfect",
  practiceTitle: "Practice: LLM evaluation results",
  sources: cambridgeTenses,
  theory: [
    {
      heading: "Главное различие",
      body: "Past Simple сообщает о завершённом событии в законченном периоде. Present Perfect связывает прошлое с настоящим: результат важен сейчас, период ещё продолжается или точное время не называется.",
    },
    {
      heading: "Форма",
      items: [
        "Past Simple: verb-ed или вторая форма: We tested it yesterday.",
        "Present Perfect: have/has + past participle: We have completed three evaluations.",
        "Вопрос: Have you reviewed the latest output?",
      ],
    },
    {
      heading: "Маркеры",
      body: "Yesterday, last week, in May и ago требуют Past Simple. So far, already, yet, recently и since/for обычно указывают на Present Perfect.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не используйте Present Perfect с законченным временем: не «have tested yesterday».",
        "После have нужен participle: «have found», не «have find».",
        "Since обозначает начало периода, for — его длительность.",
      ],
    },
    {
      heading: "Запомните",
      body: "Есть завершённая дата — Past Simple. Важен текущий результат или незаконченный период — Present Perfect.",
    },
  ],
  vocabulary: vocabulary([
    [
      "evaluation dataset",
      "набор данных для оценки",
      "We created the evaluation dataset last month.",
    ],
    [
      "benchmark",
      "контрольный показатель",
      "The model has exceeded the benchmark so far.",
    ],
    [
      "hallucination rate",
      "доля галлюцинаций модели",
      "The hallucination rate fell during the second test.",
    ],
    [
      "grounded answer",
      "ответ, основанный на источнике",
      "We have reviewed 200 grounded answers.",
    ],
    [
      "failure mode",
      "тип сбоя",
      "The team identified a new failure mode yesterday.",
    ],
    [
      "edge case",
      "крайний случай",
      "The latest run has exposed several edge cases.",
    ],
    ["test run", "тестовый прогон", "The first test run finished on Friday."],
    [
      "acceptance threshold",
      "порог приёмки",
      "The model has not met the acceptance threshold yet.",
    ],
    [
      "false positive",
      "ложноположительный результат",
      "We found twelve false positives in the last run.",
    ],
    [
      "quality criteria",
      "критерии качества",
      "The stakeholders have approved the quality criteria.",
    ],
    [
      "since the pilot began",
      "с начала пилота",
      "Accuracy has improved since the pilot began.",
    ],
    ["so far", "на данный момент", "So far, the tool has passed four checks."],
    [
      "in the latest round",
      "в последнем раунде",
      "In the latest round, we tested multilingual prompts.",
    ],
    [
      "We have now completed…",
      "Мы уже завершили…",
      "We have now completed the safety review.",
    ],
    [
      "The test showed that…",
      "Тест показал, что…",
      "The test showed that retrieval needs tuning.",
    ],
  ]),
  readingTitle: "An evaluation update",
  reading:
    "We started the LLM evaluation six weeks ago and agreed on four quality criteria with the client. In the first test run, the model achieved 78% grounded accuracy. The team then improved retrieval and added difficult edge cases. Since that change, accuracy has risen to 88%, and the hallucination rate has fallen. We completed the latest run on Tuesday and found one remaining failure mode in German queries. So far, the model has passed the relevance and tone thresholds, but it has not met the multilingual threshold yet. The result is encouraging, although one more test cycle is required.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We ___ (complete) the latest run on Tuesday."',
      answer: "completed",
      explanation: "On Tuesday — законченное время, поэтому Past Simple.",
      subcategory: "past-simple",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Accuracy ___ (improve) since we changed retrieval."',
      answer: "has improved",
      explanation: "Since связывает прошлое изменение с результатом сейчас.",
      subcategory: "present-perfect",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "We have found the issue yesterday." B) "We found the issue yesterday."',
      answer: "B",
      accepted: ["b"],
      explanation: "Yesterday требует Past Simple.",
      subcategory: "finished-time",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The model ___ (not meet) the threshold yet."',
      answer: "has not met",
      accepted: ["hasn't met"],
      explanation:
        "Yet и актуальный незавершённый результат требуют Present Perfect.",
      subcategory: "present-perfect-negative",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with "since" or "for": "We have monitored the model ___ six weeks."',
      answer: "for",
      explanation: "For вводит длительность периода.",
      subcategory: "since-for",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "The stakeholders ___ (approve) the criteria last month."',
      answer: "approved",
      explanation: "Last month — завершённый период.",
      subcategory: "past-simple",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Give the past participle: "The latest run has ___ several edge cases." (expose)',
      answer: "exposed",
      explanation: "После has нужен past participle exposed.",
      subcategory: "past-participle",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "Have you reviewed the output yet?" B) "Did you review the output yet last Friday?"',
      answer: "A",
      accepted: ["a"],
      explanation:
        "Yet без законченного времени естественно сочетается с Present Perfect.",
      subcategory: "present-perfect-question",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Summarise these facts in one update: "We began testing in May. Testing continues. We completed four runs."',
      sample: "We have completed four test runs since evaluation began in May.",
      criteria:
        "Present Perfect передаёт продолжающийся период, since корректно задаёт начало, факты не искажены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rephrase professionally and distinguish the finished event from its current result: "Tuesday: we fixed retrieval. Now accuracy is better."',
      sample:
        "We fixed retrieval on Tuesday, and accuracy has improved since then.",
      criteria:
        "Past Simple для события во вторник, Present Perfect для текущего результата, логичная связь.",
    },
  ],
  writingPrompt:
    "Write an implementation update summarising an LLM evaluation: what the team did in the last test round and what has improved so far.",
  writingRequirements: [
    "Используйте Past Simple для минимум двух датированных событий.",
    "Используйте Present Perfect минимум три раза.",
    "Назовите метрику, failure mode и текущий статус.",
    "Завершите следующим шагом.",
  ],
});

const futureForms = createLesson({
  slug: "future-forms",
  topic: "future-forms",
  title: "Future Forms",
  practiceTitle: "Practice: planning an AI tool rollout",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Три способа говорить о будущем",
      body: "Will выражает решение в момент речи, обещание или прогноз. Be going to показывает намерение или прогноз по видимым данным. Present Continuous обозначает уже согласованную договорённость с конкретным временем.",
    },
    {
      heading: "Форма и примеры",
      items: [
        "will + infinitive: I will send the risk log today.",
        "am/is/are going to + infinitive: We are going to run a pilot.",
        "Present Continuous + future time: We are meeting IT on Thursday.",
      ],
    },
    {
      heading: "Расписание",
      body: "Present Simple может описывать официальное расписание: The rollout starts on 3 September. В придаточных after, when, as soon as для будущего используется Present Simple, не will.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не ставьте will после when: «when testing finishes».",
        "Для уже назначенной встречи используйте Continuous, а не неопределённое will.",
        "После going to нужен инфинитив: «going to deploy».",
      ],
    },
    {
      heading: "Запомните",
      body: "Выберите форму по основанию: спонтанное решение, намерение или подтверждённая договорённость.",
    },
  ],
  vocabulary: vocabulary([
    [
      "rollout plan",
      "план внедрения",
      "We are presenting the rollout plan tomorrow.",
    ],
    [
      "go-live date",
      "дата запуска",
      "The go-live date is going to move by one week.",
    ],
    [
      "phased deployment",
      "поэтапное развёртывание",
      "The phased deployment starts in September.",
    ],
    [
      "readiness check",
      "проверка готовности",
      "We are conducting a readiness check on Monday.",
    ],
    [
      "training session",
      "обучающая сессия",
      "The vendor is running a training session next week.",
    ],
    [
      "contingency plan",
      "резервный план",
      "We will activate the contingency plan if needed.",
    ],
    ["launch window", "окно запуска", "The launch window closes on Friday."],
    [
      "user cohort",
      "группа пользователей",
      "The first user cohort is going to test the assistant.",
    ],
    [
      "change champion",
      "представитель, поддерживающий изменения",
      "We are meeting the change champions on Tuesday.",
    ],
    ["rollback", "откат версии", "IT will manage any rollback."],
    [
      "schedule a workshop",
      "назначить воркшоп",
      "I will schedule a workshop this afternoon.",
    ],
    [
      "subject to approval",
      "при условии одобрения",
      "The launch will proceed subject to approval.",
    ],
    [
      "once the test is complete",
      "как только тест завершится",
      "Once the test is complete, we will share the results.",
    ],
    [
      "We are due to…",
      "По плану мы должны…",
      "We are due to launch in October.",
    ],
    [
      "The next step will be…",
      "Следующим шагом будет…",
      "The next step will be user training.",
    ],
  ]),
  readingTitle: "Planning a controlled rollout",
  reading:
    "The client is launching its internal AI assistant in October. The project team is meeting department leads next Tuesday, and the first training session starts on 18 September. Before then, consultants are going to complete a readiness check and test the rollback process. The initial cohort will include forty users. If support tickets rise sharply, the team will pause expansion and review the logs. Once the first cohort completes two weeks of use, the steering committee will decide whether to extend access. This staged plan is going to reduce operational risk while keeping the launch date realistic.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the arrangement: "We ___ (meet) the security team on Thursday."',
      answer: "are meeting",
      explanation:
        "Согласованная встреча с датой выражается Present Continuous.",
      subcategory: "arrangement",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete the intention: "The client ___ (run) a phased pilot."',
      answer: "is going to run",
      explanation: "Going to выражает заранее сформированное намерение.",
      subcategory: "going-to",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with one word: "I ___ send the revised plan this afternoon."',
      answer: "will",
      accepted: ["'ll"],
      explanation: "Обещание, данное сейчас, оформляется с will.",
      subcategory: "will-promise",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "When testing will finish, we will launch." B) "When testing finishes, we will launch."',
      answer: "B",
      accepted: ["b"],
      explanation: "После when в будущем используется Present Simple.",
      subcategory: "future-time-clause",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the timetable: "The first training session ___ (start) on 18 September."',
      answer: "starts",
      explanation: "Официальное расписание выражается Present Simple.",
      subcategory: "timetable",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete: "The evidence suggests ticket volume ___ increase." (going to)',
      answer: "is going to",
      explanation: "Прогноз по текущим данным оформляется be going to.",
      subcategory: "evidence-prediction",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "As soon as IT ___ (approve) access, we will begin."',
      answer: "approves",
      explanation: "После as soon as употребляется Present Simple.",
      subcategory: "future-time-clause",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B for a scheduled workshop: A) "We will meet at 10 tomorrow." B) "We are meeting at 10 tomorrow."',
      answer: "B",
      accepted: ["b"],
      explanation:
        "Конкретная договорённость лучше передаётся Present Continuous.",
      subcategory: "arrangement",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Turn this note into a clear rollout update using two appropriate future forms: "Plan: readiness check Monday; promise: results Tuesday."',
      sample:
        "We are carrying out the readiness check on Monday, and we will share the results on Tuesday.",
      criteria:
        "Present Continuous для договорённости, will для обещания, сроки и смысл сохранены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Soften this prediction using evidence-based going to: "The launch will fail because readiness is low."',
      sample:
        "The current readiness results suggest that the launch is going to face difficulties.",
      criteria:
        "be going to связано с текущими данными, категоричность снижена, основная обеспокоенность сохранена.",
    },
  ],
  writingPrompt:
    "Write a rollout update to stakeholders covering confirmed arrangements, team intentions, predictions, and one promise.",
  writingRequirements: [
    "Используйте will, be going to и Present Continuous.",
    "Укажите минимум две даты или этапа.",
    "Добавьте условие с when/once/as soon as без will.",
    "Назовите риск и contingency plan.",
  ],
});

const modalVerbs = createLesson({
  slug: "modal-verbs",
  topic: "modal-verbs",
  title: "Modal Verbs",
  practiceTitle: "Practice: requirements and recommendations",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Функции модальных глаголов",
      body: "Must и have to выражают необходимость; should — рекомендацию; can/could — возможность или способность; may/might — вероятность или разрешение. В консалтинге выбор модального глагола показывает силу требования.",
    },
    {
      heading: "Форма",
      items: [
        "modal + bare infinitive: We should validate the data.",
        "После модального нет -s и to.",
        "Have to изменяется по времени: We had to delay the test.",
      ],
    },
    {
      heading: "Важные различия",
      body: "Mustn't означает запрет, а don't have to — отсутствие необходимости. Could часто звучит мягче, чем can; might передаёт менее уверенную вероятность, чем may.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не «must to review», а «must review».",
        "Не путайте mustn't и don't have to.",
        "Для дипломатичной рекомендации часто лучше should/could, чем must.",
      ],
    },
    {
      heading: "Запомните",
      body: "Сначала определите смысл — обязательство, совет, возможность или вероятность — затем выбирайте модальный глагол.",
    },
  ],
  vocabulary: vocabulary([
    [
      "mandatory requirement",
      "обязательное требование",
      "Audit logging is a mandatory requirement.",
    ],
    [
      "nice-to-have",
      "желательная, но необязательная функция",
      "Custom branding is a nice-to-have.",
    ],
    [
      "constraint",
      "ограничение",
      "The solution must respect the data constraint.",
    ],
    ["dependency", "зависимость", "The rollout may depend on identity access."],
    [
      "compliance review",
      "проверка соответствия требованиям",
      "Legal has to complete a compliance review.",
    ],
    [
      "access control",
      "контроль доступа",
      "The platform must support role-based access control.",
    ],
    [
      "human oversight",
      "контроль со стороны человека",
      "High-risk outputs should receive human oversight.",
    ],
    [
      "data residency",
      "локализация хранения данных",
      "The vendor must meet data-residency rules.",
    ],
    [
      "feasibility",
      "осуществимость",
      "We could assess feasibility in a short pilot.",
    ],
    [
      "prerequisite",
      "предварительное условие",
      "Clean source data is a prerequisite.",
    ],
    [
      "be able to",
      "быть в состоянии",
      "The team will be able to monitor usage.",
    ],
    [
      "may require",
      "может потребовать",
      "The integration may require additional testing.",
    ],
    [
      "You may want to consider…",
      "Возможно, вам стоит рассмотреть…",
      "You may want to consider a smaller scope.",
    ],
    [
      "We would recommend…",
      "Мы бы рекомендовали…",
      "We would recommend human approval for payments.",
    ],
    ["This must not…", "Это не должно…", "This must not expose personal data."],
  ]),
  readingTitle: "Turning needs into requirements",
  reading:
    "During the requirements workshop, the client separated essential controls from optional features. The assistant must use role-based access, and it must not retain confidential prompts. Legal has to approve the data-processing agreement before the pilot. The first release does not have to include voice input, although the team may add it later. Consultants recommended that sensitive recommendations should receive human review. They also explained that a short pilot could reveal integration constraints and might reduce the risk of an expensive redesign.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the obligation: "The system ___ protect confidential prompts."',
      answer: "must",
      accepted: ["has to"],
      explanation: "Must/has to выражают обязательное требование.",
      subcategory: "obligation",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "Users must not share passwords." B) "Users do not have to share passwords."',
      answer: "A",
      accepted: ["a"],
      explanation:
        "Must not выражает запрет; don't have to — отсутствие необходимости.",
      subcategory: "prohibition",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the recommendation: "High-risk outputs ___ receive human review."',
      answer: "should",
      explanation: "Should передаёт профессиональную рекомендацию.",
      subcategory: "recommendation",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with one modal: "A short pilot ___ reveal hidden constraints." (possibility)',
      answer: "could",
      accepted: ["may", "might", "can"],
      explanation:
        "Could/may/might выражают возможность; could также звучит осторожно.",
      subcategory: "possibility",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Correct the form: "The vendor must to provide audit logs."',
      answer: "must provide",
      explanation: "После must используется инфинитив без to.",
      subcategory: "modal-form",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B for no necessity: A) "The pilot must not include voice." B) "The pilot does not have to include voice."',
      answer: "B",
      accepted: ["b"],
      explanation: "Does not have to означает, что функция необязательна.",
      subcategory: "no-necessity",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete about past necessity: "We ___ delay the test because access was unavailable."',
      answer: "had to",
      explanation: "Для необходимости в прошлом используется had to.",
      subcategory: "past-obligation",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Complete politely: "You ___ want to consider a smaller pilot."',
      answer: "may",
      accepted: ["might"],
      explanation: "May/might смягчает рекомендацию.",
      subcategory: "diplomatic-modal",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Soften this client recommendation with modal verbs: "You must reduce the scope."',
      sample:
        "You may want to reduce the scope, and you could move optional features to a later phase.",
      criteria:
        "совет выражен дипломатично через may/should/could, исходная рекомендация сохранена.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Transform into a clear requirement and a non-requirement: "Audit logs: essential. Voice input: optional."',
      sample:
        "The solution must provide audit logs, but it does not have to support voice input in the first release.",
      criteria:
        "must/have to передаёт обязательность, don't have to — необязательность, значения не перепутаны.",
    },
  ],
  writingPrompt:
    "Write a requirements summary that distinguishes mandatory controls, recommendations, optional features, and possible risks.",
  writingRequirements: [
    "Используйте must/have to и must not.",
    "Используйте should для рекомендации.",
    "Используйте don't have to для необязательной функции.",
    "Добавьте could/may/might для возможности или риска.",
  ],
});

const conditionals = createLesson({
  slug: "conditionals",
  topic: "first-and-second-conditionals",
  title: "First & Second Conditionals",
  practiceTitle: "Practice: business-value recommendations",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Реальное и гипотетическое условие",
      body: "First conditional описывает реальный вероятный результат. Second conditional моделирует гипотетический, маловероятный вариант или делает совет менее прямым.",
    },
    {
      heading: "Форма",
      items: [
        "First: if + Present Simple, will + infinitive.",
        "Second: if + Past Simple, would + infinitive.",
        "If we run a pilot, we will measure value. / If the budget were larger, we would customise the model.",
      ],
    },
    {
      heading: "Варианты",
      body: "В главной части возможны can, could, may или might. Unless означает if not. Для формального гипотетического условия предпочтительно were для всех лиц.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не ставьте will после if.",
        "Не смешивайте реальное условие с would без причины.",
        "После would используйте инфинитив без to.",
      ],
    },
    {
      heading: "Запомните",
      body: "Вероятный план — first conditional; воображаемый сценарий или дипломатичная гипотеза — second conditional.",
    },
  ],
  vocabulary: vocabulary([
    [
      "business case",
      "экономическое обоснование",
      "The business case will improve if adoption rises.",
    ],
    [
      "return on investment",
      "окупаемость инвестиций",
      "The pilot will clarify the return on investment.",
    ],
    [
      "time to value",
      "время до получения ценности",
      "A standard tool would shorten time to value.",
    ],
    [
      "proof of concept",
      "проверка концепции",
      "If we build a proof of concept, we will test feasibility.",
    ],
    [
      "custom solution",
      "индивидуальное решение",
      "A custom solution would require more data.",
    ],
    [
      "scalable",
      "масштабируемый",
      "The approach will be scalable if governance is clear.",
    ],
    [
      "trade-off",
      "компромисс",
      "The main trade-off is speed versus flexibility.",
    ],
    [
      "value driver",
      "фактор ценности",
      "Faster response time is a key value driver.",
    ],
    [
      "operating cost",
      "операционные расходы",
      "Automation could reduce operating cost.",
    ],
    [
      "adoption rate",
      "уровень внедрения",
      "If the adoption rate stays low, benefits will be limited.",
    ],
    [
      "validate an assumption",
      "проверить предположение",
      "A pilot would validate the assumption.",
    ],
    [
      "at full scale",
      "в полном масштабе",
      "The saving would be significant at full scale.",
    ],
    [
      "If we proceed with…",
      "Если мы продолжим с…",
      "If we proceed with the pilot, we will collect evidence.",
    ],
    [
      "If the priority were…",
      "Если бы приоритетом было…",
      "If the priority were speed, we would buy a standard tool.",
    ],
    [
      "The strongest option would be…",
      "Наилучшим вариантом было бы…",
      "The strongest option would be a controlled pilot.",
    ],
  ]),
  readingTitle: "Pilot or custom build?",
  reading:
    "The client wants measurable value within one quarter. If the team configures a standard platform, it will launch quickly and produce adoption data. A custom build could offer more flexibility, but it would take longer. If the organisation already had a mature data platform, a custom solution would be easier to justify. It does not have that capability today. The consultants therefore recommend a controlled pilot. If the pilot meets the agreed value threshold, the client will expand it. If it does not, the evidence will still prevent a larger investment based on weak assumptions.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "If we ___ (run) a pilot, we will measure adoption."',
      answer: "run",
      explanation: "После if в first conditional используется Present Simple.",
      subcategory: "first-conditional",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If the data platform ___ mature, we would build a custom model."',
      answer: "were",
      accepted: ["was"],
      explanation:
        "Second conditional требует Past Simple; were предпочтительно формально.",
      subcategory: "second-conditional",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with "will" or "would": "If adoption rises, the business case ___ improve."',
      answer: "will",
      explanation: "Реальный вероятный результат — first conditional.",
      subcategory: "first-conditional",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with "will" or "would": "If speed were the priority, we ___ choose a standard tool."',
      answer: "would",
      explanation: "Гипотетический приоритет — second conditional.",
      subcategory: "second-conditional",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "If we will proceed, we will collect data." B) "If we proceed, we will collect data."',
      answer: "B",
      accepted: ["b"],
      explanation: "Will не используется в части с if.",
      subcategory: "if-clause-form",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "Unless the pilot ___ (meet) the threshold, we will not scale it."',
      answer: "meets",
      explanation: "Unless = if not; после него Present Simple.",
      subcategory: "unless",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If costs were lower, the project ___ (be) easier to approve."',
      answer: "would be",
      explanation: "Главная часть second conditional: would + инфинитив.",
      subcategory: "second-conditional",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "If results are strong, we may expand." B) "If results would be strong, we may expand."',
      answer: "A",
      accepted: ["a"],
      explanation: "После if для реального будущего нужен Present Simple.",
      subcategory: "first-conditional-modal",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Turn this into a balanced recommendation using both conditional types: "Pilot likely; custom build hypothetical."',
      sample:
        "If we start with a pilot, we will obtain evidence quickly; if the data platform were more mature, we would consider a custom build.",
      criteria:
        "один корректный first conditional и один second conditional, варианты и смысл ясно противопоставлены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Soften this recommendation with a second conditional: "Choose the standard platform to get value faster."',
      sample:
        "If faster time to value were the main priority, I would recommend the standard platform.",
      criteria:
        "second conditional корректен, рекомендация стала дипломатичнее, исходный приоритет сохранён.",
    },
  ],
  writingPrompt:
    "Write a client recommendation comparing an AI pilot with a custom solution and explain the likely business value of each option.",
  writingRequirements: [
    "Используйте минимум два first conditionals.",
    "Используйте минимум два second conditionals.",
    "Сравните time to value, cost и flexibility.",
    "Завершите однозначной рекомендацией.",
  ],
});

const passiveVoice = createLesson({
  slug: "passive-voice",
  topic: "passive-voice",
  title: "Passive Voice",
  practiceTitle: "Practice: implementation processes",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Зачем нужен пассив",
      body: "Passive Voice фокусирует внимание на процессе или результате, когда исполнитель неизвестен, очевиден или неважен. Он особенно полезен в implementation updates и описаниях контроля.",
    },
    {
      heading: "Форма",
      items: [
        "Present Simple passive: am/is/are + past participle.",
        "Past Simple passive: was/were + past participle.",
        "Present Perfect passive: has/have been + past participle.",
        "Modal passive: modal + be + past participle.",
      ],
    },
    {
      heading: "Исполнитель",
      body: "Добавляйте by только если исполнитель действительно важен: The design was approved by Legal. Не скрывайте ответственность пассивом там, где клиенту нужно знать владельца действия.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не пропускайте be: «data is encrypted».",
        "Используйте третью форму: «was sent», не «was send».",
        "Согласуйте be с подлежащим: «tests were completed».",
      ],
    },
    {
      heading: "Запомните",
      body: "Пассив = подходящая форма be + past participle; время выражает be.",
    },
  ],
  vocabulary: vocabulary([
    [
      "implementation phase",
      "этап внедрения",
      "The workflow is configured during the implementation phase.",
    ],
    [
      "system integration",
      "системная интеграция",
      "The system integration was completed last week.",
    ],
    [
      "access provision",
      "предоставление доступа",
      "Access is provisioned by IT.",
    ],
    ["configuration", "настройка", "The configuration has been documented."],
    [
      "data migration",
      "перенос данных",
      "Data migration will be tested twice.",
    ],
    [
      "quality gate",
      "контрольная точка качества",
      "Each release is checked at a quality gate.",
    ],
    [
      "sign-off",
      "формальное утверждение",
      "Final sign-off is required before launch.",
    ],
    [
      "audit trail",
      "журнал аудита",
      "An audit trail is generated automatically.",
    ],
    [
      "deployment environment",
      "среда развёртывания",
      "The deployment environment has been secured.",
    ],
    ["issue log", "журнал проблем", "The issue log is updated daily."],
    [
      "be assigned to",
      "быть назначенным",
      "Each action is assigned to an owner.",
    ],
    [
      "be scheduled for",
      "быть запланированным на",
      "User testing is scheduled for Monday.",
    ],
    [
      "has been completed",
      "было завершено",
      "The security review has been completed.",
    ],
    [
      "is currently being tested",
      "сейчас тестируется",
      "The new connector is currently being tested.",
    ],
    [
      "will be shared",
      "будет предоставлено",
      "The final report will be shared tomorrow.",
    ],
  ]),
  readingTitle: "Implementation status",
  reading:
    "The production environment has been configured, and user access has been provisioned for the pilot group. The new CRM connector is currently being tested with anonymised records. Two mapping issues were identified yesterday and were assigned to the integration vendor. No client data will be migrated until the security review is completed. After that review, a controlled migration will be performed and the results will be checked at the final quality gate. The go-live decision will be made by the steering committee.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "User access ___ (provision) by IT every morning."',
      answer: "is provisioned",
      explanation:
        "Регулярный процесс: Present Simple passive = is + participle.",
      subcategory: "present-passive",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Two mapping issues ___ (identify) yesterday."',
      answer: "were identified",
      explanation:
        "Yesterday требует Past Simple; plural issues — were identified.",
      subcategory: "past-passive",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "The security review ___ (complete)." (present perfect passive)',
      answer: "has been completed",
      explanation: "Present Perfect passive: has been + participle.",
      subcategory: "perfect-passive",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct the verb phrase: "The report will shared tomorrow."',
      answer: "will be shared",
      explanation: "Modal/future passive требует be перед participle.",
      subcategory: "modal-passive",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "The connector is testing now." B) "The connector is being tested now."',
      answer: "B",
      accepted: ["b"],
      explanation: "Текущий процесс над объектом: is being tested.",
      subcategory: "continuous-passive",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "No data can ___ (migrate) before approval."',
      answer: "be migrated",
      explanation: "После modal: be + past participle.",
      subcategory: "modal-passive",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Transform to passive: "Legal approved the design."',
      answer: "The design was approved by Legal.",
      accepted: ["The design was approved."],
      explanation:
        "Объект становится подлежащим; Past Simple passive = was approved.",
      subcategory: "active-to-passive",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The results ___ (check) at every quality gate."',
      answer: "are checked",
      explanation: "Повторяющийся процесс во множественном числе: are checked.",
      subcategory: "present-passive",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rewrite as a neutral implementation update using passive voice: "Our vendor found two issues and our engineers fixed one."',
      sample: "Two issues were identified, and one has already been resolved.",
      criteria:
        "пассив корректно фокусирует результат, времена отражают завершённое обнаружение и актуальный результат, смысл сохранён.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Transform this process description into passive voice: "IT provisions access, then the team tests the connector."',
      sample:
        "Access is provisioned by IT, after which the connector is tested by the project team.",
      criteria:
        "оба действия преобразованы в пассив, порядок процесса ясен, participles корректны.",
    },
  ],
  writingPrompt:
    "Write a neutral implementation update describing what has been completed, what is being tested, and what will be done before go-live.",
  writingRequirements: [
    "Используйте минимум четыре пассивные конструкции.",
    "Включите Present Perfect, Present Continuous и future/modal passive.",
    "Назовите issue, quality gate и sign-off.",
    "Не скрывайте владельца там, где он важен.",
  ],
});

const relativeClauses = createLesson({
  slug: "relative-clauses",
  topic: "relative-clauses",
  title: "Relative Clauses",
  practiceTitle: "Practice: tools, roles, and requirements",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Определительные конструкции",
      body: "Relative clauses добавляют информацию о человеке, предмете, месте или требовании. Defining clause необходима для идентификации и не отделяется запятыми; non-defining даёт дополнительный комментарий и выделяется запятыми.",
    },
    {
      heading: "Местоимения",
      items: [
        "who — люди; which — предметы; that — люди/предметы в defining clauses.",
        "whose — принадлежность; where — место или среда.",
        "The tool that supports audit logs meets the requirement.",
      ],
    },
    {
      heading: "Запятые и пропуск",
      body: "В non-defining clauses that не используется. Объектное who/which/that можно опустить в defining clause: The tool (that) we tested. Подлежащее опускать нельзя.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не ставьте запятые вокруг информации, нужной для выбора объекта.",
        "Не используйте what вместо which/that после существительного.",
        "После whose сразу идёт существительное: whose API supports SSO.",
      ],
    },
    {
      heading: "Запомните",
      body: "Сначала решите, необходима ли информация для идентификации; затем выберите местоимение и пунктуацию.",
    },
  ],
  vocabulary: vocabulary([
    [
      "vendor",
      "поставщик",
      "We selected a vendor whose platform supports SSO.",
    ],
    [
      "selection criteria",
      "критерии выбора",
      "The criteria that matter most are security and usability.",
    ],
    [
      "integration capability",
      "возможность интеграции",
      "The capability that we tested was CRM synchronisation.",
    ],
    [
      "decision maker",
      "лицо, принимающее решение",
      "The decision maker who owns the budget joined the call.",
    ],
    [
      "subject-matter expert",
      "предметный эксперт",
      "A subject-matter expert who understands exceptions reviewed the design.",
    ],
    [
      "sandbox",
      "изолированная тестовая среда",
      "The sandbox where we tested the tool contains synthetic data.",
    ],
    [
      "feature set",
      "набор функций",
      "The feature set, which is still evolving, covers core workflows.",
    ],
    [
      "interoperability",
      "совместимость систем",
      "Interoperability is a requirement that cannot be postponed.",
    ],
    [
      "service-level agreement",
      "соглашение об уровне сервиса",
      "The SLA that the vendor proposed is acceptable.",
    ],
    [
      "procurement team",
      "отдел закупок",
      "The procurement team, which leads negotiation, needs the estimate.",
    ],
    [
      "the option that…",
      "вариант, который…",
      "Choose the option that offers stronger governance.",
    ],
    [
      "a stakeholder who…",
      "заинтересованное лицо, которое…",
      "We need a stakeholder who can approve access.",
    ],
    [
      "a platform whose…",
      "платформа, чья…",
      "We need a platform whose logs are exportable.",
    ],
    [
      "the environment where…",
      "среда, где…",
      "This is the environment where the pilot will run.",
    ],
    [
      "which means that…",
      "что означает, что…",
      "The API is rate-limited, which means that batching is required.",
    ],
  ]),
  readingTitle: "Selecting an AI platform",
  reading:
    "The client needs a platform that can connect to its CRM and export a complete audit trail. The procurement lead, who joined the evaluation last week, also wants predictable pricing. One vendor offers a sandbox where the team can test integrations without real customer data. Its platform, which already supports the required identity provider, has the shortest implementation time. Another vendor has a stronger analytics module but an API whose rate limits could delay batch processing. The consultants recommend the first option because it meets the requirements that the client classified as mandatory.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "We need a consultant ___ understands LLM evaluation."',
      answer: "who",
      accepted: ["that"],
      explanation: "Для человека в defining clause используется who или that.",
      subcategory: "relative-pronoun",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Choose a platform ___ audit logs are exportable."',
      answer: "whose",
      explanation: "Whose выражает принадлежность: логи платформы.",
      subcategory: "whose",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "This is the sandbox ___ we tested the connector."',
      answer: "where",
      explanation: "Where относится к месту/среде.",
      subcategory: "where",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "The tool, that we selected, supports SSO." B) "The tool, which we selected, supports SSO."',
      answer: "B",
      accepted: ["b"],
      explanation: "В non-defining clause после запятой that не используется.",
      subcategory: "non-defining",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Join with "that": "The requirement is mandatory. It concerns audit logging."',
      answer: "The requirement that concerns audit logging is mandatory.",
      explanation: "Defining clause без запятых идентифицирует требование.",
      subcategory: "defining-clause",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The API is rate-limited, ___ may delay processing."',
      answer: "which",
      explanation:
        "Which после запятой комментирует всю предыдущую информацию.",
      subcategory: "comment-clause",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "The vendor what we assessed" B) "The vendor that we assessed"',
      answer: "B",
      accepted: ["b"],
      explanation: "После существительного нужен that/which, не what.",
      subcategory: "relative-pronoun",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Remove the optional relative pronoun: "The tool that we tested met the threshold."',
      answer: "The tool we tested met the threshold.",
      explanation: "That является объектом tested и может быть опущено.",
      subcategory: "pronoun-omission",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Combine into one concise recommendation: "Vendor A supports SSO. We tested Vendor A. Vendor A has the shortest rollout."',
      sample:
        "Vendor A, which we tested, supports SSO and offers the shortest rollout.",
      criteria:
        "relative clause грамматически корректна, повтор устранён, все ключевые факты сохранены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Clarify the role using a defining relative clause: "We need a stakeholder. This person can approve the budget."',
      sample: "We need a stakeholder who can approve the budget.",
      criteria:
        "defining clause идентифицирует нужного человека, who/that используется корректно, смысл сохранён.",
    },
  ],
  writingPrompt:
    "Write a client recommendation comparing two AI tools and describing the people, requirements, and environments involved.",
  writingRequirements: [
    "Используйте who, which/that, whose и where.",
    "Включите defining и non-defining clauses.",
    "Сравните минимум два selection criteria.",
    "Дайте чёткую рекомендацию.",
  ],
});

const reportedSpeech = createLesson({
  slug: "reported-speech",
  topic: "reported-speech",
  title: "Reported Speech",
  practiceTitle: "Practice: stakeholder meeting follow-up",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Передача слов другого человека",
      body: "Reported speech помогает нейтрально зафиксировать решения, вопросы и риски после встречи. После reporting verb в прошлом время обычно сдвигается назад, если сообщение рассматривается с прошлой точки зрения.",
    },
    {
      heading: "Сдвиг времён и указателей",
      items: [
        "present → past: 'We need access' → She said they needed access.",
        "will → would; can → could; have completed → had completed.",
        "today → that day; next week → the following week; here → there.",
      ],
    },
    {
      heading: "Вопросы и просьбы",
      body: "В косвенном вопросе порядок слов утвердительный: He asked when the pilot would start. Просьба: asked + object + to-infinitive; указание: told + object + to-infinitive.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "После said не ставьте прямое дополнение без to: said to us или told us.",
        "В косвенном вопросе нет do/does и инверсии.",
        "Не сдвигайте время механически, если факт всё ещё очевидно актуален; однако сохраняйте последовательность в протоколе.",
      ],
    },
    {
      heading: "Запомните",
      body: "Выберите reporting verb, измените лицо/время/указатели и восстановите прямой порядок слов в вопросах.",
    },
  ],
  vocabulary: vocabulary([
    [
      "meeting minutes",
      "протокол встречи",
      "The meeting minutes recorded every decision.",
    ],
    [
      "action item",
      "пункт действий",
      "She said the action item belonged to IT.",
    ],
    [
      "decision log",
      "журнал решений",
      "The decision log shows why scope changed.",
    ],
    [
      "raise a concern",
      "высказать опасение",
      "Security raised a concern about retention.",
    ],
    [
      "confirm ownership",
      "подтвердить ответственность",
      "The sponsor asked us to confirm ownership.",
    ],
    [
      "clarify a point",
      "уточнить вопрос",
      "The consultant clarified what the vendor had promised.",
    ],
    ["state that", "заявить, что", "The client stated that access was urgent."],
    [
      "point out that",
      "указать, что",
      "Legal pointed out that approval was still pending.",
    ],
    [
      "ask whether",
      "спросить, ли",
      "The sponsor asked whether the pilot could start.",
    ],
    [
      "agree to",
      "согласиться сделать",
      "The vendor agreed to update the estimate.",
    ],
    ["commit to", "обязаться", "IT committed to providing logs."],
    [
      "according to",
      "согласно",
      "According to the sponsor, value must be measurable.",
    ],
    [
      "The client explained that…",
      "Клиент объяснил, что…",
      "The client explained that the workflow was changing.",
    ],
    [
      "We were asked to…",
      "Нас попросили…",
      "We were asked to revise the plan.",
    ],
    [
      "It was agreed that…",
      "Было согласовано, что…",
      "It was agreed that testing would continue.",
    ],
  ]),
  readingTitle: "Notes from a steering meeting",
  reading:
    "At the steering meeting, the sponsor said that the pilot needed a clearer value metric. The security lead explained that her team had completed the initial review but still required the retention policy. The operations manager asked whether training could begin the following week. The consultant replied that the schedule would remain provisional until Legal approved the agreement. The sponsor then asked the project team to update the decision log and told the vendor to provide a revised estimate by Friday.",
  graded: [
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Report: She said, "We need access."',
      answer: "She said that they needed access.",
      accepted: ["She said they needed access."],
      explanation:
        "Present need сдвигается к past needed; we меняется по контексту на they.",
      subcategory: "backshift",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "He said the rollout ___ start the following week." (will)',
      answer: "would",
      explanation: "Will в reported speech обычно сдвигается к would.",
      subcategory: "will-to-would",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Legal said it ___ completed the review." (has)',
      answer: "had",
      explanation: "Present Perfect сдвигается к Past Perfect.",
      subcategory: "perfect-backshift",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "She asked when would the pilot start." B) "She asked when the pilot would start."',
      answer: "B",
      accepted: ["b"],
      explanation: "Косвенный вопрос имеет утвердительный порядок слов.",
      subcategory: "reported-question",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Report the request: "Please update the log," she said to us.',
      answer: "She asked us to update the log.",
      explanation: "Просьба передаётся asked + object + to-infinitive.",
      subcategory: "reported-request",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete with "said" or "told": "The sponsor ___ us to revise the metric."',
      answer: "told",
      explanation: "Перед прямым дополнением us нужен told.",
      subcategory: "say-tell",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Change the time expression: "We will test it next week" → They said they would test it ___.',
      answer: "the following week",
      accepted: ["the next week"],
      explanation: "Next week обычно меняется на the following week.",
      subcategory: "time-reference",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Report the yes/no question: "Can training begin?"',
      answer: "She asked whether training could begin.",
      accepted: ["She asked if training could begin."],
      explanation: "Yes/no вопрос вводится whether/if; can сдвигается к could.",
      subcategory: "reported-question",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Summarise neutrally in reported speech: Sponsor: "The metric is unclear. Update it by Friday."',
      sample:
        "The sponsor said that the metric was unclear and asked the team to update it by Friday.",
      criteria:
        "утверждение и просьба переданы подходящими reporting verbs, backshift и to-infinitive корректны.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Transform the direct question into a professional meeting note: Legal asked, "When will the vendor provide the policy?"',
      sample: "Legal asked when the vendor would provide the policy.",
      criteria:
        "косвенный вопрос имеет прямой порядок слов, will → would, содержание вопроса сохранено.",
    },
  ],
  writingPrompt:
    "Write concise meeting minutes reporting the main statements, one question, one request, and the agreed next actions from an AI project meeting.",
  writingRequirements: [
    "Используйте минимум три reporting verbs.",
    "Передайте один косвенный вопрос.",
    "Передайте просьбу или указание через to-infinitive.",
    "Измените времена и указатели времени последовательно.",
  ],
});

const linkingWords = createLesson({
  slug: "linking-words-cohesion",
  topic: "linking-words-and-cohesion",
  title: "Linking Words & Cohesion",
  practiceTitle: "Practice: cohesive client recommendations",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Логика текста",
      body: "Linking words показывают отношение между идеями: addition, contrast, cause, result, condition и sequence. Они помогают читателю быстро понять аргумент, но не заменяют ясную структуру абзаца.",
    },
    {
      heading: "Основные группы",
      items: [
        "addition: moreover, in addition; contrast: however, whereas, although.",
        "cause/result: because, therefore, as a result; concession: nevertheless.",
        "sequence: first, then, finally; purpose: so that, in order to.",
      ],
    },
    {
      heading: "Пунктуация",
      body: "However и therefore как sentence adverbs обычно отделяются запятой. Although соединяет части одного предложения и не употребляется вместе с but. Because вводит причину, therefore — результат.",
    },
    {
      heading: "Cohesion шире коннекторов",
      body: "Используйте ссылочные слова this approach, these findings и осмысленное повторение ключевых терминов. Не начинайте каждое предложение с нового коннектора.",
    },
    {
      heading: "Запомните",
      body: "Выберите точное логическое отношение и проверьте пунктуацию; один сильный коннектор лучше нескольких лишних.",
    },
  ],
  vocabulary: vocabulary([
    [
      "recommendation",
      "рекомендация",
      "The recommendation follows from the evaluation findings.",
    ],
    ["rationale", "обоснование", "The rationale is based on cost and risk."],
    [
      "key finding",
      "ключевой вывод",
      "One key finding concerns user adoption.",
    ],
    [
      "on the one hand",
      "с одной стороны",
      "On the one hand, customisation offers flexibility.",
    ],
    [
      "on the other hand",
      "с другой стороны",
      "On the other hand, it increases delivery time.",
    ],
    ["however", "однако", "However, the current data is incomplete."],
    [
      "therefore",
      "поэтому",
      "The risk is high; therefore, we recommend a pilot.",
    ],
    ["moreover", "более того", "Moreover, the platform supports audit logs."],
    [
      "nevertheless",
      "тем не менее",
      "The test was limited; nevertheless, it revealed useful patterns.",
    ],
    [
      "whereas",
      "тогда как",
      "Option A is faster, whereas Option B is more flexible.",
    ],
    [
      "as a result",
      "в результате",
      "Adoption rose; as a result, time savings increased.",
    ],
    [
      "in order to",
      "для того чтобы",
      "We need a baseline in order to measure value.",
    ],
    [
      "these findings suggest…",
      "эти выводы указывают…",
      "These findings suggest that the pilot should continue.",
    ],
    [
      "for this reason",
      "по этой причине",
      "For this reason, we advise against immediate scale-up.",
    ],
    [
      "in conclusion",
      "в заключение",
      "In conclusion, a phased rollout offers the best balance.",
    ],
  ]),
  readingTitle: "A recommendation with a clear argument",
  reading:
    "The pilot reduced average handling time by 18%. Moreover, users rated the assistant positively after the second training session. Accuracy remains below the target for complex cases; however, these cases represent only a small part of total volume. A full rollout would create unnecessary risk, whereas a second pilot phase would allow the team to improve routing and collect stronger evidence. Therefore, we recommend expanding the pilot to one additional department. This approach preserves momentum while keeping human review in place. In conclusion, controlled expansion offers the strongest balance of value, cost, and risk.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Choose the result linker: "Accuracy improved; ___, the team approved expansion."',
      answer: "therefore",
      accepted: ["as a result"],
      explanation: "Therefore/as a result вводит следствие.",
      subcategory: "result-linker",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Choose the contrast linker: "Option A is faster, ___ Option B is more flexible."',
      answer: "whereas",
      explanation:
        "Whereas сопоставляет два контрастных факта в одном предложении.",
      subcategory: "contrast-linker",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "Although the risk is high, but value is clear." B) "Although the risk is high, value is clear."',
      answer: "B",
      accepted: ["b"],
      explanation: "Although не сочетается с but в одной конструкции.",
      subcategory: "concession",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete with one linker: "The pilot was small. ___, it revealed a critical issue."',
      answer: "Nevertheless",
      accepted: ["However"],
      explanation:
        "Nevertheless/However выражает уступительный контраст и отделяется запятой.",
      subcategory: "sentence-adverb",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the purpose phrase: "We created a baseline ___ measure business value."',
      answer: "in order to",
      accepted: ["to"],
      explanation: "In order to + infinitive выражает цель.",
      subcategory: "purpose",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose the cause, A or B: "We delayed launch ___ security approval was pending." A) because B) therefore',
      answer: "A",
      accepted: ["a", "because"],
      explanation: "Because вводит причину внутри предложения.",
      subcategory: "cause",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete the addition: "The tool is accurate. ___, it is easy to audit."',
      answer: "Moreover",
      accepted: ["In addition"],
      explanation: "Moreover/In addition добавляет поддерживающий аргумент.",
      subcategory: "addition",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Add the missing punctuation word-for-word: "The data is limited however the trend is positive."',
      answer: "The data is limited; however, the trend is positive.",
      accepted: ["The data is limited. However, the trend is positive."],
      explanation:
        "However соединяет самостоятельные части через точку или точку с запятой и отделяется запятой.",
      subcategory: "punctuation",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Improve cohesion with suitable linkers: "The pilot saved time. Accuracy was below target. We recommend another phase."',
      sample:
        "The pilot saved time; however, accuracy remained below target. Therefore, we recommend another phase.",
      criteria:
        "контраст и вывод связаны точными коннекторами, пунктуация корректна, смысл не изменён.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        "Summarise as a balanced two-sentence recommendation using whereas and for this reason.",
      sample:
        "A full rollout would deliver value quickly, whereas a second pilot would limit risk. For this reason, we recommend controlled expansion.",
      criteria:
        "whereas создаёт ясное сравнение, for this reason вводит логичный вывод, рекомендация профессиональна.",
    },
  ],
  writingPrompt:
    "Write a cohesive client recommendation based on mixed pilot results, balancing business value, quality, and rollout risk.",
  writingRequirements: [
    "Используйте коннекторы addition, contrast, cause/result и concession.",
    "Организуйте текст в логичные абзацы.",
    "Используйте this approach/these findings для связи предложений.",
    "Завершите кратким conclusion.",
  ],
});

const gerundsInfinitives = createLesson({
  slug: "gerunds-infinitives",
  topic: "gerunds-and-infinitives",
  title: "Gerunds & Infinitives",
  practiceTitle: "Practice: adoption and continuous improvement",
  sources: cambridgeStructures,
  theory: [
    {
      heading: "Выбор формы",
      body: "После одних глаголов нужен gerund (-ing), после других — to-infinitive. Предлоги всегда требуют -ing. В рекомендациях эти модели часто встречаются с avoid, consider, recommend, decide, plan и agree.",
    },
    {
      heading: "Основные модели",
      items: [
        "avoid/consider/suggest + -ing: We suggest extending the pilot.",
        "decide/plan/agree/need + to-infinitive: We plan to automate routing.",
        "adjective + to-infinitive: It is important to monitor quality.",
      ],
    },
    {
      heading: "Изменение значения",
      body: "Stop doing означает прекратить действие; stop to do — остановиться, чтобы сделать другое. Remember doing — помнить прошлое действие; remember to do — не забыть выполнить действие.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не «recommend to expand», а «recommend expanding» или «recommend that we expand».",
        "После before/by/without используйте -ing.",
        "Не ставьте -ing после decide: «decide to proceed».",
      ],
    },
    {
      heading: "Запомните",
      body: "Учите глагол вместе с его моделью и отдельно проверяйте форму после предлога.",
    },
  ],
  vocabulary: vocabulary([
    [
      "user adoption",
      "принятие инструмента пользователями",
      "Improving user adoption requires listening to feedback.",
    ],
    [
      "enablement",
      "поддержка и обучение пользователей",
      "We plan to strengthen enablement.",
    ],
    [
      "feedback loop",
      "цикл обратной связи",
      "The team created a feedback loop for improving prompts.",
    ],
    [
      "continuous improvement",
      "непрерывное улучшение",
      "Continuous improvement depends on measuring outcomes.",
    ],
    [
      "usage guideline",
      "руководство по использованию",
      "Users agreed to follow the usage guideline.",
    ],
    [
      "office hours",
      "открытые консультационные часы",
      "We recommend offering weekly office hours.",
    ],
    [
      "prompt library",
      "библиотека промптов",
      "The client decided to maintain a prompt library.",
    ],
    [
      "adoption barrier",
      "барьер внедрения",
      "Avoiding technical language can remove an adoption barrier.",
    ],
    [
      "champion network",
      "сеть внутренних амбассадоров",
      "The team plans to build a champion network.",
    ],
    [
      "refresher training",
      "повторное обучение",
      "Managers suggested running refresher training.",
    ],
    [
      "consider doing",
      "рассмотреть возможность сделать",
      "Consider adding examples to the guidance.",
    ],
    [
      "agree to do",
      "согласиться сделать",
      "The vendor agreed to simplify login.",
    ],
    ["avoid doing", "избегать действия", "Avoid launching without support."],
    [
      "by doing",
      "посредством действия",
      "We can improve trust by explaining limitations.",
    ],
    [
      "The next step is to…",
      "Следующий шаг — …",
      "The next step is to analyse feedback.",
    ],
  ]),
  readingTitle: "Improving adoption after launch",
  reading:
    "After launching the assistant, the client noticed that many employees avoided using it for complex tasks. The project team decided to interview users and discovered that they needed more practical examples. Consultants recommended creating a prompt library and offering weekly office hours. They also suggested asking change champions to demonstrate real workflows. By collecting questions and updating guidance every week, the client can build a stronger feedback loop. The team plans to review adoption monthly and has agreed to run refresher training when usage falls.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We recommend ___ (extend) the pilot."',
      answer: "extending",
      explanation: "Recommend обычно принимает gerund.",
      subcategory: "gerund-after-verb",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The client decided ___ (create) a prompt library."',
      answer: "to create",
      explanation: "После decide используется to-infinitive.",
      subcategory: "infinitive-after-verb",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We can build trust by ___ (explain) the limits."',
      answer: "explaining",
      explanation: "После предлога by нужен gerund.",
      subcategory: "gerund-after-preposition",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "Avoid to launch without support." B) "Avoid launching without support."',
      answer: "B",
      accepted: ["b"],
      explanation: "Avoid принимает форму -ing.",
      subcategory: "gerund-after-verb",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct the phrase: "The vendor agreed simplifying login."',
      answer: "agreed to simplify",
      explanation: "Agree требует to-infinitive.",
      subcategory: "infinitive-after-verb",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "It is important ___ (monitor) adoption."',
      answer: "to monitor",
      explanation: "После adjective important используется to-infinitive.",
      subcategory: "adjective-infinitive",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B for "прекратить использование": A) "stop using the tool" B) "stop to use the tool"',
      answer: "A",
      accepted: ["a"],
      explanation:
        "Stop doing = прекратить действие; stop to do = остановиться ради другого действия.",
      subcategory: "meaning-change",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Remember ___ (send) the usage report tomorrow."',
      answer: "to send",
      explanation: "Remember to do означает не забыть будущее действие.",
      subcategory: "meaning-change",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rephrase as two professional recommendations using a gerund and an infinitive: "More training. Build a prompt library."',
      sample:
        "We recommend providing more training and advise the team to build a prompt library.",
      criteria:
        "одна корректная gerund-модель и одна to-infinitive-модель, рекомендации ясны и смысл сохранён.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Transform into an improvement statement using by + gerund: "Explain limitations. This will increase trust."',
      sample:
        "The client can increase trust by explaining the tool's limitations clearly.",
      criteria:
        "by + gerund выражает способ достижения результата, причинная связь и смысл сохранены.",
    },
  ],
  writingPrompt:
    "Write a post-rollout recommendation explaining how the client can improve adoption and maintain a continuous feedback loop.",
  writingRequirements: [
    "Используйте минимум четыре gerunds после глаголов или предлогов.",
    "Используйте минимум четыре to-infinitives.",
    "Включите recommend, avoid, decide/plan и agree.",
    "Предложите обучение, feedback loop и способ измерять adoption.",
  ],
});

const advancedSources = [
  "Cambridge Dictionary — English Grammar",
  "British Council — LearnEnglish Grammar (B2)",
  "Oxford Learner's Dictionaries — grammar reference",
];

const thirdConditional = createLesson({
  slug: "third-conditional",
  topic: "third-conditional",
  title: "Third Conditional",
  practiceTitle: "Practice: analysing an AI incident",
  sources: advancedSources,
  theory: [
    {
      heading: "Когда использовать",
      body: "Third Conditional описывает нереальное прошлое: условие уже не произошло, поэтому результат тоже нельзя изменить. В post-mortem эта конструкция помогает анализировать причины без утверждений о реальном ходе событий.",
    },
    {
      heading: "Форма",
      items: [
        "If + past perfect, would have + past participle.",
        "If we had tested the fallback, we would have detected the defect.",
        "Could/might have передают возможность или менее уверенный результат.",
      ],
    },
    {
      heading: "Порядок частей",
      body: "Части можно менять местами. Запятая нужна, когда if-clause стоит первой: If the alert had fired, we would have responded. We would have responded if the alert had fired.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не используйте would в if-clause: if we had known, не if we would have known.",
        "После had нужен past participle: had gone, had been, had seen.",
        "Не подменяйте факты обвинением: формулируйте вывод и corrective action нейтрально.",
      ],
    },
    {
      heading: "Запомните",
      body: "Past perfect задаёт нереальное условие в прошлом; would/could/might have + V3 показывает его воображаемое следствие.",
    },
  ],
  vocabulary: vocabulary([
    [
      "incident post-mortem",
      "разбор инцидента",
      "The incident post-mortem identified three control gaps.",
    ],
    [
      "root cause",
      "коренная причина",
      "A missing validation rule was the root cause.",
    ],
    [
      "contributing factor",
      "сопутствующий фактор",
      "Limited monitoring was a contributing factor.",
    ],
    [
      "fallback mechanism",
      "резервный механизм",
      "The fallback mechanism did not activate.",
    ],
    [
      "audit trail",
      "журнал аудита",
      "The audit trail showed every model decision.",
    ],
    [
      "severity level",
      "уровень серьёзности",
      "The team classified the event as severity level two.",
    ],
    [
      "contain an incident",
      "локализовать инцидент",
      "Earlier detection could have contained the incident.",
    ],
    [
      "trigger an alert",
      "вызвать оповещение",
      "A higher error rate should trigger an alert.",
    ],
    [
      "corrective action",
      "корректирующее действие",
      "Each corrective action has an owner.",
    ],
    [
      "prevent a recurrence",
      "предотвратить повторение",
      "The new test should prevent a recurrence.",
    ],
    [
      "Had we known…",
      "Если бы мы знали…",
      "Had we known about the drift, we would have paused deployment.",
    ],
    [
      "If the control had worked…",
      "Если бы контроль сработал…",
      "If the control had worked, fewer records would have been affected.",
    ],
    [
      "would have detected",
      "обнаружили бы",
      "A canary test would have detected the issue.",
    ],
    [
      "might have avoided",
      "возможно, избежали бы",
      "We might have avoided the outage with a rollback plan.",
    ],
    [
      "lessons learned",
      "извлечённые уроки",
      "The lessons learned informed the next release.",
    ],
  ]),
  readingTitle: "Post-mortem: incorrect document routing",
  reading:
    "A document-routing model sent 8% of incoming claims to the wrong queue after a Friday release. The team contained the incident within two hours and restored the previous model. The root cause was a mapping change that had not been included in the staging data. If the staging set had represented the new mapping, the validation test would have failed. Monitoring also focused on latency rather than routing accuracy. A distribution alert might have exposed the change within minutes. The post-mortem assigns two corrective actions: update representative test data and add a routing-quality alert. Had these controls existed before the release, the team could have prevented most of the manual rework.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If we ___ (include) the mapping, the test would have failed."',
      answer: "had included",
      explanation: "В if-clause нужен Past Perfect.",
      subcategory: "if-clause",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The alert would have ___ (detect) the shift."',
      answer: "detected",
      explanation: "После would have используется V3.",
      subcategory: "result-clause",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "If we had known, we would pause." B) "If we had known, we would have paused."',
      answer: "B",
      accepted: ["b"],
      explanation: "Нереальный прошлый результат требует would have + V3.",
      subcategory: "form",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct: "If the monitor would have worked, we had responded."',
      answer: "If the monitor had worked, we would have responded.",
      explanation: "Had + V3 в условии; would have + V3 в результате.",
      subcategory: "form",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete with possibility: "A canary release ___ have prevented the outage."',
      answer: "might",
      accepted: ["could"],
      explanation: "Might/could have выражает возможный прошлый результат.",
      subcategory: "modals",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "Had the team tested the fallback, it ___ have activated."',
      answer: "would",
      explanation: "Had the team tested = inverted if-clause.",
      subcategory: "inversion",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt: 'Choose the correct form: A) "had went" B) "had gone"',
      answer: "B",
      accepted: ["b"],
      explanation: "Past participle от go — gone.",
      subcategory: "past-participle",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete the result: "If the logs had been complete, ..." Use detect.',
      answer: "we would have detected the root cause.",
      accepted: ["We would have detected the root cause"],
      explanation: "Результат строится с would have + detected.",
      subcategory: "result-clause",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Write a neutral third-conditional lesson from this fact: "The team skipped load testing; the service failed."',
      sample:
        "If the team had completed load testing, it might have detected the capacity limit before the service failed.",
      criteria:
        "third conditional, нейтральный post-mortem register, причинная связь и исходный смысл сохранены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Rewrite with inverted Had: "If the alert had fired, we would have contained the incident sooner."',
      sample:
        "Had the alert fired, we would have contained the incident sooner.",
      criteria:
        "корректная инверсия Had + subject + V3, результат и смысл сохранены.",
    },
  ],
  writingPrompt:
    "Write a concise AI incident post-mortem covering impact, root cause, counterfactual analysis, and corrective actions.",
  writingRequirements: [
    "Используйте минимум четыре third conditionals.",
    "Включите would have, could have и might have.",
    "Разделите root cause и contributing factors.",
    "Предложите минимум две corrective actions.",
  ],
});

const mixedConditionals = createLesson({
  slug: "mixed-conditionals",
  topic: "mixed-conditionals",
  title: "Mixed Conditionals",
  practiceTitle: "Practice: designing an AI evaluation framework",
  sources: advancedSources,
  theory: [
    {
      heading: "Зачем смешивать времена",
      body: "Mixed Conditionals связывают условие и результат из разных периодов. В evaluation framework они показывают, как прошлое решение влияет на текущую надёжность или как постоянное свойство объясняет прошлый результат.",
    },
    {
      heading: "Прошлое → настоящее",
      items: [
        "If + past perfect, would + base verb.",
        "If we had defined thresholds earlier, the framework would be reliable now.",
      ],
    },
    {
      heading: "Настоящее → прошлое",
      items: [
        "If + past simple, would have + past participle.",
        "If the benchmark were representative, it would have revealed the bias.",
      ],
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Определите реальное время каждой части до выбора формы.",
        "Не ставьте would в if-clause.",
        "Were допустимо со всеми лицами в формальном гипотетическом условии.",
      ],
    },
    {
      heading: "Запомните",
      body: "Форма каждой части отражает её собственное время: прошлое условие может иметь нынешний результат, а нынешнее состояние — прошлое следствие.",
    },
  ],
  vocabulary: vocabulary([
    [
      "evaluation framework",
      "система оценки",
      "The evaluation framework covers quality and safety.",
    ],
    [
      "success criterion",
      "критерий успеха",
      "Each success criterion has a threshold.",
    ],
    [
      "benchmark set",
      "набор контрольных примеров",
      "The benchmark set reflects real requests.",
    ],
    [
      "acceptance threshold",
      "порог приёмки",
      "Accuracy exceeded the acceptance threshold.",
    ],
    [
      "representative sample",
      "репрезентативная выборка",
      "We need a representative sample of edge cases.",
    ],
    [
      "false positive",
      "ложноположительный результат",
      "The test tracks every false positive.",
    ],
    [
      "failure mode",
      "сценарий отказа",
      "Prompt injection is one failure mode.",
    ],
    [
      "human baseline",
      "человеческий базовый уровень",
      "The model outperformed the human baseline on speed.",
    ],
    [
      "weighted score",
      "взвешенная оценка",
      "Safety has the highest weighted score.",
    ],
    [
      "trade-off",
      "компромисс",
      "The dashboard makes the cost-quality trade-off visible.",
    ],
    [
      "If we had defined…",
      "Если бы мы определили…",
      "If we had defined ownership, the process would be clearer now.",
    ],
    [
      "would be more reliable now",
      "был бы надёжнее сейчас",
      "The result would be more reliable now.",
    ],
    [
      "If the sample were…",
      "Если бы выборка была…",
      "If the sample were balanced, it would have exposed the gap.",
    ],
    [
      "would have revealed",
      "выявил бы",
      "A multilingual test would have revealed the weakness.",
    ],
    [
      "evidence-based decision",
      "решение на основе данных",
      "The framework supports an evidence-based decision.",
    ],
  ]),
  readingTitle: "Why the first evaluation failed",
  reading:
    "A retailer is redesigning its evaluation framework after an inconclusive pilot. The original benchmark contained mostly short English questions, although the production system serves multilingual, multi-step requests. If the team had sampled production traffic earlier, its benchmark would be more representative now. The scoring model also gives equal weight to speed and safety. If safety were the primary criterion, the previous vendor would not have passed the pilot. The revised framework separates quality, safety, latency, and cost, and defines an acceptance threshold for each dimension. It also compares model performance with a human baseline. These changes will make the next recommendation traceable and evidence-based.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If we had sampled traffic, the set ___ (be) stronger now."',
      answer: "would be",
      explanation: "Прошлое условие имеет настоящий результат.",
      subcategory: "past-present",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If the sample were balanced, it ___ (reveal) the issue last month."',
      answer: "would have revealed",
      explanation: "Настоящее свойство объясняет прошлый результат.",
      subcategory: "present-past",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "If we had set thresholds, decisions would be clearer now." B) "If we set thresholds, decisions would have been clearer now."',
      answer: "A",
      accepted: ["a"],
      explanation:
        "A корректно связывает прошлое условие с настоящим результатом.",
      subcategory: "time-reference",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Correct: "If the benchmark would be realistic, it had caught the gap."',
      answer: "If the benchmark were realistic, it would have caught the gap.",
      explanation: "Were в условии, would have + V3 в прошлом результате.",
      subcategory: "present-past",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If ownership had been clear, we ___ not be revising the rubric now."',
      answer: "would",
      explanation: "Would + base verb выражает нынешний результат.",
      subcategory: "past-present",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt:
        'Complete: "If cost were less important, we ___ have selected the safer model."',
      answer: "would",
      explanation: "Настоящее условие связано с прошлым выбором.",
      subcategory: "present-past",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose the formal hypothetical form: A) "If the metric was reliable" B) "If the metric were reliable"',
      answer: "B",
      accepted: ["b"],
      explanation: "Were предпочтительно в формальной гипотезе.",
      subcategory: "were",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt:
        'Complete: "If we had documented the baseline, ..." Use be / easier / now.',
      answer: "the comparison would be easier now.",
      accepted: ["The comparison would be easier now"],
      explanation: "Настоящий результат: would be.",
      subcategory: "past-present",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Connect the past decision to the present: "We did not define safety thresholds. The recommendation is weak now."',
      sample:
        "If we had defined safety thresholds, the recommendation would be stronger now.",
      criteria:
        "past-to-present mixed conditional, смысл сохранён, профессиональный register.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Connect a current framework weakness to a past result: "The sample is narrow. It did not identify multilingual failures."',
      sample:
        "If the sample were broader, it would have identified the multilingual failures.",
      criteria:
        "present-to-past mixed conditional, грамматическая точность и причинная связь.",
    },
  ],
  writingPrompt:
    "Write a recommendation for redesigning an AI evaluation framework after a weak pilot.",
  writingRequirements: [
    "Используйте минимум четыре mixed conditionals обоих типов.",
    "Определите quality, safety, latency и cost criteria.",
    "Укажите thresholds и representative sample.",
    "Объясните влияние прошлых решений на текущую оценку.",
  ],
});

const causative = createLesson({
  slug: "causative",
  topic: "causative-have-get-something-done",
  title: "Causative: Have/Get Something Done",
  practiceTitle: "Practice: running a vendor comparison workshop",
  sources: advancedSources,
  theory: [
    {
      heading: "Значение",
      body: "Have/get something done показывает, что работу выполняет другой человек или поставщик по нашей организации. В vendor workshop форма точно распределяет заказанную проверку и исполнителя, не фокусируясь на нём.",
    },
    {
      heading: "Форма",
      items: [
        "have/get + object + past participle",
        "We had the vendors demonstrate their controls. / We had the controls demonstrated.",
        "Get обычно менее формально и иногда подчёркивает усилие.",
      ],
    },
    {
      heading: "Времена и вопросы",
      body: "Изменяется have/get: we are having the API tested; we got the report translated; will you have the pricing reviewed? Past participle остаётся неизменным.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не используйте инфинитив после объекта: have the contract reviewed.",
        "Не путайте have someone do (активный исполнитель) и have something done (результат услуги).",
        "В формальном отчёте чаще выбирайте have, а не get.",
      ],
    },
    {
      heading: "Запомните",
      body: "Если ваша команда организует услугу, но не выполняет её сама, используйте have/get + object + V3.",
    },
  ],
  vocabulary: vocabulary([
    [
      "vendor shortlist",
      "короткий список поставщиков",
      "We had the vendor shortlist approved.",
    ],
    [
      "proof of concept",
      "проверка концепции",
      "Each vendor ran a proof of concept.",
    ],
    [
      "due diligence",
      "комплексная проверка",
      "The client had legal due diligence completed.",
    ],
    [
      "pricing model",
      "модель ценообразования",
      "We are getting the pricing model reviewed.",
    ],
    [
      "reference check",
      "проверка рекомендаций",
      "Have the reference checks documented.",
    ],
    [
      "security questionnaire",
      "опросник по безопасности",
      "The vendors completed a security questionnaire.",
    ],
    [
      "solution demo",
      "демонстрация решения",
      "We had each solution demo recorded.",
    ],
    [
      "scorecard",
      "оценочная карта",
      "The scorecard compares mandatory criteria.",
    ],
    [
      "integration effort",
      "трудозатраты на интеграцию",
      "Integration effort affects the final score.",
    ],
    [
      "total cost of ownership",
      "совокупная стоимость владения",
      "Finance validated the total cost of ownership.",
    ],
    [
      "have the proposal reviewed",
      "организовать проверку предложения",
      "We will have the proposal reviewed by Legal.",
    ],
    [
      "get the sandbox configured",
      "добиться настройки песочницы",
      "Can we get the sandbox configured by Tuesday?",
    ],
    [
      "have a vendor demonstrate",
      "попросить поставщика продемонстрировать",
      "We had each vendor demonstrate audit logging.",
    ],
    [
      "commission an assessment",
      "заказать оценку",
      "The client commissioned an independent assessment.",
    ],
    [
      "make a like-for-like comparison",
      "провести сопоставимое сравнение",
      "The scorecard enables a like-for-like comparison.",
    ],
  ]),
  readingTitle: "Preparing a fair vendor workshop",
  reading:
    "The consulting team is preparing a comparison workshop for three AI platform vendors. Before the session, it will have each sandbox configured with the same dataset. It is also getting the security questionnaires reviewed by the client's risk team. During the workshop, the consultants will have each vendor demonstrate identity management, audit logging, and model monitoring. They will not ask vendors to present generic slides. Instead, every supplier must complete the same use cases while observers record results in a shared scorecard. Afterward, the client will have reference checks completed and the total cost of ownership validated by Finance. This process should produce a like-for-like comparison rather than three unrelated sales presentations.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We will have the sandbox ___ (configure)."',
      answer: "configured",
      explanation: "После object используется V3.",
      subcategory: "form",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "The client is getting the references ___ (check)."',
      answer: "checked",
      explanation: "Get + object + V3.",
      subcategory: "get-causative",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose A or B: A) "have the contract review" B) "have the contract reviewed"',
      answer: "B",
      accepted: ["b"],
      explanation: "Нужен past participle reviewed.",
      subcategory: "form",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Rewrite causatively: "Legal will review our proposal."',
      answer: "We will have our proposal reviewed by Legal.",
      accepted: ["We will get our proposal reviewed by Legal"],
      explanation: "Заказанная проверка выражается causative.",
      subcategory: "transformation",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Yesterday, we ___ the demo recorded."',
      answer: "had",
      accepted: ["got"],
      explanation: "Past Simple меняет have/get.",
      subcategory: "tense",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose the more formal option: A) "We had the assessment completed." B) "We got the assessment done."',
      answer: "A",
      accepted: ["a"],
      explanation: "Have обычно формальнее get.",
      subcategory: "register",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete the question: "Will you ___ the pricing validated?"',
      answer: "have",
      accepted: ["get"],
      explanation: "После will нужна базовая форма.",
      subcategory: "question",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct: "We are having the API to test."',
      answer: "We are having the API tested.",
      explanation: "Causative требует object + V3 без to.",
      subcategory: "form",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        'Reformulate two workshop actions to show outsourced work: "Risk reviews security. Finance validates cost."',
      sample:
        "We are having security reviewed by Risk and the cost model validated by Finance.",
      criteria:
        "минимум две корректные causative structures, исполнители и смысл сохранены.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        "Write a polite request using get something done for sandbox setup by Friday.",
      sample: "Could we get the vendor sandbox configured by Friday?",
      criteria: "get + object + V3, срок, вежливый профессиональный register.",
    },
  ],
  writingPrompt:
    "Write a workshop plan explaining how your team will organize a fair comparison of three AI vendors.",
  writingRequirements: [
    "Используйте минимум пять causative forms в разных временах.",
    "Упомяните sandbox, security review, demo и scorecard.",
    "Различайте действия консультантов и заказанные проверки.",
    "Объясните, как обеспечить like-for-like comparison.",
  ],
});

function compactLesson(config: Omit<LessonSpec, "sources">): Lesson {
  return createLesson({ ...config, sources: advancedSources });
}

const quantifiersApproximation = compactLesson({
  slug: "quantifiers-approximation",
  topic: "quantifiers-and-approximation",
  title: "Quantifiers & Approximation",
  practiceTitle: "Practice: AI governance metrics",
  theory: [
    {
      heading: "Исчисляемость",
      body: "Many/few употребляются с исчисляемыми, much/little — с неисчисляемыми; a lot of подходит обоим типам.",
    },
    {
      heading: "Приблизительные данные",
      items: [
        "approximately/roughly/around + number",
        "just over/under; nearly; up to",
        "A small proportion of requests require review.",
      ],
    },
    {
      heading: "Доля",
      body: "Most означает большинство без of; most of — долю конкретной группы. Each/every требуют существительное в единственном числе.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "information, evidence и traffic неисчисляемы.",
        "few/little = недостаточно; a few/a little = некоторое количество.",
        "Не выдавайте приблизительное число за точное.",
      ],
    },
    {
      heading: "Запомните",
      body: "Сначала определите исчисляемость, затем степень точности и только после этого выбирайте quantifier.",
    },
  ],
  vocabulary: vocabulary([
    [
      "governance board",
      "совет по управлению",
      "The governance board reviews high-risk uses.",
    ],
    [
      "policy coverage",
      "охват политикой",
      "Policy coverage is nearly complete.",
    ],
    ["risk tier", "уровень риска", "Each use case has a risk tier."],
    [
      "control owner",
      "владелец контроля",
      "Every control owner reports quarterly.",
    ],
    [
      "compliance evidence",
      "свидетельства соответствия",
      "Little compliance evidence was available.",
    ],
    [
      "exception rate",
      "доля исключений",
      "The exception rate is just under 4%.",
    ],
    [
      "a large proportion of",
      "значительная доля",
      "A large proportion of cases are low risk.",
    ],
    [
      "the vast majority of",
      "подавляющее большинство",
      "The vast majority of controls passed.",
    ],
    ["a handful of", "небольшое число", "A handful of exceptions remain."],
    ["roughly", "примерно", "Roughly 200 users need training."],
    ["just over", "чуть больше", "Just over half the models are registered."],
    ["nearly", "почти", "Nearly all owners responded."],
    ["up to", "до", "Reviews can take up to ten days."],
    ["very little", "очень мало", "Very little evidence supports the claim."],
    [
      "most of the",
      "большинство конкретных",
      "Most of the high-risk systems were reviewed.",
    ],
  ]),
  readingTitle: "A governance dashboard update",
  reading:
    "The governance board now tracks 42 AI use cases. Roughly two thirds are low risk, while just under a quarter require enhanced review. Most of the high-risk systems have named control owners, but a handful of teams have provided very little compliance evidence. Nearly all production models are registered, and every new use case receives an initial risk tier. The board expects policy coverage to reach approximately 95% this quarter. However, up to six legacy systems may need extra time because little reliable documentation exists.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "___ evidence is available." (small amount)',
      answer: "Little",
      accepted: ["little"],
      explanation: "Evidence неисчисляемо.",
      subcategory: "uncountable",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "___ use cases need review." (large number)',
      answer: "Many",
      accepted: ["many"],
      explanation: "Use cases исчисляемы.",
      subcategory: "countable",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt: "Choose: A) most systems B) most of systems",
      answer: "A",
      accepted: ["a"],
      explanation: "Без определителя используется most.",
      subcategory: "most",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "___ of the registered models passed."',
      answer: "Most",
      accepted: ["most"],
      explanation: "Перед the нужна конструкция most of.",
      subcategory: "most-of",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Replace with an approximation: "101 users" (use just over).',
      answer: "just over 100 users",
      explanation: "Just over показывает небольшое превышение.",
      subcategory: "approximation",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        "Choose for some positive amount: A) few controls B) a few controls",
      answer: "B",
      accepted: ["b"],
      explanation: "A few = некоторое количество.",
      subcategory: "few",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "Every control ___ an owner."',
      answer: "has",
      explanation: "Every требует единственного числа.",
      subcategory: "agreement",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct: "many compliance evidence".',
      answer: "much compliance evidence",
      accepted: ["a lot of compliance evidence"],
      explanation: "Evidence неисчисляемо.",
      subcategory: "uncountable",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        "Summarise 48 of 50 compliant systems without claiming exactness.",
      sample: "Nearly all systems are compliant.",
      criteria:
        "уместный approximation/quantifier, точный общий смысл, профессиональный register.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt: "Diplomatically report that only three teams lack evidence.",
      sample:
        "A small number of teams still have very little supporting evidence.",
      criteria:
        "quantifiers для countable и uncountable nouns, дипломатичный тон.",
    },
  ],
  writingPrompt:
    "Write a governance dashboard commentary summarising coverage, risk tiers, exceptions, and evidence gaps.",
  writingRequirements: [
    "Используйте минимум восемь разных quantifiers/approximators.",
    "Различайте countable и uncountable nouns.",
    "Включите доли и приблизительные числа.",
    "Не создавайте ложной точности.",
  ],
});

const articlesBusiness = compactLesson({
  slug: "articles-business-english",
  topic: "articles-in-business-english",
  title: "Articles in Business English",
  practiceTitle: "Practice: security and risk assessment",
  theory: [
    {
      heading: "A/an",
      body: "A/an вводит один неспецифичный исчисляемый объект: a vulnerability, an audit.",
    },
    {
      heading: "The",
      body: "The указывает на уже известный, уникальный в контексте или уточнённый объект: the risk identified yesterday.",
    },
    {
      heading: "Нулевой артикль",
      items: [
        "Неисчисляемые и множественные существительные в общем значении: Security requires evidence.",
        "Названия функций часто без артикля: Legal, Finance; но the legal team.",
      ],
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не пропускайте артикль у singular countable noun.",
        "Не ставьте the перед общим абстрактным понятием.",
        "Выбирайте an по звуку: an SSO issue, a user.",
      ],
    },
    {
      heading: "Запомните",
      body: "Спросите: объект один и новый, конкретный или обобщённый? Это определяет a/an, the или zero article.",
    },
  ],
  vocabulary: vocabulary([
    ["threat model", "модель угроз", "We created a threat model."],
    [
      "attack surface",
      "поверхность атаки",
      "The attack surface includes the API.",
    ],
    ["data leakage", "утечка данных", "Data leakage is a critical risk."],
    ["vulnerability", "уязвимость", "An external test found a vulnerability."],
    ["mitigation", "мера снижения риска", "The mitigation reduces exposure."],
    ["risk register", "реестр рисков", "The risk register has an owner."],
    ["access control", "контроль доступа", "Access control requires testing."],
    [
      "security audit",
      "аудит безопасности",
      "The client commissioned a security audit.",
    ],
    ["likelihood", "вероятность", "The likelihood is low."],
    [
      "impact assessment",
      "оценка влияния",
      "An impact assessment is required.",
    ],
    [
      "the issue identified",
      "выявленная проблема",
      "The issue identified yesterday is resolved.",
    ],
    ["a material risk", "существенный риск", "This is a material risk."],
    [
      "in production",
      "в промышленной среде",
      "The model is not yet in production.",
    ],
    ["under review", "на рассмотрении", "The mitigation is under review."],
    [
      "security by design",
      "безопасность по замыслу",
      "Security by design reduces later rework.",
    ],
  ]),
  readingTitle: "Security assessment summary",
  reading:
    "A security assessment of the proposed assistant identified a material risk: users could place confidential data in an external prompt. The risk is higher in the production environment than in the controlled sandbox. Security recommended an access control, a data-loss prevention rule, and mandatory training. The control must be tested before launch. An independent audit will then verify the mitigation. The assessment also examined model access, retention, and the attack surface of the API. Security by design is now a requirement for the project.",
  graded: [
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "We found ___ vulnerability."',
      answer: "a",
      explanation: "Новый singular countable object.",
      subcategory: "indefinite",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "___ issue found yesterday is fixed."',
      answer: "The",
      accepted: ["the"],
      explanation: "Уточнение делает объект конкретным.",
      subcategory: "definite",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        'Choose the correct option: "___ Security requires evidence." (the / a / an / —)',
      answer: "—",
      accepted: ["-", "zero article", "no article"],
      explanation: "Абстрактное общее понятие без артикля.",
      subcategory: "zero",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt: "Choose: A) a audit B) an audit",
      answer: "B",
      accepted: ["b"],
      explanation: "Audit начинается с гласного звука.",
      subcategory: "a-an",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "___ attack surface of the API is limited."',
      answer: "The",
      accepted: ["the"],
      explanation: "Of-phrase определяет объект.",
      subcategory: "definite",
    },
    {
      format: ExerciseFormat.ShortAnswer,
      prompt: 'Correct: "We need mitigation before launch."',
      answer: "We need a mitigation before launch.",
      explanation: "Mitigation здесь один исчисляемый объект.",
      subcategory: "indefinite",
    },
    {
      format: ExerciseFormat.MultipleChoice,
      prompt:
        "General meaning: A) The data leakage is dangerous. B) Data leakage is dangerous.",
      answer: "B",
      accepted: ["b"],
      explanation: "Общее абстрактное значение требует zero article.",
      subcategory: "zero",
    },
    {
      format: ExerciseFormat.FillBlank,
      prompt: 'Complete: "It was ___ SSO issue."',
      answer: "an",
      explanation: "Название S произносится с начальным гласным звуком.",
      subcategory: "a-an",
    },
  ],
  open: [
    {
      format: ExerciseFormat.Rewrite,
      prompt:
        "Write two sentences that introduce a risk and then refer to it again.",
      sample:
        "The review identified a vulnerability. The vulnerability affects the authentication flow.",
      criteria:
        "a/an при первом упоминании, the при повторном, смысл и register.",
    },
    {
      format: ExerciseFormat.Rewrite,
      prompt: "Contrast security in general with the security of this API.",
      sample:
        "Security is essential, and the security of this API requires additional testing.",
      criteria: "zero article для общего понятия и the для конкретного.",
    },
  ],
  writingPrompt:
    "Write a security and risk assessment summary for an AI assistant.",
  writingRequirements: [
    "Используйте a/an, the и zero article минимум по три раза.",
    "Опишите threat, likelihood, impact и mitigation.",
    "Сначала вводите риски, затем ссылайтесь на них.",
    "Укажите решение до production launch.",
  ],
});

type FinalLessonConfig = {
  slug: string;
  topic: string;
  title: string;
  scenario: string;
  theory: TheorySection[];
  words: ReadonlyArray<readonly [string, string, string]>;
  reading: string;
  drills: ReadonlyArray<
    readonly [
      prompt: string,
      answer: string,
      explanation: string,
      accepted?: readonly string[],
    ]
  >;
  opens: ReadonlyArray<readonly [string, string, string]>;
  writing: string;
  requirements: string[];
};

type DrillMetadata = readonly [format: ExerciseFormatType, subcategory: string];

const finalLessonDrillMetadata: Readonly<
  Record<string, readonly DrillMetadata[]>
> = {
  "advanced-prepositions": [
    [ExerciseFormat.FillBlank, "noun-preposition-collocation"],
    [ExerciseFormat.FillBlank, "verb-preposition-collocation"],
    [ExerciseFormat.FillBlank, "adjective-preposition-collocation"],
    [ExerciseFormat.Transformation, "change-amount-result"],
    [ExerciseFormat.FillBlank, "concession-preposition"],
    [ExerciseFormat.FillBlank, "cause-preposition"],
    [ExerciseFormat.FillBlank, "method-preposition"],
    [ExerciseFormat.FillBlank, "range-endpoint-preposition"],
  ],
  "participle-clauses": [
    [ExerciseFormat.Transformation, "present-participle-reduction"],
    [ExerciseFormat.FillBlank, "passive-condition-participle"],
    [ExerciseFormat.FillBlank, "perfect-participle-marker"],
    [ExerciseFormat.Transformation, "dangling-participle"],
    [ExerciseFormat.FillBlank, "active-role-participle"],
    [ExerciseFormat.FillBlank, "passive-participle-clause"],
    [ExerciseFormat.FillBlank, "perfect-participle-form"],
    [ExerciseFormat.Transformation, "past-participle-reduction"],
  ],
  "emphasis-inversion": [
    [ExerciseFormat.Transformation, "fronted-only-inversion"],
    [ExerciseFormat.FillBlank, "not-only-inversion"],
    [ExerciseFormat.FillBlank, "negative-adverbial-modal-inversion"],
    [ExerciseFormat.Transformation, "inversion-base-verb"],
    [ExerciseFormat.Transformation, "cleft-focus"],
    [ExerciseFormat.FillBlank, "not-until-inversion"],
    [ExerciseFormat.FillBlank, "only-when-future-inversion"],
    [ExerciseFormat.Transformation, "never-perfect-inversion"],
  ],
  "hedging-diplomatic-language": [
    [ExerciseFormat.Transformation, "evidence-claim-hedging"],
    [ExerciseFormat.FillBlank, "appearance-hedge"],
    [ExerciseFormat.FillBlank, "worth-gerund-pattern"],
    [ExerciseFormat.Transformation, "suggest-gerund-pattern"],
    [ExerciseFormat.FillBlank, "likely-infinitive-pattern"],
    [ExerciseFormat.Transformation, "diplomatic-disagreement"],
    [ExerciseFormat.FillBlank, "degree-limitation-phrase"],
    [ExerciseFormat.FillBlank, "diplomatic-recommendation"],
  ],
  "advanced-business-email-style": [
    [ExerciseFormat.Transformation, "concise-purpose-clause"],
    [ExerciseFormat.FillBlank, "polite-request-modal"],
    [ExerciseFormat.FillBlank, "conditional-approval-phrase"],
    [ExerciseFormat.ShortAnswer, "direct-verb-style"],
    [ExerciseFormat.FillBlank, "purpose-infinitive"],
    [ExerciseFormat.ShortAnswer, "action-oriented-subject-line"],
    [ExerciseFormat.FillBlank, "appreciate-noun-phrase"],
    [ExerciseFormat.Transformation, "parallel-list-structure"],
  ],
};

function finalLesson(c: FinalLessonConfig): Lesson {
  const drillMetadata = finalLessonDrillMetadata[c.slug];
  if (!drillMetadata || drillMetadata.length !== c.drills.length) {
    throw new Error(`Invalid drill metadata for ${c.slug}`);
  }
  return compactLesson({
    slug: c.slug,
    topic: c.topic,
    title: c.title,
    practiceTitle: `Practice: ${c.scenario}`,
    theory: c.theory,
    vocabulary: vocabulary(c.words),
    readingTitle: c.scenario,
    reading: c.reading,
    graded: c.drills.map(([prompt, answer, explanation, accepted], i) => ({
      format: drillMetadata[i][0],
      prompt,
      answer,
      accepted: accepted ? [...accepted] : undefined,
      explanation,
      subcategory: drillMetadata[i][1],
    })),
    open: c.opens.map(([prompt, sample, criteria]) => ({
      format: ExerciseFormat.Rewrite,
      prompt,
      sample,
      criteria,
    })),
    writingPrompt: c.writing,
    writingRequirements: c.requirements,
  });
}

const advancedPrepositions = finalLesson({
  slug: "advanced-prepositions",
  topic: "advanced-prepositions",
  title: "Advanced Prepositions",
  scenario: "optimising AI costs",
  theory: [
    {
      heading: "Устойчивые сочетания",
      body: "В деловом английском предлог часто является частью устойчивого сочетания и не выбирается по буквальному переводу. Учите всю модель: impact on costs, comply with a limit, responsible for spend. В рекомендации такая точность показывает, какое отношение связывает показатель, действие и объект.",
    },
    {
      heading: "Причина и средство",
      items: [
        "because of/due to + noun: Costs rose due to longer prompts.",
        "by + method; through + process: We saved money by caching repeated requests.",
        "by + amount; to + result; from + start: Costs fell from €48,000 by €9,000 to €39,000.",
      ],
    },
    {
      heading: "Контраст",
      body: "Despite и in spite of принимают существительное или -ing-форму, тогда как although вводит полное предложение. Эта разница позволяет кратко сопоставить экономию и ограничение: Despite higher traffic, spend fell; Although traffic increased, spend fell.",
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Не смешивайте due to и because + clause.",
        "Различайте by (величина изменения) и to (итог).",
        "Не заменяйте устойчивый предлог близким по переводу: impact on, не impact to.",
      ],
    },
    {
      heading: "Запомните",
      body: "Перед выбором предлога определите функцию: collocation, причина, метод, величина изменения, конечное значение или контраст. Затем проверьте, идёт ли после него noun phrase, -ing-форма или целое предложение.",
    },
  ],
  words: [
    [
      "cost per request",
      "стоимость запроса",
      "Cost per request fell by 10% after we routed simple queries to a smaller model.",
    ],
    [
      "compute spend",
      "расходы на вычисления",
      "Finance reviews compute spend against the quality targets every month.",
    ],
    [
      "token usage",
      "использование токенов",
      "We reduced inference cost through lower token usage without changing answer quality.",
    ],
    [
      "rate limit",
      "лимит запросов",
      "The caching layer keeps peak traffic within the provider's rate limit.",
    ],
    [
      "reserved capacity",
      "зарезервированная мощность",
      "Projected savings depend on reserved capacity being used throughout the contract term.",
    ],
    [
      "under budget",
      "в рамках бюджета",
      "The evaluation pilot stayed under budget despite a 20% increase in test volume.",
    ],
    [
      "at scale",
      "в масштабе",
      "At scale, prompt caching can reduce both latency and cost per request.",
    ],
    [
      "in line with",
      "в соответствии с",
      "Monthly spend remains in line with the approved forecast after the routing change.",
    ],
    [
      "with regard to",
      "в отношении",
      "With regard to latency, the team recommends retaining the current model for complex cases.",
    ],
    [
      "on behalf of",
      "от имени",
      "Procurement negotiated reserved capacity on behalf of all three business units.",
    ],
    [
      "due to",
      "из-за",
      "Inference costs rose due to longer prompts in the document-analysis workflow.",
    ],
    [
      "by means of",
      "посредством",
      "We reduced repeated model calls by means of semantic caching.",
    ],
    [
      "despite",
      "несмотря на",
      "Despite higher production traffic, monthly inference spend fell below forecast.",
    ],
    [
      "from…to…",
      "с…до…",
      "Average latency fell from 900 to 600 milliseconds after the routing update.",
    ],
    [
      "by 15%",
      "на 15%",
      "Token usage decreased by 15% after the team removed redundant context.",
    ],
  ],
  reading:
    "The client reduced monthly inference spend from €48,000 to €39,000 by means of prompt compression and caching. Despite a 20% increase in traffic, cost per request fell by 31%. The largest saving came from routing simple requests to a smaller model. With regard to quality, evaluation scores remained in line with the baseline. The team stayed within rate limits and negotiated reserved capacity on behalf of three business units. Due to uncertain seasonal demand, it recommends reviewing capacity quarterly rather than committing to a longer term.",
  drills: [
    ["Complete: impact ___ cost", "on", "Impact collocates with on."],
    ["Complete: comply ___ the limit", "with", "Comply collocates with with."],
    [
      "Complete: responsible ___ spend",
      "for",
      "Responsible collocates with for.",
    ],
    [
      "Correct only the two prepositions; keep all figures and wording: Costs fell to €9,000 by €39,000.",
      "Costs fell by €9,000 to €39,000.",
      "By marks change; to marks result.",
    ],
    [
      "Complete: ___ higher traffic, cost fell.",
      "Despite",
      "Despite takes a noun phrase.",
    ],
    [
      "Complete: Costs rose ___ longer prompts.",
      "due to",
      "Due to precedes a noun phrase.",
    ],
    [
      'Complete with "through" to express a process: We saved money ___ caching.',
      "through",
      "Through expresses a process.",
    ],
    ["Complete: from €48,000 ___ €39,000", "to", "From pairs with to."],
  ],
  opens: [
    [
      "Rephrase using despite: Traffic rose, but spend fell.",
      "Despite higher traffic, spend fell.",
      "despite + noun/gerund, contrast and meaning preserved.",
    ],
    [
      "Report a 20% reduction ending at €8,000.",
      "Costs fell by 20% to €8,000.",
      "correct use of by and to, accurate meaning.",
    ],
  ],
  writing:
    "Write an AI cost-optimisation recommendation with current spend, savings, trade-offs, and next actions.",
  requirements: [
    "Используйте минимум восемь target prepositions.",
    "Различайте by, from и to.",
    "Включите cause, method и contrast.",
    "Защитите качество при снижении расходов.",
  ],
});

const participleClauses = finalLesson({
  slug: "participle-clauses",
  topic: "participle-clauses",
  title: "Participle Clauses",
  scenario: "planning a multi-agent architecture",
  theory: [
    {
      heading: "-ing clauses",
      body: "Present participle сокращает активную придаточную часть, когда действие выполняет субъект главного предложения. Конструкция может передавать одновременное действие, способ или причину: Using routing logic, the orchestrator selects a specialist agent.",
    },
    {
      heading: "-ed clauses",
      body: "Past participle выражает пассивное или результативное значение: Given a clear role, each agent behaves predictably; Flagged as sensitive, the request goes to a human. Исполнитель обычно не называется, потому что важнее состояние объекта.",
    },
    {
      heading: "Perfect participle",
      items: [
        "Having + V3 подчёркивает, что первое действие завершилось раньше второго.",
        "Having validated the permissions, the team launched the workflow.",
        "Отрицание ставится перед having: Not having received approval, the team postponed launch.",
      ],
    },
    {
      heading: "Типичные ошибки",
      items: [
        "Субъект participle clause должен совпадать с субъектом main clause.",
        "Не сокращайте предложение, если временная или причинная связь становится неоднозначной.",
        "Проверяйте dangling participles: Using a router, the system assigned the request, а не the request was assigned.",
      ],
    },
    {
      heading: "Запомните",
      body: "Выберите -ing для активного действия, V3 для пассивного состояния и having + V3 для предшествования. После сокращения обязательно проверьте общий субъект и сохранённую логическую связь.",
    },
  ],
  words: [
    [
      "orchestrator",
      "оркестратор",
      "Acting as orchestrator, the service assigns tasks.",
    ],
    [
      "specialist agent",
      "агент-специалист",
      "Each specialist agent receives a narrow role, limited context, and explicit tool permissions.",
    ],
    [
      "routing logic",
      "логика маршрутизации",
      "Using routing logic, the system selects an agent.",
    ],
    [
      "shared memory",
      "общая память",
      "Shared memory requires access controls that prevent one agent from exposing restricted context.",
    ],
    [
      "handoff protocol",
      "протокол передачи",
      "Defined clearly, the handoff protocol reduces errors.",
    ],
    [
      "tool permission",
      "разрешение инструмента",
      "Tool permissions follow least privilege so that a research agent cannot approve its own output.",
    ],
    [
      "termination condition",
      "условие завершения",
      "An explicit termination condition stops the workflow when agents repeat the same handoff.",
    ],
    [
      "human-in-the-loop",
      "участие человека",
      "Flagged as sensitive, requests become human-in-the-loop.",
    ],
    [
      "observability",
      "наблюдаемость",
      "End-to-end observability lets operations identify which agent introduced an incorrect claim.",
    ],
    [
      "trace",
      "трассировка",
      "Each trace records the prompt, tool call, handoff, and final decision for audit purposes.",
    ],
    [
      "using",
      "используя",
      "Using a central router, the architecture avoids sending one request to several agents.",
    ],
    [
      "given",
      "при наличии",
      "Given clear context and a narrow role, the specialist agent produces more consistent outputs.",
    ],
    [
      "having validated",
      "проверив",
      "Having validated every tool permission, the security team approved the workflow for launch.",
    ],
    [
      "designed to",
      "спроектированный для",
      "Designed to classify support requests, the agent stays within a testable operational boundary.",
    ],
    [
      "acting as",
      "выступая в роли",
      "Acting as judge, one agent scores the combined answer against completeness and citation criteria.",
    ],
  ],
  reading:
    "Using a central orchestrator, the proposed architecture sends each request to a specialist agent. Given a narrow role and limited tool permissions, each agent can be tested independently. The research agent gathers evidence, while the analysis agent compares options. Having combined their outputs, the orchestrator asks a judge agent to check completeness. Requests flagged as sensitive are sent to a human reviewer. Designed around explicit termination conditions, the workflow avoids uncontrolled loops. Recording every handoff in a shared trace, the platform also gives the operations team enough observability to investigate failures.",
  drills: [
    [
      'Reduce with an initial -ing clause beginning "Using a router,"; keep "the system" as subject.',
      "Using a router, the system selects an agent.",
      "Active simultaneous action uses -ing.",
    ],
    [
      "Complete: ___ a clear role, the agent behaves predictably.",
      "Given",
      "Given introduces a passive condition.",
    ],
    [
      "Complete: ___ validated the output, we approved it.",
      "Having",
      "Having + V3 marks prior action.",
    ],
    [
      'Correct the dangling participle; begin "Using a router," and make "the system" the subject: Using a router, the request was assigned by the system.',
      "Using a router, the system assigned the request.",
      "The subjects must match.",
    ],
    [
      "Complete: ___ as judge, the agent scores outputs.",
      "Acting",
      "Active role uses -ing.",
    ],
    [
      "Complete: ___ as sensitive, the request goes to a human.",
      "Flagged",
      "Passive meaning uses V3.",
    ],
    [
      'Complete with the past participle of "review": Having ___ the trace, we found the loop.',
      "reviewed",
      "Having takes a past participle.",
    ],
    [
      'Reduce with the initial past-participle phrase "Designed for routing,"; keep the main clause unchanged.',
      "Designed for routing, the agent stays narrow.",
      "Passive clause reduces to V3.",
    ],
  ],
  opens: [
    [
      "Combine with a present participle: The orchestrator checks intent. It selects an agent.",
      "Checking the request's intent, the orchestrator selects an agent.",
      "correct -ing clause, shared subject, meaning preserved.",
    ],
    [
      "Combine to show prior completion: We validated permissions. We launched the workflow.",
      "Having validated the permissions, we launched the workflow.",
      "having + V3 and clear sequence.",
    ],
  ],
  writing:
    "Write an architecture note describing a multi-agent workflow, controls, and handoffs.",
  requirements: [
    "Используйте минимум шесть participle clauses.",
    "Включите -ing, V3 и having + V3.",
    "Не допускайте dangling participles.",
    "Опишите routing, permissions и human review.",
  ],
});

const emphasisInversion = finalLesson({
  slug: "emphasis-inversion",
  topic: "emphasis-and-inversion",
  title: "Emphasis & Inversion",
  scenario: "planning a RAG solution",
  theory: [
    {
      heading: "Форма",
      body: "После отрицательного или ограничительного выражения в начале предложения вспомогательный или модальный глагол ставится перед субъектом: Only then did we identify the gap; Under no circumstances should access be bypassed. Если вспомогательного глагола нет, добавляется do/does/did.",
    },
    {
      heading: "Модели",
      items: [
        "Not only did precision improve, but citation accuracy also increased.",
        "Not until the access audit was complete did we approve production use.",
        "It is metadata that enables filtering; What we need is a fresher knowledge base.",
      ],
    },
    {
      heading: "Ошибки",
      body: "После did используется base verb: did we identify, не did we identified. Only вызывает инверсию лишь тогда, когда ограничивающая фраза вынесена в начало; в обычном порядке We deployed only after testing инверсии нет.",
    },
    {
      heading: "Эффект",
      body: "Инверсия подчёркивает исключительность условия, момента или запрета и подходит для выводов и controls. Cleft sentence It is/was ... that выделяет решающий компонент без изменения фактов — например источник ошибки или обязательный контроль.",
    },
    {
      heading: "Запомните",
      body: "Сначала выберите ограничивающее выражение, затем вспомогательный глагол, субъект и base verb. Используйте акцент избирательно: один сильный вывод эффективнее ряда искусственных инверсий.",
    },
  ],
  words: [
    [
      "retrieval pipeline",
      "конвейер поиска",
      "It is the retrieval pipeline that needs end-to-end testing before the RAG pilot can launch.",
    ],
    [
      "knowledge base",
      "база знаний",
      "The knowledge base contains only approved policies with named owners and review dates.",
    ],
    [
      "chunking strategy",
      "стратегия разбиения",
      "Only after testing long policy documents did we revise the chunking strategy.",
    ],
    [
      "embedding model",
      "модель эмбеддингов",
      "The embedding model affects retrieval recall for multilingual product documentation.",
    ],
    [
      "reranker",
      "переранжировщик",
      "Not only did the reranker improve precision, but it also removed outdated results from the top five.",
    ],
    [
      "grounded answer",
      "обоснованный ответ",
      "A grounded answer cites the approved policy passage that supports each material claim.",
    ],
    [
      "citation accuracy",
      "точность ссылок",
      "Citation accuracy must meet the agreed threshold before the assistant is shown to users.",
    ],
    [
      "retrieval recall",
      "полнота поиска",
      "Retrieval recall improved after the team added product synonyms to the evaluation set.",
    ],
    [
      "access filtering",
      "фильтрация доступа",
      "Under no circumstances may access filtering return documents outside a user's permissions.",
    ],
    [
      "source freshness",
      "актуальность источника",
      "It was source freshness that caused the assistant to cite an obsolete retention policy.",
    ],
    [
      "only after",
      "только после",
      "Only after the retrieval tests passed did the steering group approve the pilot.",
    ],
    [
      "not until",
      "только когда",
      "Not until the access audit was complete did the team enable production data.",
    ],
    [
      "not only…but also",
      "не только…но и",
      "Not only did the reranker improve precision, but it also increased citation accuracy.",
    ],
    [
      "under no circumstances",
      "ни при каких обстоятельствах",
      "Under no circumstances may restricted client data enter the shared retrieval index.",
    ],
    [
      "it is…that",
      "именно…",
      "It is document metadata that enables reliable access filtering across business units.",
    ],
  ],
  reading:
    "Only after testing the retrieval pipeline did the team discover that outdated policies dominated results. It was source freshness, not model size, that caused most incorrect answers. Not only did a reranker improve precision, but it also increased citation accuracy. Under no circumstances should the system retrieve documents outside a user's permissions. Only when access filtering passes testing will the team approve production use.",
  drills: [
    [
      "Invert: We discovered the gap only after testing.",
      "Only after testing did we discover the gap.",
      "Fronted only requires inversion.",
    ],
    ["Not only ___ recall improve.", "did", "Past inversion uses did."],
    [
      "Under no circumstances ___ access be bypassed.",
      "should",
      "Modal precedes subject.",
    ],
    [
      "Correct: Only then did we identified it.",
      "Only then did we identify it.",
      "Use base verb after did.",
    ],
    [
      'Form an it-cleft using "It is ... that" and keep metadata as the focus: Metadata enables filtering.',
      "It is metadata that enables filtering.",
      "Cleft highlights metadata.",
    ],
    [
      "Not until the audit ___ we see it.",
      "did",
      "Not until triggers inversion.",
    ],
    [
      "Only when tests pass ___ we deploy.",
      "will",
      "Future inversion uses will.",
    ],
    [
      "Invert: We had never seen this.",
      "Never had we seen this.",
      "Never triggers inversion.",
    ],
  ],
  opens: [
    [
      "Emphasise source quality with a cleft.",
      "It was source quality that caused the failure.",
      "correct cleft and preserved meaning.",
    ],
    [
      "Join precision and accuracy using Not only.",
      "Not only did precision improve, but citation accuracy also increased.",
      "inversion and parallel meaning.",
    ],
  ],
  writing:
    "Write a RAG planning note emphasising decisive choices and controls.",
  requirements: [
    "Используйте четыре inversion patterns.",
    "Добавьте две cleft sentences.",
    "Опишите retrieval, citations и access filtering.",
    "Сохраняйте деловой стиль.",
  ],
});

const hedging = finalLesson({
  slug: "hedging-diplomatic-language",
  topic: "hedging-and-diplomatic-language",
  title: "Hedging & Diplomatic Language",
  scenario: "presenting AI ROI",
  theory: [
    {
      heading: "Назначение",
      body: "Hedging отделяет наблюдаемые результаты от интерпретаций и прогнозов. В ROI-презентации он помогает честно обозначить ограниченную выборку, зависимость от допущений и диапазон уверенности, не ослабляя подтверждённые цифры.",
    },
    {
      heading: "Средства",
      items: [
        "may/might/could + infinitive для возможности: The result may indicate a trend.",
        "appears/seems/tends to + infinitive для осторожной интерпретации данных.",
        "It may be worth + -ing / I would suggest + -ing для дипломатичной рекомендации.",
      ],
    },
    {
      heading: "Точность",
      body: "Смягчайте степень уверенности, а не сами данные: Handling time fell by 11% — факт; this may indicate a productivity gain — интерпретация. Критические риски, известные ограничения и обязательные controls называйте прямо.",
    },
    {
      heading: "Ошибки",
      body: "Не складывайте несколько hedges в одной фразе и не представляйте прогноз как доказанный результат. После suggest используется gerund или that-clause, после likely — to-infinitive, после worth — -ing.",
    },
    {
      heading: "Запомните",
      body: "Стройте вывод в четыре шага: подтверждённый результат, осторожная интерпретация, ограничение данных и конкретная рекомендация. Так executive-аудитория видит и потенциал, и риск решения.",
    },
  ],
  words: [
    [
      "return on investment",
      "окупаемость",
      "The pilot appears to support a positive return on investment, although the sample is limited.",
    ],
    [
      "payback period",
      "срок окупаемости",
      "The payback period is likely to be between twelve and sixteen months, depending on adoption.",
    ],
    [
      "benefit estimate",
      "оценка выгоды",
      "The benefit estimate may be conservative because it excludes avoided compliance costs.",
    ],
    [
      "confidence range",
      "диапазон уверенности",
      "We would suggest presenting a confidence range rather than one headline ROI figure.",
    ],
    [
      "assumption",
      "допущение",
      "The adoption assumption may change after the solution expands beyond the pilot team.",
    ],
    [
      "sensitivity analysis",
      "анализ чувствительности",
      "The sensitivity analysis shows how lower adoption would affect the projected payback period.",
    ],
    [
      "productivity gain",
      "рост производительности",
      "The fall in handling time may indicate a productivity gain, but the evidence is not yet conclusive.",
    ],
    [
      "cost avoidance",
      "предотвращённые расходы",
      "Cost avoidance is difficult to verify, so the business case reports it separately from cash savings.",
    ],
    [
      "appears to",
      "по-видимому",
      "Adoption appears to improve when managers review AI-assisted workflows every week.",
    ],
    [
      "is likely to",
      "вероятно",
      "Support demand is likely to grow during the first month of enterprise rollout.",
    ],
    [
      "may indicate",
      "может указывать",
      "The reduction in handling time may indicate a productivity trend worth measuring further.",
    ],
    [
      "to some extent",
      "до некоторой степени",
      "The pilot validates the workflow to some extent, but it does not yet prove enterprise scalability.",
    ],
    [
      "it may be worth",
      "возможно, стоит",
      "It may be worth extending measurement before committing to the full investment.",
    ],
    [
      "I would suggest",
      "я бы предложил",
      "I would suggest validating the savings across a second business unit.",
    ],
    [
      "cautious interpretation",
      "осторожная интерпретация",
      "A cautious interpretation is appropriate because the pilot covers only one unit and eight weeks.",
    ],
  ],
  reading:
    "The pilot appears to support a positive ROI, although the evidence is not conclusive. Handling time fell by approximately 11%, which may indicate a productivity gain. However, the sample covers one unit and eight weeks. Payback is likely to be between 12 and 16 months, depending on adoption. It may be worth extending measurement. I would suggest presenting a confidence range and sensitivity analysis rather than one headline figure.",
  drills: [
    [
      'Soften with "appears to indicate" and keep "The pilot" as subject: The pilot proves ROI.',
      "The pilot appears to indicate positive ROI.",
      "Avoid overstating evidence.",
    ],
    ["The result ___ indicate a trend.", "may", "May marks uncertainty."],
    ["It may be worth ___ the pilot.", "extending", "Worth takes -ing."],
    [
      "Correct: I suggest to validate it.",
      "I suggest validating it.",
      "Suggest takes a gerund.",
    ],
    ["Demand is likely ___ grow.", "to", "Likely takes to-infinitive."],
    [
      'Soften with "may be inaccurate" and keep "The estimate" as subject: The estimate is wrong.',
      "The estimate may be inaccurate.",
      "May softens criticism.",
    ],
    ["This helps ___ some extent.", "to", "Fixed phrase."],
    [
      "I would ___ presenting a range.",
      "suggest",
      "Diplomatic recommendation.",
    ],
  ],
  opens: [
    [
      "Challenge a claim that savings are guaranteed.",
      "The results appear promising, although they may not guarantee the projected savings.",
      "hedging, limitation and respectful register.",
    ],
    [
      "Recommend more measurement diplomatically.",
      "It may be worth extending measurement before the final decision.",
      "diplomatic action and timing.",
    ],
  ],
  writing:
    "Write an executive AI ROI summary with evidence, assumptions, uncertainty, and recommendation.",
  requirements: [
    "Используйте восемь hedges.",
    "Отделите results от projections.",
    "Укажите range и assumptions.",
    "Дайте ясную рекомендацию.",
  ],
});

const emailStyle = finalLesson({
  slug: "advanced-business-email-style",
  topic: "advanced-business-email-style",
  title: "Advanced Business Email Style",
  scenario: "proposing an enterprise adoption roadmap",
  theory: [
    {
      heading: "Структура",
      body: "Executive email быстро сообщает цель, минимально необходимый контекст, рекомендацию и требуемое решение. Тема письма и первый абзац должны позволять адресату понять ask, даже если он не читает детали roadmap.",
    },
    {
      heading: "Краткость",
      items: [
        "Заменяйте nominal style прямыми глаголами: conduct an evaluation → evaluate.",
        "Стройте bullets параллельно: integrate controls, train users, measure adoption.",
        "Оставляйте одну основную цель письма и выносите детали в приложение.",
      ],
    },
    {
      heading: "Запрос",
      body: "Could you confirm/approve ... by Friday? объединяет действие, объект и срок без резкости. Если решений несколько, перечислите их отдельно и назначьте owner, чтобы ответ можно было дать однозначно.",
    },
    {
      heading: "Связность",
      items: [
        "With this in mind вводит рекомендацию, основанную на предыдущем контексте.",
        "To ensure + noun/verb выражает цель следующего действия.",
        "Subject to approval обозначает условие и не должно маскировать ответственного за решение.",
      ],
    },
    {
      heading: "Запомните",
      body: "Проверьте четыре элемента: informative subject, clear ask, параллельные next steps и deadline. Каждый action item должен иметь owner и наблюдаемый результат; вежливость не должна делать просьбу расплывчатой.",
    },
  ],
  words: [
    [
      "subject line",
      "тема письма",
      "The subject line states the decision required and the relevant rollout phase.",
    ],
    [
      "executive summary",
      "резюме",
      "The executive summary leads with pilot value, investment need, and the requested decision.",
    ],
    [
      "phased rollout",
      "поэтапное внедрение",
      "We recommend a phased rollout that validates governance before expanding use cases.",
    ],
    [
      "adoption roadmap",
      "дорожная карта",
      "The adoption roadmap links each quarter to owners, controls, and measurable outcomes.",
    ],
    [
      "decision required",
      "требуемое решение",
      "Decision required: approve the phase-one budget and confirm an executive sponsor.",
    ],
    [
      "action owner",
      "ответственный",
      "Each action owner confirms the deliverable and deadline before the steering meeting.",
    ],
    [
      "dependency",
      "зависимость",
      "Identity integration is a critical dependency for secure enterprise access.",
    ],
    [
      "milestone",
      "контрольная точка",
      "Completion of manager training is the final milestone before regional launch.",
    ],
    [
      "subject to approval",
      "при условии одобрения",
      "Subject to budget approval by Friday, implementation can begin on 1 October.",
    ],
    [
      "with this in mind",
      "учитывая это",
      "With this in mind, we recommend funding governance and identity work first.",
    ],
    [
      "to ensure",
      "чтобы обеспечить",
      "To ensure consistent adoption, each region will nominate a trained local champion.",
    ],
    [
      "could you confirm",
      "подтвердите, пожалуйста",
      "Could you confirm the executive sponsor and budget owner by Friday?",
    ],
    [
      "we would appreciate",
      "будем признательны",
      "We would appreciate your approval of the phase-one budget by Friday.",
    ],
    [
      "for your review",
      "на рассмотрение",
      "The detailed adoption roadmap and risk register are attached for your review.",
    ],
    [
      "next steps",
      "следующие шаги",
      "The next steps identify the owner, deliverable, and deadline for each rollout phase.",
    ],
  ],
  reading:
    "Subject: Decision required — approve phase one\n\nDear Committee,\n\nFollowing the successful pilot, we recommend a phased enterprise rollout. Phase one will establish governance, integrate identity controls, and train priority users. Phase two will expand proven use cases; phase three will optimise operations using adoption data. With this in mind, we request funding approval and confirmation of a sponsor. Subject to approval by 15 September, work can begin on 1 October. Could you confirm both decisions by Friday? The roadmap is attached for your review.\n\nKind regards,\nProject Team",
  drills: [
    [
      'Make concise by replacing "for the purpose of requesting" with "to request"; keep all other wording: We write for the purpose of requesting approval.',
      "We write to request approval.",
      "Infinitive states purpose.",
    ],
    ["___ you confirm the sponsor?", "Could", "Polite request."],
    ["Subject ___ approval.", "to", "Fixed phrase."],
    ["Replace: conduct an evaluation.", "evaluate", "Direct verb is concise."],
    ["To ___ adoption.", "ensure", "States purpose."],
    [
      "Clear subject: Update / Decision required — approve phase one",
      "Decision required — approve phase one",
      "States action.",
    ],
    ["We would appreciate ___ approval.", "your", "Needs noun phrase."],
    [
      "Parallelise: integrating, training, and we measure.",
      "integrating, training, and measuring",
      "Parallel forms.",
      ["integrating, training and measuring"],
    ],
  ],
  opens: [
    [
      "Request budget approval by Friday.",
      "Could you approve the phase-one budget by Friday?",
      "polite request and deadline.",
    ],
    [
      "Open with a three-phase recommendation after a pilot.",
      "Following the successful pilot, we recommend a three-phase adoption roadmap.",
      "concise context and recommendation.",
    ],
  ],
  writing:
    "Write an executive email requesting approval for an enterprise AI adoption roadmap.",
  requirements: [
    "Добавьте informative subject и clear ask.",
    "Опишите три phases параллельно.",
    "Укажите owners и deadlines.",
    "Используйте четыре diplomatic phrases.",
  ],
});

export const englishAiConsultantLessons: readonly Lesson[] = [
  presentSimpleContinuous,
  pastSimplePresentPerfect,
  futureForms,
  modalVerbs,
  conditionals,
  passiveVoice,
  relativeClauses,
  reportedSpeech,
  linkingWords,
  gerundsInfinitives,
  thirdConditional,
  mixedConditionals,
  causative,
  quantifiersApproximation,
  articlesBusiness,
  advancedPrepositions,
  participleClauses,
  emphasisInversion,
  hedging,
  emailStyle,
];

// Kept as a named export for compatibility with existing imports.
export const englishAiConsultantConditionals = conditionals;
