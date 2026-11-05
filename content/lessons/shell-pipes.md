## Small tools, big answers

The Unix philosophy: each tool does one thing well, and you connect them with the **pipe** `|`, which feeds one command's output into the next command's input.

```
cat file.txt | grep error | sort | uniq -c
```

## The toolbox

- `grep pattern file` - keep lines that match. Useful flags: `-i` ignore case, `-v` invert, `-n` line numbers, `-c` count, `-o` print only the matching part, `-r` search folders.
- `cut -d' ' -f3` - split lines on a delimiter and keep field 3.
- `sort` - sort lines (`-n` numeric, `-r` reverse).
- `uniq -c` - collapse **adjacent** duplicates and count them (so always `sort` first!).
- `head -n 5` / `tail -n 5` - first/last lines.
- `wc -l` - count lines.

## A worked example

"How many times does each user appear in the log?"

```
grep 'Failed' log.txt | cut -d' ' -f9 | sort | uniq -c | sort -rn
```

Read it left to right as a sentence: *find failures, take the 9th field, sort, count duplicates, sort by count descending.*

## Redirects

`>` writes output to a file, `>>` appends. `command > out.txt` saves your findings.

## Your mission

A server was brute-forced overnight. In `/var/log/auth.log`, find which IP address produced the most **Failed password** lines. Hint: a log line looks like

```
... Failed password for root from 203.0.113.x port 5000 ssh2
```

This is exactly what incident responders do. Later you'll automate it in Python.
