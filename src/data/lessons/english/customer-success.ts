// English Customer Success / Hospitality curriculum (B2).
// Ten lessons mirror the English AI Consultant grammar sequence while using
// customer success, hotel operations, MICE, and AI-supported service contexts.

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

type VocabTuple = readonly [term: string, translation: string, example: string];
type GradedTuple = readonly [
  format: ExerciseFormatType,
  prompt: string,
  answer: string,
  explanation: string,
  accepted?: readonly string[],
];
type OpenTuple = readonly [
  format: ExerciseFormatType,
  prompt: string,
  sample: string,
  criteria: string,
];

interface LessonSpec {
  slug: string;
  topic: string;
  title: string;
  theory: TheorySection[];
  vocabulary: readonly VocabTuple[];
  readingTitle: string;
  reading: string;
  graded: readonly GradedTuple[];
  open: readonly OpenTuple[];
  writingPrompt: string;
  writingRequirements: string[];
  sources: string[];
}

const grammarSources = [
  "Cambridge Dictionary — English Grammar",
  "British Council — LearnEnglish Grammar",
  "Oxford Learner's Dictionaries — grammar reference",
];

function vocabulary(entries: readonly VocabTuple[]): VocabularyItem[] {
  return entries.map(([term, translation, example]) => ({
    term,
    translation,
    example,
  }));
}

function createLesson(spec: LessonSpec): Lesson {
  const prefix = `en-customer-success-${spec.slug}`;
  return {
    id: lessonId(prefix),
    topic: spec.topic,
    language: Language.English,
    careerTrack: CareerTrack.CustomerSuccessHospitality,
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
        items: vocabulary(spec.vocabulary),
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
        title: `Practice: ${spec.title}`,
        exercises: [
          ...spec.graded.map(
            ([format, prompt, answer, explanation, accepted], index) => ({
              id: exerciseId(`${prefix}-ex${index + 1}`),
              evaluation: ExerciseEvaluation.Graded,
              skillArea: SkillArea.Grammar,
              format,
              topic: spec.topic,
              category: "grammar",
              severity: MistakeSeverity.Medium,
              prompt,
              expectedAnswer: answer,
              acceptedAnswers: accepted ? [...accepted] : undefined,
              explanation,
            }),
          ),
          ...spec.open.map(([format, prompt, sample, criteria], index) => ({
            id: exerciseId(`${prefix}-ex${spec.graded.length + index + 1}`),
            evaluation: ExerciseEvaluation.Open,
            skillArea: SkillArea.Grammar,
            format,
            prompt,
            sampleAnswer: sample,
            explanation:
              `Критерии оценки: ${criteria} Смысл исходного сообщения должен ` +
              "сохраняться; допустимы разные корректные формулировки.",
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

const presentSimpleContinuous = createLesson({
  slug: "present-simple-continuous",
  topic: "present-simple-vs-present-continuous",
  title: "Present Simple vs Present Continuous",
  sources: grammarSources,
  theory: [
    {
      heading: "Значение и употребление",
      body: "Present Simple описывает регулярные процессы, правила и постоянные факты. Present Continuous показывает действие сейчас, временную ситуацию или меняющийся процесс. В отеле это различие отделяет стандартную процедуру от того, что команда делает для гостя в данный момент.",
    },
    {
      heading: "Форма и маркеры",
      items: [
        "Present Simple: subject + base verb; he/she/it + -s.",
        "Present Continuous: subject + am/is/are + verb-ing.",
        "We normally confirm groups within one day. / We are confirming your rooming list now.",
        "Usually и every day указывают на рутину; currently и this week — на временное действие.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не пропускайте am/is/are и не ставьте глаголы состояния need, know, understand в Continuous без особой причины. Сначала определите: это стандартный сервис или временная работа сейчас.",
    },
  ],
  vocabulary: [
    ["guest journey", "путь гостя", "The guest journey starts before arrival."],
    [
      "front desk",
      "стойка регистрации",
      "The front desk handles late arrivals.",
    ],
    [
      "rooming list",
      "список размещения группы",
      "We are checking the rooming list now.",
    ],
    [
      "service standard",
      "стандарт обслуживания",
      "Our service standard requires a reply within one hour.",
    ],
    [
      "special request",
      "особая просьба гостя",
      "The team is arranging your special request.",
    ],
    [
      "occupancy",
      "загрузка номерного фонда",
      "Occupancy usually rises during trade fairs.",
    ],
    [
      "touchpoint",
      "точка контакта с клиентом",
      "Every touchpoint affects guest satisfaction.",
    ],
    [
      "to coordinate",
      "координировать",
      "The events team coordinates all supplier access.",
    ],
    [
      "in progress",
      "в процессе",
      "Your airport transfer is currently in progress.",
    ],
    ["to handle", "обрабатывать; решать", "Who handles VIP amenities?"],
    [
      "at the moment",
      "в данный момент",
      "We are updating the booking at the moment.",
    ],
    [
      "on a daily basis",
      "ежедневно",
      "Housekeeping updates room status on a daily basis.",
    ],
    [
      "Let me check that for you.",
      "Позвольте мне это проверить.",
      "Let me check that for you while we are speaking.",
    ],
    [
      "We are currently looking into it.",
      "Мы сейчас разбираемся в этом.",
      "We are currently looking into the duplicate charge.",
    ],
    [
      "How does this normally work?",
      "Как это обычно работает?",
      "How does this normally work for conference groups?",
    ],
  ],
  readingTitle: "A changing arrival plan",
  reading:
    "The Riverside Hotel normally sends group arrival details to every department two days in advance. This week, however, the events team is managing a last-minute change for an international conference. The client is adding twelve delegates, and several guests are requesting early check-in. The front desk is checking room availability while housekeeping is prioritising the relevant rooms. The customer success manager usually updates the CRM after the daily briefing, but today she is entering changes as soon as they arrive. She is also using an AI assistant to summarise client emails, although she checks every suggested action before sharing it. The hotel follows its usual approval process, but the teams are communicating more frequently until the group has arrived.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete: "The front desk usually ___ late arrivals." (handle)',
      "handles",
      "Usually обозначает регулярный процесс; для третьего лица нужен -s.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We ___ the rooming list at the moment." (check)',
      "are checking",
      "At the moment требует Present Continuous: are + checking.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose the correct form: "Occupancy rises / is rising every summer."',
      "rises",
      "Every summer описывает повторяющийся факт.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The events team ___ supplier access this week." (coordinate)',
      "is coordinating",
      "This week — временная текущая ситуация.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "How ___ the hotel normally confirm group bookings?"',
      "does",
      "В вопросе Present Simple с hotel используется does.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Correct one word: "We are need a final guest count."',
      "need",
      "Need — глагол состояния; здесь используется Present Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Housekeeping ___ room status every morning." (update)',
      "updates",
      "Every morning указывает на рутину; housekeeping — единственное число.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "I ___ into the duplicate charge now." (look)',
      "am looking",
      "Now требует am + verb-ing.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Rewrite to contrast routine and current action: "We confirm transfers. Today we arrange an extra coach."',
      "We normally confirm transfers in advance, but today we are arranging an extra coach.",
      "нужны Present Simple для рутины и Present Continuous для текущего исключения",
    ],
    [
      ExerciseFormat.Rewrite,
      "Write a professional update saying that the hotel usually answers within an hour but is investigating this request now.",
      "We usually respond within an hour, and we are currently investigating your request.",
      "обе временные формы должны быть употреблены точно и сообщение должно звучать профессионально",
    ],
  ],
  writingPrompt:
    "Write an internal update about normal group-arrival procedures and the temporary changes your hotel is making for a conference this week.",
  writingRequirements: [
    "Используйте Present Simple минимум четыре раза.",
    "Используйте Present Continuous минимум четыре раза.",
    "Упомяните front desk, housekeeping, CRM и одну AI-supported задачу.",
    "Отделите стандартные процессы от временных действий.",
  ],
});

const pastSimplePresentPerfect = createLesson({
  slug: "past-simple-present-perfect",
  topic: "past-simple-vs-present-perfect",
  title: "Past Simple vs Present Perfect",
  sources: grammarSources,
  theory: [
    {
      heading: "Результат или завершённый момент",
      body: "Past Simple сообщает о завершённом событии в известный момент прошлого. Present Perfect связывает прошлое с настоящим: важен текущий результат, опыт или период, который ещё не закончился.",
    },
    {
      heading: "Форма и маркеры",
      items: [
        "Past Simple: subject + V2; отрицание did not + base verb.",
        "Present Perfect: have/has + V3.",
        "Yesterday, last night и at 9:00 требуют Past Simple; already, yet, just, since и so far часто сопровождают Present Perfect.",
        "We moved the guest at 11 p.m. / We have already updated her profile.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не соединяйте Present Perfect с законченным указателем yesterday. Используйте Past Simple для хронологии инцидента, а Present Perfect — для актуального результата и выполненных follow-up действий.",
    },
  ],
  vocabulary: [
    [
      "service incident",
      "сервисный инцидент",
      "The service incident occurred last night.",
    ],
    ["complaint", "жалоба", "We have logged the complaint in the CRM."],
    [
      "resolution",
      "решение проблемы",
      "The guest accepted the resolution yesterday.",
    ],
    [
      "service recovery",
      "восстановление доверия после сбоя",
      "Our service recovery has restored the client's confidence.",
    ],
    [
      "goodwill gesture",
      "жест доброй воли",
      "We offered a goodwill gesture at checkout.",
    ],
    [
      "root cause",
      "коренная причина",
      "The team has identified the root cause.",
    ],
    [
      "case history",
      "история обращения",
      "I reviewed the case history this morning.",
    ],
    [
      "to reimburse",
      "возместить расходы",
      "We have reimbursed the transfer cost.",
    ],
    [
      "to acknowledge",
      "признать; подтвердить получение",
      "The manager acknowledged the delay yesterday.",
    ],
    [
      "to resolve",
      "устранить проблему",
      "Engineering has resolved the integration issue.",
    ],
    [
      "so far",
      "к настоящему моменту",
      "We have received no further complaints so far.",
    ],
    [
      "since your last message",
      "с момента вашего последнего сообщения",
      "We have taken three actions since your last message.",
    ],
    [
      "Thank you for bringing this to our attention.",
      "Спасибо, что обратили наше внимание.",
      "Thank you for bringing this to our attention yesterday.",
    ],
    [
      "We have now taken the following steps.",
      "Сейчас мы предприняли следующие шаги.",
      "We have now taken the following steps to prevent a repeat.",
    ],
    [
      "I am following up on...",
      "Я возвращаюсь к вопросу о...",
      "I am following up on the complaint you made on Monday.",
    ],
  ],
  readingTitle: "Following up after a transfer failure",
  reading:
    "A conference speaker reported on Tuesday that the arranged airport transfer did not arrive. The night manager booked a taxi and apologised immediately. The guest reached the hotel forty minutes late, but she attended her first session as planned. Since then, the customer success manager has reviewed the supplier log and has discovered that an outdated flight number caused the failure. The hotel has reimbursed the taxi fare, has added a goodwill credit, and has corrected the guest's CRM profile. Yesterday, the transport supplier confirmed a new verification step. No similar incident has occurred so far. In today's follow-up email, the manager gives the exact timeline in Past Simple and uses Present Perfect to show what the hotel has done and what is true now.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete: "The transfer ___ at 8:30 last night." (fail)',
      "failed",
      "Точное законченное время требует Past Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We ___ already ___ the taxi fare." (reimburse)',
      "have reimbursed",
      "Already и актуальный результат требуют Present Perfect.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "The manager called / has called the supplier yesterday."',
      "called",
      "Yesterday сочетается с Past Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "No similar incident ___ since Tuesday." (occur)',
      "has occurred",
      "Since задаёт период до настоящего момента.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "I ___ the guest at checkout this morning." (apologise)',
      "apologised",
      "This morning здесь обозначает завершённый момент.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose "yet" or "last night": "The supplier has not replied ___."',
      "yet",
      "Yet используется в отрицательном Present Perfect.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The team ___ the root cause so far." (identify)',
      "has identified",
      "So far связывает результат с настоящим.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We ___ a replacement room two hours ago." (offer)',
      "offered",
      "Ago требует Past Simple.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      "Write two sentences: give the time of the complaint, then state its current resolution.",
      "The guest reported the issue on Tuesday. We have now resolved it and updated her profile.",
      "первая фраза должна содержать Past Simple с законченным временем, вторая — Present Perfect с актуальным результатом",
    ],
    [
      ExerciseFormat.Rewrite,
      'Rephrase as a follow-up using "since": "The guest complained on Monday. There are no more errors now."',
      "We have recorded no further errors since the guest complained on Monday.",
      "Present Perfect должен описывать период до настоящего, а Past Simple — исходное событие",
    ],
  ],
  writingPrompt:
    "Write a follow-up email to a guest after resolving a complaint about a failed airport transfer.",
  writingRequirements: [
    "Опишите хронологию минимум тремя формами Past Simple.",
    "Сообщите о текущих результатах минимум тремя формами Present Perfect.",
    "Включите apology, root cause, reimbursement и prevention step.",
    "Сохраните спокойный и ответственный тон.",
  ],
});

const futureForms = createLesson({
  slug: "future-forms",
  topic: "future-forms",
  title: "Future Forms",
  sources: grammarSources,
  theory: [
    {
      heading: "Разные виды будущего",
      body: "Will подходит для решения в момент речи, обещания или прогноза. Be going to выражает намерение или прогноз по видимым данным. Present Continuous обозначает согласованную договорённость, а Present Simple — фиксированное расписание.",
    },
    {
      heading: "Профессиональные примеры",
      items: [
        "I will send the revised proposal today.",
        "We are going to add a self-service check-in option.",
        "The event manager is meeting the client at 14:00.",
        "The keynote starts at 09:30 tomorrow.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "После will используйте базовую форму без to. Не подменяйте расписание формой will, если время установлено программой. Выбор формы показывает, является ли будущее обещанием, планом, договорённостью или расписанием.",
    },
  ],
  vocabulary: [
    [
      "event brief",
      "бриф мероприятия",
      "We are reviewing the event brief tomorrow.",
    ],
    [
      "run of show",
      "поминутный сценарий мероприятия",
      "The run of show starts with registration.",
    ],
    [
      "site inspection",
      "осмотр площадки",
      "The client is attending a site inspection on Friday.",
    ],
    ["delegate", "делегат мероприятия", "Two hundred delegates will attend."],
    [
      "breakout room",
      "зал для параллельной сессии",
      "We are going to open two breakout rooms.",
    ],
    [
      "contingency plan",
      "резервный план",
      "The contingency plan will cover bad weather.",
    ],
    [
      "final headcount",
      "окончательное число участников",
      "The client will send the final headcount today.",
    ],
    [
      "cut-off date",
      "крайний срок",
      "The rooming-list cut-off date is next Monday.",
    ],
    ["to allocate", "распределять", "We are going to allocate extra staff."],
    [
      "to confirm availability",
      "подтвердить доступность",
      "I will confirm availability this afternoon.",
    ],
    [
      "scheduled to",
      "запланировано",
      "The gala is scheduled to finish at midnight.",
    ],
    [
      "subject to change",
      "может измениться",
      "The setup time is subject to change.",
    ],
    [
      "I will get back to you by...",
      "Я отвечу вам к...",
      "I will get back to you by 4 p.m.",
    ],
    [
      "We are pleased to confirm that...",
      "Рады подтвердить, что...",
      "We are pleased to confirm that your ballroom is reserved.",
    ],
    [
      "The next step is to...",
      "Следующий шаг — ...",
      "The next step is to approve the floor plan.",
    ],
  ],
  readingTitle: "Planning a hybrid product launch",
  reading:
    "The hotel is hosting a hybrid product launch next month. The main programme begins at 10:00, and the livestream starts fifteen minutes earlier. The event manager is meeting the client on Thursday to approve the floor plan. Based on the latest registration figures, the hotel is going to open another breakout room. The client has just requested an AI-supported help desk for delegates, so the customer success manager makes an immediate promise: she will ask the technology partner for a proposal today. The AV team is testing the streaming connection on Friday, and catering is presenting the final menu after the test. If registrations continue to rise, the hotel will allocate two extra hosts. Each future form makes the status of the action clear.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete the immediate promise: "I ___ contact the AV partner now."',
      "will",
      "Решение и обещание в момент речи выражаются will.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the arrangement: "We ___ meeting the client at 14:00 tomorrow."',
      "are",
      "Согласованная договорённость выражается Present Continuous.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "The keynote starts / will start at 09:30 according to the programme."',
      "starts",
      "Фиксированное расписание требует Present Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the evidence-based plan: "Registrations are rising, so we ___ going to open another room."',
      "are",
      "План на основе текущих данных выражается be going to.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The site inspection ___ place on Friday at 11:00." (take)',
      "takes",
      "Зафиксированное расписание использует Present Simple.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Correct one word: "I will to send the proposal today."',
      "send",
      "После will используется базовая форма без to.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The events team ___ presenting the menu tomorrow."',
      "is",
      "Запланированная встреча: is presenting.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We have approved the budget; we ___ going to hire two hosts."',
      "are",
      "Уже принятое намерение выражается are going to.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Turn these notes into one update using two suitable future forms: "Fixed schedule: registration 8:30. Promise: revised signs today."',
      "Registration opens at 8:30, and I will send the revised signs today.",
      "нужны Present Simple для расписания и will для обещания",
    ],
    [
      ExerciseFormat.Rewrite,
      "Write an update about a confirmed client meeting tomorrow and a plan to add an AI help desk.",
      "We are meeting the client tomorrow, and we are going to add an AI-supported help desk for delegates.",
      "Present Continuous должен выражать договорённость, be going to — намерение",
    ],
  ],
  writingPrompt:
    "Write a planning update to a MICE client about next month's hybrid event.",
  writingRequirements: [
    "Используйте will, be going to, Present Continuous и Present Simple для будущего.",
    "Укажите минимум две фиксированные части расписания.",
    "Сообщите об одной договорённости, одном плане и одном обещании.",
    "Упомяните contingency plan и AI-supported delegate service.",
  ],
});

const modalVerbs = createLesson({
  slug: "modal-verbs",
  topic: "modal-verbs",
  title: "Modal Verbs",
  sources: grammarSources,
  theory: [
    {
      heading: "Функции модальных глаголов",
      body: "Must и have to выражают обязанность; mustn't — запрет, а don't have to — отсутствие необходимости. Should даёт рекомендацию. Can/could описывают возможность или вежливую просьбу; may/might — вероятность.",
    },
    {
      heading: "Форма",
      items: [
        "После can, could, must, should, may и might используется базовая форма без to.",
        "Have to изменяется по времени и лицу: has to, had to.",
        "Guests must show ID. / You don't have to print the voucher.",
        "Could you update the dietary requirements?",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Mustn't не означает «необязательно»: это строгий запрет. Для мягкой рекомендации выбирайте should, а для обязательной процедуры — must или have to. Точная степень давления особенно важна в инструкциях гостям и коллегам.",
    },
  ],
  vocabulary: [
    ["house policy", "правила отеля", "Guests must follow the house policy."],
    [
      "duty of care",
      "обязанность заботиться о безопасности",
      "The hotel has a duty of care.",
    ],
    [
      "accessibility requirement",
      "требование доступности",
      "We must record every accessibility requirement.",
    ],
    [
      "dietary restriction",
      "диетическое ограничение",
      "Catering should confirm each dietary restriction.",
    ],
    [
      "data consent",
      "согласие на обработку данных",
      "Guests must give data consent before profiling.",
    ],
    [
      "emergency exit",
      "аварийный выход",
      "Equipment must not block an emergency exit.",
    ],
    [
      "incident protocol",
      "протокол при инциденте",
      "Staff have to follow the incident protocol.",
    ],
    [
      "authorised personnel",
      "уполномоченный персонал",
      "Only authorised personnel may enter.",
    ],
    [
      "to comply with",
      "соблюдать",
      "Suppliers have to comply with safety rules.",
    ],
    [
      "to waive",
      "отменять требование или сбор",
      "The manager may waive the late fee.",
    ],
    ["mandatory", "обязательный", "ID verification is mandatory."],
    ["optional", "необязательный", "Printing the confirmation is optional."],
    [
      "Could you please...?",
      "Не могли бы вы...",
      "Could you please confirm the guest names?",
    ],
    [
      "You are required to...",
      "Вы обязаны...",
      "You are required to keep the fire lane clear.",
    ],
    [
      "You may wish to...",
      "Возможно, вам стоит...",
      "You may wish to reserve accessible seating.",
    ],
  ],
  readingTitle: "Operational requirements for a gala",
  reading:
    "Before Saturday's gala, every department has to complete a safety check. Suppliers must use the service entrance and must not leave cases near emergency exits. The client does not have to print access passes because the events app can display them. However, each external technician must show photo ID. Catering should review the dietary list again, and it may contact guests if any information is unclear. The customer success manager could use the hotel's AI tool to group dietary notes, but a staff member must verify the result because health requirements cannot be delegated to an automated system. If a guest requests a reasonable adjustment, the team should respond quickly and may waive an additional service fee.",
  graded: [
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "Technicians must / should show photo ID; it is mandatory."',
      "must",
      "Mandatory обозначает обязанность, поэтому must.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the prohibition: "Cases ___ block the emergency exit."',
      "mustn't",
      "Mustn't выражает строгий запрет.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the lack of necessity: "Guests ___ have to print the pass."',
      "don't",
      "Don't have to означает, что действие необязательно.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose the polite request: "Could / Must you confirm the headcount, please?"',
      "Could",
      "Could формирует вежливую просьбу.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the advice: "Catering ___ review the dietary list again."',
      "should",
      "Should выражает рекомендацию.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose the possibility: "The manager may / has to waive the fee."',
      "may",
      "May показывает возможное решение, а не обязанность.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Only authorised staff ___ enter the control room."',
      "may",
      "May здесь выражает разрешение.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Correct one word: "Suppliers must to comply with the policy."',
      "comply",
      "После must нужна базовая форма без to.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Rewrite politely with a modal: "Send the final dietary list today."',
      "Could you please send the final dietary list today?",
      "нужен подходящий modal для вежливой просьбы без изменения срока",
    ],
    [
      ExerciseFormat.Rewrite,
      "Write two contrasting rules: blocking exits is prohibited; printing a voucher is unnecessary.",
      "Equipment mustn't block emergency exits, but guests don't have to print their vouchers.",
      "mustn't должен выражать запрет, а don't have to — отсутствие необходимости",
    ],
  ],
  writingPrompt:
    "Write an operational briefing for hotel staff and suppliers before a large gala dinner.",
  writingRequirements: [
    "Используйте must/have to для минимум трёх обязанностей.",
    "Включите mustn't и don't have to с разными значениями.",
    "Дайте две рекомендации с should и укажите одну возможность с may/might.",
    "Опишите безопасное применение AI при обработке требований гостей.",
  ],
});

const conditionals = createLesson({
  slug: "conditionals",
  topic: "first-and-second-conditionals",
  title: "First & Second Conditionals",
  sources: grammarSources,
  theory: [
    {
      heading: "Реальные и гипотетические условия",
      body: "First Conditional описывает реальное возможное будущее: if + Present Simple, will + base verb. Second Conditional обсуждает воображаемую или маловероятную ситуацию: if + Past Simple, would + base verb.",
    },
    {
      heading: "Сервисные примеры",
      items: [
        "If the room is ready, we will offer early check-in.",
        "If I were the duty manager, I would waive the charge.",
        "Unless означает if not: Unless we act now, the guest will leave dissatisfied.",
        "В if-clause обычно не ставится will.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не используйте would в условной части стандартного Second Conditional. Для формальной рекомендации предпочтительно If I were. Выберите First для вероятного плана восстановления сервиса и Second для гипотетической альтернативы.",
    },
  ],
  vocabulary: [
    [
      "service failure",
      "сбой в обслуживании",
      "If a service failure occurs, we will log it.",
    ],
    [
      "recovery option",
      "вариант восстановления сервиса",
      "We can offer two recovery options.",
    ],
    [
      "room move",
      "переселение в другой номер",
      "If the noise continues, we will arrange a room move.",
    ],
    ["fee waiver", "отмена сбора", "A fee waiver would show flexibility."],
    [
      "upgrade",
      "повышение категории",
      "We will offer an upgrade if one is available.",
    ],
    [
      "retention risk",
      "риск потери клиента",
      "The account would become a retention risk.",
    ],
    [
      "escalation path",
      "порядок эскалации",
      "Follow the escalation path if the guest refuses.",
    ],
    [
      "fallback option",
      "запасной вариант",
      "The fallback option is a partner hotel.",
    ],
    [
      "to make amends",
      "загладить вину",
      "We want to make amends for the disruption.",
    ],
    [
      "to restore confidence",
      "восстановить доверие",
      "A personal call would restore confidence.",
    ],
    [
      "provided that",
      "при условии что",
      "We can extend checkout provided that occupancy permits.",
    ],
    ["unless", "если не", "Unless we respond today, the risk will increase."],
    [
      "If this happens again,...",
      "Если это повторится,...",
      "If this happens again, we will alert the duty manager.",
    ],
    [
      "If I were in your position,...",
      "На вашем месте...",
      "If I were in your position, I would accept the upgrade.",
    ],
    [
      "We would be happy to...",
      "Мы были бы рады...",
      "We would be happy to discuss another option.",
    ],
  ],
  readingTitle: "Choosing a service-recovery response",
  reading:
    "A family has complained twice about noise from a private event. If the music continues after 10 p.m., the duty manager will move the family to a room in the quiet wing. If that room is not ready, the hotel will arrange accommodation at a nearby partner property. The customer success manager also considers a broader question: if she were the guest, she would expect the hotel to recognise the lost sleep, not only provide a new key. She therefore recommends breakfast, transport, and a fee waiver. If the team handles the case consistently, it will reduce the risk of a negative review. If the hotel had unlimited quiet rooms, it would relocate every affected guest, but tonight it needs a realistic first-conditional plan.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete: "If the noise continues, we ___ move the guest."',
      "will",
      "Реальная будущая ситуация требует First Conditional.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "If I ___ the manager, I would waive the fee."',
      "were",
      "В формальной гипотезе используется If I were.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "If a quiet room is available, we ___ offer it."',
      "will",
      "Возможное будущее: will в главной части.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "If we will respond / respond now, we will reduce the risk."',
      "respond",
      "В if-clause First Conditional используется Present Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "If the hotel had more suites, it ___ upgrade every affected guest."',
      "would",
      "Нереальная текущая ситуация требует would.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Replace "if not" with one word: "If we do not act, the guest will leave."',
      "unless",
      "Unless означает if not.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Unless housekeeping ___ the room soon, we will use the partner hotel." (release)',
      "releases",
      "После unless в реальном условии нужен Present Simple.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "What ___ you offer if you were the duty manager?"',
      "would",
      "Гипотетический вопрос строится с would.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      "Write a realistic recovery promise: the room may remain noisy; then the hotel will relocate the guest.",
      "If the room remains noisy, we will relocate you immediately.",
      "нужен First Conditional с Present Simple после if и will в результате",
    ],
    [
      ExerciseFormat.Rewrite,
      "Give a hypothetical recommendation as the customer success manager about waiving the charge.",
      "If I were the customer success manager, I would waive the charge and call the guest personally.",
      "нужен Second Conditional с If I were и would + base verb",
    ],
  ],
  writingPrompt:
    "Write a service-recovery proposal for a guest whose stay was disrupted twice by event noise.",
  writingRequirements: [
    "Используйте минимум три First Conditionals для реального плана.",
    "Используйте минимум два Second Conditionals для альтернатив.",
    "Включите unless или provided that.",
    "Предложите escalation path, compensation и CRM follow-up.",
  ],
});

const passiveVoice = createLesson({
  slug: "passive-voice",
  topic: "passive-voice",
  title: "Passive Voice",
  sources: grammarSources,
  theory: [
    {
      heading: "Когда нужен Passive Voice",
      body: "Пассив ставит в центр действие или результат, когда исполнитель неизвестен, очевиден или менее важен. Он полезен в операционных инструкциях и нейтральных статусах: The request has been logged.",
    },
    {
      heading: "Форма",
      items: [
        "Passive: подходящая форма be + past participle (V3).",
        "Present: is checked; Past: was checked; Present Perfect: has been checked; Future: will be checked.",
        "Исполнителя добавляют с by, только если он важен.",
        "Modal passive: must/can/should + be + V3.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не забывайте been в Present Perfect Passive и be после модального глагола. Пассив не должен скрывать ответственность в извинении, но хорошо показывает этапы внутреннего процесса.",
    },
  ],
  vocabulary: [
    [
      "maintenance request",
      "заявка в техническую службу",
      "The maintenance request has been prioritised.",
    ],
    ["room status", "статус номера", "Room status is updated by housekeeping."],
    [
      "handover log",
      "журнал передачи смены",
      "The incident was entered in the handover log.",
    ],
    ["work order", "наряд на работы", "A work order has been created."],
    [
      "quality check",
      "проверка качества",
      "A quality check is completed before release.",
    ],
    [
      "out of order",
      "не работает; выведен из эксплуатации",
      "The lift has been taken out of order.",
    ],
    [
      "to assign",
      "назначать ответственному",
      "The case was assigned to engineering.",
    ],
    ["to inspect", "осматривать", "The room will be inspected at noon."],
    ["to document", "документировать", "Every action must be documented."],
    [
      "to prioritise",
      "назначать приоритет",
      "Urgent guest issues are prioritised.",
    ],
    ["pending", "в ожидании", "The request is pending approval."],
    [
      "within the agreed timeframe",
      "в согласованный срок",
      "The repair was completed within the agreed timeframe.",
    ],
    [
      "Your request has been logged.",
      "Ваш запрос зарегистрирован.",
      "Your request has been logged under case 418.",
    ],
    [
      "The matter is being investigated.",
      "Вопрос расследуется.",
      "The matter is being investigated by the duty team.",
    ],
    [
      "You will be kept informed.",
      "Вас будут информировать.",
      "You will be kept informed at every stage.",
    ],
  ],
  readingTitle: "How a guest request moves through the hotel",
  reading:
    "When a guest reports a technical issue, the request is first logged in the CRM. A priority is assigned according to safety and guest impact. The relevant department is then notified automatically, but the suggested category is checked by a team member. If a room cannot be used, it is marked out of order and alternative accommodation is offered. Every action must be documented in the handover log. Once the repair has been completed, the room is inspected by a supervisor. The guest is contacted before the case is closed, and the outcome is recorded for future stays. This process allows clear updates without naming every employee at every stage.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete the present passive: "The request ___ logged in the CRM."',
      "is",
      "Present Passive: is + logged.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the past passive: "The room ___ inspected yesterday."',
      "was",
      "Past Passive для room: was + V3.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the present perfect passive: "A work order ___ been created."',
      "has",
      "Present Perfect Passive: has been created.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the future passive: "The guest ___ be contacted after the repair."',
      "will",
      "Future Passive: will be + V3.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Change the verb to V3: "Every action must be ___ (document)."',
      "documented",
      "Modal Passive: must be documented.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The lift is being ___ now." (inspect)',
      "inspected",
      "Continuous Passive: is being + V3.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "The case assigned / was assigned to engineering."',
      "was assigned",
      "Пассив требует форму be перед V3.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Alternative rooms can ___ offered immediately."',
      "be",
      "После modal в пассиве требуется be + V3.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Rewrite in the passive: "Housekeeping updates the room status after inspection."',
      "The room status is updated after inspection.",
      "нужен Present Simple Passive; исполнитель можно опустить",
    ],
    [
      ExerciseFormat.Rewrite,
      'Turn into a neutral status update: "Engineering has repaired the lift and a supervisor will test it."',
      "The lift has been repaired and will be tested by a supervisor.",
      "нужны корректные Present Perfect Passive и Future Passive",
    ],
  ],
  writingPrompt:
    "Write a process update explaining how the hotel handles and closes an urgent maintenance request from a guest.",
  writingRequirements: [
    "Используйте минимум шесть passive forms в разных временах.",
    "Включите один modal passive.",
    "Упомяните CRM, work order, inspection и guest follow-up.",
    "Не скрывайте ответственность за извинение, но описывайте процесс нейтрально.",
  ],
});

const relativeClauses = createLesson({
  slug: "relative-clauses",
  topic: "relative-clauses",
  title: "Relative Clauses",
  sources: grammarSources,
  theory: [
    {
      heading: "Defining и non-defining clauses",
      body: "Defining clause уточняет, о каком человеке или объекте идёт речь, и не отделяется запятыми. Non-defining clause добавляет необязательную информацию и выделяется запятыми.",
    },
    {
      heading: "Относительные слова",
      items: [
        "who — люди; which — предметы и организации; that — люди или предметы в defining clauses.",
        "whose показывает принадлежность; where относится к месту.",
        "Our CRM, which was updated in May, stores guest preferences.",
        "The coordinator who owns the account will call today.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не используйте that в non-defining clause после запятой. Следите за двумя запятыми вокруг вставной информации. Выбирайте clause по вопросу: информация идентифицирует объект или лишь добавляет деталь?",
    },
  ],
  vocabulary: [
    [
      "CRM profile",
      "профиль в CRM",
      "The CRM profile that contains the preference is current.",
    ],
    [
      "account owner",
      "ответственный за клиента",
      "The account owner who manages the group will call.",
    ],
    [
      "guest preference",
      "предпочтение гостя",
      "Record every preference that affects the stay.",
    ],
    [
      "consent record",
      "запись о согласии",
      "The consent record, which is encrypted, must be current.",
    ],
    [
      "data field",
      "поле данных",
      "Use the field that stores accessibility needs.",
    ],
    [
      "duplicate record",
      "дублирующая запись",
      "The duplicate record was merged.",
    ],
    [
      "property management system",
      "система управления отелем",
      "The PMS, which stores reservations, syncs with the CRM.",
    ],
    [
      "loyalty status",
      "статус программы лояльности",
      "Guests whose loyalty status is Gold receive a benefit.",
    ],
    [
      "data retention",
      "хранение данных",
      "The policy that governs data retention is strict.",
    ],
    [
      "single source of truth",
      "единый достоверный источник данных",
      "The CRM should be our single source of truth.",
    ],
    [
      "to merge records",
      "объединять записи",
      "We merge records that belong to one guest.",
    ],
    ["to flag", "помечать", "Flag profiles whose consent has expired."],
    [
      "The guest who...",
      "Гость, который...",
      "The guest who booked the suite prefers a quiet floor.",
    ],
    [
      "the property where...",
      "отель, где...",
      "This is the property where the gala will take place.",
    ],
    [
      "which means that...",
      "что означает, что...",
      "The profile is duplicated, which means that updates may be missed.",
    ],
  ],
  readingTitle: "Creating a reliable client profile",
  reading:
    "The hotel group uses a CRM that combines event contacts, guest preferences, and follow-up history. The account owner who manages a conference must check the organiser's profile before every call. Duplicate records, which can hide recent updates, are merged by an authorised employee. Preferences that affect service delivery are shared with the relevant property, while private notes that have no operational purpose are removed. The consent record, which shows how information may be used, is reviewed before an AI tool summarises the account. Any summary that is generated by the tool is verified against the CRM, which remains the single source of truth. This process helps teams recognise returning clients without relying on unverified assumptions.",
  graded: [
    [
      ExerciseFormat.ShortAnswer,
      'Choose the relative pronoun: "The coordinator ___ manages the account will call."',
      "who",
      "Who относится к человеку.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "The CRM, who / which was updated in May, is stable."',
      "which",
      "Which относится к системе, не к человеку.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Guests ___ consent has expired must be contacted."',
      "whose",
      "Whose показывает принадлежность consent гостям.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "This is the hotel ___ the gala will take place."',
      "where",
      "Where относится к месту.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose for a defining clause: "the field that / whose stores preferences"',
      "that",
      "That может относиться к предмету в defining clause.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Our PMS, ___ stores reservations, syncs hourly."',
      "which",
      "Non-defining clause после запятой требует which.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "the guest which / who requested a quiet room"',
      "who",
      "Для человека используется who.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We merge records ___ belong to the same guest."',
      "that",
      "Defining clause идентифицирует нужные records.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Combine: "The account owner will call. She manages the conference group."',
      "The account owner who manages the conference group will call.",
      "нужен defining relative clause с who без запятых",
    ],
    [
      ExerciseFormat.Rewrite,
      'Combine with extra information: "The CRM remains the source of truth. It was upgraded in May."',
      "The CRM, which was upgraded in May, remains the source of truth.",
      "нужен non-defining clause с which и парой запятых",
    ],
  ],
  writingPrompt:
    "Write a CRM quality note explaining which client and guest records should be checked before a major event.",
  writingRequirements: [
    "Используйте минимум три defining relative clauses.",
    "Используйте минимум два non-defining clauses с правильными запятыми.",
    "Включите who, whose, which и where.",
    "Упомяните consent, duplicate records и проверку AI summary.",
  ],
});

const reportedSpeech = createLesson({
  slug: "reported-speech",
  topic: "reported-speech",
  title: "Reported Speech",
  sources: grammarSources,
  theory: [
    {
      heading: "Передача чужих слов",
      body: "Reported Speech передаёт содержание разговора без дословной цитаты. После глагола в прошлом время обычно сдвигается назад: present → past, will → would, can → could, present perfect → past perfect.",
    },
    {
      heading: "Утверждения, вопросы и просьбы",
      items: [
        "She said that the room was noisy.",
        "He asked whether the transfer had been confirmed.",
        "She asked us to call after 6 p.m.",
        "Tell требует дополнения: told me; say употребляется без него: said that.",
      ],
    },
    {
      heading: "Изменение указателей",
      body: "Today часто становится that day, tomorrow — the next day, here — there. В косвенном вопросе прямой порядок слов: he asked when the room would be ready. Не добавляйте do/did.",
    },
  ],
  vocabulary: [
    [
      "guest statement",
      "заявление гостя",
      "The log contains the guest's statement.",
    ],
    [
      "shift handover",
      "передача смены",
      "Reported speech keeps the shift handover neutral.",
    ],
    [
      "escalation note",
      "заметка об эскалации",
      "I added an escalation note to the case.",
    ],
    [
      "verbatim quote",
      "дословная цитата",
      "Use a verbatim quote only when necessary.",
    ],
    [
      "reported concern",
      "переданная жалоба",
      "The reported concern involved room noise.",
    ],
    [
      "requested action",
      "запрошенное действие",
      "The requested action was a manager call.",
    ],
    [
      "to clarify",
      "уточнять",
      "The supervisor asked us to clarify the timeline.",
    ],
    ["to state", "заявлять", "The guest stated that the transfer was late."],
    ["to mention", "упоминать", "She mentioned that this was her second stay."],
    [
      "to confirm",
      "подтверждать",
      "The agent confirmed that a credit had been added.",
    ],
    [
      "according to",
      "согласно",
      "According to the night manager, the call ended at midnight.",
    ],
    [
      "the following day",
      "на следующий день",
      "He said he would reply the following day.",
    ],
    [
      "The guest explained that...",
      "Гость объяснил, что...",
      "The guest explained that the room had not been cleaned.",
    ],
    [
      "She asked whether...",
      "Она спросила, ли...",
      "She asked whether breakfast was included.",
    ],
    [
      "He asked us to...",
      "Он попросил нас...",
      "He asked us to contact the organiser.",
    ],
  ],
  readingTitle: "A neutral shift-handover record",
  reading:
    "During the evening shift, a guest said that music from the ballroom was disturbing his call. He explained that he had contacted reception earlier and asked whether the event would finish before midnight. The receptionist told him that the duty manager was checking the schedule. The event coordinator later confirmed that the music would end at 11:30 and said that security had already closed the terrace doors. The guest asked the team to call him when the room was quiet. In the handover log, the night manager recorded what each person had said, distinguished confirmed facts from reported concerns, and noted that the customer success manager would follow up the next day.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Report: She said, "The room is noisy." → She said that the room ___ noisy.',
      "was",
      "Present обычно сдвигается в Past после said.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Report: He said, "I will call." → He said that he ___ call.',
      "would",
      "Will сдвигается в would.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Report: She said, "I have updated the case." → She said she ___ updated the case.',
      "had",
      "Present Perfect сдвигается в Past Perfect.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "The guest told / said me that the room was cold."',
      "told",
      "Tell требует дополнения: told me.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Report the yes/no question: "Is breakfast included?" → She asked ___ breakfast was included.',
      "whether",
      "Косвенный общий вопрос вводится whether/if.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose the correct order: "He asked when would the room / the room would be ready."',
      "the room would be ready",
      "В косвенном вопросе прямой порядок слов.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Report the request: "Please call me." → He asked us ___ call him.',
      "to",
      "Просьба: asked + object + to-infinitive.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Change "tomorrow" in past reporting: "She said she would reply ___."',
      "the next day",
      "Tomorrow обычно меняется на the next day.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Report neutrally: The guest said, "I called reception twice, and nobody has replied."',
      "The guest said that he had called reception twice and that nobody had replied.",
      "нужен корректный backshift и нейтральная передача без добавления фактов",
    ],
    [
      ExerciseFormat.Rewrite,
      'Report this question and request: "When will the event end? Please call me afterwards."',
      "The guest asked when the event would end and asked us to call him afterwards.",
      "косвенный вопрос должен иметь прямой порядок слов, просьба — asked + object + to-infinitive",
    ],
  ],
  writingPrompt:
    "Write a neutral CRM escalation note after a guest complaint involving reception, the events team, and the duty manager.",
  writingRequirements: [
    "Передайте минимум три утверждения с backshift.",
    "Включите один косвенный вопрос и одну косвенную просьбу.",
    "Различайте подтверждённые действия и слова гостя.",
    "Укажите agreed follow-up без обвинительного тона.",
  ],
});

const linkingWords = createLesson({
  slug: "linking-words-cohesion",
  topic: "linking-words-and-cohesion",
  title: "Linking Words & Cohesion",
  sources: grammarSources,
  theory: [
    {
      heading: "Логика текста",
      body: "Связки показывают отношение между идеями: addition (furthermore), contrast (however/although), cause (because), result (therefore/as a result), example (for instance) и sequence (first/finally).",
    },
    {
      heading: "Позиция и пунктуация",
      items: [
        "However и therefore как sentence adverbs обычно отделяются запятой.",
        "Although вводит придаточное и не употребляется вместе с but в одной конструкции.",
        "Because называет причину; therefore и as a result вводят следствие.",
        "This/these + noun помогают связать предложения: This delay affected check-in.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "Не заполняйте текст однотипными also. Сначала определите логическую связь, затем выберите точный connector. Проверяйте, чтобы местоимения this/they имели ясную отсылку.",
    },
  ],
  vocabulary: [
    [
      "onboarding milestone",
      "этап онбординга",
      "The first onboarding milestone is data import.",
    ],
    [
      "success plan",
      "план достижения целей клиента",
      "The success plan defines measurable outcomes.",
    ],
    [
      "adoption rate",
      "уровень использования",
      "The adoption rate has increased.",
    ],
    [
      "follow-up action",
      "последующее действие",
      "Each follow-up action has an owner.",
    ],
    [
      "stakeholder alignment",
      "согласованность участников",
      "Stakeholder alignment remains important.",
    ],
    [
      "implementation gap",
      "пробел во внедрении",
      "However, one implementation gap remains.",
    ],
    [
      "therefore",
      "поэтому",
      "Training was delayed; therefore, adoption remained low.",
    ],
    [
      "however",
      "однако",
      "The setup is complete; however, two users need access.",
    ],
    [
      "furthermore",
      "более того",
      "Furthermore, the dashboard is now available.",
    ],
    [
      "as a result",
      "в результате",
      "The team practised weekly; as a result, response time improved.",
    ],
    [
      "although",
      "хотя",
      "Although the client is live, onboarding is not complete.",
    ],
    [
      "for instance",
      "например",
      "For instance, managers can review unresolved cases.",
    ],
    [
      "To summarise,...",
      "Подводя итог,...",
      "To summarise, the launch is on track.",
    ],
    [
      "The main reason is that...",
      "Основная причина в том, что...",
      "The main reason is that permissions arrived late.",
    ],
    [
      "As a next step,...",
      "В качестве следующего шага,...",
      "As a next step, we will schedule role-based training.",
    ],
  ],
  readingTitle: "A structured onboarding follow-up",
  reading:
    "The hotel group has completed the first stage of onboarding to a guest-messaging platform. First, the customer success team imported property and contact data. The import finished on time; however, several user roles were incomplete. The team therefore held an additional access workshop. Furthermore, it created short guides for front-desk and reservations staff. Although the core workflow is now live, adoption differs between properties. For instance, the airport hotel uses automated arrival messages daily, whereas the city property still sends many messages manually. As a result, the next success-plan milestone will focus on role-based coaching. This targeted support should improve adoption and, at the same time, preserve human review for sensitive guest conversations.",
  graded: [
    [
      ExerciseFormat.ShortAnswer,
      'Choose contrast: "The setup is complete; ___, two roles are missing."',
      "however",
      "However вводит контраст.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose result: "Training was delayed; ___, adoption stayed low."',
      "therefore",
      "Therefore вводит следствие.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete addition: "___, we created a guide for reception staff."',
      "Furthermore",
      "Furthermore добавляет ещё один аргумент.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose cause: "Adoption improved because / therefore staff practised weekly."',
      "because",
      "Because вводит причину внутри предложения.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete contrast: "___ the workflow is live, onboarding is not complete."',
      "Although",
      "Although вводит уступительное придаточное.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose an example marker: "For instance / As a result, managers can review open cases."',
      "For instance",
      "For instance вводит пример.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete the sequence: "___, we imported the contact data; then we configured roles."',
      "First",
      "First обозначает первый этап.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Remove the redundant connector: "Although adoption rose, but two teams need help."',
      "but",
      "Although уже выражает контраст, поэтому but удаляется.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      'Join with a cause-and-result link: "Permissions arrived late. The workshop moved to Friday."',
      "Permissions arrived late; therefore, the workshop moved to Friday.",
      "нужна ясная связь причины и результата с корректной пунктуацией",
    ],
    [
      ExerciseFormat.Rewrite,
      'Turn the notes into a cohesive update using contrast and addition: "Core workflow live. Two roles missing. Guides created."',
      "The core workflow is live; however, two roles are still missing. Furthermore, we have created user guides.",
      "нужны точные connectors для contrast и addition, а также логичная отсылка",
    ],
  ],
  writingPrompt:
    "Write a follow-up email after the first month of onboarding a hotel group to an AI-supported guest-messaging platform.",
  writingRequirements: [
    "Организуйте письмо как progress, gap, cause, result и next step.",
    "Используйте минимум шесть разных linking words.",
    "Включите хотя бы один contrast, cause, result и example.",
    "Упомяните adoption data, human review и следующую встречу.",
  ],
});

const gerundsInfinitives = createLesson({
  slug: "gerunds-infinitives",
  topic: "gerunds-and-infinitives",
  title: "Gerunds & Infinitives",
  sources: grammarSources,
  theory: [
    {
      heading: "Основные модели",
      body: "Gerund (-ing) употребляется после enjoy, avoid, consider, recommend и предлогов. To-infinitive следует после agree, decide, plan, hope, need и want. Некоторые глаголы меняют значение в зависимости от модели.",
    },
    {
      heading: "Профессиональные примеры",
      items: [
        "We recommend reviewing AI-generated replies.",
        "The team agreed to update the CRM daily.",
        "Remember to call the guest means не забыть позвонить; remember calling означает помнить сам звонок.",
        "We improved consistency by creating response templates.",
      ],
    },
    {
      heading: "Типичные ошибки и вывод",
      body: "После recommend обычно нужен gerund или that-clause, не object + to-infinitive. После предлога используйте -ing. Запоминайте не отдельный глагол, а его модель в полезной рабочей фразе.",
    },
  ],
  vocabulary: [
    [
      "AI-assisted reply",
      "ответ с поддержкой ИИ",
      "We recommend reviewing every AI-assisted reply.",
    ],
    [
      "quality assurance",
      "контроль качества",
      "Quality assurance includes sampling conversations.",
    ],
    [
      "response template",
      "шаблон ответа",
      "The team decided to revise the response template.",
    ],
    [
      "sentiment flag",
      "метка тональности",
      "Avoid treating a sentiment flag as a final decision.",
    ],
    [
      "human review",
      "проверка человеком",
      "Human review prevents sending unsuitable advice.",
    ],
    [
      "feedback loop",
      "цикл обратной связи",
      "We plan to strengthen the feedback loop.",
    ],
    [
      "case summary",
      "резюме обращения",
      "The tool helps agents create a case summary.",
    ],
    [
      "knowledge base",
      "база знаний",
      "Staff practise finding approved knowledge-base articles.",
    ],
    [
      "to avoid doing",
      "избегать действия",
      "Avoid sharing sensitive details in prompts.",
    ],
    [
      "to agree to do",
      "согласиться сделать",
      "The manager agreed to review flagged replies.",
    ],
    [
      "to recommend doing",
      "рекомендовать действие",
      "We recommend measuring resolution quality.",
    ],
    [
      "by doing",
      "посредством действия",
      "We reduce errors by checking source data.",
    ],
    [
      "We plan to...",
      "Мы планируем...",
      "We plan to train the night team next week.",
    ],
    [
      "It is worth considering...",
      "Стоит рассмотреть...",
      "It is worth considering a smaller pilot.",
    ],
    [
      "Please remember to...",
      "Пожалуйста, не забудьте...",
      "Please remember to record the final outcome.",
    ],
  ],
  readingTitle: "Using AI without losing service quality",
  reading:
    "The customer success team has started using an AI assistant to summarise long guest cases and draft routine follow-up messages. Agents appreciate saving time, but the hotel avoids sending generated text without review. Team leaders recommend checking names, dates, promised actions, and policy references before approving a reply. They also ask agents to remove unnecessary personal data before entering a prompt. The operations manager plans to sample ten conversations each week and hopes to identify recurring gaps in the knowledge base. By comparing AI suggestions with final human responses, the team can improve its templates. The goal is not to replace listening to guests; it is to give staff more time to understand complex needs and complete meaningful follow-up.",
  graded: [
    [
      ExerciseFormat.FillBlank,
      'Complete: "We recommend ___ every AI-assisted reply." (review)',
      "reviewing",
      "Recommend обычно требует gerund.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The manager agreed ___ flagged cases daily." (check)',
      "to check",
      "Agree требует to-infinitive.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Avoid ___ personal data in a prompt." (share)',
      "sharing",
      "Avoid требует gerund.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We plan ___ the night team next week." (train)',
      "to train",
      "Plan требует to-infinitive.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "We improve quality by ___ source data." (verify)',
      "verifying",
      "После предлога by нужен gerund.",
    ],
    [
      ExerciseFormat.ShortAnswer,
      'Choose: "Please remember recording / to record the outcome after the call."',
      "to record",
      "Remember to do означает не забыть выполнить действие.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "Agents enjoy ___ time on routine summaries." (save)',
      "saving",
      "Enjoy требует gerund.",
    ],
    [
      ExerciseFormat.FillBlank,
      'Complete: "The team hopes ___ recurring knowledge gaps." (identify)',
      "to identify",
      "Hope требует to-infinitive.",
    ],
  ],
  open: [
    [
      ExerciseFormat.Rewrite,
      "Give two recommendations using a gerund and a to-infinitive: review AI replies; agree on weekly sampling.",
      "We recommend reviewing AI-assisted replies and advise team leaders to agree on weekly sampling.",
      "нужны одна корректная gerund-модель и одна корректная to-infinitive-модель",
    ],
    [
      ExerciseFormat.Rewrite,
      'Explain the method with "by": "Check CRM facts. This reduces incorrect follow-ups."',
      "The team can reduce incorrect follow-ups by checking CRM facts before sending a reply.",
      "by + gerund должен ясно выражать способ достижения результата",
    ],
  ],
  writingPrompt:
    "Write an internal recommendation for introducing an AI assistant into customer-success follow-up work at a hotel group.",
  writingRequirements: [
    "Используйте минимум четыре gerunds после глаголов или предлогов.",
    "Используйте минимум четыре to-infinitives.",
    "Включите recommend, avoid, agree/decide и plan/hope.",
    "Опишите human review, data protection, quality sampling и feedback loop.",
  ],
});

export const englishCustomerSuccessLessons: readonly Lesson[] = [
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
];

// Compatibility export for code that used the original single lesson.
export const englishCustomerSuccessTenses = pastSimplePresentPerfect;
