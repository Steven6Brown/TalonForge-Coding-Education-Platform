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
