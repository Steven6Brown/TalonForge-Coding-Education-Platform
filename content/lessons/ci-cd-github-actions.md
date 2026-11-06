## Automate the checks

**Continuous integration (CI)** runs your build and tests automatically whenever code changes. **Continuous delivery/deployment (CD)** can then release changes automatically.

## GitHub Actions in a nutshell

Workflows are YAML files in `.github/workflows/`:

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

- **Triggers:** `push`, `pull_request`, `schedule` (cron syntax), manual runs.
- **Jobs and steps:** jobs run on runners; steps run commands or reusable actions.
- **Secrets:** store tokens in repository **secrets** and reference them (`${{ secrets.NAME }}`); never commit them.

## Security in the pipeline

Run dependency and secret scanning, linting and tests on every pull request; pin action versions; give workflows the minimum permissions they need.

## Check yourself

Take the quiz below. This is the same idea as the repo you're building here: tests run on every change before anything ships.
