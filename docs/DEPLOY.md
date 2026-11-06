# Deploying to Vercel

Status: **not deployed.** This is a checklist for the first deployment. Nothing below has been run.

## Before you deploy

1. `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all pass locally (they did on 2026-11-06).
2. Decide the public URL and domain. Check the **TalonForge** name for trademark and domain conflicts first (see README).
4. Accounts stay **off** (`NEXT_PUBLIC_AUTH_ENABLED=false`) until the Supabase setup in `docs/AUTH.md` is done and tested.

## Vercel project settings

- Import the GitHub repository (note: the repo moved to `Steven6Brown/TalonForge-Coding-Education-Platform`; update the git remote if it still points at the old name).
- Framework preset: **Next.js**. Install `npm install`, build `npm run build`, output default.
- Node.js 20 or newer.
- **Do not set `NEXT_DIST_DIR`** (it is only for local verification builds).

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | The production URL (used for canonical links, sitemap, Open Graph) |
| `NEXT_PUBLIC_BRAND` | No | Defaults to `talonforge` |
| `NEXT_PUBLIC_AUTH_ENABLED` | No | Keep `false` for now |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Only with accounts | The service-role key is server-only; never expose it |

Set secrets in the Vercel dashboard (Production and Preview separately). Never commit values.

## After the first deploy, check

1. The home page, a lesson, a track page, `/careers`, `/tools` and `/playground` load and are styled.
2. A JavaScript lab runs, a Python lab and a SQL lab load their engines (this proves the CSP allows `cdn.jsdelivr.net` for the workers).
3. Response headers include the CSP, HSTS and `X-Frame-Options` (browser dev tools, Network tab).
4. `/robots.txt` and `/sitemap.xml` use the production URL.
5. `GET /api/helper` returns `{"ai":false}` when no key is set.
6. If AI is enabled: ask the helper one question with the opt-in box ticked, and confirm the rate limit response after the limit.
7. Run Lighthouse and an accessibility check; test on a real phone.

## Known deployment caveats

- The helper's rate limit is per serverless instance (see SECURITY.md).
- Progress is stored in each visitor's browser only, so there is nothing to migrate or back up server-side until accounts are enabled.
- `next` currently pulls a vulnerable build-time `postcss` (see SECURITY.md); plan the Next 16 upgrade.
