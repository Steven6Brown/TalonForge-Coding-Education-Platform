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

## Commands you will use in this lab (with examples)

- **`/etc/passwd`** lists accounts and each account's login **shell** (the last field). A shell of `/usr/sbin/nologin` means the account cannot sign in interactively (typical for service accounts). `grep -v nologin /etc/passwd` shows every line that does **not** contain `nologin` (`-v` means "invert": show the non-matches).
- **`/etc/shadow`** stores the password hashes, so only the administrator may read it. A normal user is refused. **`sudo`** means "run this command as the administrator": `sudo cat /etc/shadow`. (Here, practicing is safe.)
- In `/etc/shadow` each line is `name:hash:...`. The second field tells you the account's password status:
  - `!` means the password is **locked** (nobody can sign in with a password).
  - `*` means **no password login** is possible.
  - A long string starting with `$` is a real **hash**: the account can be used with a password.
- `sudo grep -Ev '!|\*' /etc/shadow` shows lines that contain neither `!` nor `*` (`-E` allows the `|` meaning "or", `-v` inverts). The accounts left are the ones with a usable password. Ignore `root` as the task says.

An audit like this is routine: unused accounts with passwords are an easy way in.
