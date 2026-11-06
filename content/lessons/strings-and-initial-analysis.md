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

## Walk-through: pulling text out of bytes

A file is a sequence of numbers (bytes). **Printable ASCII** means the numbers 32 (space) to 126 (`~`), the ones that display as characters. Everything else (0, 1, 2... and 127 upward) is non-printable.

Take these bytes and a minimum length of 3:

```
[72, 105, 0, 65, 66, 67, 68, 0, 10]
```

Walk through with a variable `cur` (the run being built):

```
72  H  printable -> cur = "H"
105 i  printable -> cur = "Hi"
0      not printable -> run ended. "Hi" has 2 characters, below 3: discard. cur = ""
65  A  -> cur = "A"
66  B  -> cur = "AB"
67  C  -> cur = "ABC"
68  D  -> cur = "ABCD"
0      not printable -> run ended. "ABCD" has 4 characters: keep it. cur = ""
10     not printable -> nothing to save
```

Result: `["ABCD"]`.

## Two details that matter

- Use `String.fromCharCode(b)` to turn a number into its character.
- **After the loop**, check `cur` once more: a run can reach the very end of the data without a non-printable byte after it, and you would otherwise lose it.

## Why analysts do this

Running `strings` on an unknown file is one of the first triage steps. URLs, IP addresses, file names, registry keys and error messages inside the program often appear as readable strings and hint at what it does. (Packed or encrypted programs hide their strings, which is itself a clue.)

## Check yourself

With `minLen` 2, what would the example above return? (`["Hi", "ABCD"]`.)
