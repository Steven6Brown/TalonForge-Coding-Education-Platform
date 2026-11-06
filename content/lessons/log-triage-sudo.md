## Why watch sudo?

`sudo` lets a user run commands as root, so every use is security-relevant. Auditors review who used it, when and for what. A sudo log line looks like:

```
Apr 12 14:30:09 host sudo: harrypotter : TTY=pts/0 ; PWD=/home/harrypotter ; USER=root ; COMMAND=/usr/bin/systemctl status ssh
```

Splitting on spaces: `$1` month, `$2` day, `$3` time, `$4` host, `$5` `sudo:`, `$6` the **user**.

## The toolkit

```
grep sudo access1.log                         # only sudo lines
grep sudo access1.log | grep Apr              # April only
grep -c harrypotter file                      # count matching lines
grep sudo access1.log | awk '{print $1,$2,$6}'  # pick fields
sort -k 6                                     # sort by the 6th field
sort | uniq -c                                # count duplicates (sort first!)
sort -rn                                      # highest count first
```

## Building the answer

*Who ran sudo most?*

```
grep sudo access1.log | awk '{print $6}' | sort | uniq -c | sort -rn
```

Read it as a sentence: *keep sudo lines, take the user, group identical users, count, rank.*

## What to look for in real logs

- Unexpected users using sudo
- Activity at odd hours
- Commands that change accounts, permissions or logs
- A sudden jump in volume

## Your task

Answer the two questions in `~/README.txt`. This is the same exercise pattern used in many Linux security courses, with fictional data.

## Commands you will use in this lab (with examples)

**sudo** is the command people use to run something with administrator rights, and every use is written to a log. Reviewing those entries shows who did privileged things and when. A line looks like:

```
Apr 12 09:15:02 host sudo: harrypotter : TTY=pts/0 ; COMMAND=/bin/ls
```

Split on spaces, the user name is the **6th word** (field 6): `Apr`(1) `12`(2) `09:15:02`(3) `host`(4) `sudo:`(5) `harrypotter`(6).

- `grep sudo access1.log` keeps only the sudo lines.
- **Chaining filters:** `grep sudo access1.log | grep Apr | grep -c harrypotter`. Each `grep` narrows the lines further (sudo lines, then April, then that user), and `grep -c` prints how **many** lines matched instead of the lines themselves. That answers question 1.
- **Ranking users:** `grep sudo access1.log | awk '{print $6}' | sort | uniq -c | sort -rn`. `awk '{print $6}'` prints field 6 of every line, `sort` groups identical names, `uniq -c` counts them, and `sort -rn` puts the biggest count first. The top name answers question 2.
