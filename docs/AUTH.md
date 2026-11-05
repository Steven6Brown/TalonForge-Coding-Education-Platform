# Accounts & enterprise login (Supabase)

The code is complete and **switched off** via `NEXT_PUBLIC_AUTH_ENABLED=false`. With the flag off, middleware is a pass-through, auth pages show "Accounts are coming soon", and the header shows no login buttons. **None of this has been tested against a live Supabase project yet.**

## Feature map

| Requirement | Where | Notes |
| --- | --- | --- |
| Sign up + email verification | `SignupForm`, `/auth/confirm` | Neutral confirmation message (anti-enumeration) |
| Log in / log out | `LoginForm`, `AuthNav` | Same error for unknown email vs wrong password |
| Forgot / reset password | `PasswordResetForms`, `/reset-password` | Always shows "if an account exists..."; global sign-out after reset |
| Password policy | `lib/auth/password-policy.ts` | NIST style: 12+ chars, blocklist, no email name; strength meter |
| TOTP MFA | `SecurityPanel`, `MfaChallenge` | Supabase MFA (aal2) |
| Recovery codes | `lib/auth/server/*` | 10 one-time codes, scrypt-hashed, rate-limited, service-role only |
| Social login | `SocialButtons` | GitHub + Google (enable each in Supabase) |
| Sessions | middleware + `useIdleSignOut` | Refresh on request; 30-min idle sign-out; "Sign out everywhere" |
| Roles + admin | `requireRole`, `/admin` | Role in `app_metadata` (server-only writable) + RLS |
| Audit log | `audit_log` table, `recordAuthEvent` | Admin view at `/admin` |
| Cloud sync | `lib/auth/sync.ts` | Merge union, zod-validated |
| Open-redirect protection | `lib/auth/redirect.ts` | Tested |
| Passkeys | **Not implemented** | `passkeysSupported=false`; seam in `AuthProvider`. Button is disabled |

## Turn it on (checklist)

1. Create a Supabase project. Run `supabase/migrations/0001_init.sql` in the SQL editor.
2. Copy URL + anon key + service-role key into `.env.local` (never commit). Set `NEXT_PUBLIC_AUTH_ENABLED=true`.
3. Auth > URL Configuration: Site URL = your domain; add redirect URLs `<site>/auth/callback` and `<site>/auth/confirm`.
4. Auth > Email Templates: change links to token-hash form so server verification works:
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
   - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`
5. Auth > Providers: enable Email (confirm email ON), GitHub, Google (needs OAuth apps). Enable **MFA (TOTP)**.
6. Auth > Settings: password min length 12, leaked-password protection (Pro plan), tune rate limits, set up a custom SMTP sender for production email.
7. Make yourself admin (SQL at bottom of the migration).
8. Test: signup, verify, login, reset, MFA enroll + recovery code, logout, admin page, RLS (a second user must not see your data).

## Known gaps / decisions

- **Lockout:** brute-force protection relies on Supabase's server rate limits; the client back-off is UX only. A custom per-account lockout would need a server login proxy (deferred).
- **Failed logins** are not in `audit_log` (no user id yet); use Supabase's own auth logs.
- **Passkeys/SAML SSO** are future work (SSO matters for white-label enterprise clients; Supabase supports SAML on paid plans).
- **CAPTCHA** (Supabase supports Turnstile/hCaptcha) is recommended before public launch.
- `SUPABASE_SERVICE_ROLE_KEY` is used only in server actions; never expose it.
