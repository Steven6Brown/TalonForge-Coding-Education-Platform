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

## Walk-through: one subnet from start to finish

Take `192.168.10.37/26`. Read it as: the address `192.168.10.37`, and the first **26 bits** are the network part.

1. **How many host bits?** 32 - 26 = **6**. So the network has 2^6 = **64** addresses.
2. **Find the block size in the interesting octet.** The first three octets use 24 bits, so the 4th octet holds the last 2 network bits and 6 host bits. The blocks in that octet go up in steps of 64: 0, 64, 128, 192.
3. **Which block holds 37?** 37 is between 0 and 63, so the network is `192.168.10.0` and the broadcast (last address) is `192.168.10.63`.
4. **Usable hosts:** `.1` to `.62`, which is 62 addresses (64 minus the network and broadcast addresses).

So `192.168.10.37/26` lives in network `192.168.10.0/26`, with usable hosts `.1` to `.62`.

## The cheat sheet worth memorizing

```
/24 = 256 addresses (254 usable)   mask 255.255.255.0
/25 = 128 (126 usable)             mask 255.255.255.128
/26 =  64 (62 usable)              mask 255.255.255.192
/27 =  32 (30 usable)              mask 255.255.255.224
/28 =  16 (14 usable)              mask 255.255.255.240
/30 =   4 (2 usable)               point-to-point links
```

Each step to a bigger prefix number halves the network. Usable hosts = 2^(host bits) - 2.

## Why networks are split

Smaller subnets limit how far a problem (or an attacker) can spread, keep broadcast traffic down and let you apply firewall rules between groups, such as guests, servers and staff.

## Check yourself

How many usable hosts are in a /27? (32 - 2 = 30.) Which /26 block holds `10.0.0.130`? (`10.0.0.128/26`, since the blocks go 0, 64, 128, 192.)
