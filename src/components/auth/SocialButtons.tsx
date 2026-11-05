"use client";
import { useState } from "react";
import { auth, type OAuthProvider } from "@/lib/auth";
import { Alert } from "./fields";

const PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: "github", label: "Continue with GitHub" },
  { id: "google", label: "Continue with Google" },
];

/** Social sign-in. Each provider must also be enabled in the Supabase dashboard (see docs/AUTH.md). */
export function SocialButtons() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="social" aria-label="Other sign-in options">
      <p className="divider"><span>or</span></p>
      {error && <Alert kind="error">{error}</Alert>}
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          className="btn block"
          onClick={async () => {
            const r = await auth.signInWithOAuth(p.id);
            if (!r.ok) setError(r.error.message);
          }}
        >
          {p.label}
        </button>
      ))}
      <button type="button" className="btn block" disabled title="Passkeys will be enabled when the auth provider supports WebAuthn">
        Sign in with a passkey (coming soon)
      </button>
    </div>
  );
}
