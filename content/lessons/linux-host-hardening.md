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

## Commands you will use in this lab (with examples)

**Hardening** means closing doors an attacker could use. Start with `cat ~/README.txt` to see the three tasks, and use `labcheck` any time to see which are done.

### Task 1: the firewall (ufw)

`ufw` ("uncomplicated firewall") decides which connections are allowed in. The safe pattern is **deny everything, then allow only what you need**:

```
sudo ufw default deny incoming     # block all inbound by default
sudo ufw allow 22/tcp              # allow SSH (so you can still log in)
sudo ufw allow 443/tcp             # allow HTTPS
sudo ufw enable                    # turn the firewall on
sudo ufw status verbose            # check the result
```

Always allow SSH **before** enabling, or you can lock yourself out of a remote server.

### Task 2: stop unneeded services

Every running service is a possible way in. `systemctl list-units --type=service --state=active` lists what is running. To remove one you do not need: `sudo systemctl stop avahi-daemon` (stop now) and `sudo systemctl disable avahi-daemon` (do not start at boot). Repeat for `cups` (printing).

### Task 3: password aging

`sudo chage -M 30 -W 14 jdoe` makes jdoe's password expire after 30 days (`-M`) with a warning 14 days before (`-W`). Check it with `chage -l jdoe`.

When all three boxes in `labcheck` are ticked, it prints the flag to submit.
