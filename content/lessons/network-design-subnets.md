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

## Walk-through: choosing a subnet size

You are planning a network and each department needs room for its devices. Remember: a `/p` network has `2^(32-p)` addresses, and **usable hosts = that number minus 2** (the network address and the broadcast address cannot be given to devices).

**Example: 30 devices.**

| Prefix | Addresses | Usable hosts | Fits 30? |
| --- | --- | --- | --- |
| /30 | 4 | 2 | no |
| /29 | 8 | 6 | no |
| /28 | 16 | 14 | no |
| /27 | 32 | 30 | **yes (exactly)** |

The answer is `/27`: the **smallest** network (largest prefix number) that still holds 30 hosts.

**Example: 50 devices.** `/27` holds only 30, but `/26` holds `64 - 2 = 62`, so the answer is `/26`.

**Leave growth room.** Real designs add 25 to 50 percent spare capacity and plan separate subnets for servers, staff, guests and cameras, so a problem in one cannot easily reach another.

## How the loop searches

Start at `/30` (the smallest useful network) and work **down** to `/1`, computing `2 ** (32 - p) - 2`. The first prefix whose usable hosts are at least `n` is the answer, so `return p` immediately. If nothing fits, return 0.

## If something goes wrong

- Off by one prefix: you forgot to subtract 2.
- Returns 30 for everything: you started the loop at the wrong end or did not return early.

## Check yourself

How many hosts can a `/28` hold? (16 - 2 = 14.) What prefix do you need for 100 hosts? (`/25` holds 126.)
