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
