## Why secure the network layer?

Ordinary TCP/IP has no built-in security: a packet is data plus a TCP header, an IP header and a link-layer header, readable and modifiable by anyone on the path. Security can be added at different layers:

- **Network layer:** IPsec (this lesson), which protects everything above it (layers 4-7) transparently.
- **Application layer:** protocols such as TLS (next lessons) that applications call.

## What IPsec provides

IPsec is a suite of protocols working at the IP layer. It gives **access control**, **data-origin authentication**, **data confidentiality** and **rejection of replayed packets**. It is used on LANs, WANs and the public internet, and implemented in hosts, firewalls and gateways.

## AH and ESP

- **Authentication Header (AH):** integrity, origin authentication and anti-replay for the packet (including most IP header fields). It does **not** encrypt.
- **Encapsulating Security Payload (ESP):** encryption (confidentiality) plus optional authentication and anti-replay. ESP has a header and a trailer (with padding so encrypted data fills whole cipher blocks, and a pad length).

Both carry a **Security Parameters Index (SPI)** telling the receiver which keys and algorithms apply, and a **sequence number** for anti-replay. The **integrity check value (ICV)** is a keyed hash over the protected fields: the receiver recomputes it with the shared key. A match means the packet is intact and came from a holder of the key; a mismatch means damage or the wrong key, and the packet is discarded.

## Transport mode versus tunnel mode

- **Transport mode:** protects the **payload** of the original IP packet and leaves the original IP header alone. Typical use: **host to host**.
- **Tunnel mode:** encapsulates the **entire original IP packet** inside a new IP packet with new addresses (the gateways'). Hides the real endpoints, which helps against traffic analysis. Typical use: **gateway to gateway** (site-to-site VPNs), or when one end is a security gateway.

Two protocols times two modes gives four combinations: AH transport, AH tunnel, ESP transport and ESP tunnel.

## Key management

- **Manual keys:** an administrator configures keys on each end (out-of-band).
- **IKE (Internet Key Exchange)** over **UDP port 500** negotiates algorithms and keys automatically (the negotiation covers the encryption algorithm, hash for integrity, Diffie-Hellman group and authentication method). ISAKMP/Oakley describe the framework for negotiating, establishing, modifying and deleting security associations.
- Authentication options: **pre-shared key**, **public-key infrastructure** or **certificates**.

## Security associations (SAs)

An **SA** is a **one-way** relationship giving security services to the traffic it carries; two-way communication needs two SAs. It is uniquely identified by the **destination IP address**, the **security protocol** (AH or ESP) and the **SPI**. The security association database stores each SA's parameters: sequence counter, overflow handling, **anti-replay window**, algorithms and keys, lifetime, mode and path MTU. The **security policy database** is an ordered list of rules deciding which packets get which protection.

## Anti-replay

The sender increments a sequence number per packet. The receiver keeps a **sliding window** of recent numbers: anything older than the window is dropped, and any number already seen is dropped. That blocks an attacker who records and resends valid packets.

## VPNs

A **virtual private network** creates a private, secure connection over an untrusted network (the internet), emulating a point-to-point link using secure protocols (IPsec or TLS). Uses: remote employees connecting to the corporate network, and branch offices or partners linked securely, so the VPN logically acts as a WAN link.

## Your task

Implement the sliding-window anti-replay check.
