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

## Walk-through: try these in the editor

**1. Split text into words**

```python
line = "Failed password for root from 203.0.113.9 port 22"
parts = line.split()
print(parts)
print(len(parts))
```

Output: a list of the words, then `8`. `split()` with no argument cuts at spaces. Now each word has a position: `parts[0]` is `Failed`.

**2. Find a word's position**

```python
i = parts.index("from")
print(i)
print(parts[i + 1])
```

Output: `4` then `203.0.113.9`. `.index("from")` tells you where `from` is. The address is the very next word, so add 1.

**3. A function that returns it**

```python
def extract_ip(line):
    parts = line.split()
    return parts[parts.index("from") + 1]

print(extract_ip(line))
```

Output: `203.0.113.9`. `def name(parameter):` defines the function (the colon and indentation again). `return` hands the answer back. Calling `extract_ip(line)` runs it.

**4. Other tools**

```python
print("  hi  ".strip())
print("ABC".lower())
print("admin" in "the admin user")
print(",".join(["a", "b"]))
```

Output: `hi`, `abc`, `True`, `a,b`.

## If something goes wrong

- `ValueError: 'from' is not in list`: that line has no `from`. Check first: `if "from" in parts:`.
- `IndentationError`: the function body must be indented.
- Function prints `None`: you printed inside the function but never used `return`.

## Check yourself

What does `"a-b-c".split("-")` give? (`['a', 'b', 'c']`.)
