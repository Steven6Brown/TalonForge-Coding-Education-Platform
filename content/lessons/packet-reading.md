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

## Commands you will use in this lab (with examples)

The capture is a plain text list of network packets, one per line. Learn to read one line first:

```
12:00:03 IP 10.0.0.31.51877 > 10.0.0.1.53: A? some-name.example
```

From the left: the **time**, the word `IP`, the **source** (who sent it), `>`, the **destination**, then what the packet says (`A?` means a DNS question: "what is the address of this name?"). Each address ends with a **port** after the last dot, so `10.0.0.31.51877` is address `10.0.0.31` using port `51877`. (This is just an example format; read the real lines in your capture.)

- `cat ~/capture.txt` shows all packets.
- `grep evil-c2 ~/capture.txt` shows only the lines mentioning that name. You will find a **DNS query**: a computer asking "what is the address of evil-c2.example?".
- The computer that **asked** is the source of that query line. Remember to drop the port (the last number) when you submit the address.
