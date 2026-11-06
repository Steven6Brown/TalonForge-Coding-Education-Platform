## Start here

A script you run by hand is helpful. A script that runs **by itself** at 2:00 every morning is automation. A **scheduler** is the program that starts jobs at the times you choose.

## Cron: the classic Linux/macOS scheduler

You list jobs in a file called a **crontab** (edit it with `crontab -e`). Each line has five time fields and then the command:

```
minute  hour  day-of-month  month  day-of-week   command
*/15    *     *             *      *             /home/me/job.sh
```

Reading it: `*` means "every". `*/15` in the minute field means "every 15 minutes". So that line runs the script every 15 minutes, all day, every day. Another example, `30 2 * * 1-5` means 2:30 am on weekdays (Monday to Friday).

Tip: sites like crontab.guru translate an expression into plain English so you can check it.

## The "works in my terminal but not in cron" problem

Cron starts jobs with a **tiny environment**. Your usual settings (like the PATH that lets the shell find programs) are missing. The fix:

- Use **absolute paths** (`/usr/bin/python3 /home/me/job.py`, not `python3 job.py`).
- Set any variables the script needs at the top of the crontab or inside the script.
- Send output to a **log file** so you can see errors: `/home/me/job.sh >> /home/me/job.log 2>&1`.

## Do not let two copies run at once

If a job takes longer than the gap between runs, a second copy starts while the first is still working, and they can corrupt each other's files. Prevent it with a **lock file** or the `flock` command: the job takes the lock, and a second copy that cannot get it exits right away.

## Other schedulers

- **systemd timers** (Linux): add logging and dependency handling.
- **Task Scheduler** (Windows).
- **GitHub Actions** with a `schedule:` trigger, great for repository jobs.
- **Cloud schedulers** for serverless functions.

## Check yourself

Take the quiz. The explanations point back to the sections above.
