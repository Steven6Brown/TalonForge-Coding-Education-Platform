## Run it without you

- **cron** (Linux/macOS): `*/15 * * * * /path/job.sh` runs every 15 minutes. Fields: minute, hour, day of month, month, day of week.
- **systemd timers** add logging and dependency handling.
- **Task Scheduler** on Windows; **GitHub Actions** `schedule:` for repo jobs; cloud schedulers for serverless.

Cron runs with a tiny environment, so use absolute paths and set variables. Use `flock` or a lock file so runs never overlap, and send output to a log file.

## Check yourself

Take the quiz below.
