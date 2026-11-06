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

## Walk-through: building the IP pattern in small steps

Test each piece in the editor with `print(re.findall(pattern, text))` before adding the next.

**1. One or more digits.** `r"\d+"` finds runs of digits.

```python
import re
print(re.findall(r"\d+", "ports 22 and 443"))
```

Output: `['22', '443']`.

**2. One to three digits.** An IP segment (octet) has at most three digits: `r"\d{1,3}"`. `{1,3}` means "between 1 and 3 times".

**3. A dot.** A plain `.` in a regex means "any character", so to match a real dot write `\.` (backslash first).

**4. One group plus a dot, three times, then a last group.**

```python
pattern = r"\b(?:\d{1,3}\.){3}\d{1,3}\b"
text = "Host 10.1.1.5 and 10.1.1.5 again"
print(re.findall(pattern, text))
```

Output: `['10.1.1.5', '10.1.1.5']`. `(?:\d{1,3}\.){3}` means "a 1-3 digit number followed by a dot, exactly three times". Then `\d{1,3}` is the last number. `\b` marks a word edge so you do not match inside a longer number. `(?: ... )` groups without capturing, which keeps `findall` returning whole matches.

**5. Remove duplicates, sort, join.**

```python
ips = re.findall(pattern, text)
print(",".join(sorted(set(ips))))
```

Output: `10.1.1.5`. `set` removes repeated items, `sorted` puts them in order, `",".join(...)` glues them with commas.

## If something goes wrong

- Empty list: your pattern did not match. Test on a tiny string first. Check you wrote `\.` and not `.`.
- Pieces of numbers returned instead of whole addresses: you used a normal `( )` group; use `(?: )`.
- A warning about invalid escape sequences: you forgot the `r` before the quotes.

## Check yourself

What does `r"\d{1,3}"` match in `"port 8080"`? (`808` then `0`: it takes up to three digits at a time.)
