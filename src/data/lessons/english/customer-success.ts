// Static lesson content — English / Customer Success & Hospitality (towards B2).
//
// Grammar focus: present perfect vs past simple for following up with
// customers — reporting what has been done, and what happened at a specific
// past moment. Original content authored for WorkLang AI; see the content
// principles in docs/roadmap.md. No copyrighted text is reproduced. Grammar
// explanations and vocabulary glosses are in Russian; examples stay in English.

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

export const englishCustomerSuccessTenses: Lesson = {
  id: lessonId("en-customer-success-present-perfect"),
  language: Language.English,
  careerTrack: CareerTrack.CustomerSuccessHospitality,
  title: "Following up: present perfect vs past simple",
  targetLevel: CefrLevel.B2,
  sources: [
    "Cambridge Dictionary — English Grammar (present perfect)",
    "British Council — LearnEnglish (present perfect and past simple)",
    "Oxford Learner's Dictionaries — grammar reference",
  ],
  activities: [
    {
      id: activityId("en-customer-success-present-perfect-review"),
      kind: ActivityKind.Review,
      title: "Review",
    },
    {
      id: activityId("en-customer-success-present-perfect-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Present perfect vs past simple",
      sections: [
        {
          heading: "Что это значит",
          body:
            "В ответе клиенту выбранное время меняет смысл. Past Simple " +
            "сообщает о законченном действии в конкретный момент прошлого. " +
            "Present Perfect сообщает о результате, который важен сейчас, без " +
            "указания точного времени.",
        },
        {
          heading: "Когда использовать",
          body:
            "Past Simple — с маркерами конкретного времени: yesterday, this " +
            "morning, a moment ago. Present Perfect — когда время не названо и " +
            "результат всё ещё в силе; часто с already, just, yet, so far.",
        },
        {
          heading: "Формула",
          items: [
            "Past Simple: подлежащее + глагол в прошедшем (V2).",
            "Present Perfect: have/has + причастие прошедшего времени (V3).",
          ],
        },
        {
          heading: "Примеры",
          items: [
            "I escalated your ticket this morning.",
            "I have escalated your ticket, so our senior team is already looking into it.",
            "We have already resolved the issue.",
            "Have you received our reply yet?",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Не сочетайте Present Perfect с точным прошедшим: не «I have escalated it yesterday», а «I escalated it yesterday».",
            "yet — в вопросах и отрицаниях; already — в утверждениях.",
            "has — для he/she/it; have — для остальных лиц.",
          ],
        },
        {
          heading: "Запомните",
          body:
            "Можно добавить конкретный момент прошлого — берите Past Simple. " +
            "Сообщаете результат, который всё ещё верен, — берите Present " +
            "Perfect.",
        },
      ],
    },
    {
      id: activityId("en-customer-success-present-perfect-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Professional vocabulary: customer success",
      items: [
        {
          term: "to escalate",
          translation: "передать вопрос на более высокий уровень поддержки",
          example: "I have escalated your case to our senior team.",
        },
        {
          term: "ticket",
          translation: "заявка — зафиксированный запрос клиента",
          example: "Your ticket was created this morning at 9:14.",
        },
        {
          term: "to follow up",
          translation: "вернуться к вопросу после предыдущего контакта",
          example: "I am following up on the request you sent last week.",
        },
        {
          term: "onboarding",
          translation: "адаптация — помощь новому клиенту начать работу",
          example: "We have completed the onboarding for your whole team.",
        },
        {
          term: "resolution",
          translation: "решение, которое закрывает обращение",
          example: "A resolution was sent to you yesterday afternoon.",
        },
        {
          term: "churn",
          translation: "отток клиентов — уходы или отмены",
          example: "Faster replies have reduced churn this quarter.",
        },
      ],
    },
    {
      id: activityId("en-customer-success-present-perfect-reading"),
      kind: ActivityKind.Reading,
      title: "A follow-up message",
      text:
        "Hi Daniel, thank you for your patience. I am following up on the " +
        "issue you reported yesterday. Our senior team has already reviewed " +
        "the logs, and we have found the cause of the delay. I escalated your " +
        "ticket this morning, and a fix was deployed a few hours ago. We have " +
        "not seen the error again since then, but please let me know if it " +
        "returns. I have also added a note to your account so that future " +
        "requests are handled faster. Thanks again for flagging this.",
    },
    {
      id: activityId("en-customer-success-present-perfect-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Practice: present perfect vs past simple",
      exercises: [
        {
          id: exerciseId("en-customer-success-present-perfect-ex1"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct form of "escalate": "I ___ your ' +
            'ticket to our senior team a moment ago."',
          expectedAnswer: "escalated",
          explanation:
            "«A moment ago» — конкретный момент в прошлом, поэтому Past " +
            "Simple: «escalated».",
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex2"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct form of "resolve": "We ___ already ' +
            '___ your issue, so no further action is needed." (one word per ' +
            "gap)",
          expectedAnswer: "have resolved",
          explanation:
            "«Already» с результатом, который важен сейчас, требует Present " +
            "Perfect: «have already resolved».",
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex3"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.ShortAnswer,
          skillArea: SkillArea.Grammar,
          prompt:
            'Choose the correct form: "A fix ___ (be) deployed yesterday ' +
            'afternoon."',
          expectedAnswer: "was",
          explanation:
            "«Yesterday afternoon» — завершённый момент в прошлом, поэтому " +
            "Past Simple: «was».",
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex4"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the present perfect of "complete": "We ___ the ' +
            'onboarding for your whole team." (two words)',
          expectedAnswer: "have completed",
          explanation:
            "Времени нет, а результат всё ещё актуален — Present Perfect: " +
            "«have completed».",
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex5"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.ShortAnswer,
          skillArea: SkillArea.Grammar,
          prompt:
            'Choose "yet" or "already": "Have you received our reply ' +
            '___?"',
          expectedAnswer: "yet",
          explanation:
            "В вопросах в Present Perfect «yet» спрашивает, произошло ли " +
            "что-то к настоящему моменту.",
        },
      ],
    },
    {
      id: activityId("en-customer-success-present-perfect-writing"),
      kind: ActivityKind.Writing,
      title: "Writing task",
      prompt:
        "A customer reported a problem yesterday and your team has now fixed " +
        "it. Write a short follow-up email that reassures them.",
      wordRange: { min: 100, max: 130 },
      requirements: [
        "Используйте Past Simple для конкретных шагов в известный момент прошлого (не менее трёх).",
        "Используйте Present Perfect для результатов, которые важны сейчас (не менее трёх).",
        "Выдержите тон, который успокаивает и обнадёживает клиента.",
      ],
    },
  ],
};
