## Automate the boring, rule-based work

Good candidates: tasks you repeat, that follow clear rules, and where mistakes are costly when done by hand (renaming files, weekly reports, log checks). Poor candidates: one-offs and anything needing human judgment.

## Rules for trustworthy automation

- **Idempotent:** running it twice leaves the same end state.
- **Dry-run first:** print what you would change before changing it.
- **Log everything** and fail loudly.
- **No secrets in code:** read tokens from environment variables.
- **Start small:** automate one step, then chain steps.

## Your task

Answer the quiz below.
