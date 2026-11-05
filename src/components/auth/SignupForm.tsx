"use client";
import Link from "next/link";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { emailSchema, passwordIssues } from "@/lib/auth/password-policy";
import { Alert, Field, PasswordField } from "./fields";
import { SocialButtons } from "./SocialButtons";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError("Enter a valid email address.");
    const issues = passwordIssues(password, parsed.data);
    if (issues.length) return setError(issues[0]);
    if (!agree) return setError("Please accept the terms to continue.");
    setBusy(true);
    const res = await auth.signUp(parsed.data, password);
    setBusy(false);
    if (!res.ok) return setError(res.error.message);
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <Alert kind="ok">Check your inbox. If this address can be registered, you&apos;ll get a verification link shortly.</Alert>
        <button className="btn" onClick={() => auth.resendVerification(email)}>Resend email</button>
        <p className="small"><Link href="/login">Back to log in</Link></p>
      </div>
    );
  }
  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        {error && <Alert kind="error">{error}</Alert>}
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" />
        <PasswordField label="Create a password" value={password} onChange={setPassword} email={email} mode="new" />
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I will only practice security techniques on systems I own or am authorized to test.</span>
        </label>
        <button className="btn primary block" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>
      <SocialButtons />
      <p className="small">Already have an account? <Link href="/login">Log in</Link></p>
    </>
  );
}
