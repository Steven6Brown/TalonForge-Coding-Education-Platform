## From a scan result to a to-do list

A port scan of your own systems gives a list of open ports. The valuable part is what you do next: for each port decide *should this be open?* and *is it protected properly?*

## Triage questions

1. **Is the service needed?** If not, disable it.
2. **Is it encrypted?** Clear-text services (Telnet 23, FTP 21, HTTP 80, POP3 110, IMAP 143, SNMPv1/v2c 161, LDAP 389, TFTP 69) should be replaced by encrypted versions.
3. **Who can reach it?** Databases (1433, 3306, 5432, 27017, 6379), SMB (445), RDP (3389) and management consoles should be reachable only from specific internal hosts or through a VPN, never from the whole internet.
4. **Is the software patched and authenticated?**

## Safer replacements

| Risky | Replace with |
| --- | --- |
| Telnet 23 | SSH 22 |
| FTP 21 | SFTP (22) or FTPS |
| HTTP 80 | HTTPS 443 (redirect + HSTS) |
| POP3 110 / IMAP 143 | POP3S 995 / IMAPS 993 |
| LDAP 389 | LDAPS 636 |
| SNMPv1/v2c | SNMPv3 |
| Exposed RDP 3389 | RDP behind a VPN/gateway with MFA |

## Your task

Write `auditPorts` that looks up each open port in a table of risky services and returns a readable finding for each. You'll use an object as a lookup table, a loop and `push`.
