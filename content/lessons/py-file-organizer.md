## Start here

Cleaning up a folder is the classic first automation. Every cleanup script does the same three things: **look** at each file, **decide** which group it belongs to, then **act**. In this lab you practice the middle part, the deciding, by sorting file names into groups by their extension. (We only print the groups, so nothing on your computer is touched.)

**What you need to know first:** variables, lists, `for` loops and dictionaries. These are in the Python Foundations track, lesson "Lists, Loops and Dictionaries".

## Idea 1: a file name has an extension

In `report.pdf` the part after the last dot, `pdf`, is the **extension**. It tells you the type of file. Python can split text at a dot:

```python
name = "scan.PDF"
parts = name.rsplit(".", 1)   # split ONCE from the right: ["scan", "PDF"]
ext = parts[1].lower()        # "pdf"
```

- `rsplit(".", 1)` splits at the **last** dot only. That matters for names like `my.report.final.pdf`.
- `.lower()` makes it lowercase, so `PDF` and `pdf` are treated as the same type.

## Idea 2: a dictionary of lists

We want a result like `{"pdf": ["report.pdf", "budget.pdf"], "png": ["photo.png"]}`: each extension points to a **list** of files.

```python
groups = {}
groups.setdefault("pdf", []).append("report.pdf")
groups.setdefault("pdf", []).append("budget.pdf")
print(groups)   # {'pdf': ['report.pdf', 'budget.pdf']}
```

`setdefault(key, [])` means: "if this key is not in the dictionary yet, create it with an empty list, then give me the list". `.append(...)` then adds an item to it. Without `setdefault` you would have to check `if ext not in groups` each time.

## Your plan

1. Inside the loop, compute `ext` from `name` (Idea 1).
2. Add the file to `groups[ext]` (Idea 2).
3. Delete the `pass` line (it was a placeholder that does nothing).
4. Run it. The last line of the starter prints `ext:count` pairs sorted by extension.

## Common mistakes

- Forgetting `.lower()`: `scan.PDF` becomes its own group.
- Using `split(".")` on a name with several dots: you get the wrong piece.
- Forgetting that indentation matters: the code inside the loop must be indented.

## In real life

You would use the `pathlib` and `shutil` modules to actually move files, with a **dry-run** flag first (print the plan, then do it). The grouping logic you wrote here stays exactly the same.
