# Changelog

## Unreleased (2026-11-06)

### Added
- **Careers section** (`/careers`, replaces `/simulators`, which redirects): IT Help Desk (30 scenarios) and SOC Analyst (10) at beginner, intermediate and advanced levels, graded by security procedure, customer service, technical accuracy and documentation. Beginner scenarios open with a primer of key terms and offer hints; advanced ones have no hints.
- **Hands-on scenario steps:** simulated Windows/Linux terminal (output changes after a fix), mock admin console, write-the-ticket scored against a checklist, and SIEM evidence searches. 11 hands-on scenarios.
- **Mini-SIEM** search engine and deterministic fictional logs; `SIEM & SOC Analyst` track (6 lessons).
- **Tools page:** number converter, crypto workbench (hashes, classical ciphers, AES-GCM), ports reference with flashcards.
- **Binary, Encryption, Hashing & Ports** track (9 lessons) and **JavaScript Foundations** (8) and **Python Foundations** (3) tracks for complete beginners.
- **Helper "Talon":** redesigned floating helper with a "How I work" explanation; built-in glossary mode and an optional AI mode (server key + learner opt-in).
- **Beginner scaffolding:** every code lab now has concepts, a numbered plan, prerequisite links and (where useful) a loadable example; plain-English error explainer; terminal basics panel for shell labs.
- **Lesson depth pass:** a primer, walk-through or worked example now in 142 of 151 lessons (the 9 longest Network Security, ports and incident-planning lessons were left as written); quiz lessons now teach every answer their quiz checks; terminal labs list the commands they expect; track pages show a "do these first" path (`track-paths.ts`).
- Detail chips (level, time, XP) and back-arrow links across lesson, track and career pages.
- Tests: scenario integrity, hands-on task shape, beginner audit (scaffolds, hints, prerequisites, track order, quiz coverage), Markdown tables, SIEM engine, helper, tools.

### Fixed
- **Markdown tables never rendered** (showed raw `|` text) in every lesson; the renderer now supports them.
- `next build` failed on lint errors (unescaped apostrophes, `prefer-const`); fixed, and lint warnings for unused code and ARIA attributes on tabs cleaned up.
- Several simulated-shell command examples in lessons corrected after checking them against the simulator (`grep -B` is not supported; capture line format; file locations).

### Earlier unreleased work
- Shell: nano/vi/vim editor panel, tee, printf, sed, awk, sudo (simulated), find -size/-user, setuid display, ssh/scp range with hidden password prompt.
- Simulated Kali toolset (nmap, gobuster, curl, nc, ping, nslookup, searchsploit, hashid, john) against a fictional network.
- Tracks: Kali Pentest Lab (intro + reporting), Security Foundations, Math for Security, Cyber Range Labs, Digital Forensics, Databases & SQL (real SQLite via sql.js), Malware Analytics, Network Security.
- Share card (LinkedIn/clipboard/GitHub badge) and Resources page.
- Lessons written from the owner's own course notes; all text is original.

## 0.1.0 - 2026-11-05
- Initial MVP: 8 tracks, 40 lessons, shell/Python/JS labs, quizzes, Language Atlas, Playground, local progress.
- White-label brand system (TalonForge default).
- Supabase auth module (feature-flagged off): signup, verify, login, reset, MFA, recovery codes, social login, roles, audit log, sync.
