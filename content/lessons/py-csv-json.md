## Reports from raw data

CSV and JSON are the two formats automation touches most.

```python
import csv, io, json
rows = list(csv.DictReader(io.StringIO(text)))   # list of dicts
data = json.loads('{"a": 1}')
```

Aggregate with a dictionary: `totals[key] = totals.get(key, 0) + value`. Convert strings with `float()`; for real money use `decimal.Decimal`.

Treat input files as untrusted: validate columns and handle bad rows instead of crashing.

## Your task

Total the amount per category and print the biggest one.
