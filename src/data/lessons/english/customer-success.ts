// Static lesson content — English / Customer Success & Hospitality (towards B2).
//
// Grammar focus: present perfect vs past simple for following up with
// customers — reporting what has been done, and what happened at a specific
// past moment. Original content authored for WorkLang AI; see the content
// principles in docs/roadmap.md. No copyrighted text is reproduced.

import {
  ActivityKind,
  CareerTrack,
  CefrLevel,
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
      content:
        "When you follow up with a customer, the tense you choose changes the " +
        "message. Use the past simple for a finished action at a specific past " +
        'time — with words like "yesterday", "this morning", "a moment ' +
        'ago": "I escalated your ticket this morning." Use the present ' +
        'perfect ("have"/"has" + past participle) when the time is not ' +
        'stated and the result still matters now: "I have escalated your ' +
        'ticket, so our senior team is already looking into it." The present ' +
        'perfect also pairs with "already", "just", "yet", and "so ' +
        'far": "We have already resolved the issue"; "Have you received ' +
        'our reply yet?" A useful rule: if you can add a specific past time, ' +
        "use the past simple; if you are reporting a result that is still " +
        "true, use the present perfect.",
    },
    {
      id: activityId("en-customer-success-present-perfect-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Professional vocabulary: customer success",
      items: [
        {
          term: "to escalate",
          translation: "to pass an issue to a higher level of support",
          example: "I have escalated your case to our senior team.",
        },
        {
          term: "ticket",
          translation: "a logged record of a customer request",
          example: "Your ticket was created this morning at 9:14.",
        },
        {
          term: "to follow up",
          translation: "to check back after earlier contact",
          example: "I am following up on the request you sent last week.",
        },
        {
          term: "onboarding",
          translation: "helping a new customer get started",
          example: "We have completed the onboarding for your whole team.",
        },
        {
          term: "resolution",
          translation: "the solution that closes an issue",
          example: "A resolution was sent to you yesterday afternoon.",
        },
        {
          term: "churn",
          translation: "customers leaving or cancelling",
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
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct form of "escalate": "I ___ your ' +
            'ticket to our senior team a moment ago."',
          expectedAnswer: "escalated",
          explanation:
            '"A moment ago" is a specific past time, so use the past ' +
            'simple: "escalated".',
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex2"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the correct form of "resolve": "We ___ already ' +
            '___ your issue, so no further action is needed." (one word per ' +
            "gap)",
          expectedAnswer: "have resolved",
          explanation:
            '"Already" with a result that still matters now calls for the ' +
            'present perfect: "have already resolved".',
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex3"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Choose the correct form: "A fix ___ (be) deployed yesterday ' +
            'afternoon."',
          expectedAnswer: "was",
          explanation:
            '"Yesterday afternoon" is a finished past time, so use the ' +
            'past simple: "was".',
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex4"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Complete with the present perfect of "complete": "We ___ the ' +
            'onboarding for your whole team." (two words)',
          expectedAnswer: "have completed",
          explanation:
            "No stated time and a result that is still true now — present " +
            'perfect: "have completed".',
        },
        {
          id: exerciseId("en-customer-success-present-perfect-ex5"),
          skillArea: SkillArea.Grammar,
          prompt:
            'Choose "yet" or "already": "Have you received our reply ' +
            '___?"',
          expectedAnswer: "yet",
          explanation:
            'In present-perfect questions, "yet" asks whether something has ' +
            "happened up to now.",
        },
      ],
    },
    {
      id: activityId("en-customer-success-present-perfect-writing"),
      kind: ActivityKind.Writing,
      title: "Writing task",
      prompt:
        "A customer reported a problem yesterday and your team has now fixed " +
        "it. Write a short follow-up email (100–130 words) that reassures " +
        "them. Use the past simple for the specific steps you took at a known " +
        "time and the present perfect for results that still matter now. " +
        "Include at least three of each.",
    },
  ],
};
