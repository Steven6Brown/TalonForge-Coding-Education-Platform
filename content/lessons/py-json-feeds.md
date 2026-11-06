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
