"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { emailSchema } from "@/lib/auth/password-policy";
import { safeNext } from "@/lib/auth/redirect";
import { redeemRecoveryCode, recordAuthEvent } from "@/lib/auth/server/actions";
import { useBackoff } from "./hooks";
import { Alert, Field, PasswordField } from "./fields";
import { MfaChallenge } from "./MfaChallenge";
import { SocialButtons } from "./SocialButtons";

type Step = "credentials" | "mfa" | "recovery";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "link" ? "That link is invalid or expired." : params.get("error") === "oauth" ? "Sign-in failed. Please try again." : null,
  );
  const backoff = useBackoff();

  const finish = async () => {
    await recordAuthEvent("login");
    router.push(next);
    router.refresh();
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (backoff.secondsLeft > 0) return;
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError("Enter a valid email address.");
    setBusy(true);
    const res = await auth.signIn(parsed.data, password);
    setBusy(false);
    if (!res.ok) {
      backoff.recordFailure();
      return setError(res.error.message);
    }
    backoff.reset();
    if (res.data.mfaRequired) setStep("mfa");
    else await finish();
  }

  if (step === "mfa") {
    return (
      <>
        <MfaChallenge onVerified={finish} />
        <p className="small">
          Lost your authenticator? <button className="link" onClick={() => setStep("recovery")}>Use a recovery code</button>
        </p>
      </>
    );
  }
  if (step === "recovery") {
    return <RecoveryRedeem onDone={() => setStep("credentials")} />;
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        {error && <Alert kind="error">{error}</Alert>}
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" inputMode="email" />
        <PasswordField value={password} onChange={setPassword} mode="current" />
        <button className="btn primary block" type="submit" disabled={busy || backoff.secondsLeft > 0}>
          {backoff.secondsLeft > 0 ? `Try again in ${backoff.secondsLeft}s` : busy ? "Signing in…" : "Log in"}
        </button>
        <p className="small"><Link href="/forgot-password">Forgot your password?</Link></p>
      </form>
      <SocialButtons />
      <p className="small">New here? <Link href="/signup">Create an account</Link></p>
    </>
  );
}

/** After a successful password login the user is aal1; redeeming a code removes their lost factor. */
function RecoveryRedeem({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await redeemRecoveryCode(code);
    setBusy(false);
    if (!res.ok) return setError(res.message);
    await auth.signOut("local"); // force a fresh sign-in now that the old factor is gone
    onDone();
    router.refresh();
  }
  return (
    <form onSubmit={submit}>
      <h2>Use a recovery code</h2>
      <p className="muted small">
        Enter one of your saved codes. This removes your authenticator so you can log in and set up a new one.
      </p>
      {error && <Alert kind="error">{error}</Alert>}
      <Field label="Recovery code (xxxxx-xxxxx)" value={code} onChange={setCode} maxLength={11} />
      <button className="btn primary block" disabled={busy}>Redeem code</button>
    </form>
  );
}
