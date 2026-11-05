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
