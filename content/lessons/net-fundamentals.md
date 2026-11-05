## The path of a request

Type `example.com` into a browser and this happens:

1. **DNS** translates the name into an IP address.
2. Your computer opens a **TCP connection** to that IP on a **port** (443 for HTTPS).
3. The two sides exchange data (HTTP over TLS), then close the connection.

## Addresses and ports

- An **IP address** identifies a host. IPv4 looks like `203.0.113.9`; IPv6 is longer.
- **Private ranges** are used inside networks and are not routable on the internet: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
- A **port** (0-65535) identifies a service on that host: SSH 22, HTTP 80, HTTPS 443, DNS 53.

## TCP and UDP

- **TCP**: connection-oriented, ordered, reliable. Starts with the **three-way handshake**: SYN, SYN-ACK, ACK.
- **UDP**: connectionless, fast, no delivery guarantee (DNS, streaming, VoIP).

## Layers (the short version)

Link (Ethernet/Wi-Fi) → Internet (IP) → Transport (TCP/UDP) → Application (HTTP, DNS, SSH). Problems and attacks happen at every layer, so "which layer?" is the first troubleshooting question.

## Why defenders care

- Port scans probe which services are open.
- DNS logs reveal malware phoning home.
- Unusual outbound connections are often the first sign of compromise.

Try on your own machine: `nslookup example.com`, `ping`, `tracert` (Windows) or `traceroute` (Linux/macOS).

## Check yourself

Take the quiz below.
