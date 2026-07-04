"use client";

// A speaker button that pronounces a term with the browser Web Speech API.
//
// MVP text-to-speech: client-side only, no LLM, no paid API, no key. It degrades
// gracefully — if `speechSynthesis` is unavailable it renders nothing, so it
// never blocks the lesson or trainer. It picks a voice matching the term's
// language (German → de, English → en), falling back to the browser default.

import { useSyncExternalStore } from "react";

import { Language } from "@/types";

import styles from "./pronounce-button.module.css";

const LANGUAGE_BCP47: Record<Language, string> = {
  [Language.German]: "de-DE",
  [Language.English]: "en-US",
};

// Speech support is a client-only fact. `useSyncExternalStore` reads `false` on
// the server (and during hydration), then the real value on the client — no
// hydration mismatch and no setState-in-effect. Support never changes at
// runtime, so the store has nothing to subscribe to.
const noopSubscribe = () => () => {};
const isSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export function PronounceButton({
  text,
  language,
  size = "small",
}: {
  text: string;
  language: Language;
  size?: "small" | "large";
}) {
  const supported = useSyncExternalStore(
    noopSubscribe,
    isSpeechSupported,
    () => false,
  );

  if (!supported) return null;

  function speak(event: React.MouseEvent) {
    // Never let the speaker trigger card selection/matching around it.
    event.stopPropagation();
    event.preventDefault();
    const synth = window.speechSynthesis;
    if (!synth) return;
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const code = LANGUAGE_BCP47[language];
      utterance.lang = code;
      const voices = synth.getVoices();
      const prefix = code.slice(0, 2);
      const voice =
        voices.find((candidate) => candidate.lang === code) ??
        voices.find((candidate) => candidate.lang.startsWith(prefix));
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
    } catch {
      // Best-effort enhancement: swallow synthesis errors silently.
    }
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${size === "large" ? styles.large : ""}`}
      onClick={speak}
      aria-label={`Pronounce ${text}`}
      title={`Pronounce ${text}`}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}
