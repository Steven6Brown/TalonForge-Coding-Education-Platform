# Development rules - TalonForge

Follows the Aquila Digital Mobile & Web App Build Standards. Key rules for this repo:

- Never hardcode/commit secrets; `SUPABASE_SERVICE_ROLE_KEY` is server-only. Keep real values out of the repo.
- Ask before consequential architecture/security/privacy decisions. Don't add dependencies or infrastructure without a confirmed need.
- UI uses `auth` from `src/lib/auth` (never Supabase directly). Accounts stay behind `NEXT_PUBLIC_AUTH_ENABLED` until the owner enables them.
- Learner code must stay sandboxed (Workers with their own CSP; no server execution). Career terminals and the SIEM are simulators only.
- Render Markdown via `src/lib/markdown.tsx` only; never `dangerouslySetInnerHTML`. The subset has no links or images.
- New lessons: Markdown in `content/lessons/`, metadata in `src/lib/content/`, the test suite must pass. See [CONTENT.md](CONTENT.md).
- **Write for first-timers.** Every code lab needs concepts, a plan, prerequisite links and at least two hints; every lesson needs a "start here"/worked example; quiz lessons must teach their answers. Tests enforce part of this. Do not assume knowledge the page has not taught.
- Run simulator commands against the real simulator before documenting them (not every option is implemented). Verify numeric examples (run them) before publishing.
- Don't claim a test/audit was done unless it was; update [TESTING.md](TESTING.md) honestly. Say what was not verified.
- Scenarios and logs are fictional. Do not present practice as a credential or work experience.
