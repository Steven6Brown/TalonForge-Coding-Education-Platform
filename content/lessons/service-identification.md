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
