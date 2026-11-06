## Shell puzzles that teach real skills

Free "wargame" sites teach the shell through small puzzles. This lesson has the same flavor, written from scratch for TalonForge. The tricks matter in real work too.

## Filenames that look like options

A file named `-file00` makes `cat -file00` fail because the shell thinks `-file00` is an option. Fixes:

```
cat ./-file00        # a path prefix makes it a filename
cat -- -file00       # '--' means "no more options"
```

## Spaces in names

The shell splits words on spaces. Quote or escape them:

```
cat "my file.txt"
cat my\ file.txt
```

Tab completion adds the escapes for you.

## Search by attributes

`find` can match more than names:

```
find . -name "*.log"       # by name
find . -type f             # files only
find . -size 19c           # exactly 19 bytes (c = bytes, k = KiB)
find /var/www -perm 777    # by permission
```

## Your mission

Read `~/README.txt` in the terminal. Capture all three flags and submit them one at a time. If you get stuck, use the hints.

After this, try the free OverTheWire "Bandit" wargame for a long ladder of similar challenges on a real Linux server.
