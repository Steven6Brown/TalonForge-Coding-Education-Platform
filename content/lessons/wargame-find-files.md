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

## Commands you will use in this lab (with examples)

Start with `cat README.txt`: it describes the three flags. Each needs a trick the beginner terminal rarely shows you.

- **A file whose name starts with a dash**, like `-file00`. The shell thinks `-file00` is an *option*, not a file. First go to where it lives (the README says `~/inhere`): `cd inhere`, then `ls` to see the name. Put a path in front so it is clearly a file: `cat ./-file00` (`./` means "in this folder"). `cat -- -file00` also works: `--` means "options end here".
- **A file name with spaces.** Without quotes the shell sees several separate words. The file is in `~/spaced` (`cd ~/spaced`, then `ls` to read the name). Wrap the name in quotes: `cat "spaces in this filename"`. You can press <kbd>Tab</kbd> to complete long names for you.
- **Finding a file by size.** `find ~/maybehere -size 19c` searches the folder for files that are exactly 19 bytes (`c` means bytes). You can search by other properties too: `-name "*.txt"` (by name), `-type d` (folders only). `find` prints the path of each match; then use `cat` on that path.

Tip: `ls -la` lists everything with sizes and hidden files, so you can *see* what you are dealing with before guessing.
