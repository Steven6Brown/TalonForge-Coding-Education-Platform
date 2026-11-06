## A fresh server checklist

Whether it's a Raspberry Pi, a VM or a cloud VPS, do this in order:

1. **Update everything:** `sudo apt update && sudo apt upgrade`
2. **Create a normal user** with sudo; stop using root.
3. **SSH keys** instead of passwords:
   ```
   ssh-keygen -t ed25519
   ssh-copy-id user@server
   ```
4. **Harden `/etc/ssh/sshd_config`**
5. **Turn on a firewall** (next lesson) and only open what you need.
6. **Automatic security updates** and log monitoring (`fail2ban`, `journalctl`).

## The settings that matter in sshd_config

```
PermitRootLogin no          # never allow direct root login
PasswordAuthentication no   # keys only
PermitEmptyPasswords no
PubkeyAuthentication yes
MaxAuthTries 3
X11Forwarding no
```

After editing, validate and reload: `sudo sshd -t && sudo systemctl reload ssh`. Keep your current session open and test a second login before closing it, or you may lock yourself out.

## Why it matters

The log lab earlier showed hundreds of password guesses against `root`. Any internet-facing SSH server gets that within minutes. Key-only login removes the entire attack.

## Your task

Read the (training) `sshd_config` in the terminal and find the setting that permits direct root login. Submit the setting's name.

## Commands you will use in this lab (with examples)

**SSH** lets you log in to a server over the network. Its behaviour is set by the file `/etc/ssh/sshd_config`, a list of `Setting value` lines. Lines starting with `#` are comments (ignored).

- `cat /etc/ssh/sshd_config` prints the file. Read it top to bottom; it is short.
- `grep -i root /etc/ssh/sshd_config` shows only lines mentioning `root` (`-i` ignores upper/lower case). One of them is a setting that decides whether someone can log in directly **as root**.
- A setting name is a single word like `PasswordAuthentication`. The value after it is `yes` or `no`. Submit the **setting name** (the first word on the line), not the value.

**Why it matters:** attackers always try the username `root` first. Safe servers set this to `no` (or `prohibit-password`), use SSH **keys** instead of passwords, and log in as a normal user who uses `sudo` when needed.
