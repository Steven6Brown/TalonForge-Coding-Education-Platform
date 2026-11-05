"use client";
import { useSyncExternalStore } from "react";
import { z } from "zod";
import { brand } from "@/brands";

/**
 * Local-first progress store (browser localStorage), validated with zod on every read/import.
 * Contains NO personal data: lesson ids, XP and activity dates only.
 * When accounts are enabled, src/lib/sync can mirror this state to the database.
 */

const DAY = /^\d{4}-\d{2}-\d{2}$/;
export const ProgressSchema = z.object({
  version: z.literal(1),
  completed: z.record(z.string().max(64), z.object({ at: z.number().int().nonnegative(), xp: z.number().int().min(0).max(1000) })),
  activeDays: z.array(z.string().regex(DAY)).max(800),
});
export type Progress = z.infer<typeof ProgressSchema>;

const KEY = `tf:v1:${brand.id}`;
const EMPTY: Progress = { version: 1, completed: {}, activeDays: [] };
export const MAX_IMPORT_BYTES = 200_000;

let state: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = ProgressSchema.safeParse(JSON.parse(raw));
      if (parsed.success) state = parsed.data;
    }
  } catch {
    /* storage blocked or corrupt: fall back to empty progress */
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota/blocked storage; progress stays in memory for this session */
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export function completeLesson(id: string, xp: number) {
  load();
  if (!state.completed[id]) {
    state = { ...state, completed: { ...state.completed, [id]: { at: Date.now(), xp } } };
  }
  if (!state.activeDays.includes(today())) {
    state = { ...state, activeDays: [...state.activeDays, today()].slice(-800) };
  }
  persist();
  emit();
}

export function resetProgress() {
  state = EMPTY;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

/** Validates and applies an exported JSON string. Returns an error message or null. */
export function importProgress(text: string): string | null {
  if (text.length > MAX_IMPORT_BYTES) return "File is too large.";
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return "That file isn't valid JSON.";
  }
  const parsed = ProgressSchema.safeParse(json);
  if (!parsed.success) return "That file isn't a valid progress export.";
  state = parsed.data;
  persist();
  emit();
  return null;
}

export const exportProgress = () => JSON.stringify(state, null, 2);

export function computeStreak(days: string[]): number {
  const set = new Set(days);
  let streak = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setUTCDate(d.getUTCDate() - 1); // today not required yet
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

export function totalXp(p: Progress): number {
  return Object.values(p.completed).reduce((a, c) => a + c.xp, 0);
}

export function rankFor(xp: number) {
  const ranks = brand.ranks;
  let idx = 0;
  ranks.forEach((r, i) => {
    if (xp >= r.xp) idx = i;
  });
  const next = ranks[idx + 1];
  return { rank: ranks[idx], next, toNext: next ? next.xp - xp : 0 };
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
}
