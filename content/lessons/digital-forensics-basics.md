## Forensics: reconstruct what happened

**Digital forensics** collects, preserves and analyzes evidence from computers and networks to answer: *what happened, when, how, and who or what was involved?*

## Core principles

- **Preserve evidence.** Work on **copies** (forensic images), never the original.
- **Chain of custody:** document who handled each item, when, and why.
- **Hash everything.** A recorded SHA-256 proves a copy hasn't changed.
- **Timeline.** Combine logs and file times into an ordered story.
- **Volatility.** Memory and network connections vanish first; capture them first when authorized.

## Where evidence hides on Linux

- `/var/log/` (auth, syslog, web logs)
- Users' `.bash_history` (often hidden: names start with a dot, so use `ls -a`)
- Cron jobs, new accounts, and recently changed files

Attackers sometimes clear history, which is itself evidence. Absence of expected records is a clue.

## Your mission

You've been given a copy of an attacker's shell history in `~/evidence`. Read it and answer two questions: which IP hosted the script that was downloaded, and what was the script called? Note the chain-of-custody file for good practice.

## New to the terminal? Commands you will use

You type each command in the terminal below the lesson and press Enter. Read the output, then decide the next command.

- `ls` lists files. `ls -a` also shows **hidden** files (names that start with a dot).
- `cd evidence` moves into the folder called `evidence`. `cd ..` goes back up. `pwd` shows where you are.
- `cat history.txt` prints a whole file. `cat -n file` adds line numbers.
- `grep wget history.txt` shows only the lines containing `wget` (a download command). The text after `grep` is what you search for.

## Worked approach

1. `cd ~/evidence` then `ls -a` to see what you were given (note the hidden files).
2. Print the history file with `cat`.
3. Look for lines that **download** something: commands like `wget` or `curl` followed by a web address. The part between `http://` and the next `/` is the host's IP address, and the last part of the address is the script's file name.
4. Submit the IP first, then the file name (one answer at a time).
