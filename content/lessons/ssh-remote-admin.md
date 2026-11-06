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
