# Testing

Run: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## Automated (verified 2026-11-05)

- 22 Vitest tests: shell engine (quoting, pipes, redirects, permissions, VFS isolation), every shell lab is solvable, every JS lab solution passes and every starter fails, password policy, open-redirect guard, progress merge, markdown parsing, atlas ranking, content integrity.
- `tsc --noEmit`, `next lint` and `next build` pass.

## Manual (in-app browser, production build)

- Shell lab: ran commands, submitted flag, progress persisted.
- JS lab: hidden tests pass; `fetch` from learner code is blocked by CSP.
- Python labs: the 4 original Python solutions (basics, bytes, log analysis, caesar) plus hashing produce the expected output in real Pyodide; CSP allows the engine to load.

## NOT verified

- Real mobile devices; cross-browser (only Chromium-based pane tested); automated accessibility audit (axe) and screen-reader testing; keyboard-only pass of every page.
- All auth flows (needs a live Supabase project); RLS policies; recovery-code actions.
- Playwright end-to-end suite (not written).
- Lighthouse / Core Web Vitals measurements.
- Batch 2/3 verification (2026-11-05): `tsc`, `next lint`/`build` (64 pages) and 22 tests pass. All Python labs added in batches 2-3 (regex IOCs, file organizer, CSV, retry, ML from scratch) were run in real Pyodide and produce the expected output. New quizzes and lesson pages were not individually reviewed in the browser.
- Batch 4 (2026-11-05): 27 tests pass (editor, sed/awk/tee/printf, sudo, wargame and forensics labs). Verified in browser: nano editor saves a file; Kali tab nmap and searchsploit run. NOT verified: the share card clicks (LinkedIn page not opened), Kali track lesson pages, mobile, accessibility audit. The hands-on Kali walkthrough lessons (scanning, web enumeration, cracking, exploit search) have NOT been written; only the simulator exists.
- Batch 5: 27 tests pass (all new JS labs: starters fail, solutions pass). The spam classifier was run in real Pyodide (starter prints ham x4, solution prints spam,ham,spam,ham). New lesson pages were not individually reviewed in the browser.
- Batch 6 (2026-11-05): 34 tests pass (host hardening labcheck, ssh password prompt and exit, scp, sha256sum -c, awk pipeline, new JS labs), plus tsc, lint and build (121 pages). In the browser: all six SQL labs pass (starter fails with a missing-table error), the three new Python labs pass in Pyodide, and the ssh password prompt is masked and not echoed. NOT verified: the quiz lessons' pages, mobile, accessibility audit, the sql.js CDN under offline conditions.
- Kali walkthrough lessons for scanning, web enumeration, password cracking and exploit search remain unwritten (see earlier note).
- Batch 7: 35 tests pass; build passes. The z-scores Python lab was run in Pyodide (starter 0.0000 0.0000, solution 0.0668 0.8664). Quiz pages not individually reviewed.
- Deliberately NOT written: hands-on Kali walkthroughs (scanning, web enumeration, password cracking, exploit search) and a SUID privilege-escalation lesson, because earlier generation of those was stopped by a safety classifier. The simulated Kali tools remain in the Playground. Not covered from coursework: Java/IST 140, IST 261 app development, IST 389 teaching, SRA 111/211 intelligence/terrorism content, and the PDF-only materials (PDFs could not be rendered in this environment).
