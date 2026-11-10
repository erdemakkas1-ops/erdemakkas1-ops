"use client";

import { useCallback, useSyncExternalStore } from "react";

// Demo storage: favourites live in this browser only (localStorage).
const KEY = "alagozler:favoriler";
const EVENT = "alagozler:favoriler-change";
const EMPTY: string[] = [];
let cache: { raw: string | null; ids: string[] } = { raw: null, ids: EMPTY };

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw !== cache.raw) {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cache = { raw, ids: Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : EMPTY };
    }
    return cache.ids;
  } catch {
    return EMPTY;
  }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === KEY) callback(); };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", onStorage); };
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked: ignore */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { ids, has: (id: string) => ids.includes(id), toggle };
}
