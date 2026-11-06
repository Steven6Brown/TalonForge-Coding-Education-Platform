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

## Walk-through: reading and calculating permissions

**Reading a permission string.** Take `-rwxr-x---`. Split it:

```
-   rwx   r-x   ---
|    |     |     |
type owner group others
```

- `-` means a regular file (`d` would be a directory).
- Owner has `rwx`: read, write, execute.
- Group has `r-x`: read and execute, but no write.
- Others have `---`: nothing at all.

**Calculating the number.** Give each letter a value (`r` = 4, `w` = 2, `x` = 1) and add them for each of the three groups:

```
rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
--- = 0
```

So `-rwxr-x---` is `750`. Going the other way, `640` means owner `6` = `rw-`, group `4` = `r--`, others `0` = `---`.

**Try it in the terminal:**

```
$ ls -l /var/www
drwxr-xr-x 1 root root  4096 Jan  1 12:00 html
```

That `d` is a directory. The permissions `rwxr-xr-x` are `755`: owner can do everything, everyone else can read and enter.

```
$ cat /etc/shadow
cat: /etc/shadow: Permission denied
```

The password-hash file is readable only by root. The refusal is the system protecting it.

**Finding risky files:**

```
$ find /var/www -perm 777
```

prints the path of every file whose permissions are exactly `777` (anyone can read, write and run it). Use `cat` on the path it prints.

## If something goes wrong

- `Permission denied`: you are not allowed. Many files, like `/etc/shadow`, are protected on purpose.
- `find` prints nothing: check the folder you searched and the exact number.

## Check yourself

What does `chmod 600 key.pem` allow? (Owner read and write only: a typical setting for a private key.)
