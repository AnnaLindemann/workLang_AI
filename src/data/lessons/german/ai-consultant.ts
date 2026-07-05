// Static lesson content — German / AI Consultant track (towards C1).
//
// The full ten-lesson German AI-Consultant grammar curriculum, in progression
// order (see docs/content-catalog.md, German C1):
//   1. Hauptsatz + Verbklammer          6. Passiv
//   2. Perfekt vs Präteritum            7. Konjunktiv II
//   3. Präpositionen + Kasus + Artikel  8. Konnektoren
//   4. Nebensätze                       9. Nominalisierung + Funktionsverbgefüge
//   5. Relativsätze                    10. Konjunktiv I + Indirekte Rede
//
// Every lesson is a self-contained `Lesson` covering the learning loop (review →
// theory → vocabulary → reading → practice → writing) and reuses the existing
// content model unchanged (see docs/lesson-engine.md and docs/content-guidelines.md).
// Theory is sectioned into use case, form, professional examples, common errors,
// and a takeaway. The vocabulary block is a mixed set (terms, collocations, fixed
// business expressions, and reusable phrases). Each practice block holds exactly
// ten exercises: eight deterministically graded (`GradedExercise`) and two open
// (`OpenExercise`, `SkillArea.Grammar`) checked by the existing universal LLM
// mini-checker (Phase 7.2). No engine, schema, or infrastructure is modified.
//
// Explanations (theory prose, headings, exercise notes) are in Russian for the
// learner; example sentences, vocabulary, and business phrases stay in German.
// Original content authored for WorkLang AI — no copyrighted text is reproduced.

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
import type { Lesson } from "@/types";
import { activityId, exerciseId, lessonId } from "@/lib/ids";

// ---------------------------------------------------------------------------
// Lesson 1 — Hauptsatz + Verbklammer
// ---------------------------------------------------------------------------

const verbklammerMistake = {
  topic: "verbklammer",
  category: "word-order",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantVerbklammer: Lesson = {
  id: lessonId("de-ai-consultant-verbklammer"),
  topic: "verbklammer",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Hauptsatz und Verbklammer",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Satzklammer, Wortstellung)",
    "Goethe-Institut — Grammatik-Referenz (Verbstellung im Hauptsatz)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-verbklammer-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-verbklammer-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Die Verbklammer im Hauptsatz",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "В деловой переписке и презентациях консультанту важно строить " +
            "ясные, «прозрачные» предложения. Основа этой ясности — глагольная " +
            "рамка (Verbklammer): спрягаемый глагол стоит на второй позиции, а " +
            "вторая глагольная часть уходит в конец. Читатель уже в начале " +
            "видит, кто действует, и в конце получает ключевое слово — что " +
            "именно делается.",
        },
        {
          heading: "Как образуется",
          body:
            "Левая скобка — спрягаемый глагол на второй позиции (Verbzweit). " +
            "Перед ним стоит ровно один член предложения (подлежащее, " +
            "обстоятельство времени или дополнение). Правая скобка — " +
            "неспрягаемая часть в конце: инфинитив при модальном глаголе, " +
            "партицип II в перфекте или отделяемая приставка (vor-, um-, ein-, " +
            "ab-). Между скобками располагается Mittelfeld со всеми деталями.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Wir stellen das Konzept am Montag vor.",
            "Das Team muss die Anforderungen zuerst klären.",
            "Nächste Woche führen wir das neue System schrittweise ein.",
            "Der Berater hat die Ergebnisse bereits präsentiert.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Приставку ставят сразу после глагола: «Der Berater stellt vor die " +
              "Roadmap» → правильно: «… stellt die Roadmap vor».",
            "Перед глаголом ставят два члена предложения: «Morgen wir " +
              "präsentieren …» → правильно: «Morgen präsentieren wir …».",
            "Инфинитив не уводят в конец: «Wir können nicht einhalten den " +
              "Termin» → правильно: «Wir können den Termin nicht einhalten».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Держите две скобки под контролем: спрягаемый глагол — вторым, " +
            "инфинитив/партицип/приставку — в конец. Это делает деловое " +
            "сообщение однозначным и профессиональным.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-verbklammer-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Projektstart",
      items: [
        {
          term: "der Projektumfang",
          translation: "объём проекта (scope)",
          example: "Zuerst legen wir den Projektumfang gemeinsam fest.",
        },
        {
          term: "das Lastenheft",
          translation: "техническое задание заказчика",
          example: "Das Lastenheft beschreibt die Anforderungen des Kunden.",
        },
        {
          term: "der Meilenstein",
          translation: "веха / контрольная точка",
          example: "Den ersten Meilenstein erreichen wir Ende des Monats.",
        },
        {
          term: "die Abstimmung",
          translation: "согласование",
          example: "Nach der Abstimmung mit dem Kunden starten wir.",
        },
        {
          term: "der Zeitplan",
          translation: "график / план сроков",
          example: "Wir behalten den Zeitplan während des Projekts im Blick.",
        },
        {
          term: "die Zielsetzung",
          translation: "постановка целей",
          example: "Die Zielsetzung stimmen wir im ersten Workshop ab.",
        },
        {
          term: "der Ansprechpartner",
          translation: "контактное лицо",
          example:
            "Als Ansprechpartner stehe ich Ihnen jederzeit zur Verfügung.",
        },
        {
          term: "umsetzen",
          translation: "внедрять / реализовывать (отделяемый)",
          example: "Wir setzen die Empfehlungen schrittweise um.",
        },
        {
          term: "vorstellen",
          translation: "представлять / презентовать (отделяемый)",
          example: "Am Freitag stellen wir die Roadmap vor.",
        },
        {
          term: "einführen",
          translation: "вводить / внедрять (отделяемый)",
          example: "Das System führen wir im dritten Quartal ein.",
        },
        {
          term: "abstimmen",
          translation: "согласовывать (отделяемый)",
          example: "Jede Änderung stimmen wir mit dem Fachbereich ab.",
        },
        {
          term: "festlegen",
          translation: "определять / фиксировать (отделяемый)",
          example: "Die Prioritäten legen wir gemeinsam fest.",
        },
        {
          term: "den Zeitplan einhalten",
          translation: "соблюдать сроки (устойчивое сочетание)",
          example: "Trotz Verzögerungen halten wir den Zeitplan ein.",
        },
        {
          term: "den Projektumfang abstecken",
          translation: "очертить объём проекта (коллокация)",
          example: "Im Kick-off stecken wir den Projektumfang klar ab.",
        },
        {
          term: "Ich möchte Ihnen kurz die nächsten Schritte vorstellen.",
          translation: "Позвольте кратко представить дальнейшие шаги. (фраза)",
        },
        {
          term: "Wir setzen die vereinbarten Maßnahmen zeitnah um.",
          translation: "Мы оперативно реализуем согласованные меры. (фраза)",
        },
        {
          term: "Lassen Sie uns die offenen Punkte gemeinsam abstimmen.",
          translation: "Давайте вместе согласуем открытые вопросы. (фраза)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-verbklammer-reading"),
      kind: ActivityKind.Reading,
      title: "Der Projektstart beim Kunden",
      text:
        "Zu Beginn eines Beratungsprojekts legen wir gemeinsam mit dem Kunden " +
        "den Projektumfang fest. Anschließend stellt das Team die geplante " +
        "Roadmap in einem kurzen Workshop vor. Bis zum ersten Meilenstein " +
        "müssen wir die wichtigsten Anforderungen aus dem Lastenheft klären. " +
        "Danach setzen wir die vereinbarten Schritte um und stimmen jede " +
        "Änderung eng mit dem Fachbereich ab. Als fester Ansprechpartner " +
        "informiere ich Sie regelmäßig über den Fortschritt, damit alle " +
        "Beteiligten den Zeitplan im Blick behalten.",
    },
    {
      id: activityId("de-ai-consultant-verbklammer-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Verbklammer",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "separable-verb",
          prompt:
            'Ergänzen Sie die abgetrennte Vorsilbe am Satzende: "Wir setzen ' +
            'die Lösung im nächsten Quartal ___." (umsetzen)',
          expectedAnswer: "um",
          explanation:
            "Отделяемая приставка глагола umsetzen закрывает рамку и стоит в " +
            "самом конце: … setzen … um.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "modal-infinitive",
          prompt:
            'Ergänzen Sie den Infinitiv am Satzende: "Zuerst müssen wir den ' +
            'Projektumfang klar ___." (definieren)',
          expectedAnswer: "definieren",
          explanation:
            "При модальном глаголе müssen смысловой глагол стоит в инфинитиве " +
            "в конце предложения — правая скобка рамки.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "verb-second",
          prompt:
            "Welcher Satz steht korrekt im Verbzweit? Antworten Sie mit dem " +
            'Buchstaben. A) "Morgen wir präsentieren das Ergebnis." ' +
            'B) "Morgen präsentieren wir das Ergebnis." ' +
            'C) "Wir morgen präsentieren das Ergebnis."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Перед спрягаемым глаголом стоит только один член (Morgen), затем " +
            "сразу глагол: Morgen präsentieren wir …",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "sentence-building",
          prompt:
            "Bilden Sie einen Satz mit Verbklammer aus: (nächste Woche / das " +
            "Team / den Prototyp / vorstellen).",
          expectedAnswer: "Nächste Woche stellt das Team den Prototyp vor.",
          acceptedAnswers: ["Das Team stellt nächste Woche den Prototyp vor."],
          explanation:
            "Спрягаемая часть stellt — на второй позиции, отделяемая приставка " +
            "vor — в конце.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "error-correction",
          prompt:
            'Korrigieren Sie die Wortstellung: "Der Berater stellt vor die ' +
            'Roadmap im Meeting."',
          expectedAnswer: "Der Berater stellt die Roadmap im Meeting vor.",
          acceptedAnswers: ["Im Meeting stellt der Berater die Roadmap vor."],
          explanation:
            "Приставка vor не может стоять сразу после глагола — она " +
            "закрывает рамку в конце предложения.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "separable-verb",
          prompt:
            'Ergänzen Sie die Vorsilbe am Satzende: "Das Unternehmen führt ' +
            'das neue System schrittweise ___." (einführen)',
          expectedAnswer: "ein",
          explanation:
            "einführen: приставка ein- отделяется и уходит в конец предложения.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "modal-infinitive",
          prompt:
            "Welcher Satz ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Wir können nicht einhalten den Termin." ' +
            'B) "Wir können den Termin nicht einhalten." ' +
            'C) "Wir den Termin können nicht einhalten."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Инфинитив einhalten замыкает рамку в конце: … können den Termin " +
            "nicht einhalten.",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...verbklammerMistake,
          subcategory: "verb-second",
          prompt:
            'Ergänzen Sie das konjugierte Verb: "Am Freitag ___ wir die ' +
            'Anforderungen mit dem Kunden ab." (abstimmen)',
          expectedAnswer: "stimmen",
          explanation:
            "Спрягаемая основа stimmen стоит на второй позиции, приставка ab — " +
            "в конце (abstimmen).",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Bilden Sie einen vollständigen Satz mit Verbklammer aus den " +
            "Stichwörtern: (anfangen / wir / mit der Analyse / am Montag).",
          sampleAnswer: "Am Montag fangen wir mit der Analyse an.",
          explanation:
            "Критерии оценки: спрягаемый глагол на второй позиции, отделяемая " +
            "приставка an в конце, сохранён смысл всех данных слов. Возможны " +
            "разные варианты первого поля (Am Montag … / Wir …).",
        },
        {
          id: exerciseId("de-ai-consultant-verbklammer-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Formulieren Sie professioneller und mit klarer Verbklammer: " +
            '"Wir machen die KI-Sache dann irgendwann fertig."',
          sampleAnswer:
            "Wir schließen die Implementierung der KI-Lösung bis zum " +
            "vereinbarten Termin ab.",
          explanation:
            "Критерии оценки: деловой, конкретный тон вместо разговорного; " +
            "корректная рамка (… schließen … ab); сохранение исходного смысла " +
            "(«довести до конца»). Несколько формулировок могут быть верными.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-verbklammer-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde hat einem KI-Projekt zugestimmt. Schreiben Sie eine kurze " +
        "E-Mail, in der Sie die nächsten Schritte des Projektstarts erklären. " +
        "Achten Sie auf einen sachlichen Ton und eine korrekte Verbklammer.",
      wordRange: { min: 100, max: 130 },
      requirements: [
        "Опишите не менее трёх ближайших шагов проекта",
        "Используйте отделяемые глаголы (vorstellen, umsetzen, einführen, abstimmen)",
        "Соблюдайте рамочную конструкцию и деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 2 — Perfekt vs Präteritum
// ---------------------------------------------------------------------------

const tenseMistake = {
  topic: "perfekt-praeteritum",
  category: "tense",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantPerfektPraeteritum: Lesson = {
  id: lessonId("de-ai-consultant-perfekt-praeteritum"),
  topic: "perfekt-praeteritum",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Perfekt und Präteritum im Projektbericht",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Tempus: Perfekt und Präteritum)",
    "Goethe-Institut — Grammatik-Referenz (Vergangenheitstempora)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Perfekt oder Präteritum?",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Консультант постоянно описывает прошлое: что было сделано в " +
            "проекте, какие результаты получены, что пошло не так. Немецкий " +
            "предлагает два времени. Perfekt звучит естественно в устной речи, " +
            "письмах и разговоре о результатах. Präteritum — время письменного " +
            "отчёта, протокола и связного повествования о ходе проекта.",
        },
        {
          heading: "Как образуется",
          body:
            "Perfekt: вспомогательный глагол haben или sein в настоящем + " +
            "партицип II в конце (Wir haben die Daten geprüft). sein берут " +
            "глаголы движения и смены состояния (gehen, kommen, werden, " +
            "passieren, scheitern), остальные — haben. Präteritum: особая " +
            "форма глагола (prüfte, begann, war, hatte, konnte). Глаголы sein, " +
            "haben и модальные почти всегда стоят в Präteritum даже устно.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Wir haben den Prototyp letzte Woche getestet. (устно / e-mail)",
            "Das Projekt begann im März und endete im Juli. (отчёт)",
            "Der Kunde ist zum zweiten Termin nicht erschienen.",
            "Im Protokoll: „Das Team prüfte die Daten und trainierte das Modell.“",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Неверный вспомогательный глагол: «Die Kosten haben gestiegen» → " +
              "правильно: «Die Kosten sind gestiegen».",
            "Пропуск ge- у обычных глаголов или лишнее ge- у глаголов на " +
              "-ieren: правильно «analysiert», а не «geanalysiert».",
            "Разговорный Perfekt в официальном отчёте вместо Präteritum: " +
              "в протоколе уместнее «begann», «stellte fest».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Правило-ориентир: говорите и пишете письма в Perfekt, составляете " +
            "официальный отчёт — в Präteritum. sein/haben/модальные держите в " +
            "Präteritum в любом случае.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Projektbericht",
      items: [
        {
          term: "der Projektbericht",
          translation: "отчёт по проекту",
          example: "Den Projektbericht reichten wir termingerecht ein.",
        },
        {
          term: "das Protokoll",
          translation: "протокол",
          example: "Im Protokoll hielten wir alle Entscheidungen fest.",
        },
        {
          term: "die Erkenntnis",
          translation: "вывод / инсайт",
          example: "Aus der Pilotphase gewannen wir wichtige Erkenntnisse.",
        },
        {
          term: "der Rückblick",
          translation: "ретроспектива / обзор",
          example:
            "Im Rückblick zeigte sich, dass die Planung realistisch war.",
        },
        {
          term: "die Umsetzungsphase",
          translation: "фаза внедрения",
          example: "Die Umsetzungsphase dauerte länger als geplant.",
        },
        {
          term: "der Testlauf",
          translation: "тестовый прогон",
          example: "Der erste Testlauf verlief ohne größere Fehler.",
        },
        {
          term: "durchführen",
          translation: "проводить / осуществлять (отделяемый)",
          example: "Wir haben mehrere Testläufe durchgeführt.",
        },
        {
          term: "feststellen",
          translation: "установить / констатировать (отделяемый)",
          example: "Wir stellten fest, dass die Datenqualität schwankte.",
        },
        {
          term: "scheitern",
          translation: "провалиться (образует Perfekt с sein)",
          example: "Der erste Ansatz ist an fehlenden Daten gescheitert.",
        },
        {
          term: "überschreiten",
          translation: "превышать (напр. бюджет)",
          example: "Das Projekt überschritt das Budget um zehn Prozent.",
        },
        {
          term: "erzielen",
          translation: "достигать (результата)",
          example: "Mit dem Modell haben wir gute Ergebnisse erzielt.",
        },
        {
          term: "auswerten",
          translation: "анализировать / оценивать данные (отделяемый)",
          example: "Wir werteten die Kennzahlen nach jedem Sprint aus.",
        },
        {
          term: "Erkenntnisse gewinnen",
          translation: "получать выводы (устойчивое сочетание)",
          example: "Aus dem Feedback gewannen wir neue Erkenntnisse.",
        },
        {
          term: "Zusammenfassend lässt sich sagen, dass …",
          translation: "Подводя итог, можно сказать, что … (шаблон отчёта)",
        },
        {
          term: "Im Berichtszeitraum wurde … abgeschlossen.",
          translation: "За отчётный период было завершено … (шаблон)",
        },
        {
          term: "Wir haben das Ziel erreicht.",
          translation: "Мы достигли цели. (фраза, Perfekt)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-reading"),
      kind: ActivityKind.Reading,
      title: "Rückblick auf die Pilotphase",
      text:
        "Das Pilotprojekt begann im Frühjahr und verlief zunächst nach Plan. " +
        "In der ersten Phase prüfte das Team die vorhandenen Daten und stellte " +
        "fest, dass ein Teil der Datensätze unvollständig war. Deshalb " +
        "verzögerte sich das Training des Modells um zwei Wochen. Nach der " +
        "Bereinigung führten wir mehrere Testläufe durch und werteten die " +
        "Kennzahlen sorgfältig aus. Am Ende erzielten wir eine deutlich höhere " +
        "Genauigkeit als erwartet. Zusammenfassend lässt sich sagen, dass die " +
        "Pilotphase trotz des anfänglichen Rückschlags erfolgreich war.",
    },
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Perfekt und Präteritum",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "auxiliary-haben",
          prompt:
            'Ergänzen Sie das Hilfsverb: "Das Team ___ den Prototyp letzte ' +
            'Woche getestet."',
          expectedAnswer: "hat",
          explanation:
            "testen образует Perfekt с haben; подлежащее das Team → hat.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "auxiliary-sein",
          prompt:
            'Ergänzen Sie das Hilfsverb: "Der Kunde ___ zum zweiten Termin ' +
            'nicht erschienen."',
          expectedAnswer: "ist",
          explanation:
            "erscheinen — глагол смены состояния/появления, Perfekt с sein: " +
            "ist … erschienen.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "register",
          prompt:
            "Welche Formulierung passt besser in einen schriftlichen " +
            "Projektbericht? Antworten Sie mit dem Buchstaben. " +
            'A) "Wir haben die Daten geprüft und haben das Modell trainiert." ' +
            'B) "Wir prüften die Daten und trainierten das Modell."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "В связном письменном отчёте естественнее Präteritum: prüften, " +
            "trainierten.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "partizip-ii",
          prompt:
            'Ergänzen Sie das Partizip II: "Wir haben die Ergebnisse ___." ' +
            "(analysieren)",
          expectedAnswer: "analysiert",
          explanation:
            "Глаголы на -ieren образуют партицип II без ge-: analysiert.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "praeteritum-form",
          prompt:
            'Ergänzen Sie das Präteritum: "Das Projekt ___ im März." (beginnen)',
          expectedAnswer: "begann",
          explanation: "Сильный глагол beginnen в Präteritum: begann.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "perfekt-to-praeteritum",
          prompt:
            'Schreiben Sie den Satz im Präteritum: "Wir haben das Budget ' +
            'überschritten."',
          expectedAnswer: "Wir überschritten das Budget.",
          acceptedAnswers: ["Das Budget überschritten wir."],
          explanation:
            "überschreiten в Präteritum: überschritt(en). Порядок слов рамки " +
            "сохраняется.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "auxiliary-sein",
          prompt:
            "Welcher Satz ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Die Kosten haben gestiegen." B) "Die Kosten sind gestiegen."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "steigen — глагол изменения состояния, Perfekt с sein: sind " +
            "gestiegen.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...tenseMistake,
          subcategory: "partizip-ii",
          prompt:
            'Ergänzen Sie das Partizip II: "Der Berater hat den Fehler früh ' +
            '___." (erkennen)',
          expectedAnswer: "erkannt",
          explanation: "Смешанный глагол erkennen: партицип II — erkannt.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie ins Perfekt um: "Wir stellten das Konzept vor und ' +
            'diskutierten die Risiken."',
          sampleAnswer:
            "Wir haben das Konzept vorgestellt und die Risiken diskutiert.",
          explanation:
            "Критерии оценки: оба глагола в Perfekt с haben; корректные " +
            "партиципы (vorgestellt, diskutiert); сохранён смысл. Возможны " +
            "небольшие вариации порядка слов.",
        },
        {
          id: exerciseId("de-ai-consultant-perfekt-praeteritum-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Schreiben Sie diesen Satz sachlich für einen schriftlichen " +
            'Projektbericht (Präteritum): "Wir haben irgendwie rausgefunden, ' +
            'dass die Daten schlecht waren."',
          sampleAnswer:
            "Bei der Prüfung stellten wir fest, dass die Datenqualität " +
            "unzureichend war.",
          explanation:
            "Критерии оценки: Präteritum, деловой тон вместо разговорного, " +
            "точная лексика (Datenqualität, unzureichend), сохранение смысла. " +
            "Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-perfekt-praeteritum-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Eine Projektphase ist abgeschlossen. Schreiben Sie einen kurzen " +
        "schriftlichen Rückblick für den internen Projektbericht: Was wurde " +
        "gemacht, was lief gut, wo gab es Probleme? Verwenden Sie überwiegend " +
        "das Präteritum.",
      wordRange: { min: 110, max: 140 },
      requirements: [
        "Опишите ход завершённой фазы по шагам в прошедшем времени",
        "Используйте преимущественно Präteritum (begann, prüfte, stellte fest …)",
        "Назовите хотя бы одну проблему и её решение; деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 3 — Präpositionen + Kasus + Artikel
// ---------------------------------------------------------------------------

const prepositionMistake = {
  topic: "praepositionen-kasus",
  category: "case-government",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantPraepositionen: Lesson = {
  id: lessonId("de-ai-consultant-praepositionen-kasus"),
  topic: "praepositionen-kasus",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Präpositionen, Kasus und Artikel im Beratungsalltag",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Präpositionen und Rektion)",
    "Goethe-Institut — Grammatik-Referenz (Wechselpräpositionen)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Welcher Kasus nach welcher Präposition?",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Точность в предлогах и падежах отличает уверенный деловой " +
            "немецкий. Кто за что отвечает, с кем согласуется решение, на " +
            "каких данных работает система — всё это выражается предлогами, " +
            "которые управляют падежом, а падеж меняет артикль.",
        },
        {
          heading: "Как образуется",
          body:
            "Одни предлоги всегда требуют Akkusativ (für, ohne, gegen, um, " +
            "durch), другие всегда Dativ (mit, nach, bei, seit, von, zu, aus). " +
            "Wechselpräpositionen (in, an, auf, über, unter, vor, hinter, " +
            "neben, zwischen) требуют Akkusativ при направлении (wohin?) и " +
            "Dativ при местоположении (wo?). Многие глаголы имеют «свой» " +
            "предлог: sich beschäftigen mit + Dativ, sich konzentrieren auf + " +
            "Akkusativ, warten auf + Akkusativ, teilnehmen an + Dativ.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Wir arbeiten mit dem Kunden an der Lösung. (mit + Dativ)",
            "Der Bericht ist für den Vorstand bestimmt. (für + Akkusativ)",
            "Wir speichern die Daten in der Cloud. (wo? → Dativ)",
            "Wir laden die Datei in das System hoch. (wohin? → Akkusativ)",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Dativ вместо Akkusativ при направлении: «Wir laden die Datei in " +
              "dem System hoch» → правильно: «in das System».",
            "Забытое -n в Dativ Plural: «mit den Fachbereiche» → правильно: " +
              "«mit den Fachbereichen».",
            "Неверный предлог при глаголе: «Wir konzentrieren uns an …» → " +
              "правильно: «Wir konzentrieren uns auf …».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Сначала определите предлог и его падеж, затем поставьте артикль в " +
            "нужную форму. Для Wechselpräpositionen задайте вопрос wohin? " +
            "(Akkusativ) или wo? (Dativ).",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Zuständigkeiten und Datenfluss",
      items: [
        {
          term: "die Anforderung",
          translation: "требование",
          example: "Wir gehen die Anforderungen mit dem Kunden durch.",
        },
        {
          term: "der Ansprechpartner",
          translation: "контактное лицо",
          example: "Für Rückfragen wenden Sie sich an Ihren Ansprechpartner.",
        },
        {
          term: "die Einführung",
          translation: "внедрение",
          example: "Nach der Einführung des Systems schulen wir das Team.",
        },
        {
          term: "die Zuständigkeit",
          translation: "зона ответственности",
          example: "Die Zuständigkeiten legen wir zu Projektbeginn fest.",
        },
        {
          term: "die Freigabe",
          translation: "согласование / разрешение",
          example: "Ohne die Freigabe des Datenschutzes starten wir nicht.",
        },
        {
          term: "der Vorstand",
          translation: "правление / совет директоров",
          example: "Der Bericht ist für den Vorstand bestimmt.",
        },
        {
          term: "der Fachbereich",
          translation: "профильный отдел",
          example: "Wir stimmen uns mit den Fachbereichen ab.",
        },
        {
          term: "die Schnittstelle",
          translation: "интерфейс / API",
          example: "Die Daten fließen über eine Schnittstelle in das System.",
        },
        {
          term: "zuständig sein für",
          translation: "отвечать за (+ Akkusativ)",
          example: "Ich bin für die Umsetzung des Projekts zuständig.",
        },
        {
          term: "sich beschäftigen mit",
          translation: "заниматься чем-либо (+ Dativ)",
          example: "Das Team beschäftigt sich mit der Datenqualität.",
        },
        {
          term: "sich konzentrieren auf",
          translation: "сосредоточиться на (+ Akkusativ)",
          example: "Wir konzentrieren uns auf die Machbarkeit.",
        },
        {
          term: "hinweisen auf",
          translation: "указывать на (+ Akkusativ, отделяемый)",
          example: "Ich weise auf die Risiken der Lösung hin.",
        },
        {
          term: "teilnehmen an",
          translation: "участвовать в (+ Dativ, отделяемый)",
          example: "Alle Fachbereiche nehmen an dem Workshop teil.",
        },
        {
          term: "in Absprache mit …",
          translation: "по согласованию с … (устойчивое выражение, + Dativ)",
          example: "In Absprache mit dem Kunden verschieben wir den Termin.",
        },
        {
          term: "Für Rückfragen stehe ich Ihnen gern zur Verfügung.",
          translation:
            "По любым вопросам охотно остаюсь на связи. (фраза, + Dativ)",
        },
        {
          term: "Ich bin für … verantwortlich.",
          translation: "Я отвечаю за … (шаблон, + Akkusativ)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-reading"),
      kind: ActivityKind.Reading,
      title: "Rollen und Datenfluss im Projekt",
      text:
        "In unserem Projekt sind die Zuständigkeiten klar verteilt. Ich bin " +
        "für die Abstimmung mit dem Kunden verantwortlich und stehe den " +
        "Fachbereichen als Ansprechpartner zur Verfügung. Das technische Team " +
        "beschäftigt sich mit der Datenqualität und konzentriert sich auf die " +
        "Anbindung der Schnittstellen. Die Daten fließen über eine gesicherte " +
        "Schnittstelle in das zentrale System; gespeichert werden sie " +
        "ausschließlich in der internen Cloud. Ohne die Freigabe des " +
        "Datenschutzes laden wir keine personenbezogenen Daten in das System " +
        "hoch. In Absprache mit dem Vorstand berichten wir monatlich über den " +
        "Fortschritt.",
    },
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Präpositionen, Kasus und Artikel",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "article-dative",
          prompt:
            'Ergänzen Sie den Artikel im richtigen Kasus: "Wir arbeiten mit ' +
            '___ Kunden an der Lösung." (der Kunde)',
          expectedAnswer: "dem",
          explanation: "mit требует Dativ; der Kunde в Dativ → dem Kunden.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "preposition-accusative",
          prompt:
            'Ergänzen Sie die Präposition: "Der Bericht ist ___ den Vorstand ' +
            'bestimmt." (Akkusativ)',
          expectedAnswer: "für",
          explanation:
            "«den Vorstand» стоит в Akkusativ — предлог für управляет " +
            "Akkusativ.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "wechselpraeposition",
          prompt:
            "Wo werden die Daten gespeichert? Antworten Sie mit dem " +
            'Buchstaben. "Wir speichern die Daten ___." ' +
            'A) "in die Cloud" B) "in der Cloud"',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Вопрос wo? (местоположение) → Wechselpräposition in + Dativ: in " +
            "der Cloud.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "verb-preposition",
          prompt:
            'Ergänzen Sie die feste Präposition: "Das Team beschäftigt sich ' +
            '___ der Datenqualität."',
          expectedAnswer: "mit",
          explanation: "sich beschäftigen управляет предлогом mit (+ Dativ).",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "article-accusative",
          prompt:
            'Ergänzen Sie den Artikel: "Wir warten auf ___ Freigabe." ' +
            "(die Freigabe, Akkusativ)",
          expectedAnswer: "die",
          explanation:
            "warten auf + Akkusativ; die Freigabe (ж. р.) в Akkusativ → die.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "preposition-dative",
          prompt:
            "Welche Form ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Nach der Analyse präsentieren wir." ' +
            'B) "Nach die Analyse präsentieren wir."',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation:
            "nach управляет Dativ; die Analyse в Dativ → der Analyse.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "verb-preposition",
          prompt:
            'Ergänzen Sie Präposition und Artikel: "Wir konzentrieren uns ' +
            '___ ___ Machbarkeit." (die Machbarkeit)',
          expectedAnswer: "auf die",
          explanation:
            "sich konzentrieren auf + Akkusativ; die Machbarkeit в Akkusativ " +
            "→ die.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...prepositionMistake,
          subcategory: "dative-plural",
          prompt:
            'Ergänzen Sie den Artikel im Dativ Plural: "Wir sprechen mit ___ ' +
            'Fachbereichen."',
          expectedAnswer: "den",
          explanation:
            "mit + Dativ; во множественном числе артикль den, а " +
            "существительное получает -n (Fachbereichen).",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Schreiben Sie einen Satz über Ihre Zuständigkeit mit " +
            '"zuständig für" (+ Akkusativ), z. B. für die Umsetzung des ' +
            "Projekts.",
          sampleAnswer: "Ich bin für die Umsetzung des Projekts zuständig.",
          explanation:
            "Критерии оценки: конструкция zuständig für + Akkusativ, верный " +
            "артикль, осмысленное деловое содержание. Возможны разные " +
            "дополнения.",
        },
        {
          id: exerciseId("de-ai-consultant-praepositionen-kasus-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Formulieren Sie professionell und mit korrekten Präpositionen: " +
            '"Ich kümmer mich um das mit den Daten."',
          sampleAnswer:
            "Ich bin für die Aufbereitung und den Schutz der Daten " +
            "zuständig.",
          explanation:
            "Критерии оценки: деловой тон, точные предлоги и падежи, " +
            "конкретное содержание вместо «das mit den Daten». Возможны " +
            "разные корректные варианты.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-praepositionen-kasus-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein neuer Kollege soll die Rollen im Projekt verstehen. Beschreiben " +
        "Sie in einer kurzen Nachricht, wer für was zuständig ist und wie die " +
        "Daten durch das System fließen. Achten Sie besonders auf Präpositionen " +
        "und Kasus.",
      wordRange: { min: 110, max: 140 },
      requirements: [
        "Опишите не менее трёх зон ответственности (zuständig für …)",
        "Используйте разные предлоги с правильным падежом (mit + Dativ, für + Akkusativ, Wechselpräpositionen)",
        "Опишите путь данных через систему; деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 4 — Nebensätze
// ---------------------------------------------------------------------------

const nebensatzMistake = {
  topic: "nebensaetze",
  category: "subordinate-clause",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantNebensaetze: Lesson = {
  id: lessonId("de-ai-consultant-nebensaetze"),
  topic: "nebensaetze",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Nebensätze: Gründe und Bedingungen begründen",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Nebensatz, Verbstellung)",
    "Goethe-Institut — Grammatik-Referenz (Subjunktionen)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-nebensaetze-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-nebensaetze-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Der Nebensatz und die Endstellung des Verbs",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Консультант постоянно обосновывает решения: почему мы что-то " +
            "рекомендуем, при каком условии проект стартует, чтобы достичь " +
            "какой цели. Для этого нужны придаточные предложения с союзами " +
            "weil, dass, wenn, obwohl, damit, ob, da, sobald.",
        },
        {
          heading: "Как образуется",
          body:
            "Придаточное вводится подчинительным союзом, после которого " +
            "спрягаемый глагол уходит в самый конец: «…, weil die Daten " +
            "fehlen». Отделяемые глаголы в придаточном снова соединяются " +
            "(vorstellt). Если придаточное стоит первым, главное предложение " +
            "начинается сразу со спрягаемого глагола (Verbzweit через запятую): " +
            "«Wenn die Freigabe vorliegt, beginnen wir».",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Wir verschieben den Termin, weil die Daten fehlen.",
            "Der Bericht zeigt, dass das Modell genau ist.",
            "Wir dokumentieren jeden Schritt, damit das Projekt nachvollziehbar bleibt.",
            "Sobald der Kunde die Anforderungen freigibt, starten wir.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Глагол не уходит в конец: «…, dass wir müssen die Daten prüfen» → " +
              "правильно: «…, dass wir die Daten prüfen müssen».",
            "После придаточного в начале забывают инверсию: «Wenn …, wir " +
              "beginnen» → правильно: «Wenn …, beginnen wir».",
            "Путают weil (глагол в конце) и denn (порядок как в главном " +
              "предложении).",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Увидели подчинительный союз — отправляйте спрягаемый глагол в " +
            "конец. Если придаточное впереди, главное начинайте с глагола.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nebensaetze-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Begründen und Bedingungen",
      items: [
        {
          term: "die Voraussetzung",
          translation: "предпосылка / условие",
          example: "Saubere Daten sind die Voraussetzung für ein gutes Modell.",
        },
        {
          term: "die Freigabe",
          translation: "согласование / разрешение (release)",
          example: "Wir starten, sobald die Freigabe vorliegt.",
        },
        {
          term: "die Einschätzung",
          translation: "оценка / суждение",
          example: "Nach unserer Einschätzung ist das Risiko gering.",
        },
        {
          term: "die Rückmeldung",
          translation: "обратная связь / ответ",
          example: "Wir warten auf die Rückmeldung des Fachbereichs.",
        },
        {
          term: "der Nachweis",
          translation: "подтверждение / доказательство",
          example:
            "Der Machbarkeitsnachweis zeigt, dass die Lösung funktioniert.",
        },
        {
          term: "gewährleisten",
          translation: "обеспечивать / гарантировать",
          example: "Wir gewährleisten, dass die Daten geschützt bleiben.",
        },
        {
          term: "berücksichtigen",
          translation: "учитывать",
          example: "Wir berücksichtigen, dass das Budget begrenzt ist.",
        },
        {
          term: "voraussetzen",
          translation: "предполагать / требовать как условие (отделяемый)",
          example: "Das Projekt setzt voraus, dass die Daten verfügbar sind.",
        },
        {
          term: "priorisieren",
          translation: "расставлять приоритеты",
          example:
            "Wir priorisieren die Anwendungsfälle, weil die Zeit knapp ist.",
        },
        {
          term: "nachvollziehbar",
          translation: "прослеживаемый / понятный",
          example: "Wir dokumentieren alles, damit es nachvollziehbar bleibt.",
        },
        {
          term: "weil (+ Verbendstellung)",
          translation: "потому что (глагол в конце)",
          example: "Wir verschieben den Launch, weil die Tests noch laufen.",
        },
        {
          term: "damit (+ Verbendstellung)",
          translation: "чтобы / для того чтобы",
          example: "Wir schulen das Team, damit es das Tool sicher nutzt.",
        },
        {
          term: "obwohl (+ Verbendstellung)",
          translation: "хотя",
          example: "Obwohl das Projekt teuer war, hat es sich gelohnt.",
        },
        {
          term: "Wir gehen davon aus, dass …",
          translation: "Мы исходим из того, что … (шаблон)",
        },
        {
          term: "Bitte geben Sie uns Bescheid, sobald …",
          translation: "Сообщите нам, как только … (шаблон)",
        },
        {
          term: "Aus unserer Sicht ist es sinnvoll, dass …",
          translation: "С нашей точки зрения целесообразно, чтобы … (шаблон)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nebensaetze-reading"),
      kind: ActivityKind.Reading,
      title: "Warum wir den Zeitplan anpassen",
      text:
        "Wir schlagen vor, den Zeitplan anzupassen, weil ein Teil der Daten " +
        "noch nicht freigegeben ist. Solange die Freigabe des Datenschutzes " +
        "fehlt, können wir das Modell nicht mit echten Daten trainieren. Wir " +
        "gehen davon aus, dass die Freigabe bis Ende der Woche vorliegt. Damit " +
        "das Projekt nachvollziehbar bleibt, dokumentieren wir jede " +
        "Verzögerung im Protokoll. Obwohl sich der Start verschiebt, " +
        "berücksichtigen wir den ursprünglichen Endtermin, sodass die " +
        "wichtigsten Meilensteine erhalten bleiben. Bitte geben Sie uns " +
        "Bescheid, sobald die Freigabe erteilt ist.",
    },
    {
      id: activityId("de-ai-consultant-nebensaetze-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Nebensätze",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "verb-final",
          prompt:
            'Ergänzen Sie das Verb in der Endstellung: "Wir starten das ' +
            'Projekt, sobald der Kunde die Anforderungen ___." (freigeben)',
          expectedAnswer: "freigibt",
          explanation:
            "В придаточном спрягаемый глагол стоит в конце; freigeben " +
            "(отделяемый) снова соединяется: freigibt.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "word-order",
          prompt:
            "Welcher dass-Satz ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Ich denke, dass wir müssen die Daten prüfen." ' +
            'B) "Ich denke, dass wir die Daten prüfen müssen."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Спрягаемый глагол müssen уходит в самый конец придаточного: …, " +
            "dass wir die Daten prüfen müssen.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "conjunction",
          prompt:
            "Ergänzen Sie die passende Konjunktion (weil / obwohl / damit): " +
            '"___ das Budget begrenzt ist, priorisieren wir die ' +
            'Anwendungsfälle."',
          expectedAnswer: "weil",
          explanation:
            "Придаточное называет причину → weil (глагол ist в конце).",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "sentence-building",
          prompt:
            'Verbinden Sie mit "weil" zu einem Satz: "Wir verschieben den ' +
            'Termin. Die Daten fehlen."',
          expectedAnswer: "Wir verschieben den Termin, weil die Daten fehlen.",
          acceptedAnswers: [
            "Weil die Daten fehlen, verschieben wir den Termin.",
          ],
          explanation: "После weil глагол fehlen стоит в конце придаточного.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "verb-final",
          prompt:
            'Ergänzen Sie das Verb in der Endstellung: "Der Kunde fragt, ob ' +
            'wir die Ergebnisse morgen ___." (vorstellen)',
          expectedAnswer: "vorstellen",
          explanation:
            "В придаточном с ob отделяемый глагол снова соединяется и стоит в " +
            "конце: vorstellen.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "main-clause-inversion",
          prompt:
            "Welcher Satz ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Wenn die Freigabe vorliegt, wir beginnen die Umsetzung." ' +
            'B) "Wenn die Freigabe vorliegt, beginnen wir die Umsetzung."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "После придаточного главное предложение начинается со спрягаемого " +
            "глагола: …, beginnen wir …",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "dass-clause",
          prompt:
            'Bilden Sie einen dass-Satz: "Der Bericht zeigt: Das Modell ist ' +
            'genau."',
          expectedAnswer: "Der Bericht zeigt, dass das Modell genau ist.",
          explanation: "После dass глагол ist уходит в конец придаточного.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nebensatzMistake,
          subcategory: "conjunction",
          prompt:
            'Ergänzen Sie die Konjunktion des Zwecks: "Wir dokumentieren ' +
            'jeden Schritt, ___ das Projekt nachvollziehbar bleibt."',
          expectedAnswer: "damit",
          explanation:
            "Цель выражается союзом damit; глагол bleibt стоит в конце.",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie in einen Nebensatz mit "obwohl" um: "Das Projekt ' +
            'war teuer. Trotzdem hat es sich gelohnt."',
          sampleAnswer: "Obwohl das Projekt teuer war, hat es sich gelohnt.",
          explanation:
            "Критерии оценки: союз obwohl, глагол war в конце придаточного, " +
            "инверсия в главном предложении, сохранение смысла уступки. " +
            "Возможен и порядок «…, obwohl das Projekt teuer war».",
        },
        {
          id: exerciseId("de-ai-consultant-nebensaetze-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Verbinden Sie professionell zu einem Satz mit Nebensatz: "Die ' +
            'Daten sind sensibel. Wir anonymisieren sie."',
          sampleAnswer:
            "Da die Daten sensibel sind, werden sie vor der Verarbeitung " +
            "anonymisiert.",
          explanation:
            "Критерии оценки: причинный придаточный (da/weil) с глаголом в " +
            "конце, деловой тон, сохранение смысла. Несколько формулировок " +
            "возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nebensaetze-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Sie müssen dem Kunden erklären, warum sich ein Meilenstein " +
        "verschiebt und unter welchen Bedingungen das Projekt weiterläuft. " +
        "Schreiben Sie eine kurze, sachliche Nachricht und begründen Sie Ihre " +
        "Einschätzung mit Nebensätzen.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Обоснуйте перенос сроков с помощью weil/da",
        "Сформулируйте хотя бы одно условие (wenn/sobald) и одну цель (damit)",
        "Соблюдайте конечную позицию глагола в придаточных; деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 5 — Relativsätze
// ---------------------------------------------------------------------------

const relativsatzMistake = {
  topic: "relativsaetze",
  category: "relative-clause",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantRelativsaetze: Lesson = {
  id: lessonId("de-ai-consultant-relativsaetze"),
  topic: "relativsaetze",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Relativsätze: Lösungen präzise beschreiben",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Relativsatz, Relativpronomen)",
    "Goethe-Institut — Grammatik-Referenz (Relativsätze)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-relativsaetze-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-relativsaetze-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Der Relativsatz und das Relativpronomen",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Чтобы точно описать инструмент, набор данных или решение, нужны " +
            "относительные придаточные: «система, которая объединяет отделы», " +
            "«решение, которое мы разработали». Они делают деловое описание " +
            "конкретным и профессиональным без длинных цепочек предложений.",
        },
        {
          heading: "Как образуется",
          body:
            "Относительное придаточное описывает существительное и вводится " +
            "относительным местоимением; глагол стоит в конце. Род и число " +
            "местоимения берутся у определяемого слова, а падеж — от роли " +
            "внутри придаточного. Формы: Nom der/die/das/die, Akk " +
            "den/die/das/die, Dativ dem/der/dem/denen, Gen dessen/deren. " +
            "Предлог ставится перед местоимением: «das System, mit dem wir " +
            "arbeiten».",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Das ist der Berater, der das Projekt leitet.",
            "Die Lösung, die wir entwickelt haben, ist skalierbar.",
            "Der Kunde, dem wir das Angebot geschickt haben, hat zugesagt.",
            "Das System, mit dem wir arbeiten, ist veraltet.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Падеж местоимения берут у главного слова, а не по роли в " +
              "придаточном: «Die Lösung, den wir entwickelt haben» → правильно: " +
              "«…, die wir entwickelt haben».",
            "Предлог ставят в конец, а не перед местоимением: «das System, das " +
              "wir mit arbeiten» → правильно: «…, mit dem wir arbeiten».",
            "Путают dessen/deren в родительном падеже по роду определяемого " +
              "слова.",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Сначала берите род и число у определяемого существительного, " +
            "затем определяйте падеж по функции местоимения в придаточном. " +
            "Предлог — всегда перед местоимением.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-relativsaetze-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Werkzeuge und Lösungen",
      items: [
        {
          term: "die Schnittstelle",
          translation: "интерфейс / API",
          example:
            "Wir nutzen eine Schnittstelle, die beide Systeme verbindet.",
        },
        {
          term: "der Datensatz",
          translation: "набор данных",
          example: "Ein Datensatz, der Lücken enthält, verzerrt das Modell.",
        },
        {
          term: "die Kennzahl",
          translation: "показатель / метрика (KPI)",
          example: "Die Kennzahl, die wir verfolgen, ist die Genauigkeit.",
        },
        {
          term: "das Dashboard",
          translation: "информационная панель",
          example:
            "Wir bauen ein Dashboard, das die Kennzahlen in Echtzeit zeigt.",
        },
        {
          term: "der Anbieter",
          translation: "поставщик / вендор",
          example: "Der Anbieter, dessen Software wir testen, ist bekannt.",
        },
        {
          term: "die Vorgabe",
          translation: "предписание / требование",
          example: "Wir beachten die Vorgaben, die der Datenschutz vorgibt.",
        },
        {
          term: "die Funktion",
          translation: "функция",
          example: "Eine Funktion, die kaum genutzt wird, entfernen wir.",
        },
        {
          term: "bereitstellen",
          translation: "предоставлять (отделяемый)",
          example:
            "Wir stellen ein Tool bereit, das die Auswertung automatisiert.",
        },
        {
          term: "automatisieren",
          translation: "автоматизировать",
          example: "Wir empfehlen ein Tool, das die Auswertung automatisiert.",
        },
        {
          term: "skalierbar",
          translation: "масштабируемый",
          example: "Wir liefern eine Lösung, die skalierbar ist.",
        },
        {
          term: "der Berater, der …",
          translation: "консультант, который … (Nom, м. р.)",
          example: "Das ist der Berater, der das Projekt leitet.",
        },
        {
          term: "die Lösung, die …",
          translation: "решение, которое … (Nom/Akk, ж. р.)",
          example: "Die Lösung, die wir entwickelt haben, ist skalierbar.",
        },
        {
          term: "das System, mit dem …",
          translation: "система, с которой … (Dativ, ср. р.)",
          example: "Das System, mit dem wir arbeiten, ist veraltet.",
        },
        {
          term: "Wir haben eine Lösung entwickelt, die …",
          translation: "Мы разработали решение, которое … (шаблон)",
        },
        {
          term: "Das ist ein Ansatz, der sich in der Praxis bewährt hat.",
          translation:
            "Это подход, который зарекомендовал себя на практике. (фраза)",
        },
        {
          term: "Es gibt einen Punkt, den wir noch klären müssen.",
          translation: "Есть вопрос, который нам ещё нужно прояснить. (фраза)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-relativsaetze-reading"),
      kind: ActivityKind.Reading,
      title: "Die Lösung, die wir empfehlen",
      text:
        "Wir empfehlen eine Lösung, die sich leicht in die bestehende " +
        "Umgebung einfügt. Im Zentrum steht ein Dashboard, das die wichtigsten " +
        "Kennzahlen in Echtzeit darstellt. Die Daten stammen aus einer " +
        "Schnittstelle, mit der wir beide Systeme verbinden. Der Anbieter, " +
        "dessen Software wir getestet haben, bietet einen zuverlässigen " +
        "Support. Für die Fachbereiche, denen die Auswertung bisher viel Zeit " +
        "gekostet hat, bedeutet das eine spürbare Entlastung. Es gibt nur " +
        "einen Punkt, den wir vor dem Start noch mit dem Datenschutz klären " +
        "müssen.",
    },
    {
      id: activityId("de-ai-consultant-relativsaetze-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Relativsätze",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "nominative",
          prompt:
            'Ergänzen Sie das Relativpronomen: "Das ist der Berater, ___ das ' +
            'Projekt leitet."',
          expectedAnswer: "der",
          explanation:
            "Определяемое слово der Berater (м. р.); роль в придаточном — " +
            "подлежащее → Nominativ der.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "accusative",
          prompt:
            'Ergänzen Sie das Relativpronomen: "Die Lösung, ___ wir ' +
            'entwickelt haben, ist skalierbar."',
          expectedAnswer: "die",
          explanation:
            "die Lösung (ж. р.); в придаточном — прямое дополнение → " +
            "Akkusativ die.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "dative",
          prompt:
            'Ergänzen Sie das Relativpronomen: "Der Kunde, ___ wir das ' +
            'Angebot geschickt haben, hat zugesagt."',
          expectedAnswer: "dem",
          explanation:
            "schicken + Dativ (кому): der Kunde (м. р.) в Dativ → dem.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "preposition-relative",
          prompt:
            "Welche Form ist korrekt? Antworten Sie mit dem Buchstaben. " +
            '"Das System, ___ wir arbeiten, ist veraltet." ' +
            'A) "mit dem" B) "mit den" C) "mit der"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation:
            "arbeiten mit + Dativ; das System (ср. р.) в Dativ → dem. Предлог " +
            "стоит перед местоимением: mit dem.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "dative-plural",
          prompt:
            'Ergänzen Sie das Relativpronomen (Dativ Plural): "Die Kollegen, ' +
            '___ wir danken, haben mitgeholfen."',
          expectedAnswer: "denen",
          explanation: "danken + Dativ; множественное число в Dativ → denen.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "sentence-building",
          prompt:
            'Verbinden Sie zu einem Relativsatz: "Wir nutzen eine ' +
            'Schnittstelle. Die Schnittstelle verbindet beide Systeme."',
          expectedAnswer:
            "Wir nutzen eine Schnittstelle, die beide Systeme verbindet.",
          explanation:
            "die Schnittstelle → подлежащее придаточного, Nominativ die; " +
            "verbindet стоит в конце.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "genitive",
          prompt:
            "Welches Relativpronomen ist korrekt? Antworten Sie mit dem " +
            'Buchstaben. "Der Anbieter, ___ Software wir testen, ist ' +
            'bekannt." A) "dessen" B) "deren" C) "dem"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation:
            "der Anbieter (м. р.) в родительном падеже → dessen Software.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...relativsatzMistake,
          subcategory: "nominative",
          prompt:
            'Ergänzen Sie das Relativpronomen: "Das Modell, ___ die besten ' +
            'Ergebnisse liefert, wird ausgewählt."',
          expectedAnswer: "das",
          explanation:
            "das Modell (ср. р.); подлежащее придаточного → Nominativ das.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Bilden Sie einen Relativsatz: "Wir empfehlen ein Tool. Das Tool ' +
            'automatisiert die Auswertung."',
          sampleAnswer:
            "Wir empfehlen ein Tool, das die Auswertung automatisiert.",
          explanation:
            "Критерии оценки: правильное местоимение (das, ср. р., Nominativ), " +
            "глагол в конце, сохранение смысла. Возможны варианты порядка слов " +
            "в придаточном.",
        },
        {
          id: exerciseId("de-ai-consultant-relativsaetze-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formulieren Sie mit einem Relativsatz professioneller: "Wir ' +
            'haben ein Dashboard gebaut. Es zeigt die wichtigsten Zahlen."',
          sampleAnswer:
            "Wir haben ein Dashboard entwickelt, das die wichtigsten " +
            "Kennzahlen in Echtzeit darstellt.",
          explanation:
            "Критерии оценки: относительное придаточное с правильным " +
            "местоимением и глаголом в конце, более деловая лексика, " +
            "сохранение смысла. Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-relativsaetze-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde möchte wissen, welche Lösung Sie empfehlen. Beschreiben " +
        "Sie in einer kurzen Nachricht das Tool und seine wichtigsten " +
        "Bestandteile. Nutzen Sie Relativsätze, um jedes Element präzise zu " +
        "beschreiben.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Опишите не менее трёх элементов решения через относительные придаточные",
        "Используйте разные падежи местоимений (Nominativ, Akkusativ, Dativ; при возможности с предлогом)",
        "Соблюдайте конечную позицию глагола; деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 6 — Passiv (Vorgangspassiv)
// ---------------------------------------------------------------------------

const passiveMistake = {
  topic: "vorgangspassiv",
  category: "passive-voice",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantPassive: Lesson = {
  id: lessonId("de-ai-consultant-vorgangspassiv"),
  topic: "vorgangspassiv",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Prozesse beschreiben: das Vorgangspassiv",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Passiv)",
    "Goethe-Institut — Grammatik-Referenz (Vorgangspassiv)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-vorgangspassiv-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Das Vorgangspassiv",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Vorgangspassiv (пассив действия) выдвигает на первый план само " +
            "действие и оставляет неважным или неназванным того, кто его " +
            "выполняет. В консалтинге это удобно: часто важнее процесс, а не " +
            "исполнитель — в центре стоит модель, анализ или шаг системы, а не " +
            "команда за ними.",
        },
        {
          heading: "Как образуется",
          body:
            "Форма глагола «werden» + партицип II смыслового глагола. В " +
            "придаточном предложении спрягаемая форма «werden» уходит в конец. " +
            "Если исполнителя всё же называют, используют «von» (+ Dativ) для " +
            "действующего лица и «durch» (+ Akkusativ) для средства или " +
            "инструмента.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Die Daten werden anonymisiert.",
            "Der Bericht wird vom Berater geprüft.",
            "Die Auswertung wird durch ein Skript erstellt.",
            "…, bevor das Modell trainiert wird.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Путают Vorgangspassiv (werden) и Zustandspassiv (sein): «Die " +
              "Schnittstelle ist angebunden» описывает состояние, а «… wird " +
              "angebunden» — процесс.",
            "Неверный предлог исполнителя: средство через «durch», лицо через " +
              "«von».",
            "Забывают согласование «werden» с подлежащим во множественном " +
              "числе: «Die Daten wird …» → правильно: «Die Daten werden …».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Нужно описать процесс без исполнителя — берите werden + партицип " +
            "II. Исполнителя, если он важен, добавляйте через von (лицо) или " +
            "durch (средство).",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: KI-Beratung",
      items: [
        {
          term: "die Anforderungsanalyse",
          translation: "анализ требований",
          example:
            "Vor der Umsetzung wird eine gründliche Anforderungsanalyse " +
            "durchgeführt.",
        },
        {
          term: "der Machbarkeitsnachweis",
          translation: "подтверждение осуществимости (proof of concept)",
          example:
            "Der Machbarkeitsnachweis wird in zwei Wochen fertiggestellt.",
        },
        {
          term: "die Schnittstelle",
          translation: "интерфейс / API",
          example:
            "Die Schnittstelle wird an das bestehende System angebunden.",
        },
        {
          term: "der Anwendungsfall",
          translation: "сценарий использования",
          example: "Für jeden Anwendungsfall werden klare Kriterien definiert.",
        },
        {
          term: "der Datenschutz",
          translation: "защита данных",
          example: "Der Datenschutz wird bei jedem Schritt berücksichtigt.",
        },
        {
          term: "die Wirtschaftlichkeit",
          translation: "экономическая целесообразность",
          example: "Die Wirtschaftlichkeit der Lösung wird laufend geprüft.",
        },
        {
          term: "anonymisieren",
          translation: "анонимизировать",
          example:
            "Personenbezogene Daten werden vor der Analyse anonymisiert.",
        },
        {
          term: "bereinigen",
          translation: "очищать (данные)",
          example: "Die Rohdaten werden zuerst bereinigt.",
        },
        {
          term: "trainieren",
          translation: "обучать (модель)",
          example: "Das Modell wird mit historischen Daten trainiert.",
        },
        {
          term: "ausrollen",
          translation: "разворачивать / внедрять (отделяемый)",
          example: "Die Lösung wird schrittweise ausgerollt.",
        },
        {
          term: "anbinden",
          translation: "подключать / интегрировать (отделяемый)",
          example: "Die Schnittstelle wird an das CRM angebunden.",
        },
        {
          term: "durch (+ Akkusativ)",
          translation: "посредством / через (средство действия)",
          example: "Die Auswertung wird durch ein Skript erstellt.",
        },
        {
          term: "von (+ Dativ)",
          translation: "кем (действующее лицо в пассиве)",
          example: "Der Bericht wird vom Berater geprüft.",
        },
        {
          term: "Die Daten werden verschlüsselt gespeichert.",
          translation: "Данные хранятся в зашифрованном виде. (фраза)",
        },
        {
          term: "Im ersten Schritt wird … erhoben.",
          translation: "На первом шаге собирается … (шаблон описания процесса)",
        },
        {
          term: "Anschließend wird … geprüft.",
          translation: "Затем проверяется … (шаблон описания процесса)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-reading"),
      kind: ActivityKind.Reading,
      title: "Ein KI-Projekt beim Kunden",
      text:
        "Zu Beginn eines Projekts wird gemeinsam mit dem Kunden der " +
        "Anwendungsfall festgelegt. Anschließend werden die vorhandenen Daten " +
        "gesichtet und auf Qualität geprüft. Personenbezogene Angaben werden " +
        "anonymisiert, bevor ein erstes Modell trainiert wird. Die Ergebnisse " +
        "werden in einem Machbarkeitsnachweis zusammengefasst und dem " +
        "Fachbereich vorgestellt. Erst wenn die Wirtschaftlichkeit bestätigt " +
        "ist, wird die Lösung über eine Schnittstelle in das bestehende System " +
        "integriert und schrittweise ausgerollt.",
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Vorgangspassiv",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Wir speichern die ' +
            'Kundendaten verschlüsselt."',
          sampleAnswer: "Die Kundendaten werden verschlüsselt gespeichert.",
          explanation:
            "Критерии оценки: подлежащее — «die Kundendaten»; конструкция " +
            "werden + партицип II (gespeichert); сохранение смысла. Возможны " +
            "варианты порядка слов.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "werden-agreement",
          prompt:
            'Ergänzen Sie die richtige Form von "werden": "Bevor das ' +
            'Modell trainiert ___, werden die Daten bereinigt."',
          expectedAnswer: "wird",
          explanation:
            'В придаточном предложении спрягаемое "werden" стоит в конце; ' +
            'подлежащее "das Modell" в единственном числе — "wird".',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "agent-preposition",
          prompt:
            'Ergänzen Sie "von" oder "durch": "Der Bericht wird ___ dem ' +
            'Berater geprüft."',
          expectedAnswer: "von",
          explanation:
            'Действующее лицо (человек) присоединяется предлогом "von" + ' +
            "Dativ.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "agent-preposition",
          prompt:
            'Ergänzen Sie "von" oder "durch": "Die Auswertung wird ___ ' +
            'ein Skript erstellt."',
          expectedAnswer: "durch",
          explanation:
            "Средство или инструмент действия присоединяется предлогом " +
            '"durch" + Akkusativ.',
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie ins Vorgangspassiv um: "Das Team stellt die ' +
            'Ergebnisse vor."',
          sampleAnswer: "Die Ergebnisse werden vorgestellt.",
          explanation:
            "Критерии оценки: конструкция werden + партицип II отделяемого " +
            "глагола (vorgestellt, приставка присоединена); сохранение смысла. " +
            "Указание исполнителя (vom Team) допустимо.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "werden-agreement",
          prompt:
            'Ergänzen Sie die richtige Form von "werden": "Die Daten ___ vor ' +
            'dem Training bereinigt."',
          expectedAnswer: "werden",
          explanation:
            "Подлежащее «die Daten» во множественном числе → werden.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "agent-preposition",
          prompt:
            'Ergänzen Sie richtig. Antworten Sie mit dem Buchstaben. "Die ' +
            'Prüfung wird ___ ein automatisiertes Skript durchgeführt." ' +
            'A) "von" B) "durch"',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation: "Скрипт — средство действия → durch + Akkusativ.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "active-to-passive",
          prompt:
            'Formen Sie ins Vorgangspassiv um (mit Handelndem): "Der Berater ' +
            'erstellt den Bericht."',
          expectedAnswer: "Der Bericht wird vom Berater erstellt.",
          acceptedAnswers: [
            "Der Bericht wird von dem Berater erstellt.",
            "Vom Berater wird der Bericht erstellt.",
          ],
          explanation:
            "«den Bericht» → подлежащее «der Bericht»; werden + erstellt; " +
            "исполнитель через von + Dativ (vom Berater).",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "partizip-ii",
          prompt:
            'Ergänzen Sie das Partizip II: "Personenbezogene Daten werden vor ' +
            'der Analyse ___." (anonymisieren)',
          expectedAnswer: "anonymisiert",
          explanation: "Глагол на -ieren: партицип II без ge- → anonymisiert.",
        },
        {
          id: exerciseId("de-ai-consultant-vorgangspassiv-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...passiveMistake,
          subcategory: "vorgangs-vs-zustand",
          prompt:
            "Welcher Satz beschreibt einen Vorgang (Prozess)? Antworten Sie " +
            'mit dem Buchstaben. A) "Die Schnittstelle ist angebunden." ' +
            'B) "Die Schnittstelle wird angebunden."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "werden + партицип II описывает процесс (Vorgangspassiv); sein + " +
            "партицип II описывает результат/состояние (Zustandspassiv).",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-vorgangspassiv-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde bittet um eine kurze Beschreibung, wie ein KI-Projekt " +
        "abläuft. Beschreiben Sie den Ablauf und verwenden Sie mindestens " +
        "fünf Passivkonstruktionen. Achten Sie auf einen sachlichen, " +
        "professionellen Ton.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Опишите ход проекта по шагам",
        "Используйте не менее пяти пассивных конструкций (Vorgangspassiv)",
        "Сохраняйте деловой, нейтральный тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 7 — Konjunktiv II
// ---------------------------------------------------------------------------

const konjunktiv2Mistake = {
  topic: "konjunktiv-2",
  category: "mood",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantKonjunktiv2: Lesson = {
  id: lessonId("de-ai-consultant-konjunktiv-ii"),
  topic: "konjunktiv-2",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Konjunktiv II: höflich beraten und empfehlen",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Konjunktiv II)",
    "Goethe-Institut — Grammatik-Referenz (Konjunktiv II, Höflichkeit)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Konjunktiv II für Empfehlungen und Bitten",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Консультант редко приказывает — он рекомендует, предлагает и " +
            "вежливо просит. Konjunktiv II смягчает высказывание: он выражает " +
            "вежливые просьбы, осторожные советы и гипотетические сценарии " +
            "(«если бы у нас было больше данных …»). Это язык дипломатичной " +
            "рекомендации.",
        },
        {
          heading: "Как образуется",
          body:
            "У большинства глаголов: würde + инфинитив (Wir würden empfehlen). " +
            "Частые глаголы имеют собственную форму: sein → wäre, haben → " +
            "hätte, können → könnte, sollen → sollte, müssen → müsste, werden " +
            "→ würde. Нереальное условие ставит Konjunktiv II в обеих частях: " +
            "«Wenn wir mehr Zeit hätten, würden wir zusätzliche Tests " +
            "durchführen».",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Könnten Sie uns die Daten bis Freitag zusenden?",
            "An Ihrer Stelle würde ich zuerst einen Machbarkeitsnachweis erstellen.",
            "Es wäre sinnvoll, die Einführung zu verschieben.",
            "Mit einer Automatisierung könnten wir viel Zeit sparen.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "würde там, где есть готовая форма: «würde haben» / «würde sein» → " +
              "лучше hätte / wäre.",
            "Индикатив в нереальном условии: «Wenn das Budget reicht, machen " +
              "wir es» звучит как реальное; для гипотезы — «Wenn das Budget " +
              "reichen würde, würden wir es umsetzen».",
            "Слишком прямой тон вместо вежливого: «Schicken Sie mir …» → " +
              "«Könnten Sie mir … schicken?».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Для вежливости и гипотез берите Konjunktiv II: частые глаголы — " +
            "через wäre/hätte/könnte/sollte, остальные — через würde + " +
            "инфинитив.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Empfehlungen und Beratung",
      items: [
        {
          term: "der Vorschlag",
          translation: "предложение",
          example: "Ich hätte einen Vorschlag zur Priorisierung.",
        },
        {
          term: "die Empfehlung",
          translation: "рекомендация",
          example: "Unsere Empfehlung wäre, zunächst klein zu starten.",
        },
        {
          term: "die Bedenken (Pl.)",
          translation: "сомнения / опасения",
          example: "Ich hätte Bedenken bei diesem Zeitplan.",
        },
        {
          term: "der Machbarkeitsnachweis",
          translation: "подтверждение осуществимости (PoC)",
          example: "Zunächst würde ich einen Machbarkeitsnachweis erstellen.",
        },
        {
          term: "abraten von",
          translation: "отговаривать от (+ Dativ)",
          example: "Von einer Komplettlösung würde ich vorerst abraten.",
        },
        {
          term: "vorschlagen",
          translation: "предлагать (отделяемый)",
          example: "Ich würde einen schrittweisen Ansatz vorschlagen.",
        },
        {
          term: "empfehlen",
          translation: "рекомендовать",
          example: "Wir würden empfehlen, mit einem Pilotprojekt zu beginnen.",
        },
        {
          term: "eventuell",
          translation: "возможно / при случае",
          example: "Eventuell könnten wir die Einführung verschieben.",
        },
        {
          term: "die Alternative",
          translation: "альтернатива",
          example: "Eine Alternative wäre, den Umfang zu reduzieren.",
        },
        {
          term: "der Aufwand",
          translation: "затраты усилий / времени",
          example: "Der Aufwand wäre in diesem Fall deutlich geringer.",
        },
        {
          term: "Könnten Sie …?",
          translation: "Не могли бы Вы …? (вежливая просьба)",
          example: "Könnten Sie uns die Freigabe bis Freitag erteilen?",
        },
        {
          term: "Ich würde vorschlagen, dass …",
          translation: "Я бы предложил, чтобы … (шаблон)",
        },
        {
          term: "An Ihrer Stelle würde ich …",
          translation: "На Вашем месте я бы … (шаблон совета)",
        },
        {
          term: "Es wäre sinnvoll, … zu …",
          translation: "Было бы целесообразно … (шаблон)",
        },
        {
          term: "Ich hätte da eine Frage / einen Vorschlag.",
          translation: "У меня был бы вопрос / предложение. (фраза)",
        },
        {
          term: "Wir könnten uns vorstellen, dass …",
          translation: "Мы могли бы представить, что … (фраза)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-reading"),
      kind: ActivityKind.Reading,
      title: "Eine vorsichtige Empfehlung",
      text:
        "Sehr geehrte Frau Berg, vielen Dank für die Unterlagen. Nach einer " +
        "ersten Sichtung würden wir empfehlen, zunächst mit einem kleinen " +
        "Pilotprojekt zu beginnen. So könnten wir den Nutzen zeigen, ohne " +
        "gleich hohe Kosten zu verursachen. An Ihrer Stelle würde ich vor der " +
        "vollständigen Einführung einen Machbarkeitsnachweis abwarten. Es " +
        "wäre außerdem sinnvoll, die Datenqualität vorab zu prüfen; wenn die " +
        "Daten sauberer wären, könnten wir das Modell schneller trainieren. " +
        "Könnten Sie uns mitteilen, bis wann eine Entscheidung getroffen " +
        "werden soll? Für Rückfragen stünde ich Ihnen jederzeit gern zur " +
        "Verfügung.",
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Konjunktiv II",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "wuerde-advice",
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form: "An Ihrer Stelle ___ ich ' +
            'zuerst einen Machbarkeitsnachweis erstellen." (werden)',
          expectedAnswer: "würde",
          explanation: "Совет через würde + инфинитив: würde … erstellen.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "polite-request",
          prompt:
            'Ergänzen Sie die höfliche Form von "können": "___ Sie uns die ' +
            'Daten bis Freitag zusenden?"',
          expectedAnswer: "Könnten",
          explanation:
            "Вежливая просьба: Könnten Sie …? (Konjunktiv II от können).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "irreal-condition",
          prompt:
            'Welche Form passt? Antworten Sie mit dem Buchstaben. "Wenn wir ' +
            'mehr Zeit ___, würden wir zusätzliche Tests durchführen." ' +
            'A) "hätten" B) "haben"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation: "Нереальное условие → Konjunktiv II: hätten.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "waere",
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form von "sein": "Es ___ ' +
            'sinnvoll, die Einführung zu verschieben."',
          expectedAnswer: "wäre",
          explanation:
            "sein → wäre; «Es wäre sinnvoll, …» — типичная осторожная " +
            "формулировка.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "polite-reformulation",
          prompt:
            'Formulieren Sie höflicher mit Konjunktiv II: "Schicken Sie mir ' +
            'den Bericht."',
          expectedAnswer: "Könnten Sie mir den Bericht schicken?",
          acceptedAnswers: ["Würden Sie mir den Bericht schicken?"],
          explanation: "Императив → вежливый вопрос с Könnten/Würden Sie …?",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "sollte-advice",
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form von "sollen": "Sie ___ die ' +
            'Risiken vorher mit dem Datenschutz abstimmen."',
          expectedAnswer: "sollten",
          explanation: "Мягкий совет: sollten (Konjunktiv II от sollen).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "irreal-condition",
          prompt:
            "Welcher Satz steht im Konjunktiv II? Antworten Sie mit dem " +
            'Buchstaben. A) "Wenn das Budget reicht, machen wir es." ' +
            'B) "Wenn das Budget reichen würde, würden wir es umsetzen."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Гипотетический сценарий → Konjunktiv II в обеих частях.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv2Mistake,
          subcategory: "koennte",
          prompt:
            'Ergänzen Sie die Konjunktiv-II-Form von "können": "Mit einer ' +
            'Automatisierung ___ wir viel Zeit sparen."',
          expectedAnswer: "könnten",
          explanation: "können → könnten; гипотетическая возможность.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Bilden Sie einen irrealen Bedingungssatz mit Konjunktiv II: " +
            '"Wir haben keine sauberen Daten, deshalb trainieren wir das ' +
            'Modell nicht."',
          sampleAnswer:
            "Wenn wir saubere Daten hätten, würden wir das Modell trainieren.",
          explanation:
            "Критерии оценки: нереальное условие с Konjunktiv II в обеих " +
            "частях (hätten … würden), сохранение смысла. Возможны варианты " +
            "(könnten wir … trainieren).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-ii-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formulieren Sie diplomatisch mit Konjunktiv II: "Ihr Plan ist ' +
            'schlecht und zu teuer."',
          sampleAnswer:
            "Ich hätte bei diesem Plan gewisse Bedenken, da er recht " +
            "kostenintensiv wäre; ich würde eine schlankere Lösung " +
            "vorschlagen.",
          explanation:
            "Критерии оценки: вежливый, дипломатичный тон через Konjunktiv II " +
            "(hätte/wäre/würde), сохранение критики по сути, деловой стиль. " +
            "Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-ii-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Ein Kunde möchte sofort eine teure Komplettlösung einführen. Sie " +
        "halten ein schrittweises Vorgehen für besser. Schreiben Sie eine " +
        "höfliche E-Mail, in der Sie diplomatisch davon abraten und eine " +
        "Alternative empfehlen. Verwenden Sie durchgehend Konjunktiv II.",
      wordRange: { min: 120, max: 150 },
      requirements: [
        "Вежливо выразите сомнения (Ich hätte Bedenken …)",
        "Дайте рекомендацию и альтернативу через Konjunktiv II (würde, wäre, könnte)",
        "Сформулируйте хотя бы одну вежливую просьбу (Könnten Sie …?)",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 8 — Konnektoren
// ---------------------------------------------------------------------------

const konnektorMistake = {
  topic: "konnektoren",
  category: "cohesion",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantKonnektoren: Lesson = {
  id: lessonId("de-ai-consultant-konnektoren"),
  topic: "konnektoren",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Konnektoren: Argumente überzeugend verbinden",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Konnektoren, Konjunktionaladverbien)",
    "Goethe-Institut — Grammatik-Referenz (Satzverbindungen)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-konnektoren-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-konnektoren-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Konnektoren und ihre Satzstellung",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Убедительная рекомендация — это не список фактов, а связный " +
            "аргумент: причина, уступка, противопоставление, вывод. Коннекторы " +
            "делают текст логичным и профессиональным, показывая, как связаны " +
            "затраты и польза, риски и решения.",
        },
        {
          heading: "Как образуется",
          body:
            "Три группы по влиянию на порядок слов. Сочинительные союзы (und, " +
            "aber, denn, sondern, oder) не меняют порядок слов. Подчинительные " +
            "союзы (weil, obwohl, da, während) отправляют глагол в конец. " +
            "Союзные наречия (deshalb, deswegen, trotzdem, dennoch, außerdem, " +
            "zudem, jedoch, hingegen, folglich) стоят на первом месте и требуют " +
            "инверсии (глагол вторым). Есть и парные: sowohl … als auch, " +
            "entweder … oder, nicht nur … sondern auch, je … desto.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Die Datenqualität war niedrig, deshalb verzögerte sich das Projekt.",
            "Obwohl das Modell genau ist, wird es selten genutzt.",
            "Wir prüfen sowohl die Kosten als auch den Nutzen.",
            "Je mehr Daten wir sammeln, desto genauer wird das Modell.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "После союзного наречия забывают инверсию: «…, trotzdem wir sind " +
              "unsicher» → правильно: «…, trotzdem sind wir unsicher».",
            "Путают denn (порядок как в главном) и weil (глагол в конце).",
            "Смешивают части парных коннекторов: «Je … je» → правильно: «Je … " +
              "desto».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Выбирайте коннектор по логике (причина, уступка, контраст, " +
            "добавление) и помните его влияние на порядок слов: наречие → " +
            "инверсия, подчинительный союз → глагол в конец.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konnektoren-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Argumentieren",
      items: [
        {
          term: "der Aufwand",
          translation: "затраты / усилия",
          example: "Der Aufwand ist hoch, dennoch lohnt sich die Investition.",
        },
        {
          term: "der Nutzen",
          translation: "польза / выгода",
          example: "Der Nutzen überwiegt die Kosten deutlich.",
        },
        {
          term: "die Herausforderung",
          translation: "вызов / сложность",
          example: "Die größte Herausforderung ist die Datenqualität.",
        },
        {
          term: "der Kompromiss",
          translation: "компромисс",
          example: "Als Kompromiss schlagen wir eine Teillösung vor.",
        },
        {
          term: "gegenüberstellen",
          translation: "сопоставлять (отделяемый)",
          example: "Wir stellen Kosten und Nutzen gegenüber.",
        },
        {
          term: "abwägen",
          translation: "взвешивать (за и против) (отделяемый)",
          example: "Wir wägen die Vor- und Nachteile sorgfältig ab.",
        },
        {
          term: "überwiegen",
          translation: "перевешивать / преобладать",
          example: "Die Vorteile überwiegen, deshalb empfehlen wir die Lösung.",
        },
        {
          term: "folglich",
          translation: "следовательно (союзное наречие)",
          example:
            "Die Tests laufen noch, folglich verschieben wir den Launch.",
        },
        {
          term: "hingegen",
          translation: "напротив (союзное наречие)",
          example: "Die Kosten steigen; der Aufwand hingegen sinkt.",
        },
        {
          term: "trotzdem",
          translation: "тем не менее (союзное наречие)",
          example: "Die Lösung ist teuer; trotzdem empfehlen wir sie.",
        },
        {
          term: "deshalb",
          translation: "поэтому (союзное наречие)",
          example:
            "Der Prozess ist fehleranfällig, deshalb automatisieren wir ihn.",
        },
        {
          term: "sowohl … als auch",
          translation: "как … так и (парный коннектор)",
          example: "Wir prüfen sowohl die Kosten als auch den Nutzen.",
        },
        {
          term: "nicht nur … sondern auch",
          translation: "не только … но и (парный коннектор)",
          example: "Das spart nicht nur Zeit, sondern auch Kosten.",
        },
        {
          term: "je … desto",
          translation: "чем … тем (парный коннектор)",
          example: "Je sauberer die Daten, desto besser das Ergebnis.",
        },
        {
          term: "Einerseits …, andererseits …",
          translation: "С одной стороны …, с другой стороны … (шаблон)",
        },
        {
          term: "Zusammenfassend empfehlen wir, dass …",
          translation: "Подводя итог, мы рекомендуем, чтобы … (шаблон вывода)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konnektoren-reading"),
      kind: ActivityKind.Reading,
      title: "Kosten und Nutzen einer KI-Lösung",
      text:
        "Die Einführung der KI-Lösung verursacht zunächst zusätzliche Kosten, " +
        "denn Lizenzen und Schulungen müssen finanziert werden. Einerseits ist " +
        "der Aufwand also spürbar, andererseits sinkt der manuelle Aufwand im " +
        "Betrieb deutlich. Die Datenqualität ist derzeit niedrig, deshalb " +
        "beginnen wir mit einer Bereinigung. Obwohl das Projekt anspruchsvoll " +
        "ist, überwiegt der Nutzen: Die Lösung spart nicht nur Zeit, sondern " +
        "verbessert auch die Genauigkeit der Auswertungen. Je mehr saubere " +
        "Daten zur Verfügung stehen, desto zuverlässiger arbeitet das Modell. " +
        "Zusammenfassend empfehlen wir, dass zunächst ein Pilot gestartet wird.",
    },
    {
      id: activityId("de-ai-consultant-konnektoren-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Konnektoren",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "adverb-consequence",
          prompt:
            'Ergänzen Sie das passende Konnektoradverb (Folge): "Die ' +
            'Datenqualität war niedrig, ___ verzögerte sich das Projekt."',
          expectedAnswer: "deshalb",
          acceptedAnswers: ["deswegen", "daher", "folglich"],
          explanation:
            "Причина → следствие: deshalb/deswegen/daher/folglich; за ним " +
            "инверсия (verzögerte sich).",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "adverb-inversion",
          prompt:
            "Welcher Satz ist korrekt? Antworten Sie mit dem Buchstaben. " +
            'A) "Wir haben getestet, trotzdem wir sind unsicher." ' +
            'B) "Wir haben getestet, trotzdem sind wir unsicher."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation:
            "Союзное наречие trotzdem требует инверсии: trotzdem sind wir …",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "subjunction",
          prompt:
            'Ergänzen Sie die Konjunktion (weil / denn / trotzdem): "Wir ' +
            "verschieben den Launch, ___ die Tests noch nicht abgeschlossen " +
            'sind."',
          expectedAnswer: "weil",
          explanation:
            "Глагол sind стоит в конце → подчинительный союз weil (причина).",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "paired-connector",
          prompt:
            'Ergänzen Sie den ersten Teil des Konnektors: "Wir prüfen ___ die ' +
            'Kosten als auch den Nutzen."',
          expectedAnswer: "sowohl",
          explanation: "Парный коннектор: sowohl … als auch.",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "sentence-building",
          prompt:
            'Verbinden Sie mit "obwohl": "Das Modell ist genau. Es wird ' +
            'selten genutzt."',
          expectedAnswer:
            "Obwohl das Modell genau ist, wird es selten genutzt.",
          acceptedAnswers: [
            "Das Modell wird selten genutzt, obwohl es genau ist.",
          ],
          explanation:
            "obwohl отправляет глагол в конец придаточного; при вынесении " +
            "вперёд — инверсия в главном (wird es …).",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "paired-connector",
          prompt:
            "Welche Kombination ist korrekt? Antworten Sie mit dem " +
            'Buchstaben. "___ mehr Daten wir sammeln, ___ genauer wird das ' +
            'Modell." A) "Je / desto" B) "Desto / je"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation:
            "Правильный порядок: Je …, desto … (сравнительная степень в обеих " +
            "частях).",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "adverb-concession",
          prompt:
            'Ergänzen Sie das Konnektoradverb (Einräumung): "Die Lösung ist ' +
            'teuer; ___ empfehlen wir sie, weil sie viel Zeit spart."',
          expectedAnswer: "trotzdem",
          acceptedAnswers: ["dennoch"],
          explanation:
            "Уступка вопреки высокой цене: trotzdem/dennoch + инверсия.",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...konnektorMistake,
          subcategory: "denn-to-weil",
          prompt:
            'Schreiben Sie mit "weil": "Wir automatisieren den Prozess, ' +
            'denn er ist fehleranfällig."',
          expectedAnswer:
            "Wir automatisieren den Prozess, weil er fehleranfällig ist.",
          explanation:
            "denn (порядок как в главном) → weil (глагол ist в конце).",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Verbinden Sie die Sätze mit einem passenden Konnektor der " +
            'Einräumung: "Die Einführung war aufwendig. Sie hat sich ' +
            'gelohnt."',
          sampleAnswer:
            "Die Einführung war aufwendig, dennoch hat sie sich gelohnt.",
          explanation:
            "Критерии оценки: коннектор уступки (dennoch/trotzdem с инверсией " +
            "или obwohl с глаголом в конце), сохранение смысла, корректный " +
            "порядок слов. Несколько формулировок возможны.",
        },
        {
          id: exerciseId("de-ai-consultant-konnektoren-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Formulieren Sie als zusammenhängendes Argument mit Konnektoren: " +
            '"KI spart Zeit. KI kostet Geld. Wir empfehlen sie."',
          sampleAnswer:
            "KI verursacht zwar zusätzliche Kosten, spart jedoch erheblich " +
            "Zeit; deshalb empfehlen wir den Einsatz.",
          explanation:
            "Критерии оценки: связный аргумент с коннекторами (zwar … jedoch, " +
            "deshalb …), верный порядок слов, сохранение всех трёх идей. " +
            "Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konnektoren-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Der Kunde ist unsicher, ob sich eine KI-Lösung lohnt. Schreiben Sie " +
        "eine kurze, überzeugende Stellungnahme, in der Sie Kosten und Nutzen " +
        "abwägen und zu einer klaren Empfehlung kommen. Verbinden Sie Ihre " +
        "Argumente mit passenden Konnektoren.",
      wordRange: { min: 130, max: 160 },
      requirements: [
        "Сопоставьте затраты и пользу (einerseits … andererseits, zwar … jedoch)",
        "Используйте не менее двух союзных наречий с инверсией (deshalb, trotzdem, folglich)",
        "Завершите чёткой рекомендацией; деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 9 — Nominalisierung + Funktionsverbgefüge
// ---------------------------------------------------------------------------

const nominalMistake = {
  topic: "nominalisierung",
  category: "register-nominal-style",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantNominalisierung: Lesson = {
  id: lessonId("de-ai-consultant-nominalisierung"),
  topic: "nominalisierung",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Nominalstil und Funktionsverbgefüge im Bericht",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Nominalisierung, Funktionsverbgefüge)",
    "Goethe-Institut — Grammatik-Referenz (Nominalstil)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-nominalisierung-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-nominalisierung-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Nominalstil und Funktionsverbgefüge",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "Официальные отчёты, заключения и презентации в немецком часто " +
            "написаны «именным стилем» (Nominalstil): действия выражаются " +
            "существительными. Это придаёт тексту сжатость и деловую " +
            "объективность. Рядом работают функционально-глагольные сочетания " +
            "(Funktionsverbgefüge) — устойчивые пары «существительное + " +
            "глагол», типичные для формального регистра.",
        },
        {
          heading: "Как образуется",
          body:
            "Номинализация превращает глагол в существительное: prüfen → die " +
            "Prüfung, umsetzen → die Umsetzung, entscheiden → die " +
            "Entscheidung. Придаточное сворачивается в именную группу с " +
            "родительным падежом или предлогом: «nachdem die Daten geprüft " +
            "wurden» → «nach der Prüfung der Daten». Funktionsverbgefüge — " +
            "фиксированные сочетания: eine Entscheidung treffen, in Betracht " +
            "ziehen, zur Verfügung stellen, in Frage stellen, zum Einsatz " +
            "kommen, Rücksprache halten.",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Nach der Prüfung der Daten erstellen wir den Bericht.",
            "Wir treffen die Entscheidung nach der Analyse.",
            "Die Risiken werden dabei in Betracht gezogen.",
            "Die neue Methode kommt ab Januar zum Einsatz.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Неверный глагол в Funktionsverbgefüge: «die Risiken in Betracht " +
              "nehmen» → правильно: «in Betracht ziehen».",
            "Чрезмерная номинализация делает текст тяжёлым и нечитаемым — " +
              "именной стиль хорош дозированно.",
            "Пропуск родительного падежа при номинализации: «die Umsetzung das " +
              "Projekt» → правильно: «die Umsetzung des Projekts».",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Для формального отчёта уместен именной стиль и Funktionsverb" +
            "gefüge; но следите за читаемостью и точным управлением (родительный " +
            "падеж, фиксированный глагол сочетания).",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nominalisierung-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Formeller Berichtsstil",
      items: [
        {
          term: "die Umsetzung",
          translation: "реализация / внедрение (← umsetzen)",
          example: "Die Umsetzung des Projekts beginnt im dritten Quartal.",
        },
        {
          term: "die Entscheidung",
          translation: "решение (← entscheiden)",
          example: "Die Entscheidung fällt nach der Analyse.",
        },
        {
          term: "die Prüfung",
          translation: "проверка (← prüfen)",
          example: "Nach der Prüfung der Daten folgt die Auswertung.",
        },
        {
          term: "die Berücksichtigung",
          translation: "учёт (← berücksichtigen)",
          example:
            "Unter Berücksichtigung der Risiken empfehlen wir Variante B.",
        },
        {
          term: "die Einführung",
          translation: "внедрение / введение (← einführen)",
          example: "Die Einführung des Systems erfolgt schrittweise.",
        },
        {
          term: "die Auswertung",
          translation: "анализ / оценка (← auswerten)",
          example: "Die Auswertung der Kennzahlen erfolgt monatlich.",
        },
        {
          term: "eine Entscheidung treffen",
          translation: "принимать решение (Funktionsverbgefüge)",
          example: "Wir müssen bald eine Entscheidung treffen.",
        },
        {
          term: "in Betracht ziehen",
          translation: "принимать во внимание (Funktionsverbgefüge)",
          example: "Wir ziehen alle Risiken in Betracht.",
        },
        {
          term: "zur Verfügung stellen",
          translation: "предоставлять (Funktionsverbgefüge)",
          example: "Der Kunde stellt uns die Daten zur Verfügung.",
        },
        {
          term: "in Frage stellen",
          translation: "ставить под вопрос (Funktionsverbgefüge)",
          example: "Die hohen Kosten stellen den Nutzen in Frage.",
        },
        {
          term: "zum Einsatz kommen",
          translation:
            "применяться / вводиться в действие (Funktionsverbgefüge)",
          example: "Ab Januar kommt die neue Methode zum Einsatz.",
        },
        {
          term: "Rücksprache halten",
          translation: "согласовывать / советоваться (Funktionsverbgefüge)",
          example: "Wir halten mit dem Datenschutz Rücksprache.",
        },
        {
          term: "eine Empfehlung aussprechen",
          translation: "выносить рекомендацию (Funktionsverbgefüge)",
          example: "Wir sprechen eine klare Empfehlung aus.",
        },
        {
          term: "Unter Berücksichtigung von … (+ Dativ)",
          translation: "С учётом … (шаблон отчёта)",
        },
        {
          term: "Im Rahmen der Umsetzung …",
          translation: "В рамках реализации … (шаблон отчёта)",
        },
        {
          term: "Nach Abschluss der Prüfung …",
          translation: "По завершении проверки … (шаблон отчёта)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nominalisierung-reading"),
      kind: ActivityKind.Reading,
      title: "Auszug aus dem Abschlussbericht",
      text:
        "Nach Abschluss der Prüfung der Datenqualität wurde eine Entscheidung " +
        "über das weitere Vorgehen getroffen. Unter Berücksichtigung der " +
        "Kosten und des erwarteten Nutzens sprechen wir die Empfehlung aus, " +
        "die Lösung schrittweise einzuführen. Im Rahmen der Umsetzung werden " +
        "die bestehenden Schnittstellen angebunden; dabei kommen bewährte " +
        "Verfahren zum Einsatz. Vor der Verarbeitung personenbezogener Daten " +
        "halten wir mit dem Datenschutz Rücksprache. Etwaige Risiken werden " +
        "fortlaufend in Betracht gezogen und dokumentiert.",
    },
    {
      id: activityId("de-ai-consultant-nominalisierung-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Nominalstil und Funktionsverbgefüge",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "nominalization",
          prompt: 'Nominalisieren Sie das Verb: "prüfen → die ___"',
          expectedAnswer: "Prüfung",
          explanation: "prüfen → die Prüfung (номинализация действия).",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "funktionsverbgefuege",
          prompt:
            'Ergänzen Sie das Funktionsverb: "Wir müssen bald eine ' +
            'Entscheidung ___."',
          expectedAnswer: "treffen",
          explanation: "Устойчивое сочетание: eine Entscheidung treffen.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "funktionsverbgefuege",
          prompt:
            "Welche Formulierung ist korrekt? Antworten Sie mit dem " +
            'Buchstaben. A) "Wir nehmen die Risiken in Betracht." ' +
            'B) "Wir ziehen die Risiken in Betracht."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation: "Правильный глагол в сочетании: in Betracht ziehen.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "nominalization",
          prompt: 'Nominalisieren Sie das Verb: "einführen → die ___"',
          expectedAnswer: "Einführung",
          explanation: "einführen → die Einführung.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "nominalization",
          prompt:
            'Ergänzen Sie die Nominalisierung: "Nach der ___ der Daten ' +
            'erstellen wir den Bericht." (analysieren)',
          expectedAnswer: "Analyse",
          explanation:
            "analysieren → die Analyse; «nach der Analyse der Daten».",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "funktionsverbgefuege",
          prompt:
            "Ergänzen Sie das Funktionsverb. Antworten Sie mit dem " +
            'Buchstaben. "Die hohen Kosten ___ den Nutzen in Frage." ' +
            'A) "stellen" B) "machen"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation: "Сочетание: etwas in Frage stellen.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "funktionsverbgefuege",
          prompt:
            'Ergänzen Sie das Nomen: "Die neue Methode kommt ab Januar zum ' +
            '___." (einsetzen)',
          expectedAnswer: "Einsatz",
          explanation: "Сочетание: zum Einsatz kommen.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...nominalMistake,
          subcategory: "nominal-to-verbal",
          prompt:
            'Formen Sie in den Verbalstil um: "Nach der Freigabe des Budgets ' +
            'beginnen wir."',
          expectedAnswer: "Nachdem das Budget freigegeben wurde, beginnen wir.",
          acceptedAnswers: [
            "Nachdem das Budget freigegeben worden ist, beginnen wir.",
            "Sobald das Budget freigegeben ist, beginnen wir.",
          ],
          explanation:
            "Именная группа «nach der Freigabe des Budgets» → придаточное с " +
            "глаголом (nachdem … freigegeben wurde).",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            'Formen Sie in den Nominalstil um: "Wir prüfen die Anforderungen ' +
            'und bewerten die Risiken."',
          sampleAnswer:
            "die Prüfung der Anforderungen und die Bewertung der Risiken",
          explanation:
            "Критерии оценки: обе номинализации с родительным падежом " +
            "(Prüfung der Anforderungen, Bewertung der Risiken), сохранение " +
            "смысла. Возможен полный вариант в предложении.",
        },
        {
          id: exerciseId("de-ai-consultant-nominalisierung-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Formulieren Sie für einen formellen Bericht mit einem " +
            'Funktionsverbgefüge: "Wir haben entschieden, das Tool zu ' +
            'benutzen."',
          sampleAnswer:
            "Wir haben die Entscheidung getroffen, das Tool zum Einsatz zu " +
            "bringen.",
          explanation:
            "Критерии оценки: использование Funktionsverbgefüge (eine " +
            "Entscheidung treffen, zum Einsatz bringen/kommen), формальный " +
            "тон, сохранение смысла. Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-nominalisierung-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Fassen Sie das Ergebnis einer Projektphase in einem kurzen, formellen " +
        "Berichtsabsatz zusammen. Nutzen Sie den Nominalstil und mindestens " +
        "drei Funktionsverbgefüge, ohne den Text zu überladen.",
      wordRange: { min: 130, max: 160 },
      requirements: [
        "Используйте именной стиль (Prüfung, Umsetzung, Auswertung …)",
        "Включите не менее трёх Funktionsverbgefüge (eine Entscheidung treffen, in Betracht ziehen, zum Einsatz kommen …)",
        "Сохраняйте читаемость и формальный деловой тон",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lesson 10 — Konjunktiv I + Indirekte Rede
// ---------------------------------------------------------------------------

const konjunktiv1Mistake = {
  topic: "konjunktiv-1",
  category: "reported-speech",
  severity: MistakeSeverity.Medium,
} as const;

export const germanAiConsultantKonjunktiv1: Lesson = {
  id: lessonId("de-ai-consultant-konjunktiv-i"),
  topic: "konjunktiv-1",
  language: Language.German,
  careerTrack: CareerTrack.AiConsultant,
  title: "Konjunktiv I: Aussagen im Protokoll wiedergeben",
  targetLevel: CefrLevel.C1,
  sources: [
    "Duden — Die Grammatik (Konjunktiv I, indirekte Rede)",
    "Goethe-Institut — Grammatik-Referenz (Indirekte Rede)",
    "Deutsche Welle — Deutsch lernen, Grammatik",
  ],
  activities: [
    {
      id: activityId("de-ai-consultant-konjunktiv-i-review"),
      kind: ActivityKind.Review,
      title: "Wiederholung",
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-i-theory"),
      kind: ActivityKind.GrammarTheory,
      title: "Konjunktiv I und indirekte Rede",
      sections: [
        {
          heading: "Где это нужно",
          body:
            "В протоколах встреч, отчётах и обзорах консультант передаёт чужие " +
            "высказывания нейтрально и дистанцированно — не присваивая их и не " +
            "оценивая. Для этого служит косвенная речь с Konjunktiv I: «Клиент " +
            "сказал, что проект идёт по плану».",
        },
        {
          heading: "Как образуется",
          body:
            "Konjunktiv I образуется от основы инфинитива: er sage, er habe, " +
            "er komme, er werde; sein — особая форма (er sei, sie seien). Если " +
            "форма Konjunktiv I совпадает с индикативом (особенно во " +
            "множественном числе: sie haben), берут Konjunktiv II, чтобы " +
            "косвенная речь оставалась узнаваемой: «sie hätten», «sie würden " +
            "… starten».",
        },
        {
          heading: "Примеры из практики",
          items: [
            "Der Kunde sagte, das Projekt sei auf gutem Weg.",
            "Sie teilte mit, sie habe die Daten bereits geprüft.",
            "Der Berater erklärte, die Lösung werde im Mai eingeführt.",
            "Laut Protokoll seien die Kosten im Rahmen.",
          ],
        },
        {
          heading: "Типичные ошибки",
          items: [
            "Индикатив вместо Konjunktiv I: «Er sagt, er hat keine Zeit» → в " +
              "нейтральном протоколе: «…, er habe keine Zeit».",
            "Форма совпадает с индикативом, но её не заменяют на Konjunktiv II: " +
              "«sie sagten, sie haben …» → «…, sie hätten …».",
            "Неверная форма sein: «er ist» вместо «er sei» в косвенной речи.",
          ],
        },
        {
          heading: "Вывод",
          body:
            "Для нейтральной передачи чужих слов используйте Konjunktiv I; " +
            "когда он неотличим от индикатива, переходите на Konjunktiv II.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-i-vocabulary"),
      kind: ActivityKind.Vocabulary,
      title: "Fachwortschatz: Protokoll und Wiedergabe",
      items: [
        {
          term: "die Aussage",
          translation: "высказывание / заявление",
          example: "Die Aussage des Kunden wurde im Protokoll festgehalten.",
        },
        {
          term: "die Stellungnahme",
          translation: "заключение / позиция",
          example: "Der Fachbereich gab eine kurze Stellungnahme ab.",
        },
        {
          term: "das Protokoll",
          translation: "протокол",
          example: "Laut Protokoll sei der Zeitplan bestätigt worden.",
        },
        {
          term: "behaupten",
          translation: "утверждать",
          example: "Der Anbieter behauptet, seine Lösung sei DSGVO-konform.",
        },
        {
          term: "mitteilen",
          translation: "сообщать (отделяемый)",
          example: "Sie teilte mit, sie habe die Freigabe erteilt.",
        },
        {
          term: "erklären",
          translation: "заявлять / пояснять",
          example: "Der Berater erklärte, das Modell sei einsatzbereit.",
        },
        {
          term: "betonen",
          translation: "подчёркивать",
          example: "Der Kunde betonte, der Datenschutz habe Priorität.",
        },
        {
          term: "einräumen",
          translation: "признавать (отделяемый)",
          example: "Das Team räumte ein, der Zeitplan sei zu knapp gewesen.",
        },
        {
          term: "laut (+ Dativ)",
          translation: "согласно",
          example: "Laut dem Bericht sei das Budget ausreichend.",
        },
        {
          term: "zufolge (+ Dativ, nachgestellt)",
          translation: "согласно (ставится после слова)",
          example: "Dem Kunden zufolge sei die Lösung überzeugend.",
        },
        {
          term: "die Rückmeldung",
          translation: "обратная связь / ответ",
          example: "Die Rückmeldung des Vorstands sei positiv ausgefallen.",
        },
        {
          term: "Der Kunde sagte, er …",
          translation: "Клиент сказал, что он … (шаблон косвенной речи)",
          example: "Der Kunde sagte, er brauche mehr Zeit.",
        },
        {
          term: "Sie teilte mit, dass …",
          translation: "Она сообщила, что … (шаблон)",
        },
        {
          term: "Laut … sei / habe …",
          translation: "Согласно … является / имеет … (шаблон протокола)",
        },
        {
          term: "Es wurde darauf hingewiesen, dass …",
          translation: "Было отмечено, что … (шаблон протокола)",
        },
        {
          term: "Im Protokoll wurde festgehalten, dass …",
          translation: "В протоколе зафиксировано, что … (шаблон)",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-i-reading"),
      kind: ActivityKind.Reading,
      title: "Protokoll der Abstimmung",
      text:
        "Im Protokoll wurde festgehalten, dass das Projekt insgesamt auf " +
        "gutem Weg sei. Der Kunde erklärte, er sei mit dem bisherigen " +
        "Fortschritt zufrieden, die Kosten seien jedoch etwas höher als " +
        "geplant. Die Projektleiterin teilte mit, das Team habe die " +
        "Datenqualität geprüft und werde das Modell in der kommenden Woche " +
        "trainieren. Der Datenschutz wies darauf hin, dass personenbezogene " +
        "Daten vorher anonymisiert werden müssten. Laut dem Vorstand solle bis " +
        "Monatsende eine Entscheidung über die weitere Finanzierung getroffen " +
        "werden.",
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-i-practice"),
      kind: ActivityKind.GrammarPractice,
      title: "Übung: Konjunktiv I und indirekte Rede",
      exercises: [
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex1"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "sein-form",
          prompt:
            'Ergänzen Sie den Konjunktiv I von "sein": "Der Kunde sagte, das ' +
            'Projekt ___ auf gutem Weg."',
          expectedAnswer: "sei",
          explanation: "sein в Konjunktiv I (3. л. ед. ч.): sei.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex2"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "haben-form",
          prompt:
            'Ergänzen Sie den Konjunktiv I von "haben": "Sie teilte mit, sie ' +
            '___ die Daten bereits geprüft."',
          expectedAnswer: "habe",
          explanation: "haben в Konjunktiv I (3. л. ед. ч.): habe.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex3"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "indirect-vs-direct",
          prompt:
            "Welcher Satz ist korrekte indirekte Rede (Konjunktiv I)? " +
            'Antworten Sie mit dem Buchstaben. A) "Er sagt, er hat keine ' +
            'Zeit." B) "Er sagt, er habe keine Zeit."',
          expectedAnswer: "B",
          acceptedAnswers: ["b"],
          explanation: "Нейтральная косвенная речь: er habe (Konjunktiv I).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex4"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "werden-form",
          prompt:
            'Ergänzen Sie den Konjunktiv I von "werden": "Der Berater ' +
            'erklärte, die Lösung ___ im Mai eingeführt."',
          expectedAnswer: "werde",
          explanation:
            "werden в Konjunktiv I (3. л. ед. ч.): werde (пассив будущего/" +
            "процесса в косвенной речи).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex5"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "direct-to-indirect",
          prompt:
            'Geben Sie in indirekter Rede wieder. Der Kunde: "Ich brauche ' +
            'mehr Zeit."',
          expectedAnswer: "Der Kunde sagte, er brauche mehr Zeit.",
          acceptedAnswers: [
            "Der Kunde sagte, dass er mehr Zeit brauche.",
            "Der Kunde sagte, er brauche mehr Zeit .",
          ],
          explanation: "ich → er; brauchen в Konjunktiv I: brauche.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex6"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.MultipleChoice,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "konjunktiv-ii-substitute",
          prompt:
            'Warum heißt es "Die Mitarbeiter sagten, sie hätten keine ' +
            'Schulung"? Antworten Sie mit dem Buchstaben. ' +
            "A) \"weil 'haben' im Konjunktiv I wie der Indikativ aussieht\" " +
            'B) "weil es Vergangenheit ist"',
          expectedAnswer: "A",
          acceptedAnswers: ["a"],
          explanation:
            "Во мн. ч. Konjunktiv I «sie haben» = индикативу, поэтому берут " +
            "Konjunktiv II «hätten».",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex7"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.FillBlank,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "sein-form",
          prompt:
            'Ergänzen Sie den Konjunktiv I von "sein": "Laut dem Protokoll ' +
            '___ das Budget ausreichend."',
          expectedAnswer: "sei",
          explanation: "Косвенная передача с laut → Konjunktiv I: sei.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex8"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.ShortAnswer,
          evaluation: ExerciseEvaluation.Graded,
          ...konjunktiv1Mistake,
          subcategory: "konjunktiv-ii-substitute",
          prompt:
            'Geben Sie in indirekter Rede wieder. Die Beraterin: "Wir haben ' +
            'das Ziel erreicht."',
          expectedAnswer: "Die Beraterin sagte, sie hätten das Ziel erreicht.",
          acceptedAnswers: [
            "Die Beraterin sagte, dass sie das Ziel erreicht hätten.",
          ],
          explanation:
            "«wir haben» во мн. ч. совпадает с индикативом → Konjunktiv II " +
            "hätten (sie hätten … erreicht).",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex9"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Transformation,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Geben Sie in indirekter Rede (Konjunktiv I) wieder. Der " +
            'Projektleiter: "Das Modell ist fertig und wir starten den ' +
            'Test."',
          sampleAnswer:
            "Der Projektleiter sagte, das Modell sei fertig und sie würden " +
            "den Test starten.",
          explanation:
            "Критерии оценки: einleitender Satz с глаголом речи; sein → sei; " +
            "«wir starten» (мн. ч.) → Konjunktiv II würden … starten или " +
            "starteten; смещение местоимений (wir → sie). Несколько " +
            "формулировок возможны.",
        },
        {
          id: exerciseId("de-ai-consultant-konjunktiv-i-ex10"),
          skillArea: SkillArea.Grammar,
          format: ExerciseFormat.Rewrite,
          evaluation: ExerciseEvaluation.Open,
          prompt:
            "Fassen Sie die Aussage für ein Protokoll in indirekter Rede " +
            'zusammen. Kunde: "Ich bin zufrieden, aber die Kosten sind zu ' +
            'hoch."',
          sampleAnswer:
            "Der Kunde teilte mit, er sei zufrieden, die Kosten seien jedoch " +
            "zu hoch.",
          explanation:
            "Критерии оценки: Konjunktiv I (sei; seien для мн. ч.), нейтральный " +
            "протокольный тон, смещение местоимений, сохранение обоих " +
            "утверждений. Несколько формулировок возможны.",
        },
      ],
    },
    {
      id: activityId("de-ai-consultant-konjunktiv-i-writing"),
      kind: ActivityKind.Writing,
      title: "Schreibaufgabe",
      prompt:
        "Nach einem Kundengespräch sollen Sie ein kurzes Protokoll schreiben. " +
        "Geben Sie die wichtigsten Aussagen des Kunden und des Teams in " +
        "indirekter Rede (Konjunktiv I) wieder, neutral und sachlich.",
      wordRange: { min: 130, max: 160 },
      requirements: [
        "Передайте не менее четырёх высказываний в косвенной речи (sei, habe, werde …)",
        "Там, где Konjunktiv I совпадает с индикативом, используйте Konjunktiv II (hätten, würden)",
        "Сохраняйте нейтральный протокольный тон и глаголы речи (sagte, teilte mit, wies darauf hin)",
      ],
    },
  ],
};

export const germanAiConsultantLessons: readonly Lesson[] = [
  germanAiConsultantVerbklammer,
  germanAiConsultantPerfektPraeteritum,
  germanAiConsultantPraepositionen,
  germanAiConsultantNebensaetze,
  germanAiConsultantRelativsaetze,
  germanAiConsultantPassive,
  germanAiConsultantKonjunktiv2,
  germanAiConsultantKonnektoren,
  germanAiConsultantNominalisierung,
  germanAiConsultantKonjunktiv1,
];
