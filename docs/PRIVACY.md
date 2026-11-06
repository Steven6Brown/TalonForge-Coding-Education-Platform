# Privacy & data

**Defaults (accounts off):** no accounts, no analytics, no cookies, no third-party trackers.

| Data | Why | Where | Retention |
| --- | --- | --- | --- |
| Progress (lesson ids, XP, active dates, completed career scenarios as `sim:<id>`) | Show progress/streaks | Browser `localStorage` only (key `tf:v1:talonforge`) | Until the user resets/clears it. Export/import and reset are in /progress |
| Learner code, terminal commands, scenario choices, SIEM searches | Run labs and score scenarios | Memory only | Gone on reload (not saved) |
| Share card text | Let the user post an aggregate summary | Generated locally; only sent if the user clicks a share link | Nothing is sent automatically |

Network requests: the Python engine and the SQL engine are downloaded from `cdn.jsdelivr.net` when a Python or SQL lab first runs (the CDN sees an IP address and standard request metadata).

## Helper

The study helper ("Talon") answers from a built-in glossary and explains lab errors **entirely in your browser**. Your questions and any lab code you attach are never sent anywhere.

**Accounts on (future):** email address, password hash (managed by Supabase), MFA factors, hashed recovery codes, progress JSON, security audit events (user id + event type + time). Stored in Supabase (Postgres, RLS). Processors: Supabase, the email sender, and OAuth providers if used. Retention/deletion policy and a user-facing data-deletion flow are **not yet built**; a legal review of terms/privacy text is required before launch.
