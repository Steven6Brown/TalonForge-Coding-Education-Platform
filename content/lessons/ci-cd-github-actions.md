## Start here

When several people change the same project, how do you know a change did not break something? **Continuous Integration (CI)** is the answer: every time someone pushes code, a server automatically **builds the project and runs the tests**, then reports pass or fail. Bugs are caught in minutes instead of weeks.

**Continuous Delivery/Deployment (CD)** goes one step further: when the checks pass, the new version can be released automatically.

## What GitHub Actions is

GitHub Actions is GitHub's built-in automation. You describe what to do in a **workflow**: a text file in the **YAML** format (indentation-based settings) saved in the folder `.github/workflows/` of your repository.

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

Read it from the top:

- `on:` is the **trigger**: when to run (here on every push and pull request; others are `schedule` using cron syntax, or a manual button).
- `jobs:` are groups of work. Each job runs on a fresh **runner** (a temporary machine, here Ubuntu Linux).
- `steps:` run in order. `uses:` runs a ready-made **action** (check out the code, install Node). `run:` runs a command like `npm test`.

## Secrets

Workflows sometimes need a password or token. **Never write it in the file.** Add it in the repository settings as an encrypted **secret** and reference it as `${{ secrets.MY_TOKEN }}`. Anything committed to Git history must be treated as stolen.

## Security checks belong in CI

- **Dependency scanning** (npm audit, Dependabot) finds known-vulnerable packages.
- **Secret scanning** catches keys committed by accident.
- Linting and tests on every pull request.
- Pin action versions and give workflows the **minimum permissions** they need.

## Check yourself

Take the quiz below.
