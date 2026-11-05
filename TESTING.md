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
- py-regex-iocs lab expected output was checked with an equivalent JS regex, NOT in Pyodide. New quizzes/lessons (batch 2) were not browser-tested.
