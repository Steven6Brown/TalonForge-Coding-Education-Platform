## Designing a network

A small enterprise network is usually divided by floor or department. Each segment gets its own **subnet**, with a **switch** connecting its devices and a **default gateway**, and wireless access points (with **WPA2/WPA3-Enterprise** and AES encryption) where needed.

Example plan:

- Third floor (admin + finance, 25 staff): `172.28.6.0/24`, switch at `172.28.6.1`
- Second floor (sales + R&D, 40 devices): `172.28.5.0/24`, switch at `172.28.5.1`

## Sizing a subnet

Usable hosts = `2^(32 - prefix) - 2` (the network and broadcast addresses are reserved). To fit `n` devices, pick the **smallest** network that holds them, leaving room to grow:

| Prefix | Usable hosts |
| --- | --- |
| /30 | 2 |
| /28 | 14 |
| /27 | 30 |
| /24 | 254 |
| /23 | 510 |

## Why segment?

- **Security:** a compromise in one segment doesn't automatically reach the others; firewalls control traffic between segments.
- **Performance:** less broadcast traffic.
- **Management:** policies per department.

## Hub-and-spoke designs

Larger organizations connect sites through hubs; links between nearby buildings are faster, farther ones slower, so hubs are placed where many networks are close.

## Your task

Implement `prefixForHosts(n)` to find the smallest subnet that fits `n` hosts.
