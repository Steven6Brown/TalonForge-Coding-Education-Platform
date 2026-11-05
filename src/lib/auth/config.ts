/**
 * Auth feature flag + environment access.
 *
 * Accounts are OFF by default (the app works fully local-first). To turn them on:
 *   1. Create a Supabase project and run supabase/migrations/*.sql
 *   2. Fill NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
 *   3. Set NEXT_PUBLIC_AUTH_ENABLED=true
 * See docs/AUTH.md for the full checklist.
 */
export const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

/** Public (browser-safe) Supabase settings. NEXT_PUBLIC_* must be referenced literally so Next can inline them. */
export function supabasePublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Auth is enabled but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.");
  }
  return { url, anonKey };
}

/** Idle sign-out window for signed-in users (minutes). */
export const IDLE_TIMEOUT_MINUTES = 30;

/** Routes that require a signed-in user (enforced in middleware AND re-checked in the page/action). */
export const PROTECTED_PREFIXES = ["/account", "/admin"];
