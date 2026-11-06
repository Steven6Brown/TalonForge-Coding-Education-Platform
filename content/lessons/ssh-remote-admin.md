## A range of machines

Real environments have many machines. Cloud cyber ranges give each learner a small network of virtual computers; you log in to each one, inspect it, and work from machine to machine. This lab simulates that.

## SSH basics

`ssh user@host` opens an encrypted shell on another machine. After you authenticate, the prompt changes to show where you are (`student@web01`). `exit` returns you to the previous machine.

```
ssh student@web01
...
exit
```

`scp` copies files over the same protocol: `scp web01:/etc/motd motd.txt` copies a remote file to the current machine. (Real SSH should use key-based login; this lab uses a password for simplicity.)

## What to check on each server

- **Web server:** authentication and access logs show who is trying to get in. Many failed logins from one IP suggest password guessing.
- **Database server:** the `bind-address` setting decides which network interfaces the database listens on. `127.0.0.1` means local only; `0.0.0.0` means *every* interface, which exposes the database to the whole network and should be restricted.

## Your task

Read `~/README.txt`, log in to `web01` and find the IP with the most failed logins, then log in to `db01` and find the risky bind-address value.

## Commands you will use in this lab (with examples)

This lab has **several machines**. The prompt always shows which one you are on, for example `student@jump:~$` versus `student@web01:~$`. Commands run on the machine named in the prompt.

1. `cat ~/README.txt` on your starting machine: it contains the instructions and the password you will need.
2. **Log in to another machine:** `ssh student@web01` means "connect to `web01` as user `student`". It asks for the password; **typing it shows nothing on screen**, which is normal. When it works, the prompt changes to `web01`.
3. **Do your work there**, for example the failed-login search from the earlier lessons: `grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1`.
4. **Leave the machine:** `exit` returns you to where you were.
5. **Go to the next machine:** `ssh student@db01`, then `cat /etc/mysql/mysqld.cnf` to read the database settings.

In the database file, `bind-address` says which network interfaces the database listens on. `127.0.0.1` means "this machine only" (safe). `0.0.0.0` means **every** interface, so anyone who can reach the machine can try to connect (risky). That is the value you are looking for.

`scp web01:/etc/motd motd.txt` copies a file from another machine to yours (the same login rules apply).
