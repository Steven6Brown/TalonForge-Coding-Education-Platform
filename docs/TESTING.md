# Testing

Run: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (use `NEXT_DIST_DIR=.next-verify` so a verification build does not overwrite a running `next dev`).

## Automated (verified 2026-11-06)

- **185 Vitest tests pass** across 11 files. They cover:
  - Shell engine (quoting, pipes, redirects, permissions, VFS isolation) and every shell lab being solvable; host-hardening, ssh range, forensics and wargame labs.
  - Every JS lab: the solution passes and the starter fails. SQL and Python labs are *not* run by Vitest (see Manual).
  - Mini-SIEM engine, deterministic log data and the SIEM lab answers; helper glossary and local answering; number, hash and cipher tools.
  - **Career scenarios (40):** every step links to a real step, no cycles, a best path earns points, every scenario has a first-timer guide, hands-on task shape (terminal command patterns match their examples, required ids exist, console selects contain their correct option, ticket and SIEM tasks are well formed).
  - **Beginner audit:** every code lab has concepts and a plan, at least two hints, valid prerequisite links that come earlier in the curriculum; every track has a recommended path with no circular dependencies; quiz answers' key words appear in their lesson text (rough word-match heuristic, up to 3 misses tolerated).
  - **Markdown:** tables parse, pipes inside inline code are kept, and every table in every lesson has consistent columns and none is left as raw text.
- `tsc --noEmit` passes. `next lint` passes with **0 errors and 0 warnings**. `next build` passes (verified 2026-11-06 with `NEXT_DIST_DIR=.next-verify`).
- History: `next build` was *failing* on lint errors (unescaped apostrophes, `prefer-const`) until this date. They were fixed; the build now succeeds.

## Manual (in-app browser, dev server)

- Careers: played the "Locked out: password reset" scenario to a 15/15 result, claimed XP (stored in progress); ran the "Fix a PC with no internet" terminal task (output changed after `ipconfig /renew`, invalid command handled) and the "Reset a locked account" console task (scored correct); `/simulators` redirects.
- SIEM: brute-force lab searched and both answers accepted, lab completed.
- Helper panel opens, shows the "How I work" text and starter chips (built-in mode). Track pages show the "do these first" box; lesson and track pages show the new chips and back links; a scaffolded SQL lab shows its concepts and plan; the terminal-basics panel and the new command sections render.
- A lesson with a table (Network Security authentication) renders it as a real table after the renderer fix.
- Earlier (dev/prod build, 2026-11-05): shell labs, JS labs (fetch blocked by CSP), original Python labs and the SQL labs ran in real Pyodide / sql.js.

## NOT verified

- **New Python Foundations labs and the new Python-based labs written during the beginner audit** were not run in Pyodide this session (Python is not installed locally). Their expected outputs come from reasoning, and the lesson walk-through examples that use Python were not executed.
- **Most of the 40 scenarios were not played end to end in a browser** (the automated tests prove structure, not quality). Only the scenarios named above were played.
- **The lesson rewrites** (about 140 lessons) were not each reviewed in a browser or by a real beginner. The beginner audit tests are heuristics; "a total beginner can finish every lab alone" has not been tested with real people.
- Real mobile devices; cross-browser (only a Chromium-based pane tested); automated accessibility audit (axe), screen-reader and keyboard-only passes.
- All auth flows (needs a live Supabase project), RLS policies, recovery-code actions.
- Playwright end-to-end suite (not written); Lighthouse / Core Web Vitals.
- Any deployment (Vercel). See [docs/DEPLOY.md](DEPLOY.md).

## Deliberately not written

Hands-on offensive walkthroughs (scanning, web enumeration, password cracking, exploit search) and a SUID privilege-escalation lesson. TalonForge is defensive and educational: the simulated Kali tools remain in the Playground, and the lessons focus on understanding, detection and authorized testing.

## Known content gaps

- Nine long lessons (Network Security TLS/IPsec/PKI/threats/database/symmetric/CVSS, ports fundamentals, incident-response planning) have no separate worked-example section; their labs have in-lab scaffolding.
- Help desk has 30 scenarios (16 beginner, 11 intermediate, 3 advanced) and SOC has 10 (2, 6, 2); advanced practice is thin; Sysadmin, Network and GRC roles are placeholders.
