## Recon: know the target

Most attacks (and most defenses) start with **reconnaissance**: building a map of what exists.

- **Passive recon:** gathering info without touching the target (DNS records, certificate transparency, public job posts, GitHub).
- **Active recon:** probing the target directly (ping sweeps, port scans). Requires authorization.

## Port scanning with nmap

On networks you own or are authorized to test:

```
nmap -sV 10.10.10.0/29      # discover hosts, detect service versions
nmap -p- 10.10.10.4          # all 65535 ports on one host
```

Typical output lists each host, then `PORT STATE SERVICE` rows.

## Reading results like a defender

Ask of every open port: *Should this be exposed? Is the service current? Is it encrypted? Is there a safer alternative?*

Red flags:
- **23/tcp telnet** - plaintext logins; replace with SSH
- **21/tcp FTP** - plaintext; use SFTP
- **445/tcp SMB** exposed beyond the LAN
- **3389/tcp RDP** exposed to the internet
- Old versions with known CVEs

## Your task

Your lab scan results are saved at `~/scans/lab-scan.txt`. Use `cat` and `grep` to find which host exposes Telnet and submit its IP. In a real report this would be a high-severity finding with the fix "disable telnet; use SSH".

## Commands you will use in this lab (with examples)

A **scan report** lists, for each machine, which network **ports** are open and what service is listening. You are given the saved output of a scan as a text file (no scanning happens here). Your job is to read it.

- `cat ~/scans/lab-scan.txt` prints the whole file. Read the structure first: each machine has a header line such as `Scan report for 10.0.0.12`, followed by lines like `23/tcp open telnet`.
- `grep -n telnet ~/scans/lab-scan.txt` shows only the lines containing `telnet`, and `-n` adds their **line numbers**. The machine is not on that line: it is the `Scan report for` line *above* it. Note the line number `grep -n` shows (say 15), then scroll up in the `cat` output to the nearest `Scan report for` line above line 15. That header names the host. (`grep -n 'Scan report' file` lists every host header with its line number, so you can see which one sits just above your Telnet line.)
- **Why Telnet matters:** port 23 sends everything, including passwords, in plain text and is almost never needed today. An open Telnet port on a device is a finding to report. (Port numbers: see the Ports lesson and the Tools page.)
