## Python, from zero

Python reads almost like English, which makes it the best first language for security: automation, log analysis, network tools and most hacking scripts are written in it.

## How these labs work

Every lab explains each idea before you use it (**Before you start**), gives a numbered **plan**, lets you **load an example** to experiment with, and explains errors in plain English. The editor only accepts Python; lines starting with `#` are notes.

## Two rules unique to Python

1. **Indentation matters.** Python groups code by how far it is indented (4 spaces). That replaces the curly braces other languages use.
2. **Colons end headers.** Lines that start a block (`for`, `if`, `def`) end with `:`.

## Why Python for security?

Its standard library handles files, text, hashing, networking and JSON out of the box, and security tools (Scapy, Impacket, pwntools, requests) are mostly Python.

## Your task

Use two variables to print a sentence with an f-string.

## Walk-through: try these in the editor

**1. Print and variables**

```python
name = "student"
count = 3
print(name)
print(count)
```

Output: `student` then `3`. `name = "student"` stores text in a variable. Text goes in quotes; numbers do not. `print(...)` shows a value.

**2. f-strings: put values inside text**

```python
name = "student"
count = 3
print(f"{name} failed {count} logins")
```

Output: `student failed 3 logins`. The `f` before the opening quote turns on the feature, and each `{...}` is replaced by the value of what is inside.

**3. Maths and comments**

```python
total = 4 + 5 * 2   # multiplication happens first
print(total)
```

Output: `14`. Everything after `#` is a note for humans and is ignored.

**4. Your first indented block**

```python
for n in [1, 2, 3]:
    print("number", n)
print("done")
```

Output: `number 1`, `number 2`, `number 3`, then `done`. The indented line runs once per item. The unindented `print("done")` runs once at the end. The **4 spaces** are not decoration: they tell Python which lines belong to the loop.

## If something goes wrong

- `IndentationError: expected an indented block`: the line after a `:` is not indented.
- `NameError: name 'x' is not defined`: you used a variable before creating it, or misspelled it.
- `SyntaxError`: a missing quote, bracket or colon. Look at the line number in the message and the line before it.

## Check yourself

What does `print(f"{2 + 3} items")` print? (`5 items`: Python calculates inside the braces.)
