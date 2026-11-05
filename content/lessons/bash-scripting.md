## From commands to scripts

A script is just commands saved in a file. Start with a **shebang** and make it executable:

```
#!/usr/bin/env bash
set -euo pipefail

name="${1:-world}"
echo "Hello, $name"
```

Run with `chmod +x hello.sh` then `./hello.sh Aquila`.

## Core pieces

```
# variables (no spaces around =)
target="10.0.0.5"

# conditionals
if [ -f "$file" ]; then echo "exists"; fi

# loops
for host in 10.0.0.1 10.0.0.2; do
  echo "checking $host"
done

# exit codes: 0 = success
grep -q root /etc/passwd && echo found
echo $?
```

## Habits that prevent disasters

- **Quote variables**: `"$file"`, so spaces and special characters can't change the command.
- `set -euo pipefail` stops on errors, unset variables and failed pipelines.
- Never build commands from untrusted input (command injection).
- Use `shellcheck` to catch common bugs.

## Scheduling with cron

`crontab -e` and add: `30 2 * * * /home/user/backup.sh`

Fields: minute, hour, day of month, month, day of week. This runs daily at 02:30. Attackers also use cron for persistence, so audit it.

## Check yourself

Take the quiz below.
