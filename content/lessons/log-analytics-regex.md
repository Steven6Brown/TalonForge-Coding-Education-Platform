## Logs tell the story

Security teams collect logs from servers, firewalls and applications into a **SIEM** such as Splunk, then search them. The same ideas work in a script: extract fields, filter, count, rank.

## Web server access log lines

```
10.0.0.9 - - [12/Jan/2026:03:10:02] "GET /admin HTTP/1.1" 404 120
```

Fields: client IP, timestamp, request (method, path, protocol), status code, response size.

- **200s** success, **301/302** redirects, **403** forbidden, **404** not found, **500s** server errors.
- Many 404s from one client for different paths looks like **directory probing**; many 401/403s may mean someone is guessing credentials.

## Regex with capture groups

```python
import re
m = re.search(r'"(?:GET|POST) (\S+) HTTP/\d\.\d" (\d{3})', line)
if m:
    path, status = m.group(1), m.group(2)
```

- `(...)` captures; `(?:...)` groups without capturing.
- `\S+` is one or more non-space characters; `\d{3}` is exactly three digits.
- Always check `m` is not `None` before using it.

## Counting

`collections.Counter` counts items; `.most_common(1)` returns the top one.

## Your task

Count 404s per path in the sample log and print the top path and its count.
