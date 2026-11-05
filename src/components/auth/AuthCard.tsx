import Link from "next/link";
import type { ReactNode } from "react";
import { AUTH_ENABLED } from "@/lib/auth/config";

/** Standard centered card for all auth pages. When accounts are off it shows a friendly notice instead. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  if (!AUTH_ENABLED) {
    return (
      <section className="card auth-card">
        <h1>Accounts are coming soon</h1>
        <p className="muted">
          TalonForge works fully without an account: your progress is saved privately in this browser. Optional accounts
          (cloud sync, MFA, organizations) will be enabled later.
        </p>
        <Link className="btn primary" href="/">Back to learning</Link>
      </section>
    );
  }
  return (
    <section className="card auth-card" aria-labelledby="auth-title">
      <h1 id="auth-title">{title}</h1>
      {subtitle && <p className="muted">{subtitle}</p>}
      {children}
    </section>
  );
}
