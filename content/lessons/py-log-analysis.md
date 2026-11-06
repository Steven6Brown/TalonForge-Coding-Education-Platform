## Start here

**Before this lesson:** Python Foundations (loops, dictionaries, strings) and ideally the Linux shell lesson on pipes.

## What is a log?

A **log** is a file where a computer writes down what happens, one event per line. The SSH service writes a line every time someone tries to sign in. A failed attempt looks like this:

```
Jan 12 03:14:07 forge sshd[1]: Failed password for root from 203.0.113.9 port 22 ssh2
```

Reading it: the time, the computer name (`forge`), the program (`sshd`), and the message: someone tried the password for user `root` **from** the address `203.0.113.9`.

If one address fails hundreds of times, it is probably guessing passwords (a brute-force attack). Your job in this lab is to find that address automatically.

## The approach in four small steps

1. **Split** each line into words: `parts = line.split()` gives a list.
2. **Find the address:** it is the word right after the word `from`. `parts.index("from")` tells you where `from` is, and adding 1 gives the next position.
3. **Count** with a `Counter` (a dictionary built for counting): `counts[ip] += 1`.
4. **Pick the winner:** `counts.most_common(1)` returns the biggest as a pair like `[("203.0.113.9", 14)]`.

Only count the lines that contain `Failed password`, otherwise successful logins get mixed in.

## Tip

Test each step with `print(...)` on a single line before putting it in the loop.

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
