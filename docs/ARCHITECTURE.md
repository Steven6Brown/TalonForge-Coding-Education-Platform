# Architecture & decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript | Confirmed by owner; Vercel-friendly, static lesson pages, server actions for auth |
| Styling | Plain CSS with brand CSS variables | No extra dependency; white-label re-skin from one config |
| Data (MVP) | Local-first `localStorage`, zod-validated | Confirmed: no accounts initially; zero PII |
| Lab execution | In-browser only (Worker/WASM/simulators) | Confirmed: no server execution attack surface |
| Auth | Supabase behind an `AuthProvider` interface, feature-flagged off | Owner will use Supabase; interface lets another provider replace it |
| Lesson content | Markdown files + typed TS metadata | Easy authoring; validated by tests |
| Markdown | Small custom renderer (headings, lists, quotes, code, tables, inline styles), React elements only | No raw HTML, no dependency; tables added 2026-11-06 |
| White-label | Build-time brand config (`NEXT_PUBLIC_BRAND`) | Simplest thing that works; reversible |
| Beginner support | Scaffolds (concepts/plan/prerequisites/example) merged into lab data; track prerequisite map; error explainer; terminal basics panel | Learners must be taught everything a lab expects; enforced by tests |
| Career simulators | Scenarios as plain data graphs (`src/lib/sim`), one runner component, hands-on task widgets (terminal, console, ticket, SIEM) | Easy to add scenarios; all client-side; scoring by skill tag |
| Mini-SIEM | In-browser query engine over deterministic fictional events; lab answers computed from the same data (`TRUTH`) | No backend; answers cannot drift from data |

## Layers

UI (`components/`, `app/`) → domain (`lib/content`, `lib/progress`, `lib/runner`, `lib/shell`, `lib/siem`, `lib/sim`, `lib/helper`) → providers (`lib/auth`). UI never imports Supabase directly; it uses `auth` from `lib/auth`. The only server-side feature besides auth is `/api/helper`.

## Deferred (documented, not built)

Multi-tenant runtime branding (subdomain to brand), org/cohort dashboards and employer hiring views, real-VM labs, passkeys and SAML SSO, self-hosted Pyodide and sql.js, nonce-based CSP, i18n, certificates/badges, a shared-store rate limiter for the helper, a portfolio/"experience log" page, Sysadmin / Network Technician / GRC career roles, more advanced scenarios, mobile and accessibility audits.

## Trust boundaries

