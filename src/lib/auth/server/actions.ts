"use server";
import { cookies } from "next/headers";
import { AUTH_ENABLED } from "../config";
import { recoveryCodeSchema } from "../password-policy";
import { getServerClient, getServiceClient } from "../supabase/clients";
import { generateRecoveryCode, hashRecoveryCode, RECOVERY_CODE_COUNT, verifyRecoveryCode } from "./recovery-codes";

/**
 * Server Actions are PUBLIC endpoints. Each one: (1) checks the feature flag, (2) re-authenticates the
 * caller from the session cookie, (3) validates input with zod, (4) returns generic errors.
 */

type ActionResult<T = void> = { ok: true; data: T } | { ok: false; message: string };
const denied = (message = "Not allowed."): ActionResult<never> => ({ ok: false, message });

async function currentUser() {
  if (!AUTH_ENABLED) return null;
  const supabase = getServerClient(await cookies());
  const { data } = await supabase.auth.getUser(); // validated against the Auth server
  return data.user ?? null;
}

/** Append-only security audit trail. Best-effort: a logging failure must never block the user action. */
export async function recordAuthEvent(event: string, meta: Record<string, unknown> = {}): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) return;
    await getServiceClient().from("audit_log").insert({ user_id: user.id, event: event.slice(0, 64), meta });
  } catch {
    /* never throw from audit logging */
  }
}

/** Creates 10 fresh recovery codes (replacing any old ones). Plaintext is returned ONCE, only hashes are stored. */
export async function generateRecoveryCodes(): Promise<ActionResult<string[]>> {
  const user = await currentUser();
  if (!user) return denied();
  const db = getServiceClient();
  const codes = Array.from({ length: RECOVERY_CODE_COUNT }, generateRecoveryCode);
  const rows = await Promise.all(codes.map(async (c) => ({ user_id: user.id, code_hash: await hashRecoveryCode(c) })));
  await db.from("mfa_recovery_codes").delete().eq("user_id", user.id);
  const { error } = await db.from("mfa_recovery_codes").insert(rows);
  if (error) return denied("Couldn't create recovery codes.");
  await recordAuthEvent("mfa_recovery_codes_generated");
  return { ok: true, data: codes };
}

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

/**
 * Redeems a one-time recovery code when the user lost their authenticator: removes their TOTP factors
 * so they can sign in and enroll a new device. Rate-limited per user via the audit log.
 */
export async function redeemRecoveryCode(rawCode: string): Promise<ActionResult> {
  const user = await currentUser();
  if (!user) return denied();
  const parsed = recoveryCodeSchema.safeParse(rawCode);
  if (!parsed.success) return denied("That recovery code isn't valid.");

  const db = getServiceClient();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("audit_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("event", "mfa_recovery_failed")
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_ATTEMPTS) return denied("Too many attempts. Try again later.");

  const { data: rows } = await db.from("mfa_recovery_codes").select("id, code_hash").eq("user_id", user.id).is("used_at", null);
  for (const row of rows ?? []) {
    if (await verifyRecoveryCode(parsed.data, row.code_hash)) {
      await db.from("mfa_recovery_codes").update({ used_at: new Date().toISOString() }).eq("id", row.id);
      const { data: factors } = await db.auth.admin.mfa.listFactors({ userId: user.id });
      for (const f of factors?.factors ?? []) await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: user.id });
      await recordAuthEvent("mfa_recovery_used");
      return { ok: true, data: undefined };
    }
  }
  await recordAuthEvent("mfa_recovery_failed");
  return denied("That recovery code isn't valid.");
}
