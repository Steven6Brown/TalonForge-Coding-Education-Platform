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

## Key facts this lesson's quiz checks

- **Always quote variables: `"$file"`.** Without quotes the shell splits the value at spaces (**word splitting**) and expands characters like `*` into file names (**globbing**). A file called `my report.txt` would be treated as two files. If the value comes from an attacker it can even inject extra options or commands. Quote it: `rm "$file"`.
- **`set -euo pipefail`** at the top of a script makes it **fail fast**: `-e` stops at the first command that fails, `-u` treats use of an unset variable as an error, and `-o pipefail` makes a pipeline fail if any stage in it fails (not just the last). Without these, a script can silently keep going after something went wrong and do damage.
