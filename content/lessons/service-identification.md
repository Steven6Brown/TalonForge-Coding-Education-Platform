## Know what you run

An accurate inventory of **live hosts** and the **services** they expose is the foundation of defense. Unknown devices, forgotten test servers and unexpected open ports are common sources of breaches.

## Discovery and identification

- **Host discovery:** which addresses respond (ping sweeps, ARP on the local network).
- **Port scanning:** which TCP/UDP ports accept connections. Results are *open*, *closed* or *filtered* (a firewall is dropping the probes).
- **Service and version detection:** what software answers on each port (from banners and behavior), which maps to known vulnerabilities and patch status.

## Using the results (defender's view)

1. Compare findings to the asset inventory: anything unexpected is investigated.
2. Close or restrict ports that need not be exposed.
3. Patch outdated versions; replace insecure protocols (Telnet, FTP) with encrypted ones.
4. Re-scan after changes, and on a schedule.

## Rules of the road

Scan only networks you own or are authorized in writing to test, ideally with maintenance windows for fragile devices. You can practice the workflow in this app's Kali-style lab (simulated) or in your own isolated VM network.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Why identify service versions?** Software versions map to **known vulnerabilities and patch needs**. Learning that a server runs "Apache 2.4.49" lets you look up published advisories for exactly that version and decide whether it needs patching.
- **Authorization before scanning.** Scanning a network you do not own **without permission can be illegal** and can disrupt fragile devices (printers, medical equipment). You need **written authorization that defines the scope** (which addresses, what times, what techniques) before any scan.

## Worked example: from a scan result to a decision (defender's view)

You scan **your own** server (with written permission) and see:

```
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 7.4
80/tcp   open   http     Apache httpd 2.4.49
3306/tcp open   mysql    MySQL 5.5.60
```

Read each line as: *this port is open, running this service, this version.*

**Why the version matters.** A version maps to known vulnerabilities and patches. Search a vulnerability database for "Apache 2.4.49" and you find advisories: it has a serious known flaw, so it needs patching urgently. OpenSSH 7.4 and MySQL 5.5 are also old and should be reviewed.

**A decision per row:**

| Port | Needed? | Exposure | Action |
| --- | --- | --- | --- |
| 22 | Yes | Reachable from anywhere? | Restrict to admin addresses, use keys |
| 80 | Yes | Public | Patch Apache, redirect to HTTPS |
| 3306 | Only for the app | Should be internal | Block from the internet, bind to localhost |

## Authorization comes first

Scanning a network you do not own, **without written authorization defining the scope**, can be illegal and can disrupt fragile devices such as printers and medical equipment. Always get the scope in writing: addresses, times and methods.

## Self-check

1. Why identify versions? (To map them to known vulnerabilities and patch needs.)
2. What do you need before scanning someone else's network? (Written authorization that defines the scope.)
3. Should a database port be reachable from the internet? (No.)
