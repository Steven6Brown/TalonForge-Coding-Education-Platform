## Start here

Most data you will automate arrives as **CSV** (rows and columns, like a spreadsheet saved as text) or **JSON** (nested data, used by web services). This lab uses CSV: you total up spending per category and find the biggest.

**What you need first:** lists, loops, dictionaries and f-strings (Python Foundations track).

## What CSV looks like

```
date,category,amount
2026-01-03,hosting,20.00
2026-01-05,tools,15.50
```

The first line is the **header** (column names). Each other line is a **row**, with values separated by commas. Important: **every value is text**, even `20.00`. Before doing maths you must convert it with `float("20.00")`.

## Reading it with csv.DictReader

```python
import csv, io
for row in csv.DictReader(io.StringIO(DATA)):
    print(row["category"], row["amount"])
```

- `io.StringIO(DATA)` lets Python treat a piece of text like a file. (With a real file you would write `open("spend.csv")` instead.)
- `csv.DictReader` gives you one **dictionary per row**, keyed by the header names. So `row["category"]` is `"hosting"`.

## Adding up per category

A dictionary of running totals is the standard pattern:

```python
totals = {}
totals["hosting"] = totals.get("hosting", 0) + 20.0
```

`totals.get("hosting", 0)` means "the current total, or 0 if there is none yet". Add the new amount and store it back.

## Finding the biggest

`max(totals, key=totals.get)` returns the **key** whose value is largest. The starter already does this and prints it with two decimals using `{value:.2f}`.

## Your plan

1. Inside the loop save `cat = row["category"]`.
2. Update `totals[cat]` as shown above, converting the amount with `float(...)`.
3. Delete `pass` and run. Check the answer by adding the hosting amounts yourself (20 + 20 = 40).

## About JSON

`json.loads(text)` turns JSON text into Python lists and dictionaries; `json.dumps(data)` turns data back into text. You will use it in the Python Security track and in the AI lessons.

## Real-world safety

Treat input files as **untrusted**: check that the columns exist and skip or report bad rows instead of crashing. For real money use `decimal.Decimal`, because floating-point numbers round slightly (0.1 + 0.2 is not exactly 0.3).
