## Indicators of compromise

**IOCs** are the observable traces of an attack: IP addresses, domains, file hashes, email addresses. Analysts constantly pull them out of reports, logs and emails.

## Regular expressions

A **regex** describes a text pattern. Python's `re` module:

```python
import re
re.findall(r"\d+", "ports 22 and 443")   # ['22', '443']
```

Building blocks:

- `\d` a digit, `\w` a word character, `\b` a word boundary
- `{1,3}` repeat 1 to 3 times, `+` one or more, `?` optional
- `(?: ... )` a group that doesn't capture
- Use **raw strings** (`r"..."`) so backslashes stay intact

## An IPv4 pattern

```python
r"\b(?:\d{1,3}\.){3}\d{1,3}\b"
```

Three groups of 1-3 digits followed by a dot, then a final group. This is a *loose* match: it also accepts 999.999.999.999. For real validation, check each octet <= 255 or use the `ipaddress` module.

## Tips

- `set(items)` removes duplicates, `sorted(...)` orders them.
- Be careful: a complicated regex run against attacker-controlled text can be slow (ReDoS).

## Your task

Extract the unique IPv4 addresses from the report and print them sorted, comma-separated. Feeding these to a firewall or threat-intel tool is exactly how this is used in practice.
