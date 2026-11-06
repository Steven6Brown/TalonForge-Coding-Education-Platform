## Fields and substitutions

Two classic tools turn raw text into answers.

## awk: work with fields

`awk` splits each line into fields (`$1`, `$2`, ...; `$NF` is the last). By default whitespace separates them; `-F` sets another separator.

```
awk '{print $11}' auth.log           # the 11th field of every line
awk -F: '{print $1, $3}' /etc/passwd # username and UID
```

## sed: find and replace

```
sed 's/old/new/' file      # replace the first match on each line
sed 's/old/new/g' file     # replace all matches
```

## Build a pipeline

Count failed logins per IP (in the sample log the IP is field 11):

```
grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1
```

Read it left to right: *filter lines, take the IP, sort so duplicates are adjacent, count them, order by count, show the top.* `uniq -c` only collapses neighbors, so `sort` must come first.

## Your task

Find how many failed attempts came from the single most frequent IP in `/var/log/auth.log`. The simulated `awk` supports `'{print $N, ...}'` and `-F`.

## Commands you will use in this lab (with examples)

`awk` treats each line as **fields** separated by spaces and numbers them `$1`, `$2`, `$3`... `awk '{print $11}'` means "for every line, print the 11th word". In an SSH failure line

```
Jan 12 03:14:07 forge sshd[1]: Failed password for root from 203.0.113.9 port 22 ssh2
```

count the words: `Jan`(1) `12`(2) `03:14:07`(3) `forge`(4) `sshd[1]:`(5) `Failed`(6) `password`(7) `for`(8) `root`(9) `from`(10) `203.0.113.9`(11). The address is field 11.

Build the answer in steps and check each output:

1. `grep 'Failed password' /var/log/auth.log` (only failures)
2. `... | awk '{print $11}'` (only the addresses)
3. `... | sort` (identical addresses next to each other)
4. `... | uniq -c` (collapse and **count**: `14 203.0.113.9`)
5. `... | sort -rn | head -n 1` (biggest first, keep one line)

The number at the start of that last line is what you submit. (`sed` is the companion tool for **replacing** text: `sed 's/old/new/'` changes the first `old` on each line to `new`.)
