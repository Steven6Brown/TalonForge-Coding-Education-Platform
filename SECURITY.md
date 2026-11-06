# Security model

## Learner code execution

- **JavaScript:** runs in a dedicated Web Worker served with its own CSP (`connect-src 'none'`), so learner code cannot make network requests. 5 s timeout; the worker is terminated afterward.
- **Python:** Pyodide (WebAssembly) in a worker pinned to a version, loaded from jsDelivr. Worker CSP only allows that CDN. 10 s run timeout.
- **SQL:** sql.js 1.8.0 (SQLite WebAssembly) from jsDelivr inside a Worker with a CDN-only network policy. Each run uses a fresh in-memory database.
- **Shell, Careers terminals and the Mini-SIEM:** pure in-memory simulators. They never call real commands, and unknown commands fail. The career "terminals" only match a fixed list of command patterns to canned output.
- No learner code ever reaches a server. The learner can only harm their own tab.

## Web hardening

CSP, HSTS (prod), `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP (see `next.config.mjs`). Lesson Markdown (including tables) is rendered to React elements, never raw HTML. Imports are zod-validated and size-capped. Lesson file loading is allowlisted by id (no path traversal).

## Known issues / limitations

| Item | Status |
| --- | --- |
| Page CSP allows `'unsafe-inline'` scripts (Next.js hydration; no nonce pipeline yet) | Known; add nonce-based CSP before handling real accounts |
| JS worker CSP allows `unsafe-eval` (required to run learner code); isolated, network-less | Accepted |
| Python and SQL workers may fetch from `cdn.jsdelivr.net` | Accepted; self-host Pyodide and sql.js to remove |
| `npm audit` (prod): `next` bundles a vulnerable `postcss` (build-time CSS processing; we process no untrusted CSS). Fix requires Next 16 | Known, upgrade planned |
| `npm audit` (dev): `minimatch` in the ESLint toolchain | Dev only |
| Lab answers/solutions and career scenario answers ship in the client bundle | By design: a practice tool, not a graded exam. Do not use scores as proof of skill |
| Auth code is untested against a live Supabase project | NOT VERIFIED |
| No rate limiting on server actions beyond recovery-code attempts | Add before enabling accounts publicly |

## Reporting

Email the Aquila Digital owner. Do not open public issues for vulnerabilities.
