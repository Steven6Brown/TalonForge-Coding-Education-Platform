## The golden rule: never work on the original

Digital forensics starts by making a **forensic image**: a bit-for-bit copy of the evidence (a disk, a phone, a memory capture). Analysts examine the copy so the original stays untouched. A **write blocker** prevents accidental changes while imaging.

## Hashes prove integrity

A cryptographic **hash** (SHA-256, historically MD5) is a fingerprint of the data. You hash the evidence when you collect it and record the value. Later, re-hash and compare:

- **Same hash:** the data is unchanged.
- **Different hash:** something changed, even by one character.

```
sha256sum file                          # print a file's hash
sha256sum -c recorded-hashes.txt        # check files against recorded hashes (OK / FAILED)
```

## Chain of custody

A written record of who handled the evidence, when, where it was stored and why. Without it, evidence can be challenged.

## Common tools

- **FTK Imager** creates and mounts images (E01, raw/dd formats).
- **Autopsy** analyzes file systems, deleted files and artifacts.
- **DB Browser for SQLite** opens browser history and app databases.
- On Linux, `dd` and `dcfldd` can image drives; mounting read-only protects the evidence.

## Your task

Verify the case files against their recorded hashes and find the file that was altered after collection.

## Commands you will use in this lab (with examples)

A **hash** is a fingerprint of a file. When evidence is collected, the investigator records each file's hash. Later, if the hash of a file no longer matches, the file **changed**. Even a one-character edit produces a completely different hash.

- `cd case` moves into the evidence folder and `ls` lists it.
- `cat recorded-hashes.txt` shows the recorded list: each line is a hash followed by a file name.
- `sha256sum file` prints the SHA-256 hash of one file, so you can compare it by eye.
- `sha256sum -c recorded-hashes.txt` does all the comparing for you: it reads the list, hashes every file again and prints `OK` or `FAILED` for each. The file marked **FAILED** is the one that no longer matches. Submit that file name.

In real work this is how you prove that a forensic image (an exact copy of a drive) was not altered between collection and court: hash it at the start, hash it again later, and the two values must match.
