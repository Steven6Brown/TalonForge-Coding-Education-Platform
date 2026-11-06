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

## Commands you will use in this lab (with examples)

You are hunting through a log file for the address that keeps failing to sign in. Work in small steps and look at the output after each one.

1. **See what a failure line looks like.** `grep 'Failed password' /var/log/auth.log` prints only the lines containing that phrase. Read one line: the address comes after the word `from`.
2. **Pull out just the address.** `grep -o 'from [0-9.]*'` prints only the matching part (the word `from` and the digits and dots after it). Then `cut -d' ' -f2` splits each line at spaces and keeps the second piece, which is the address.
3. **Count each address.** `sort` puts identical lines together, then `uniq -c` collapses them and puts a **count** in front: `14 203.0.113.9`.
4. **Show the biggest first.** `sort -rn` sorts by number, largest first (`r` reverse, `n` numeric), and `head -n 1` keeps just the top line.

The pipe `|` hands the output of one command to the next, so the whole thing reads left to right: *find failures, get addresses, sort, count, sort by count, take the top*. If the output looks wrong, remove commands from the **right** one at a time until it looks right, then add them back.
