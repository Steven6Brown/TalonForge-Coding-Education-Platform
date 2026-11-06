## You found a suspicious file. Now what?

Gather information (how it was found, how it arrived), **store a clean copy** away from where you analyze, **take notes**, then run the initial steps:

1. **Calculate the hash** (MD5 or SHA-256) to use as a label, search for it, and share it with other analysts.
2. **Check reputation** on multi-engine scanning services (someone may have identified it already; but signatures are easy for authors to evade by changing a byte).
3. **Extract strings.**
4. **Run a string-decoding tool** (such as FLOSS) that recovers obfuscated strings.

## Strings

A **string** is a run of printable characters ending in a null byte (0x00).

- **ASCII:** 1 byte per character: `B A D` = `42 41 44 00`.
- **Unicode (UTF-16):** 2 bytes per character: `00 42 00 41 00 44 00 00`. Windows commonly uses UTF-16.

What to look for:

- **URLs and IP addresses**: likely contacted by the program
- **Windows function names** (`CreateService`, `InternetOpen`) and **DLL names**
- **Error messages**: often reveal functionality (a "failed to send message" text hints at email-sending code)
- **File paths, registry keys and commands**

Ignore short noise such as `VP3` or `D$4` (fragments of instructions or addresses). Use a minimum length of about **3-4 characters**.

On the command line: `strings filename` (Windows Sysinternals or Linux).

## Your task

Implement the core of the `strings` utility: scan bytes and return the printable runs of a minimum length.
