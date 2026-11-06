## Exfiltration by volume

**Exfiltration** is attackers stealing data out of a network. Even if the traffic is encrypted, you can often spot it by **volume and destination**: a server that normally sends a few kilobytes suddenly sends gigabytes to an unfamiliar address.

## Searching for it

`source=firewall | stats sum(bytes_out) as total by host | sort -total`

- `sum(bytes_out)` adds the outbound bytes per host.
- `as total` names the new column.
- `sort -total` puts the biggest sender first.

Ask the baseline question: is this normal for this host? A database server should not be the top uploader.

## Next steps in a real incident

Identify the destination, check whether any approved job explains it, declare an incident if not, block the destination, preserve evidence, and notify legal and privacy teams according to your plan. ATT&CK: **Exfiltration** (TA0010).

## Walk-through: spotting a data leak by volume

**What the firewall log holds.** Each firewall event records a connection: which machine (`host`), where it went (`dest_ip`, `dest_port`) and how much data it sent out (`bytes_out`). You do not need to read the data itself: just **how much** left.

**The question:** "Which machine sent far more data out than normal?"

1. **Add up the bytes per machine:** `source=firewall | stats sum(bytes_out) as total by host`. `sum(...)` adds the numbers together, `as total` names the new column, and `by host` does it once per machine.
2. **Rank them:** add `| sort -total` so the biggest sender is on top.
3. **Judge it against normal.** A web server sends lots of data by design. A **database server** should send very little to the outside, so a database at the top is a red flag.
4. **Find where it went:** `source=firewall host=<the suspect> | stats sum(bytes_out) as total by dest_ip | sort -total`. One unfamiliar address receiving most of the data is a strong sign of **exfiltration**.

## Next steps in real life

Check whether an approved job explains it (backups, vendor transfers). If not, declare an incident, block the destination, preserve logs and notify the incident lead and data owner. See the SOC scenario on large outbound transfers.

## Check yourself

Why can you spot exfiltration even when the traffic is encrypted? (Encryption hides the content, but not how much data moved or where it went.)
