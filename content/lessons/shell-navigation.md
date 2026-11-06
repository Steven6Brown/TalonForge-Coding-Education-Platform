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

## Walk-through: your first five minutes in the terminal

Type each command below in the terminal, pressing **Enter** after each. Here is what you should see (the prompt text may look a little different).

```
$ pwd
/home/student
```

`pwd` ("print working directory") says where you are right now: the folder `/home/student`, your home.

```
$ ls
mission  notes  welcome.txt
```

`ls` lists what is in the current folder: two folders and a file. You cannot tell which is which from this plain list; `ls -l` marks folders with a `d` at the start of each line.

```
$ cd mission
$ pwd
/home/student/mission
$ ls
briefing.txt  files
```

`cd mission` moves you *into* the folder called `mission`. Nothing is printed when it works, so use `pwd` to confirm. Now `ls` shows what is inside it.

```
$ cat briefing.txt
```

`cat` prints a file's contents. Read the briefing: it tells you the goal. (If you type a name that does not exist you get `No such file or directory`: check the spelling with `ls`.)

Now an example of hidden files, using an invented folder:

```
$ ls
data.csv  report.txt
$ ls -a
..  .  .config  data.csv  report.txt
```

`ls -a` shows **all** files, including hidden ones whose names start with a dot. Plain `ls` hid `.config`. The two entries `.` and `..` are always there: they mean "this folder" and "the folder above".

To go back: `cd ..` (up one level) or `cd ~` (straight home). Your mission mentions a hidden file. You now know how to look inside each folder for hidden files (`ls -a`) and how to print one (`cat`). Check each folder under `mission`, one at a time.

## If something goes wrong

- `No such file or directory`: wrong name or wrong folder. Run `pwd` and `ls` to check where you are.
- You cannot see the file: it may be hidden. Use `ls -a`.
- The terminal seems stuck: you have to press Enter to run a command.

## Check yourself

You are in `/home/student/mission/files`. Which command takes you to `/home/student/mission`? (`cd ..`.)
