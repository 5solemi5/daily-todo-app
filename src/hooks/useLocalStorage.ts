import { useEffect, useRef } from 'react';

/** Read a JSON value from localStorage once, with a fallback. */
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Persist a value to localStorage whenever it changes. */
export function usePersist<T>(key: string, value: T): void {
  // avoid writing on the very first render if value equals what we just read
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — ignore silently
    }
  }, [key, value]);
}
