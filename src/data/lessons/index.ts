// Static lesson catalog — the single, ordered list of all authored lessons.
//
// Each lesson is a self-contained `Lesson` (see src/types/lesson.ts) covering
// the full learning loop (review → theory → vocabulary → reading → practice →
// writing). This module is pure local project data with no I/O; the lesson
// repository in src/domain/lessons reads from it. User progress is never stored
// here — only the static content the learner interacts with.

import type { Lesson } from "@/types";

import { germanAiConsultantLessons } from "./german/ai-consultant";
import { germanCustomerSuccessKonjunktiv } from "./german/customer-success";
import { englishAiConsultantConditionals } from "./english/ai-consultant";
import { englishCustomerSuccessTenses } from "./english/customer-success";

/** Every authored lesson, in a stable order. */
export const lessons: readonly Lesson[] = [
  ...germanAiConsultantLessons,
  germanCustomerSuccessKonjunktiv,
  englishAiConsultantConditionals,
  englishCustomerSuccessTenses,
];
