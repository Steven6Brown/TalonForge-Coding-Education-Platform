# Privacy & data

**Accounts off (default):** no accounts, no analytics, no cookies, no third-party trackers.

| Data | Why | Where | Retention |
| --- | --- | --- | --- |
| Progress (lesson ids, XP, active dates) | Show progress/streaks | Browser `localStorage` only | Until the user resets/clears it. Export/import and reset are in /progress |
| Learner code | Run labs | Memory only, in a Worker | Gone on reload (not saved) |

Network requests: the Python engine is downloaded from `cdn.jsdelivr.net` when a Python lab first runs (the CDN sees an IP address and standard request metadata).

**Accounts on (future):** email address, password hash (managed by Supabase), MFA factors, hashed recovery codes, progress JSON, security audit events (user id + event type + time). Stored in Supabase (Postgres, RLS). Processors: Supabase, the email sender, and OAuth providers if used. Retention/deletion policy and a user-facing data-deletion flow are **not yet built**; a legal review of terms/privacy text is required before launch.
