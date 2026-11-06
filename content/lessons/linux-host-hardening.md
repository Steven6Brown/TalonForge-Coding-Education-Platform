## Reduce what's exposed

Hardening means removing attack surface: close ports, stop unneeded services, and enforce good account policy.

## 1. Firewall with ufw

`ufw` (Uncomplicated Firewall) manages Linux's netfilter rules.

```
sudo ufw default deny incoming     # block everything inbound by default
sudo ufw default allow outgoing
sudo ufw allow 22/tcp              # SSH
sudo ufw allow 443/tcp             # HTTPS
sudo ufw enable
sudo ufw status verbose            # review the policy and rules
```

You can also scope a rule: `sudo ufw allow from 172.16.10.10 to any port 22`.

## 2. Services with systemctl

```
systemctl list-units --type=service --state=active   # what is running
sudo systemctl stop avahi-daemon                     # stop it now
sudo systemctl disable avahi-daemon                  # don't start it at boot
```

`stop` and `disable` are different: do both. Disable anything the server doesn't need (printing, mDNS discovery) but keep what it does need (like `sshd`).

## 3. Password aging with chage

```
sudo chage -M 30 -W 14 jdoe        # force change every 30 days, warn 14 days before
chage -l jdoe                      # verify
```

## Verify your work

Hardening isn't done until you check it. In this lab, `labcheck` lists each task and prints a flag when everything passes. In real life you would use scanners and configuration baselines.

## Your task

Complete all three tasks from `~/README.txt` and submit the flag.
