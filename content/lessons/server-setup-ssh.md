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
