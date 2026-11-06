## The incident response lifecycle

1. **Preparation**: logging, backups, runbooks, contacts
2. **Detection and analysis**: is this real? what's the scope?
3. **Containment**: isolate affected systems (carefully; don't destroy evidence)
4. **Eradication and recovery**: remove the attacker's access, restore from known-good state
5. **Lessons learned**: fix root causes, improve detection

## Persistence: how attackers stay in

After getting access, attackers try to keep it. On Linux, classic places to look:

- New accounts, especially with **UID 0** (root privileges under another name)
- `~/.ssh/authorized_keys` with unfamiliar keys
- `cron` jobs (`/etc/crontab`, `/etc/cron.*`, `crontab -l`)
- systemd services and timers
- Modified shell startup files (`.bashrc`) and SUID binaries

## Hunting the backdoor account

`/etc/passwd` lines look like `name:x:UID:GID:comment:home:shell`. Only `root` should have UID 0.

```
cut -d: -f1,3 /etc/passwd
grep ':0:0:' /etc/passwd
```

## Good habits

- Work on copies or snapshots, and keep notes with timestamps.
- Preserve logs before cleaning up.
- Communicate through the plan, not ad hoc.

## Your task

Inspect `/etc/passwd` in the terminal and find the backdoor account. Submit its username.

## Commands you will use in this lab (with examples)

On Linux every account is a line in the file `/etc/passwd`, with fields separated by colons:

```
name:x:UID:GID:comment:home:shell
root:x:0:0:root:/root:/bin/bash
```

The third field is the **UID** (user ID). The special value **0** means "superuser". Normally only `root` has UID 0, so a second account with UID 0 is a classic sign of a **backdoor** an attacker created.

- `cat /etc/passwd` lists every account. Read the third field of each line.
- `cut -d: -f1,3 /etc/passwd` prints just the name and UID. (`-d:` means "fields are separated by colons", `-f1,3` means "keep fields 1 and 3".)
- `grep ':0:0:' /etc/passwd` shows lines with UID 0 and GID 0. One of them will be `root`; you want the **other**.

This is a real incident-response check: after a suspected break-in, list accounts, look for ones with UID 0, odd login shells and recently added users.
