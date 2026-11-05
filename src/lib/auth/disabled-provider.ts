import type { AuthProvider, Result } from "./types";

/** No-op provider used while accounts are switched off. Every call fails safely; nothing hits the network. */
const off = async (): Promise<Result<never>> => ({
  ok: false,
  error: { code: "auth_disabled", message: "Accounts aren't enabled yet." },
});

export const disabledProvider: AuthProvider = {
  enabled: false,
  passkeysSupported: false,
  getUser: async () => null,
  onChange: () => () => {},
  signUp: off,
  resendVerification: off,
  signIn: off,
  signInWithOAuth: off,
  signOut: async () => ({ ok: true, data: undefined }),
  requestPasswordReset: off,
  updatePassword: off,
  mfa: { list: off, enroll: off, confirmEnrollment: off, verifyLogin: off, unenroll: off, assurance: off },
};
