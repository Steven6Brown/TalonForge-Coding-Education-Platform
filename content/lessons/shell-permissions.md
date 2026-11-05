## Who can do what

Linux protects files with **owner**, **group** and **other** permissions. Run `ls -l` and you'll see something like:

```
-rwxr-x--- 1 www-data www-data 120 Jan  1 12:00 deploy.sh
```

Read `-rwxr-x---` in four parts: type (`-` file, `d` directory), then **owner** `rwx`, **group** `r-x`, **other** `---`.

## Octal shorthand

Each permission is a number: **r=4, w=2, x=1**. Add them per class.

- `7` = rwx, `6` = rw-, `5` = r-x, `4` = r--, `0` = none
- `chmod 640 file` = owner rw, group r, other none
- `chmod 755 script.sh` = owner rwx, everyone else r-x

Symbolic form also works: `chmod u+x script.sh`, `chmod o-w file`.

## What's dangerous?

- **World-writable (777 or o+w)** - any user or compromised service can modify the file. In a web root, that can mean code execution.
- **World-readable secrets** - `.env`, private keys and DB configs should be `600` or `640`.
- **SUID binaries** - run with the owner's privileges; a classic privilege-escalation hunting ground.

Least privilege: give the minimum access needed, nothing more.

## Auditing with find

```
find /var/www -perm 777          # exact mode
find / -type f -perm -002        # anything world-writable
```

## Your mission

A web server directory has one world-writable file. Find it, read it, and submit the flag. Also try `cat /etc/shadow` and notice the **Permission denied** - that's the system protecting password hashes.
