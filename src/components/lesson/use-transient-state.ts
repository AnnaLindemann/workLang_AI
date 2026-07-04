"use client";

// A tiny localStorage-backed string state hook for **transient UI state only**.
//
// Per docs/database.md, localStorage may hold only throwaway view state such as
// an in-progress, unsent form. It must never hold core learning data (progress,
// mistakes, mastery, review queue, writing history, LLM cost) — clearing the
// browser must lose nothing that matters. The only caller here is the writing
// task's draft box, which is exactly the "in-progress unsent form" example.
//
// Built on useSyncExternalStore so the server render (getServerSnapshot) is the
// empty initial value and the stored draft is picked up after hydration without
// a mismatch — and without calling setState inside an effect.

import { useCallback, useSyncExternalStore } from "react";

const PREFIX = "worklang:transient:";

export function useTransientState(
  key: string,
  initialValue = "",
): [string, (next: string) => void] {
  const storageKey = `${PREFIX}${key}`;

  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    return () => window.removeEventListener("storage", onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? initialValue;
    } catch {
      // Storage unavailable (e.g. private mode): fall back to the initial.
      return initialValue;
    }
  }, [storageKey, initialValue]);

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Ignore: losing transient state is acceptable by design.
      }
      // The "storage" event only fires in other tabs, so notify this one too.
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
    },
    [storageKey],
  );

  return [value, setValue];
}
