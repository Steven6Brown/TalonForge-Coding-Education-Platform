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

## Key facts this lesson's quiz checks

- **The TCP three-way handshake** is how two computers open a reliable connection: the client sends **SYN** ("let's talk"), the server replies **SYN-ACK** ("OK, and I'm ready too"), and the client finishes with **ACK** ("got it"). A port scanner can send just the SYN and watch for a SYN-ACK to learn that a port is open, without completing the handshake (a "SYN scan").

## Walk-through: follow one request

Say you type `example.com` and press Enter. In order:

1. **DNS lookup.** Your computer asks a DNS server: "what is the address of example.com?" It answers with something like `93.184.216.34`. (DNS is the internet's phone book.)
2. **Connect.** Your computer opens a connection to `93.184.216.34` on **port 443** (HTTPS) with the three-way handshake: you say SYN, it says SYN-ACK, you say ACK.
3. **Secure it.** Your computer and the server agree on encryption (TLS).
4. **Ask and answer.** Your browser sends `GET /` and the server sends back the page.
5. **Close.**

## Make the network show you

Open a command prompt (Windows) or terminal and try:

```
nslookup example.com
```

Prints the name server it asked and the addresses it got back: step 1 made visible.

```
ping example.com
```

Sends a few small test messages and shows the reply time in milliseconds: a quick "is it reachable?" check. (Some servers block ping, so no reply does not always mean it is down.)

```
tracert example.com     (Windows)     traceroute example.com   (Linux/macOS)
```

Lists each router your traffic passes through on the way. It shows the path your data takes.

## Reading an address and port together

`10.0.0.5:443` means: the machine at `10.0.0.5`, service on port `443`. The address finds the machine; the port finds the program on it. `10.x.x.x`, `172.16-31.x.x` and `192.168.x.x` are **private** addresses used inside homes and offices.

## Where problems show up

| Symptom | Layer to check first |
| --- | --- |
| Cable unplugged or no Wi-Fi | Link |
| `169.254.x.x` address | IP configuration (DHCP failed) |
| Ping by IP works, by name fails | DNS |
| Page times out only on one port | Firewall or the service itself |

## Check yourself

Name the two parts needed to reach a service. (An IP address to find the machine, and a port to find the service on it.)
