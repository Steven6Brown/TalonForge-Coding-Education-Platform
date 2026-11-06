## Start here if you have never programmed

If this is your very first time writing code, do the **Python Foundations** track first (it starts with "Your First Python Program"). Everything below assumes you know what a variable and a loop are. If you already do, carry on.

## How to run code here

1. Type or edit code in the box.
2. Press **Run**. The result appears in the output area under the editor.
3. Read the output and compare it with what the task asked for.

The first run downloads the Python engine (about 10 MB) once, so it may take a few seconds.

## Reading the example line by line

```python
ports = [22, 80, 443]     # a list of numbers
for p in ports:           # do the indented lines once for each port
    if p < 100:           # only when this is true
        print(p, "is a low port")
```

- `for p in ports:` means "take each item of the list in turn and call it `p`".
- The **indented** lines belong to the loop. Python uses indentation (4 spaces) the way other languages use braces. Wrong indentation is an error.
- `if p < 100:` runs the indented lines only for ports under 100. `else:` covers everything else.

## What you are being asked to do

Count how many ports are below 1024. A count needs a starting variable, then add one each time the test is true:

```python
count = 0
for p in ports:
    if p < 1024:
        count += 1
print(count)
```

Try writing it yourself first. If you get stuck, compare with this pattern: **start at 0, loop, test, add one, print at the end.** It is the most common beginner pattern in all of programming.

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
