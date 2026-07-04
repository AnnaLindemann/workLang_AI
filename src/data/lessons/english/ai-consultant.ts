// Static lesson content — English / AI Consultant (towards B2).
//
// Grammar focus: first and second conditionals for framing recommendations,
// proposals, and trade-offs to a client. Original content authored for
// WorkLang AI; see the content principles in docs/roadmap.md. No copyrighted
// text is reproduced. Grammar explanations and vocabulary glosses are in
// Russian; example sentences stay in English.

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

export const englishAiConsultantConditionals: Lesson = {
  id: lessonId("en-ai-consultant-conditionals"),
  language: Language.English,
  careerTrack: CareerTrack.AiConsultant,
  title: "Making recommendations: first and second conditionals",
  targetLevel: CefrLevel.B2,
  sources: [
    "Cambridge Dictionary — English Grammar (conditionals)",
    "British Council — LearnEnglish (conditionals)",
    "Oxford Learner's Dictionaries — grammar reference",
  ],
  activities: [
    {
      id: activityId("en-ai-consultant-conditionals-review"),
      kind: ActivityKind.Review,
      title: "Review",
    },
    {
      id: activityId("en-ai-consultant-conditionals-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "First and second conditionals",
      sections: [
        {
          heading: "Что это значит",
          body:
            "Условные предложения связывают действие с его последствием. В " +
            "консалтинге это удобный способ подать рекомендацию: вы показываете " +
            "клиенту, что произойдёт, если выбрать тот или иной вариант.",
        },
        {
          heading: "Когда использовать",
          body:
            "First conditional — для реальной и вероятной ситуации, когда вы " +
            "считаете план выполнимым. Second conditional — для гипотетической " +
            "или маловероятной ситуации, а также для осторожных предположений.",
        },
        {
          heading: "Формула",
          items: [
            "First conditional: if + Present Simple, … will + инфинитив.",
            "Second conditional: if + Past Simple, … would + инфинитив.",
          ],
        },
        {
          heading: "Примеры",
          items: [
            "If we deploy the pilot in Q3, we will collect real usage data.",
            "If the budget were larger, we would train a custom model.",
            "If we align the stakeholders early, the rollout will run more smoothly.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Не ставьте will в придаточное с if: не «if we will deploy», а «if we deploy».",
            "В нереальном условии используйте were для всех лиц: «if the model were ready».",
            "Запятая нужна, только когда придаточное с if стоит первым.",
          ],
        },
        {
          heading: "Запомните",
          body:
            "Можете подставить конкретное будущее и верите в него — берите " +
            "first conditional (will). Ситуация воображаемая или маловероятная " +
            "— берите second conditional (would).",
        },
      ],
    },
    {
      id: activityId("en-ai-consultant-conditionals-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Professional vocabulary: AI consulting",
      items: [
        {
          term: "stakeholder",
          translation:
            "заинтересованная сторона — человек или группа, влияющие на проект",
          example:
            "If we align the stakeholders early, the rollout will run more " +
            "smoothly.",
        },
        {
          term: "deliverable",
          translation: "результат работы, который получает клиент",
          example:
            "The first deliverable is a proof of concept due in three weeks.",
        },
        {
          term: "scope",
          translation: "объём работ — согласованные границы задачи",
          example: "If the scope grew, we would revise the timeline.",
        },
        {
          term: "proof of concept",
          translation:
            "подтверждение концепции — небольшой прототип для проверки осуществимости",
          example:
            "We will start with a proof of concept before any full rollout.",
        },
        {
          term: "data pipeline",
          translation:
            "конвейер данных — автоматический поток подготовки данных",
          example:
            "If the data pipeline were reliable, we could retrain the model " +
            "weekly.",
        },
        {
          term: "rollout",
          translation: "развёртывание — поэтапный выпуск решения",
          example: "A staged rollout would reduce the risk of disruption.",
        },
      ],
    },
    {
      id: activityId("en-ai-consultant-conditionals-reading"),
      kind: ActivityKind.Reading,
      title: "A consultant weighs two options",
      text:
        "Thank you for sharing your goals for the next quarter. Based on the " +
        "current scope, I would recommend a staged approach. If we begin with " +
        "a proof of concept in July, we will have real usage data before any " +
        "wider rollout, and the stakeholders will be able to judge the value " +
        "for themselves. A full custom model is also possible, but it is more " +
        "ambitious: if the budget were larger and the data pipeline were " +
        "already in place, we would build it from the start. For now, the " +
        "safer path is to prove value first and expand the scope once the " +
        "results are clear.",
    },
    {
      id: activityId("en-ai-consultant-conditionals-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Practice: conditionals",
      exercises: [
        {
          id: exerciseId("en-ai-consultant-conditionals-ex1"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If we ___ (deploy) the ' +
            'pilot next quarter, we will collect real usage data."',
          expectedAnswer: "deploy",
          explanation:
            "First conditional: часть с «if» — в Present Simple («deploy»), " +
            "главная часть — с «will».",
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex2"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If the budget ___ (be) ' +
            'larger, we would train a custom model."',
          expectedAnswer: "were",
          acceptedAnswers: ["was"],
          explanation:
            "Second conditional: в части с «if» — Past Simple. В аккуратном " +
            "письме предпочтителен «were» для всех лиц.",
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex3"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.ShortAnswer,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with "will" or "would": "If we align the ' +
            'stakeholders early, the rollout ___ run more smoothly."',
          expectedAnswer: "will",
          explanation:
            "Часть с «if» — в Present Simple (реальный, вероятный план), " +
            "поэтому в главной части — «will»: first conditional.",
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex4"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.ShortAnswer,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with "will" or "would": "If the scope grew, we ___ ' +
            'revise the timeline."',
          expectedAnswer: "would",
          explanation:
            "Часть с «if» — в Past Simple («grew») для гипотезы, поэтому в " +
            "главной части — «would»: second conditional.",
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex5"),
          evaluation: ExerciseEvaluation.Graded,
          format: ExerciseFormat.FillBlank,
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If the data pipeline ___ ' +
            '(be) reliable, we could retrain the model weekly."',
          expectedAnswer: "were",
          acceptedAnswers: ["was"],
          explanation:
            "Second conditional с «could»: часть с «if» — в Past Simple, и " +
            "«were» предпочтителен в аккуратном письме.",
        },
      ],
    },
    {
      id: activityId("en-ai-consultant-conditionals-writing"),
      kind: ActivityKind.Writing,
      title: "Writing task",
      prompt:
        "A client has asked whether to start with a small pilot or commit to " +
        "a full custom solution now. Write a short recommendation email that " +
        "explains the trade-offs and ends with a clear recommendation.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Используйте не менее двух условных предложений первого типа (first conditional).",
        "Используйте не менее двух условных предложений второго типа (second conditional).",
        "Объясните компромиссы между пилотом и полным решением.",
        "Закончите письмо чёткой рекомендацией.",
      ],
    },
  ],
};
