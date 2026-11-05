## Why Python?

Python reads like English, has a library for everything (networking, crypto, parsing, web), and is the default language for security scripting, automation and quick exploits.

Your code runs **in your browser** (via WebAssembly). The first run downloads the Python engine (~10 MB) once; after that it's fast.

## The 5 building blocks

```python
name = "student"          # variable (string)
ports = [22, 80, 443]     # list
age = 25                  # integer

for p in ports:           # loop
    if p < 100:           # condition
        print(p, "is a low port")
    else:
        print(p, "is higher")
```

- **Indentation matters.** The 4 spaces define what's inside the loop or `if`.
- `print()` shows output; lines starting with `#` are comments.
- `+=` adds to a variable: `count += 1`.

## Ports, briefly

Ports 0-1023 are **well-known ports** (SSH 22, HTTP 80, HTTPS 443, DNS 53). Anything exposed on those is usually an intentional service, so scanners care about them first.

## Your task

The list in the editor has some ports. Count how many are below 1024 and print the number. Press **Run**; when the output matches, the lab passes.

> Stuck? Use the hint button. Struggling a bit is how it sticks.
