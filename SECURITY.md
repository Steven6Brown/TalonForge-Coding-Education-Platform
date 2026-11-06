# Security model

## Learner code execution

- **JavaScript:** runs in a dedicated Web Worker served with its own CSP (`connect-src 'none'`), so learner code cannot make network requests. 5 s timeout; the worker is terminated afterward.
- **Python:** Pyodide (WebAssembly) in a worker pinned to a version, loaded from jsDelivr. Worker CSP only allows that CDN. 10 s run timeout.
- **SQL:** sql.js 1.8.0 (SQLite WebAssembly) from jsDelivr inside a Worker with a CDN-only network policy. Each run uses a fresh in-memory database.
- **Shell, Careers terminals and the Mini-SIEM:** pure in-memory simulators. They never call real commands, and unknown commands fail. The career "terminals" only match a fixed list of command patterns to canned output.
- No learner code ever reaches a server. The learner can only harm their own tab.

## Web hardening

CSP, HSTS (prod), `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP (see `next.config.mjs`). Lesson Markdown (including tables) is rendered to React elements, never raw HTML. Imports are zod-validated and size-capped. Lesson file loading is allowlisted by id (no path traversal).

## Optional AI helper (`/api/helper`)


- The key stays on the server and is never sent to the browser. The browser only learns whether AI is available (`GET` returns `{ ai: true|false }`).
- Input is validated with zod and size-capped (question 1000, code 6000, output 2000 characters); same-origin check; 20 requests per hour per IP.
- The model's reply is treated as untrusted text and rendered by the safe Markdown renderer. Learner code and output are wrapped in tags and the system prompt tells the model to treat them as data (a mitigation, not a guarantee against prompt injection).
- The system prompt asks the model not to hand over full lab solutions and to decline offensive help outside authorized, defensive use. This is best-effort.

Limits: the rate limiter is an in-memory map **per server instance**, so on serverless hosting (Vercel) it is a speed bump only. Use a shared store (for example Upstash Redis or Vercel KV) or edge rate limiting before enabling AI for the public. The route has not been tested against the live API (see docs/TESTING.md).

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
| No rate limiting on server actions beyond recovery-code attempts; helper rate limit is per instance | Add before enabling accounts or AI publicly |

## Reporting

Email the Aquila Digital owner. Do not open public issues for vulnerabilities.
