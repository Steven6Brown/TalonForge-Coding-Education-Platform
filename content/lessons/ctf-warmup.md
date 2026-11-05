## What's a CTF?

**Capture The Flag** competitions hide secret strings (flags, usually `FLAG{...}`) inside puzzles. Categories: web, crypto, forensics, reverse engineering, binary exploitation (pwn), OSINT and misc. They're the best free way to build instincts.

## The mindset

1. **Look closely** at what you're given (file names, extensions, odd characters).
2. **Identify the encoding.** `=` padding hints at base64. Shifted letters hint at ROT/Caesar.
3. **Try the cheap tools first:** `cat`, `grep`, `base64 -d`, `tr`, `strings`, `file`.
4. **Take notes** so you can write up your solution afterward.

## Tools in this terminal

- `base64 -d` decodes base64.
- `tr 'A-Za-z' 'N-ZA-Mn-za-m'` performs ROT13.
- `grep -i flag file` searches for text, case-insensitively.
- Pipes combine them: `cat note | base64 -d`.

## Your task

`~/ctf` contains three challenges. Solve each and submit all three flags (one at a time).

After you finish, try the same in real life: OverTheWire "Bandit" is a free ladder of shell challenges, and picoCTF has beginner-friendly archives.
