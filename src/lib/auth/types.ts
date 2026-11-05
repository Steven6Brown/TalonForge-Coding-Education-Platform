/** Provider-agnostic auth contract. UI depends on THIS, never on Supabase directly, so the backend can be swapped. */

export type Role = "learner" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  /** Read from app_metadata (server-controlled), never user_metadata (user-editable). */
  role: Role;
};

export type AuthError = { code: string; message: string };
export type Result<T = void> = { ok: true; data: T } | { ok: false; error: AuthError };

export type OAuthProvider = "google" | "github";

export type MfaFactor = { id: string; friendlyName: string; verified: boolean };
export type MfaEnrollment = { factorId: string; qrDataUri: string; secret: string };
export type AssuranceLevel = { current: string | null; next: string | null };

export interface AuthProvider {
  /** False for the no-op provider used while accounts are switched off. */
  readonly enabled: boolean;

  getUser(): Promise<AuthUser | null>;
  /** Subscribe to sign-in/sign-out/token events. Returns an unsubscribe function. */
  onChange(cb: (user: AuthUser | null) => void): () => void;

  signUp(email: string, password: string): Promise<Result<{ needsVerification: boolean }>>;
  resendVerification(email: string): Promise<Result>;
  signIn(email: string, password: string): Promise<Result<{ mfaRequired: boolean }>>;
  signInWithOAuth(provider: OAuthProvider): Promise<Result>;
  signOut(scope?: "local" | "global"): Promise<Result>;

  requestPasswordReset(email: string): Promise<Result>;
  updatePassword(newPassword: string): Promise<Result>;

  mfa: {
    list(): Promise<Result<MfaFactor[]>>;
    enroll(friendlyName: string): Promise<Result<MfaEnrollment>>;
    /** Confirms a new factor with the first code from the authenticator app. */
    confirmEnrollment(factorId: string, code: string): Promise<Result>;
    /** Challenge + verify at sign-in; upgrades the session to aal2. */
    verifyLogin(factorId: string, code: string): Promise<Result>;
    unenroll(factorId: string): Promise<Result>;
    assurance(): Promise<Result<AssuranceLevel>>;
  };

  /** Passkeys (WebAuthn): see docs/AUTH.md. Left as an explicit seam until the provider supports it. */
  readonly passkeysSupported: boolean;
}
