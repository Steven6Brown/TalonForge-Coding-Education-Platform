## Text tools you'll use daily

| Tool | Meaning | Example |
| --- | --- | --- |
| `text.split()` | list of words | `"a b".split()` → `["a", "b"]` |
| `text.split(",")` | split on a character | |
| `text.strip()` | remove surrounding spaces | |
| `text.lower()` / `.upper()` | change case | |
| `text.startswith("x")` | true/false | |
| `"x" in text` | does it contain x? | |
| `text[0:4]` | slice: first four characters | |
| `",".join(items)` | glue a list into text | |

## Functions

```
def extract_ip(line):
    parts = line.split()
    return parts[parts.index("from") + 1]
```

Functions give a piece of logic a name so you can reuse and test it. Keep each function small, make sure it **returns** its answer, and give it a clear name.

## Common errors

- `IndexError`: you asked for a position past the end of a list.
- `ValueError: 'from' is not in list`: `.index()` raises an error when the word isn't there. Check with `if "from" in parts:` first when the data may be messy.

## Your task

Finish `extract_ip` so it returns the address after `from`.
