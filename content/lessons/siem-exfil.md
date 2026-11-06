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
