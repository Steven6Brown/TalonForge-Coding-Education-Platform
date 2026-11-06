# TalonForge

> Forge your skills. Sharpen your talons.

A free, local-first learning platform for coding, scripting, servers, security and IT careers, built by **Aquila Digital**. Every lesson ends in a hands-on lab that runs safely in the browser, and the Careers section lets you practice real job scenarios (IT help desk, SOC analyst). Built to be white-labeled for companies later (dev-hire / training).

It is written for **first-timers**: every lab explains the ideas it uses, gives a numbered plan, and links the lessons to read first.

## What's in the app (as of 2026-11-06)

| Area | What it does |
| --- | --- |
| **20 tracks / 151 lessons** | JavaScript Foundations, Python Foundations, Binary/Encryption/Hashing/Ports, SIEM & SOC Analyst, Linux & Shell, Python for Security, Web & JS, Automation, Building AI, Networking, Systems & Servers, Ethical Hacking, Kali Pentest Lab (simulated), Security Foundations, Math for Security, Cyber Range Labs, Digital Forensics, Databases & SQL, Malware Analytics, Network Security |
| **Lab types** | Simulated Linux shell (flag hunting, ssh range), Python (Pyodide/WASM), JavaScript (Web Worker, network blocked), real in-browser SQL (sql.js), SIEM log searching, quizzes |
| **Careers (job simulators)** | `/careers`: IT Help Desk (30 scenarios) and SOC Analyst (10) at beginner, intermediate and advanced levels. Decision scenarios plus 11 **hands-on** ones (simulated terminal, mock admin console, write-the-ticket, SIEM evidence). Scored by security procedure, customer service, technical accuracy and documentation. Sysadmin, Network and GRC roles are listed as "planned" |
| **Tools** | `/tools`: number-base converter, crypto workbench (hashing, Caesar/Vigenere/XOR, AES-GCM encrypt/decrypt), ports reference with flashcards |
| **Mini-SIEM** | A Splunk-style search over fictional logs (brute force, DNS beacon, data exfiltration) used by the SIEM track and the SOC simulator |
| **Helper ("Talon")** | Floating question helper. Built-in mode matches a glossary and explains lab errors, works offline. Optional AI mode (server key required, user opt-in). See [SECURITY.md](SECURITY.md) and [PRIVACY.md](PRIVACY.md) |
| **Language Atlas** | Pick a goal, see which language fits, when to avoid it, and its security angle |
| **Playground** | JS, Python, SQLite, shell (with a nano-style editor), a simulated Kali toolset |
| **Share** | LinkedIn share link, copyable post text and GitHub README badge (user-initiated, aggregate stats only) |
| **Progress** | XP, ranks, streaks, export/import backup, stored locally (no PII) |
| **Accounts (built, switched off)** | Supabase auth: signup, email verify, login/logout, password reset, TOTP MFA + recovery codes, social login, roles, audit log, cloud sync. See [docs/AUTH.md](docs/AUTH.md) |
| **White-label** | One brand config file re-skins name, colors, ranks and footer. See `src/brands` |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit and content tests
npm run typecheck
npm run lint
npm run build && npm start
```

Requires Node 20+. Accounts and AI answers are **off** by default; no environment variables are needed to run. See `.env.example` for the optional ones.

## Project layout

```
content/lessons/*.md        Lesson text (Markdown subset incl. tables; rendered safely, never raw HTML)
src/lib/content/            Tracks, lessons, labs, scaffolds, atlas data, lab filesystems
  lab-scaffolds*.ts         Beginner concepts / plan / example / prerequisites for code labs
  track-paths.ts            Recommended order between tracks
src/lib/shell/              Virtual filesystem + bash-like shell simulator
src/lib/siem/               Search engine (SPL-lite) and deterministic fictional log data
src/lib/sim/                Career scenarios (help desk, SOC, hands-on), guides, roles
src/lib/helper/             Built-in glossary and local answering
src/app/api/helper/         Optional AI helper route (off unless a key is set)
src/components/sim/         Careers pages and the hands-on task widgets
src/components/tools/       Converter, crypto workbench, ports reference
public/workers/             Sandboxed JS, Python (Pyodide) and SQL workers
src/lib/auth/               Provider-agnostic auth (Supabase adapter, disabled adapter)
src/brands/                 White-label brand configs
supabase/migrations/        Database schema + RLS policies
docs/                       AUTH.md, CONTENT.md (authoring guide), DEPLOY.md (Vercel checklist)
```

## Adding content

See [docs/CONTENT.md](docs/CONTENT.md) for the full guide. In short: add the lesson Markdown and its metadata, give every code lab concepts and a plan, include a worked example, and run `npm test`; the tests enforce these beginner-friendliness rules.

## Deploying

Vercel is the intended host. See [docs/DEPLOY.md](docs/DEPLOY.md). The app has **not** been deployed yet.

## White-labeling

Copy `src/brands/talonforge.ts`, change name/colors/ranks, register it in `src/brands/index.ts`, and build with `NEXT_PUBLIC_BRAND=<id>`. One deployment per tenant for now; multi-tenant runtime branding is a deferred feature (see ARCHITECTURE.md).

## Honest status

See [TESTING.md](TESTING.md) for exactly what is and is not verified. Notably the AI helper route has not been tested against the live API, auth has not been tested against a live Supabase project, and no mobile or screen-reader audit has been done.

## Name note

"TalonForge" was chosen for the eagle (Aquila) + forge wordplay. A trademark and domain search has **not** been done: check both before launch.

Part of the Aquila Digital portfolio · *Per Aspera Ad Astra*.
