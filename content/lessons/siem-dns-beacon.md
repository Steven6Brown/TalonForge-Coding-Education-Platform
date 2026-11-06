## What beaconing is

After malware infects a machine it must receive instructions. Many families "call home" to a command-and-control (C2) server on a timer, for example every 60 seconds. Because the interval is so regular, it creates a recognizable pattern in DNS or firewall logs.

## What to look for

- A domain only one or a few hosts query.
- Perfectly regular timing (humans are irregular, machines are not).
- A newly registered or rare domain, or one flagged by threat intelligence.

## Investigating

1. Search DNS events for the suspicious query name.
2. Count events per `host` to find the infected system.
3. Enrich: check domain age and reputation (in real work, with threat-intel tools).
4. Contain: isolate the host with EDR, block the domain, then image the machine for evidence and hunt for the same domain elsewhere.

ATT&CK: **Command and Control**, for example Application Layer Protocol: DNS (T1071.004).
