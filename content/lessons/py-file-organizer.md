## Organizing files by type

Almost every cleanup script does the same thing: look at each item, decide a category, act on it. Here you practice the "decide a category" part with a dictionary of lists.

```python
groups = {}
groups.setdefault("pdf", []).append("report.pdf")
```

`setdefault` creates the empty list the first time a key appears. Extensions should be lowercased so `.PDF` and `.pdf` match.

On a real machine you would use `pathlib.Path(...).suffix` and `shutil.move`, with a dry-run flag first.

## Your task

Fill in the loop so files are grouped by lowercase extension.
