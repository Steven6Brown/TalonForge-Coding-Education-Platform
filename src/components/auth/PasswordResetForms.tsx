"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { emailSchema, passwordIssues } from "@/lib/auth/password-policy";
import { Alert, Field, PasswordField } from "./fields";
import { useAuthUser } from "./hooks";

/** Step 1: request a reset email. Always shows the same confirmation (prevents account enumeration). */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError("Enter a valid email address.");
    setState("busy");
    const res = await auth.requestPasswordReset(parsed.data);
    if (!res.ok) {
      setState("idle");
      return setError(res.error.message);
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <>
        <Alert kind="ok">If an account exists for that email, a reset link is on its way. It expires soon, so use it promptly.</Alert>
        <Link className="btn" href="/login">Back to log in</Link>
      </>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" />
      <button className="btn primary block" disabled={state === "busy"}>Send reset link</button>
      <p className="small"><Link href="/login">Back to log in</Link></p>
    </form>
  );
}

/** Step 2: user arrives from the emailed link (already holds a recovery session) and sets a new password. */
export function ResetPasswordForm() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <p className="muted">Checking your link…</p>;
  if (!user) {
    return (
      <>
        <Alert kind="error">This reset link is invalid or has expired.</Alert>
        <Link className="btn" href="/forgot-password">Request a new link</Link>
      </>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const issues = passwordIssues(password, user?.email);
    if (issues.length) return setError(issues[0]);
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const res = await auth.updatePassword(password);
    if (!res.ok) {
      setBusy(false);
      return setError(res.error.message);
    }
    await auth.signOut("global"); // invalidate every other session after a reset
    router.push("/login?reset=1");
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <PasswordField label="New password" value={password} onChange={setPassword} email={user.email} mode="new" />
      <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} mode="current" />
      <button className="btn primary block" disabled={busy}>{busy ? "Saving…" : "Set new password"}</button>
    </form>
  );
}
