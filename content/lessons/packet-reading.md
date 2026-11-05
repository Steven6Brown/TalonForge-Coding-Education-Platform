## Packet captures

Tools like **tcpdump** and **Wireshark** record traffic. Even plain-text summaries tell a story. A tcpdump-style line looks like:

```
12:00:03 IP 10.0.0.31.51877 > 10.0.0.1.53: A? evil-c2.example
```

Read it as: *at 12:00:03, host 10.0.0.31 (source port 51877) sent to 10.0.0.1 port 53 (DNS) a query for the A record of evil-c2.example.*

The format is `source.port > destination.port: details`. Note that in this notation the **last number after the final dot** is the port.

## Useful patterns

- **DNS queries** (port 53) reveal what hosts are trying to reach, including malware command-and-control (C2) domains.
- `Flags [S]` is a TCP SYN: the start of a new connection.
- A host that queries a domain and then immediately connects to the answer IP is following the answer.

## Real tools

```
sudo tcpdump -i eth0 port 53        # live DNS traffic
sudo tcpdump -r capture.pcap        # read a saved capture
```

Wireshark adds a graphical view and follow-stream. Capture only on networks you own or have authorization to monitor.

## Your task

Use `grep` on `~/capture.txt` to find the host that asked for the suspicious domain. Submit its IP.
