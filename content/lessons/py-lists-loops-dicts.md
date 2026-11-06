## Collections

- **List:** ordered items `[1, 2, 3]`. Index from 0. Add with `.append(x)`.
- **Dictionary:** key/value pairs `{"role": "admin"}`. Look up by key. Keys are unique.
- **Set:** unique items `{1, 2, 3}` (no duplicates, no order). `set(items)` removes duplicates.
- **Tuple:** like a list but fixed `(10, 20)`.

## Loops

```
for item in items:        # every item
    ...
for i in range(5):        # 0, 1, 2, 3, 4
    ...
while condition:          # repeat while true
    ...
```

`break` leaves the loop; `continue` skips to the next item.

## Counting is everywhere in security

Failed logins per IP, requests per path, ports per host: all use the dictionary counting pattern:

```
counts[key] = counts.get(key, 0) + 1
```

(`collections.Counter` does the same in one line, but writing it by hand first shows you what it's doing.)

## Your task

Count the words in a list and print how many times `admin` appears.

## Walk-through: try these in the editor

**1. A list**

```python
ports = [22, 80, 443]
ports.append(8080)
print(ports)
print(ports[0], len(ports))
```

Output: `[22, 80, 443, 8080]` then `22 4`. Positions start at 0. `.append(x)` adds to the end and `len(...)` counts the items.

**2. A loop over a list**

```python
for p in ports:
    print("port", p)
```

Prints one line per item. Remember the colon and the indentation.

**3. A dictionary**

```python
user = {"name": "Ana", "role": "admin"}
print(user["role"])
user["team"] = "blue"
print(user)
```

Output: `admin` then `{'name': 'Ana', 'role': 'admin', 'team': 'blue'}`. Look up by key; assigning to a new key adds it.

**4. Counting words (the pattern you need)**

```python
words = ["admin", "guest", "admin"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)
print(counts["admin"])
```

Output: `{'admin': 2, 'guest': 1}` then `2`. `counts.get(w, 0)` means "the current count for `w`, or 0 if it is not there yet". Add 1 and store it back. Walk through it on paper: first `admin` makes it 1, `guest` makes it 1, the second `admin` makes it 2.

## If something goes wrong

- `KeyError: 'admin'`: you asked for a key that is not in the dictionary. Use `counts.get("admin", 0)` to get a default instead.
- `IndexError: list index out of range`: the position does not exist (remember the last position is `len(list) - 1`).
- Counts too low or all 1: you assigned `counts[w] = 1` instead of adding to the previous value.

## Check yourself

What does `len({"a": 1, "b": 2})` give? (`2`: the number of keys.)
