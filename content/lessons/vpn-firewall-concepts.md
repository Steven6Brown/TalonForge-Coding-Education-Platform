## Firewalls

A **firewall** allows or blocks traffic according to rules (source, destination, port, protocol).

- **Rule order matters:** rules are checked top to bottom and the first match wins, so put specific rules above broad ones.
- **Stateful** firewalls track connections, so replies to allowed outbound traffic are permitted automatically.
- **Default deny** on inbound traffic is the safe baseline.
- **NAT** (network address translation) lets many private addresses share one public one. It is not a security feature by itself.
- A **DMZ** is a separate segment for public-facing servers so a compromise there can't freely reach the internal network.

Platforms include **pfSense** (open-source firewall/router), cloud security groups, host firewalls like `ufw` and Windows Defender Firewall.

## VPNs

A **VPN** creates an encrypted tunnel across an untrusted network.

- **Remote-access VPN:** one user connects to the company network.
- **Site-to-site VPN:** two networks are joined.
- **OpenVPN** (open-source, TLS-based) and **WireGuard** are common choices.
- Strong authentication matters: certificates plus MFA, not just a shared password.

A VPN protects traffic in transit, not the device, so endpoint security still applies.

## Check yourself

Take the quiz below.
