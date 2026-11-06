## What a port is

An IP address identifies a **computer**; a **port** (0-65535) identifies a **service** on it, like an apartment number in a building. A connection is defined by source IP:port and destination IP:port.

## TCP and UDP

- **TCP:** connection-oriented, ordered, reliable (web, SSH, email, databases).
- **UDP:** connectionless, fast, no delivery guarantee (DNS queries, DHCP, streaming, syslog, VPNs).

## Port ranges

- **0-1023: well-known** ports for standard services.
- **1024-49151: registered** ports for specific applications.
- **49152-65535: dynamic/ephemeral**, picked by your computer for outgoing connections.

## The ones to memorize first

| Port | Service | Notes |
| --- | --- | --- |
| 20/21 | FTP | clear text; use SFTP/FTPS |
| 22 | SSH / SFTP | encrypted remote login |
| 23 | Telnet | clear text; replace with SSH |
| 25 | SMTP | server-to-server mail |
| 53 | DNS | names to IPs (UDP and TCP) |
| 67/68 | DHCP | addresses for clients |
| 80 | HTTP | clear-text web |
| 110 | POP3 | clear text; POP3S is 995 |
| 123 | NTP | time |
| 143 | IMAP | clear text; IMAPS is 993 |
| 161 | SNMP | device monitoring |
| 389 | LDAP | directory; LDAPS is 636 |
| 443 | HTTPS | encrypted web |
| 445 | SMB | Windows file sharing |
| 587 | SMTP submission | clients send mail |
| 3306 | MySQL | database |
| 3389 | RDP | Windows Remote Desktop |

## How defenders use this

Seeing an unexpected open port means a service is listening that someone must own, patch and justify. Clear-text services (Telnet, FTP, HTTP, POP3, IMAP, SNMPv1/2) are findings; databases and SMB exposed to the internet are urgent.

## Practice with the Ports reference

The **Tools → Ports reference** page has a searchable table (with security notes for each port) and a **flashcard quiz** that asks both directions: port to service and service to port. Do a few rounds until the common ones are automatic.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **The big three to memorize first:** **SSH is 22, HTTP is 80, HTTPS is 443.** They appear in almost every scan.
- **DNS is port 53.** It uses UDP for most queries and TCP for large replies and zone transfers.
- **Databases must not face the internet.** MySQL (3306), PostgreSQL (5432), SQL Server (1433), MongoDB (27017) and Redis (6379) should **never** be exposed to the internet. They should be reachable only from the application servers that need them (use firewall rules and private networks).
