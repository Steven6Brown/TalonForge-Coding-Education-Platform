"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { totpCodeSchema } from "@/lib/auth/password-policy";
import { Alert, Field } from "./fields";
import { useBackoff } from "./hooks";

/** Second step of login: asks for the 6-digit authenticator code and upgrades the session to aal2. */
export function MfaChallenge({ onVerified }: { onVerified: () => void | Promise<void> }) {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const backoff = useBackoff();

  useEffect(() => {
    auth.mfa.list().then((r) => {
      if (!r.ok) return setError(r.error.message);
      const f = r.data.find((x) => x.verified);
      if (f) setFactorId(f.id);
      else setError("No authenticator is set up for this account.");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId || backoff.secondsLeft > 0) return;
    const parsed = totpCodeSchema.safeParse(code);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setBusy(true);
    const res = await auth.mfa.verifyLogin(factorId, parsed.data);
    setBusy(false);
    if (!res.ok) {
      backoff.recordFailure();
      setCode("");
      return setError(res.error.message);
    }
    await onVerified();
  }

  return (
    <form onSubmit={submit}>
      <h2>Two-step verification</h2>
      <p className="muted small">Open your authenticator app and enter the current 6-digit code.</p>
      {error && <Alert kind="error">{error}</Alert>}
      <Field label="6-digit code" value={code} onChange={setCode} inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
      <button className="btn primary block" disabled={busy || !factorId || backoff.secondsLeft > 0}>
        {backoff.secondsLeft > 0 ? `Try again in ${backoff.secondsLeft}s` : busy ? "Verifying…" : "Verify"}
      </button>
    </form>
  );
}
