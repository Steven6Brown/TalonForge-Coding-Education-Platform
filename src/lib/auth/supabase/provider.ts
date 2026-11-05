import type { User } from "@supabase/supabase-js";
import type { AuthError, AuthProvider, AuthUser, Result, Role } from "../types";
import { getBrowserClient } from "./clients";

/**
 * Supabase implementation of AuthProvider (browser side).
 * Security notes:
 *  - Errors are mapped to GENERIC messages so responses can't be used to enumerate accounts.
 *  - Role comes from app_metadata, which only the server/service role can change.
 */

const ok = <T>(data: T): Result<T> => ({ ok: true, data });
const fail = (codeOrError: string | AuthError, message = ""): Result<never> => ({
  ok: false,
  error: typeof codeOrError === "string" ? { code: codeOrError, message } : codeOrError,
});

/** Maps provider errors to user-safe messages. Unknown errors never leak internals. */
function toError(e: { message?: string; status?: number; code?: string } | null, fallback: string): AuthError {
  const status = e?.status;
  if (status === 429) return { code: "rate_limited", message: "Too many attempts. Please wait a few minutes and try again." };
  if (e?.code === "mfa_verification_failed" || /invalid.*(totp|code)/i.test(e?.message ?? ""))
    return { code: "mfa_invalid", message: "That code didn't work. Check your authenticator app and try again." };
  if (e?.code === "weak_password") return { code: "weak_password", message: "Choose a stronger password." };
  return { code: e?.code ?? "auth_error", message: fallback };
}

function mapUser(u: User | null | undefined): AuthUser | null {
  if (!u) return null;
  const role: Role = u.app_metadata?.role === "admin" ? "admin" : "learner";
  return { id: u.id, email: u.email ?? "", emailVerified: !!u.email_confirmed_at, role };
}

const origin = () => (typeof window === "undefined" ? "" : window.location.origin);

export const supabaseProvider: AuthProvider = {
  enabled: true,
  passkeysSupported: false,

  async getUser() {
    // getUser() validates the JWT with the Auth server (unlike getSession(), which trusts local storage).
    const { data } = await getBrowserClient().auth.getUser();
    return mapUser(data.user);
  },

  onChange(cb) {
    const { data } = getBrowserClient().auth.onAuthStateChange((_event, session) => cb(mapUser(session?.user)));
    return () => data.subscription.unsubscribe();
  },

  async signUp(email, password) {
    const { data, error } = await getBrowserClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin()}/auth/confirm?next=/` },
    });
    if (error) return fail(toError(error, "We couldn't create that account."));
    // With email confirmation on, no session is returned until the link is clicked.
    return ok({ needsVerification: !data.session });
  },

  async resendVerification(email) {
    const { error } = await getBrowserClient().auth.resend({ type: "signup", email });
    // Always report success to avoid revealing whether the email is registered.
    if (error?.status === 429) return fail("rate_limited", toError(error, "").message);
    return ok(undefined);
  },

  async signIn(email, password) {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.status === 429) return fail("rate_limited", toError(error, "").message);
      // Same message for unknown email and wrong password.
      return fail("invalid_credentials", "Invalid email or password.");
    }
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    return ok({ mfaRequired: data?.nextLevel === "aal2" && data.currentLevel !== "aal2" });
  },

  async signInWithOAuth(provider) {
    const { error } = await getBrowserClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin()}/auth/callback?next=/` },
    });
    return error ? fail("oauth_error", "Couldn't start sign-in with that provider.") : ok(undefined);
  },

  async signOut(scope = "local") {
    const { error } = await getBrowserClient().auth.signOut({ scope });
    return error ? fail("signout_error", "Couldn't sign out. Please try again.") : ok(undefined);
  },

  async requestPasswordReset(email) {
    const { error } = await getBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${origin()}/auth/confirm?next=/reset-password`,
    });
    // Same response whether or not the account exists (anti-enumeration). Only surface rate limiting.
    if (error?.status === 429) return fail("rate_limited", toError(error, "").message);
    return ok(undefined);
  },

  async updatePassword(newPassword) {
    const { error } = await getBrowserClient().auth.updateUser({ password: newPassword });
    return error ? fail(toError(error, "Couldn't update your password.")) : ok(undefined);
  },

  mfa: {
    async list() {
      const { data, error } = await getBrowserClient().auth.mfa.listFactors();
      if (error) return fail("mfa_error", "Couldn't load your authenticator apps.");
      return ok(
        data.totp.map((f) => ({ id: f.id, friendlyName: f.friendly_name ?? "Authenticator app", verified: f.status === "verified" })),
      );
    },
    async enroll(friendlyName) {
      const { data, error } = await getBrowserClient().auth.mfa.enroll({ factorType: "totp", friendlyName });
      if (error || !data) return fail("mfa_error", "Couldn't start authenticator setup.");
      return ok({ factorId: data.id, qrDataUri: data.totp.qr_code, secret: data.totp.secret });
    },
    async confirmEnrollment(factorId, code) {
      const mfa = getBrowserClient().auth.mfa;
      const ch = await mfa.challenge({ factorId });
      if (ch.error) return fail("mfa_error", "Couldn't verify the code.");
      const v = await mfa.verify({ factorId, challengeId: ch.data.id, code });
      return v.error ? fail(toError(v.error, "Couldn't verify the code.")) : ok(undefined);
    },
    async verifyLogin(factorId, code) {
      const mfa = getBrowserClient().auth.mfa;
      const ch = await mfa.challenge({ factorId });
      if (ch.error) return fail("mfa_error", "Couldn't verify the code.");
      const v = await mfa.verify({ factorId, challengeId: ch.data.id, code });
      return v.error ? fail(toError(v.error, "Couldn't verify the code.")) : ok(undefined);
    },
    async unenroll(factorId) {
      const { error } = await getBrowserClient().auth.mfa.unenroll({ factorId });
      return error ? fail("mfa_error", "Couldn't remove that authenticator.") : ok(undefined);
    },
    async assurance() {
      const { data, error } = await getBrowserClient().auth.mfa.getAuthenticatorAssuranceLevel();
      if (error || !data) return fail("mfa_error", "Couldn't check your security level.");
      return ok({ current: data.currentLevel, next: data.nextLevel });
    },
  },
};
