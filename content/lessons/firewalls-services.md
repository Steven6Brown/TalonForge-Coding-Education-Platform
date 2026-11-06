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
