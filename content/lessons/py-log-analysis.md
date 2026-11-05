## From the shell to a script

In the shell lesson you chained `grep | cut | sort | uniq`. Python does the same job but is reusable, testable and can feed alerts, dashboards or firewalls.

## Tools you need

```python
line = "Jan 12 03:14:07 forge sshd[1]: Failed password for root from 203.0.113.9 port 22 ssh2"
parts = line.split()             # list of words
i = parts.index("from")          # position of 'from'
ip = parts[i + 1]                # the next word -> '203.0.113.9'
```

`collections.Counter` counts things:

```python
from collections import Counter
c = Counter()
c["a"] += 1
c["a"] += 1
c.most_common(1)                 # [('a', 2)]
```

## Parsing rules of thumb

- **Don't trust the format.** Logs get odd lines; real parsers use `try/except` or regular expressions (`re` module).
- Filter first (`if "Failed password" in line`), then extract.
- Treat log content as **untrusted input**: attackers control usernames and request paths, which can contain surprising text.

## Your task

The editor holds the same fake auth log from the shell lab. Count failed attempts per IP and print the worst offender. Later you could extend this to auto-generate a firewall block list (carefully!).
