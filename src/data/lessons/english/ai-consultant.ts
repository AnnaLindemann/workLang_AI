// Static lesson content — English / AI Consultant (towards B2).
//
// Grammar focus: first and second conditionals for framing recommendations,
// proposals, and trade-offs to a client. Original content authored for
// WorkLang AI; see the content principles in docs/roadmap.md. No copyrighted
// text is reproduced.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
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
      content:
        "Conditionals let you frame a recommendation around its consequences, " +
        "which is exactly what a client needs when weighing options. Use the " +
        'first conditional for a real, likely situation: "if" + present ' +
        'simple, then "will" + base verb — "If we deploy the pilot in Q3, ' +
        'we will collect real usage data." It signals a plan you consider ' +
        "achievable. Use the second conditional for a hypothetical or less " +
        'likely situation: "if" + past simple, then "would" + base verb — ' +
        '"If the budget were larger, we would train a custom model." Note ' +
        '"were" for all subjects in careful writing ("if the model were ' +
        'ready"). The order is flexible: when the "if" clause comes first, ' +
        "separate it with a comma; when it comes second, no comma is needed.",
    },
    {
      id: activityId("en-ai-consultant-conditionals-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Professional vocabulary: AI consulting",
      items: [
        {
          term: "stakeholder",
          translation: "person or group with an interest in the project",
          example:
            "If we align the stakeholders early, the rollout will run more " +
            "smoothly.",
        },
        {
          term: "deliverable",
          translation: "a defined output the client receives",
          example:
            "The first deliverable is a proof of concept due in three weeks.",
        },
        {
          term: "scope",
          translation: "the agreed boundaries of the work",
          example: "If the scope grew, we would revise the timeline.",
        },
        {
          term: "proof of concept",
          translation: "a small build that tests feasibility",
          example:
            "We will start with a proof of concept before any full rollout.",
        },
        {
          term: "data pipeline",
          translation: "the automated flow that moves and prepares data",
          example:
            "If the data pipeline were reliable, we could retrain the model " +
            "weekly.",
        },
        {
          term: "rollout",
          translation: "the phased release of a solution",
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
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If we ___ (deploy) the ' +
            'pilot next quarter, we will collect real usage data."',
          expectedAnswer: "deploy",
          explanation:
            'First conditional: the "if" clause takes the present simple ' +
            '("deploy"), the main clause takes "will".',
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex2"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If the budget ___ (be) ' +
            'larger, we would train a custom model."',
          expectedAnswer: "were",
          acceptedAnswers: ["was"],
          explanation:
            'Second conditional: use the past simple in the "if" clause. ' +
            'In careful writing, "were" is preferred for all subjects.',
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex3"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with "will" or "would": "If we align the ' +
            'stakeholders early, the rollout ___ run more smoothly."',
          expectedAnswer: "will",
          explanation:
            'The "if" clause is in the present simple (a real, likely ' +
            'plan), so the main clause takes "will" — first conditional.',
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex4"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with "will" or "would": "If the scope grew, we ___ ' +
            'revise the timeline."',
          expectedAnswer: "would",
          explanation:
            'The "if" clause uses the past simple ("grew") for a ' +
            'hypothetical, so the main clause takes "would" — second ' +
            "conditional.",
        },
        {
          id: exerciseId("en-ai-consultant-conditionals-ex5"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct verb form: "If the data pipeline ___ ' +
            '(be) reliable, we could retrain the model weekly."',
          expectedAnswer: "were",
          acceptedAnswers: ["was"],
          explanation:
            'Second conditional with "could": the "if" clause takes the ' +
            'past simple, and "were" is preferred in careful writing.',
        },
      ],
    },
    {
      id: activityId("en-ai-consultant-conditionals-writing"),
      kind: ActivityKind.Writing,
      title: "Writing task",
      prompt:
        "A client has asked whether to start with a small pilot or commit to " +
        "a full custom solution now. Write a short recommendation email " +
        "(120–150 words). Use at least two first conditionals and two second " +
        "conditionals to explain the trade-offs, and end with a clear " +
        "recommendation.",
    },
  ],
};
