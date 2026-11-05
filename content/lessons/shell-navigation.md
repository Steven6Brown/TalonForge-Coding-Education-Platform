## Why the shell?

Servers rarely have a desktop. Attackers, defenders and sysadmins all live in the **shell**: a text interface where you type commands and read results. Learning it is the single highest-leverage skill in cybersecurity.

## The filesystem is a tree

Everything hangs off `/` (root). Your personal space is your **home directory**, shortened to `~`.

```
/
├── etc/        configuration files
├── var/log/    logs
├── home/student/   <- you live here (~)
└── ...
```

## Four commands to start

- `pwd` - print working directory (where am I?)
- `ls` - list files. Add `-l` for details and `-a` to show **hidden** files (names starting with `.`).
- `cd <dir>` - change directory. `cd ..` goes up one level, `cd ~` goes home.
- `cat <file>` - print a file.

> Press **Tab** to auto-complete names and **↑ / ↓** to reuse earlier commands.

## Hidden files are normal, not magic

Config files like `.bashrc` and `.ssh/` are hidden so they don't clutter listings. Attackers also use hidden files, so defenders must know to look: `ls -a`.

## Your mission

Open the terminal below. Explore `~/mission`, find the hidden file, read it with `cat`, and submit the flag. Type `help` any time to see available commands.

**Safety note:** this terminal is a *simulation*. It runs in your browser and can't touch your real computer.
