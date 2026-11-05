"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { auth, type AuthUser } from "@/lib/auth";
import { IDLE_TIMEOUT_MINUTES } from "@/lib/auth/config";

/** Current user (null while signed out or loading). `loading` is true until the first check finishes. */
export function useAuthUser(): { user: AuthUser | null; loading: boolean } {
  const [state, setState] = useState<{ user: AuthUser | null; loading: boolean }>({ user: null, loading: auth.enabled });
  useEffect(() => {
    if (!auth.enabled) return;
    let alive = true;
    auth.getUser().then((user) => alive && setState({ user, loading: false }));
    const off = auth.onChange((user) => alive && setState({ user, loading: false }));
    return () => {
      alive = false;
      off();
    };
  }, []);
  return state;
}

/**
 * Client-side progressive delay after repeated failures (UX friction only).
 * The REAL brute-force protection is the server's rate limiting; see docs/AUTH.md.
 */
export function useBackoff(freeAttempts = 3) {
  const fails = useRef(0); // ref, so state updaters stay pure
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until <= Date.now()) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [until]);

  const recordFailure = useCallback(() => {
    const n = ++fails.current;
    if (n >= freeAttempts) {
      const delay = Math.min(60, 2 ** (n - freeAttempts + 1));
      setUntil(Date.now() + delay * 1000);
      setNow(Date.now());
    }
  }, [freeAttempts]);

  return {
    secondsLeft: Math.max(0, Math.ceil((until - now) / 1000)),
    recordFailure,
    reset: () => {
      fails.current = 0;
      setUntil(0);
    },
  };
}

/** Signs the user out after IDLE_TIMEOUT_MINUTES without interaction (shared-computer safety). */
export function useIdleSignOut(active: boolean) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!active) return;
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void auth.signOut("local"), IDLE_TIMEOUT_MINUTES * 60_000);
    };
    const events = ["pointerdown", "keydown", "visibilitychange"] as const;
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active]);
}
