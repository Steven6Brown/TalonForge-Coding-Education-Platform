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
