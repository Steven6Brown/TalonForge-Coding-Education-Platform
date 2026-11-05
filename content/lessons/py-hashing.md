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
