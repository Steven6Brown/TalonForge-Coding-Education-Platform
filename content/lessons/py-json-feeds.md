## Start here

**Before this lesson:** Python Foundations (lists, loops, dictionaries). This lesson also builds on "Python Basics for Hackers".

## What is JSON and why does it matter?

**JSON** is a text format for structured data. Web services, security tools and threat-intelligence feeds use it to send information to each other. A tiny example:

```
[{"id": "T-101", "severity": 9}, {"id": "T-102", "severity": 4}]
```

Read it like Python: square brackets `[ ]` are a list, curly braces `{ }` are a dictionary of `"name": value` pairs. The text itself is only characters. To use it you must **parse** it: turn the text into real Python objects with `json.loads(text)` (think "load from string").

After parsing, `items[0]["id"]` is `"T-101"` and `items[0]["severity"]` is `9`.

## Picking out the urgent ones

A **list comprehension** builds a new list in one line:

```python
urgent = [i["id"] for i in items if i["severity"] >= 7]
```

Read it aloud: "the id of every item in items, if its severity is at least 7". It is the same as a loop that appends, just shorter.

## Your plan

1. Replace the empty `items` with `json.loads(FEED)`.
2. Build `urgent` with the comprehension above.
3. Run. Expect two ids, in the original order.

## JSON everywhere

Threat-intelligence feeds, cloud APIs and SIEM exports commonly use **JSON**. Python's `json` module converts between text and Python objects.

```python
import json
data = json.loads('[{"id": "T-1", "severity": 9}]')   # text -> list of dicts
text = json.dumps(data)                               # Python -> text
```

JSON objects become dicts, arrays become lists, and `null` becomes `None`.

## Filter with comprehensions

```python
urgent = [i["id"] for i in data if i["severity"] >= 7]
```

## Treat feeds as untrusted

Data from outside can be malformed or missing fields:

- Wrap parsing in `try/except json.JSONDecodeError`.
- Use `i.get("severity", 0)` instead of `i["severity"]` when a key may be absent.
- Validate types before using values.

## Your task

Parse the feed and print the ids of indicators with severity 7 or higher, comma-separated.
