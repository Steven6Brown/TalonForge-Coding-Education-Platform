# Architecture & decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript | Confirmed by owner; Vercel-friendly, static lesson pages, server actions for auth |
| Styling | Plain CSS with brand CSS variables | No extra dependency; white-label re-skin from one config |
| Data (MVP) | Local-first `localStorage`, zod-validated | Confirmed: no accounts initially; zero PII |
| Lab execution | In-browser only (Worker/WASM/simulator) | Confirmed: no server execution attack surface |
| Auth | Supabase behind an `AuthProvider` interface, feature-flagged off | Owner will use Supabase; interface lets another provider replace it |
| Lesson content | Markdown files + typed TS metadata | Easy authoring; validated by tests |
| White-label | Build-time brand config (`NEXT_PUBLIC_BRAND`) | Simplest thing that works; reversible |

## Layers

UI (`components/`, `app/`) → domain (`lib/content`, `lib/progress`, `lib/runner`, `lib/shell`) → providers (`lib/auth`). UI never imports Supabase directly; it uses `auth` from `lib/auth`.

## Deferred (documented, not built)

Multi-tenant runtime branding (subdomain to brand), org/cohort dashboards and employer hiring views, SQL and real-VM labs, passkeys and SAML SSO, self-hosted Pyodide, nonce-based CSP, i18n, certificates/badges, more tracks (reverse engineering, cloud, networking, forensics).

## Trust boundaries

Browser (untrusted) → Next.js server actions/route handlers (validate, re-authenticate) → Supabase (RLS). The service-role key exists only server-side.
