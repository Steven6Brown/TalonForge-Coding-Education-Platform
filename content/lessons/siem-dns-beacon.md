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

## Walk-through: finding a beacon in DNS logs

**What DNS logs show.** Every time a computer looks up a name (like `example.com`), a DNS event is recorded with the computer (`host`) and the name asked for (`query`). Normal people look up many different names at irregular times.

**The question:** "Is any machine asking for the same odd name again and again?"

1. **See what is common:** `source=dns | top 5 query`. Popular names are normal. Look for a name you do not recognize that is asked for many times.
2. **Zoom in on that name:** `source=dns query=<the name>`. Read the `_time` column: are the events evenly spaced, like once a minute? Humans are irregular; malware on a timer is not.
3. **Who is asking?** `source=dns query=<the name> | stats count by host`. If only one machine asks, that machine is your suspect.

## Next steps in real life

Check the name's reputation, isolate the machine, collect evidence and search for the name on other machines. The SOC Analyst scenario "periodic DNS queries to a rare domain" walks through it.

## Check yourself

Why is the *regular timing* suspicious? (A machine checking in for instructions runs on a schedule, while human browsing is irregular.)
