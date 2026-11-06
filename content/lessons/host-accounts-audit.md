## Why audit accounts?

Every account is a way in. Old, shared or temporary accounts with working passwords are a classic weakness, so defenders review them regularly.

## Two files to know

- `/etc/passwd`: one line per account: `name:x:UID:GID:comment:home:shell`. World-readable. The shell tells you whether the account can log in; `nologin` means it cannot.
- `/etc/shadow`: password hashes and aging data. **Readable only by root.** The second field decides what's allowed:
  - a real hash (`$6$...`): the account has a password
  - `!` (or `!!`): the password is locked
  - `*`: no password login is possible (typical for service accounts)

## Useful commands

```
grep -v nologin /etc/passwd          # accounts with a real login shell
sudo cat /etc/shadow                 # needs root
sudo grep -Ev '!|\*' /etc/shadow     # accounts whose password field is NOT locked or disabled
```

Pipe to `cut -d: -f1` to print only the usernames.

## What to look for

- Accounts nobody recognizes, or temporary accounts that were never removed
- Service accounts that can log in interactively
- Any account other than root with UID 0

## Your task

Use sudo to audit `/etc/shadow` and submit the two non-root accounts with usable passwords. This mirrors a standard Linux host-security lab exercise.
