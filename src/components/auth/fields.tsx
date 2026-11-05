"use client";
import { useId, useState } from "react";
import { passwordIssues, passwordStrength } from "@/lib/auth/password-policy";

export function Alert({ kind, children }: { kind: "error" | "ok" | "info"; children: React.ReactNode }) {
  return (
    <p className={`alert ${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email";
  maxLength?: number;
  required?: boolean;
};

export function Field({ label, value, onChange, type = "text", autoComplete, inputMode, maxLength = 254, required = true }: FieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}

const STRENGTH = ["Too weak", "Weak", "Okay", "Good", "Strong"];

/** Password input with show/hide toggle, strength meter and live policy hints (new-password mode). */
export function PasswordField({
  label = "Password",
  value,
  onChange,
  email,
  mode,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  email?: string;
  mode: "current" | "new";
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const issues = mode === "new" && value ? passwordIssues(value, email) : [];
  const strength = passwordStrength(value);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="row nowrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={mode === "new" ? "new-password" : "current-password"}
          maxLength={128}
          required
          aria-describedby={mode === "new" ? `${id}-hint` : undefined}
        />
        <button type="button" className="btn small" onClick={() => setShow(!show)} aria-pressed={show}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {mode === "new" && (
        <div id={`${id}-hint`} className="hint-box">
          <div className={`meter s${strength}`} aria-hidden="true"><span /></div>
          <p className="muted small">
            Strength: {STRENGTH[strength]}. Use 12+ characters; a passphrase works great.
          </p>
          {issues.map((i) => (
            <p key={i} className="small warn">{i}</p>
          ))}
        </div>
      )}
    </div>
  );
}
