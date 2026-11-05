"use client";
import { getBrowserClient } from "./supabase/clients";
import { ProgressSchema, exportProgress, importProgress, type Progress } from "../progress";

/**
 * Optional cloud sync of learner progress (only used when accounts are enabled and a user is signed in).
 * Merge strategy: union of completed lessons (earliest completion wins) and union of active days.
 * Remote data is untrusted: it is validated with the same zod schema as local/imported data.
 */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const completed = { ...a.completed };
  for (const [id, v] of Object.entries(b.completed)) {
    if (!completed[id] || v.at < completed[id].at) completed[id] = v;
  }
  const activeDays = [...new Set([...a.activeDays, ...b.activeDays])].sort().slice(-800);
  return { version: 1, completed, activeDays };
}

export async function syncProgress(userId: string): Promise<void> {
  const supabase = getBrowserClient();
  const local = ProgressSchema.parse(JSON.parse(exportProgress()));
  const { data } = await supabase.from("user_progress").select("data").eq("user_id", userId).maybeSingle();
  const remote = ProgressSchema.safeParse(data?.data);
  const merged = remote.success ? mergeProgress(local, remote.data) : local;
  importProgress(JSON.stringify(merged)); // updates the local store (validated again)
  await supabase.from("user_progress").upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() });
}
