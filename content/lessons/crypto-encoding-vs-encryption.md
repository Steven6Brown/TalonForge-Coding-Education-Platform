## Three tools, three jobs

| | Encoding | Hashing | Encryption |
| --- | --- | --- | --- |
| Purpose | change **format** | create a **fingerprint** | provide **secrecy** |
| Reversible? | yes, by anyone | **no** (one-way) | yes, **with the key** |
| Uses a key? | no | no (or yes for HMAC) | yes |
| Examples | Base64, hex, URL encoding | SHA-256, bcrypt | AES-GCM, ChaCha20, RSA |

## Rules of thumb

- Need data to **survive transport** (binary in text, special characters in a URL)? **Encode**.
- Need to **verify integrity** or store passwords? **Hash** (use slow, salted hashes for passwords).
- Need to **keep data secret** but get it back later? **Encrypt** (authenticated mode such as AES-GCM), and protect the key.

## Common mistakes

- "The password is encrypted with Base64." It isn't; it is encoded and readable by anyone.
- Hashing without a salt, or with a fast hash (plain MD5/SHA-1/SHA-256) for passwords.
- Inventing your own encryption. Use vetted libraries.
- Reusing an IV/nonce with the same key.
- Storing the key next to the encrypted data.

## Use the Crypto workbench

On the **Tools** page, try each: encode text to Base64 and back, hash `password` and `Password` to see the avalanche effect, and encrypt a message with AES then try the wrong passphrase.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **One-way means hashing.** A hash function turns any input into a fixed-size fingerprint, and you **cannot recover the input** from it. You can only guess inputs and compare their hashes. That is why passwords are stored as (salted) hashes.
- **Checking a download.** To confirm a downloaded file was not modified, **compare its hash with a trusted published hash**. A match shows integrity, but only if the published hash itself comes from a trustworthy place.
- **Classical ciphers today.** Caesar and Vigenere are fine for puzzles and learning. They are **not** for **protecting real secrets**, because they are trivially breakable. Use **AES-256-GCM** or **ChaCha20-Poly1305** through a vetted library.

## Worked examples: encoding, encryption or hashing?

Three operations that people constantly confuse. Ask: *can anyone reverse it without a secret?* and *is it meant to be reversed at all?*

| Operation | Example | Reversible? | Needs a secret? | Purpose |
| --- | --- | --- | --- | --- |
| **Encoding** | Base64: `hello` becomes `aGVsbG8=` | Yes, by anyone | No | Represent data so it travels safely (email, URLs) |
| **Encryption** | AES with a key | Yes, **only with the key** | Yes | Keep data secret |
| **Hashing** | SHA-256 of `hello` | **No** (one-way) | No | Fingerprint data, check integrity, store passwords |

**Test it yourself.** Paste `aGVsbG8=` into the Tools page and decode: you get `hello` with no key. So Base64 protects nothing. A system that "secures" passwords with Base64 is storing plain text.

**Scenarios:**

- You downloaded an installer and want to be sure it was not changed: compare its **hash** with the trusted published hash.
- You must send a confidential message so only Ana can read it: **encrypt** with a key only Ana has.
- You need to put binary data inside a JSON field: **encode** it with Base64.
- You store user passwords: **hash** them (with a slow, salted hash), never encrypt or encode them.

**Classical ciphers (Caesar, Vigenere)** are fun puzzles but trivially breakable, so they are **not** for protecting real secrets. Use AES-256-GCM or ChaCha20-Poly1305 from a vetted library.

## Self-check

1. Which operation is intentionally one-way? (Hashing.)
2. Is Base64 secure? (No: it is encoding, reversible by anyone.)
3. Which do you use to check a download was not modified? (A hash comparison.)
