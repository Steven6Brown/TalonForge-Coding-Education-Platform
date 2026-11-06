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

## Walk-through: from a log line to a count

Take one line:

```
10.0.0.9 - - [12/Jan/2026:03:10:02] "GET /admin HTTP/1.1" 404 120
```

**Step 1: spot what you want.** You want the **path** (`/admin`) and the **status code** (`404`). Both sit around the quoted request.

**Step 2: describe it with a pattern.**

```python
pattern = r'"(?:GET|POST) (\S+) HTTP/\d\.\d" (\d{3})'
```

Read it left to right: a quote, then `GET` or `POST` (not captured), a space, then **one or more non-space characters** (captured: the path), ` HTTP/1.1` (a digit, a dot, a digit), a closing quote, a space, and **exactly three digits** (captured: the status).

**Step 3: apply it to a line.**

```python
m = re.search(pattern, line)
print(m.group(1), m.group(2))
```

Output: `/admin 404`. `group(1)` is the first captured part and `group(2)` the second.

**Step 4: skip lines that do not match.** `re.search` returns `None` when nothing matches, and calling `.group` on `None` crashes. Always check `if m:` first.

**Step 5: count.**

```python
if m and m.group(2) == "404":
    not_found[m.group(1)] += 1
```

`not_found` is a `Counter`, so adding to a path that is new just works. After the loop, `not_found.most_common(1)[0]` is the top path and its count, which the starter code already prints.

## Why analysts care

Many 404s from one address, for different paths such as `/admin`, `/wp-login.php` and `/backup.zip`, is someone **probing for hidden pages**. This small script is a real detection.

## If something goes wrong

- `AttributeError: 'NoneType' object has no attribute 'group'`: you used `m.group` on a line with no match. Check `if m`.
- Count looks too high: you counted every status, not only `"404"` (the status is **text**, so compare with `"404"` in quotes).

## Check yourself

What would `m.group(2)` be for the line with `200 512` at the end? (`"200"`.)
