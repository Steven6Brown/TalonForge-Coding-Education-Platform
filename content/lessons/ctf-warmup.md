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

## Walk-through: how to approach a puzzle file

Start every challenge the same way:

1. `ls` and `ls -a` to see what you were given (hidden files too).
2. `cat` each file. Read it as a human first: what does it look like?
3. Match what you see to a known pattern:

| What the text looks like | Likely encoding | Tool |
| --- | --- | --- |
| Letters and digits ending in `=` or `==` | **Base64** | `base64 -d` |
| Readable-looking but nonsense words | A letter shift such as **ROT13** | `tr 'A-Za-z' 'N-ZA-Mn-za-m'` |
| A big file with one line of interest | Hidden inside noise | `grep -i flag file` |

## Tiny examples so you know what success looks like

**Base64:** the text `aGVsbG8=` ends with `=`. Decoding it:

```
$ echo aGVsbG8= | base64 -d
hello
```

**ROT13:** each letter moves 13 places (A with N, B with O...). Doing it twice returns the original, so the same command encodes and decodes:

```
$ echo URYYB | tr 'A-Za-z' 'N-ZA-Mn-za-m'
HELLO
```

**Searching a long file:**

```
$ grep -i flag access.log
```

prints only the lines containing the word `flag`, whatever the capitalization.

## Reading a command with a pipe

`cat note.b64 | base64 -d` means: print the file, then **hand it to** the decoder. The pipe `|` connects the output of one command to the input of the next.

## Your approach for the three flags

Each challenge file uses one of these ideas. Look at the file name and the first few characters of its contents to decide which idea fits, apply the tool, and read the output. A flag looks like `FLAG{...}`; submit it exactly.

## Keep notes

Write down what you tried and what worked. Real CTF teams call this a **write-up**, and it is also how you learn faster.
