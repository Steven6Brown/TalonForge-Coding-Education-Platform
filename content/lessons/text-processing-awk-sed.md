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
