## What a subnet is

A **subnet** is a slice of an IP space. **CIDR notation** writes it as an address plus a prefix length: `192.168.1.0/24`.

The prefix says how many of the 32 bits are the **network** part. The remaining bits are for **hosts**.

## The math

For a `/p` network:

- Total addresses = `2^(32 - p)`
- Usable hosts = total - 2 (the first address is the *network address*, the last is the *broadcast*)

Examples:

- `/24` → 256 addresses → **254** usable (netmask 255.255.255.0)
- `/16` → 65,536 → **65,534**
- `/30` → 4 → **2** (typical for point-to-point links)

## Why security people need it

- Firewall rules and cloud security groups are written in CIDR.
- Scanning `10.0.0.0/24` is very different from scanning `10.0.0.0/8`. Scope is defined in CIDR in a pentest contract.
- Segmentation (separating servers, users and IoT) limits how far an attacker can move.

## Your task

Write `hostsInCidr(cidr)` for prefixes up to /30. Hidden tests check four networks.
