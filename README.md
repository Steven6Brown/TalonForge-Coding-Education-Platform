# TalonForge

> Forge your skills. Sharpen your talons.

A free, local-first learning platform for coding, scripting, servers and ethical hacking, built by **Aquila Digital**. Every lesson ends in a hands-on lab that runs safely in the browser. Built to be white-labeled for companies later (dev-hire / training).

## What's in the MVP

| Area | What it does |
| --- | --- |
| **11 tracks / 57 lessons** | Linux & Shell, Python, Web & JS, Automation, Building AI, Networking, Systems, Ethical Hacking, Kali Pentest Lab (simulated), Security Foundations, Math for Security |
| **Labs** | Simulated Linux shell (flag hunting), Python (Pyodide/WASM), JavaScript (Web Worker, network blocked), quizzes |
| **Language Atlas** | Pick a goal, see which language fits, when to avoid it, and its security angle |
| **Playground** | JS, Python, shell (with a nano-style editor) and a simulated Kali toolset |
| **Share** | LinkedIn share link, copyable post text and GitHub README badge (user-initiated, aggregate stats only) |
| **Resources** | Curated links to well-known free practice platforms |
| **Progress** | XP, ranks, streaks, export/import backup, all stored locally (no PII) |
| **Accounts (built, switched off)** | Supabase auth: signup, email verify, login/logout, password reset, TOTP MFA + recovery codes, social login, roles, audit log, cloud sync. See [docs/AUTH.md](docs/AUTH.md) |
| **White-label** | One brand config file re-skins name, colors, ranks and footer. See `src/brands` |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (shell engine, lab solutions, helpers)
npm run typecheck
npm run lint
npm run build && npm start
```

Requires Node 20+. Accounts are **off** by default; no environment variables are needed to run.

## Project layout

```
content/lessons/*.md      Lesson text (Markdown, rendered safely, never as raw HTML)
src/lib/content/          Tracks, lessons, labs, atlas data, lab filesystems
src/lib/shell/            Virtual filesystem + bash-like shell simulator
src/lib/runner.ts         Web Worker runner with timeouts
public/workers/           Sandboxed JS and Python (Pyodide) workers
src/lib/auth/             Provider-agnostic auth (Supabase adapter, disabled adapter)
src/components/auth/      Login, signup, reset, MFA, security panel
src/brands/               White-label brand configs
supabase/migrations/      Database schema + RLS policies
docs/AUTH.md              Auth feature map and Supabase setup checklist
```

## Adding content

1. Add `content/lessons/<id>.md`.
2. Add a lesson entry (and lab) in `src/lib/content/lessons.ts` and list its id in a track.
3. For shell labs add a filesystem in `filesystems.ts`.
4. Run `npm test`: it checks that JS lab solutions pass and starters do not.

## White-labeling

Copy `src/brands/talonforge.ts`, change name/colors/ranks, register it in `src/brands/index.ts`, and build with `NEXT_PUBLIC_BRAND=<id>`. One deployment per tenant for now; multi-tenant runtime branding is a deferred feature (see ARCHITECTURE.md).

## Name note

"TalonForge" was chosen for the eagle (Aquila) + forge wordplay. A trademark and domain search has **not** been done: check both before launch.

Part of the Aquila Digital portfolio · *Per Aspera Ad Astra*.
