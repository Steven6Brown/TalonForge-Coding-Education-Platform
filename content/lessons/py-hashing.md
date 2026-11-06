## What a hash is

A **hash function** turns any input into a fixed-size fingerprint. It's one-way: you can't "decrypt" a hash, but you can *guess* inputs and compare fingerprints.

```python
import hashlib
hashlib.sha256(b"dragon").hexdigest()
```

Good for: file integrity, password storage (with the right algorithm), digital signatures.

## Why unsalted fast hashes fail for passwords

Attackers keep huge **wordlists** of common passwords. If your database stores plain `SHA-256(password)`:

1. Identical passwords give identical hashes (easy to spot).
2. Attackers hash millions of guesses per second and compare.
3. Precomputed "rainbow" tables skip the work entirely.

## Doing it right (defender view)

- Use a slow, purpose-built password hash: **Argon2id**, **scrypt** or **bcrypt**.
- Add a unique random **salt** per password (these libraries handle it).
- Enforce length, check against breached-password lists, and offer MFA.

## Your task (legal practice)

You're given a hash *you were handed in a lab* and a short wordlist. Hash each candidate and print the one that matches. This mirrors what tools like hashcat do at massive scale.

> Only crack hashes you own or that are explicitly provided for training. Cracking real people's leaked credentials is harmful and often illegal.

## Walk-through: hashing and checking guesses

**1. Make a hash.**

```python
import hashlib
print(hashlib.sha256(b"abc").hexdigest())
```

Output: `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`. That 64-character string is the SHA-256 hash of `abc`. Three things to notice:

- `b"abc"` (with a `b`) is **bytes**. Hash functions need bytes, not text. For a text variable use `word.encode()`.
- `.hexdigest()` writes the hash as hexadecimal text.
- The same input always gives the same output. Change one letter (`abd`) and the whole hash changes.

**2. Why guessing works against weak storage.** You cannot reverse a hash, but you can hash a guess and compare:

```python
target = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
for word in ["dragon", "abc", "letmein"]:
    if hashlib.sha256(word.encode()).hexdigest() == target:
        print("found:", word)
```

Output: `found: abc`. This is exactly what the lab asks, and it is what tools like hashcat do, billions of times faster.

**3. Why this matters.** If a site stores plain fast hashes of passwords, anyone who steals the database can run this loop with a list of common passwords. That is why real systems use slow, salted password hashes (Argon2id, scrypt, bcrypt).

## Your plan

1. Loop through the wordlist.
2. For each word, `.encode()` it, hash it with `sha256`, and take `.hexdigest()`.
3. If it equals the target hash, print that word.

## If something goes wrong

- `TypeError: Strings must be encoded before hashing`: add `.encode()`.
- No match printed: check you compared against the right variable, and that the wordlist spelling is exact (case matters).

## Check yourself

Why can't you "decrypt" a hash? (It is a one-way fingerprint, not encryption: information was discarded. You can only guess inputs and compare.)
