## Attack surface = what you expose

Every open port is a door. The fewer doors, the fewer break-ins. Security teams call this **reducing attack surface**.

## Ports and services

A **service** (SSH, a web server, a database) *listens* on a port. See what's listening:

```
ss -tulpn          # TCP/UDP listeners + owning process
sudo systemctl list-units --type=service --state=running
```

Watch the address: `127.0.0.1:5432` is local-only; `0.0.0.0:5432` is reachable from every interface.

## Firewalls: default-deny

Block everything inbound, then allow only what the server must offer. With **ufw** (Ubuntu):

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH (restrict by IP if you can)
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status verbose
```

Others: `nftables`/`iptables` (low level), `firewalld` (RHEL), Windows Defender Firewall, and cloud security groups.

## Managing services

```
sudo systemctl status nginx
sudo systemctl enable --now nginx    # start now and on boot
sudo systemctl disable --now telnet  # turn off what you don't need
journalctl -u nginx --since "1 hour ago"
```

## Principle

Disable unused services, bind internal ones to localhost, patch the rest, and monitor logs.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Protecting SSH on the internet.** Anything exposed to the internet gets password-guessing attempts within minutes. The strongest fix is to use **SSH keys** (a long cryptographic key pair instead of a password) and **turn off password login** in the SSH settings. Tools like **fail2ban** (blocks addresses after repeated failures) and rate limiting add more protection. Better still, do not expose SSH to everyone at all: restrict it to your own address or put it behind a VPN.

## Walk-through: reading a list of listening ports

On a Linux server, `ss -tulpn` prints one line for each service that is **listening** for connections. A trimmed example:

```
Netid  State   Local Address:Port   Process
tcp    LISTEN  0.0.0.0:22           sshd
tcp    LISTEN  0.0.0.0:80           nginx
tcp    LISTEN  127.0.0.1:5432       postgres
tcp    LISTEN  0.0.0.0:23           telnetd
```

Read each row as: *this program is waiting on this address and port.*

- `0.0.0.0:22` means "on every network interface", so SSH is reachable from anywhere the firewall allows.
- `127.0.0.1:5432` means "this machine only": the database cannot be reached from other computers. Good.
- `0.0.0.0:23` is **Telnet**, which sends everything unencrypted. It should not be running.

**The decision for each line:**

| Line | Needed? | Action |
| --- | --- | --- |
| sshd on 22 | Yes (management) | Keep; restrict by address, use keys |
| nginx on 80 | Yes (web) | Keep; redirect to HTTPS |
| postgres on 127.0.0.1 | Yes, local only | Leave as is |
| telnetd on 23 | No | `sudo systemctl disable --now telnet` |

## Firewall, in order

```
sudo ufw default deny incoming     # 1. block everything coming in
sudo ufw allow 22/tcp              # 2. allow SSH first, so you do not lock yourself out
sudo ufw allow 443/tcp             # 3. allow only what the server must offer
sudo ufw enable                    # 4. switch it on
sudo ufw status verbose            # 5. confirm
```

The order matters: allow your management access **before** enabling.

## Two layers of defense

A service that is turned off cannot be attacked at all. A firewall is a second layer for services you must keep. Use both.

## Check yourself

What is the difference between listening on `0.0.0.0` and on `127.0.0.1`? (`0.0.0.0` accepts connections from every interface, so other computers can reach it. `127.0.0.1` accepts only connections from the same machine.)
