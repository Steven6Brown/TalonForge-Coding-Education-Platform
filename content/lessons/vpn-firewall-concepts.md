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

## Worked example: why firewall rule order matters

A firewall checks rules **top to bottom and the first match wins**. Consider these rules protecting a web server at 10.0.0.5:

```
1. ALLOW  any -> 10.0.0.5  port 443
2. DENY   any -> any       any port
```

- Traffic to 10.0.0.5 on port 443 matches rule 1 and is allowed.
- Everything else falls through to rule 2 and is blocked (**default deny**).

Now swap them:

```
1. DENY   any -> any       any port
2. ALLOW  any -> 10.0.0.5  port 443
```

Every packet matches rule 1 first, so the web server becomes unreachable. Lesson: put **specific** rules above **broad** ones.

**Stateful** means the firewall remembers connections. If your computer opens a connection out to a website, the **reply** is allowed back in automatically, without a separate inbound rule.

## A tiny network picture

```
Internet -> [Firewall] -> DMZ (public web server)
                      \-> Internal network (staff, files)
```

The **DMZ** is a separate segment for public-facing servers. If the web server is compromised, the firewall still stands between it and the internal network.

## VPN in plain words

A VPN wraps your traffic in an encrypted tunnel across an untrusted network such as hotel Wi-Fi. **Remote-access VPN** connects one person to the company. **Site-to-site VPN** joins two offices. A VPN protects data in transit, not the laptop itself.

## Self-check

1. Is NAT a security feature? (Not by itself. It only shares public addresses.)
2. What baseline should inbound traffic follow? (Default deny.)
3. Strong VPN authentication means? (Certificates plus MFA, not only a shared password.)
