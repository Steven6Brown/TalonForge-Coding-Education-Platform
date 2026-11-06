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
