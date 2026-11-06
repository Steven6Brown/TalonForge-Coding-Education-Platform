## The real thing

This lesson uses the same building blocks real applications and password managers use. You'll encrypt text, get back unreadable bytes, and decrypt it again, and see that a wrong key fails.

## The pieces

1. **Passphrase → key (PBKDF2).** A key derivation function mixes the passphrase with a **salt** and hashes it hundreds of thousands of times to produce a 256-bit key. The cost slows guessing attacks.
2. **AES-256-GCM.** AES encrypts data in 128-bit blocks. **GCM** mode turns it into a stream-like cipher and adds an **authentication tag**.
3. **IV / nonce.** A fresh random value for every encryption (12 bytes for GCM). It's stored with the ciphertext and isn't secret, but **reusing it with the same key breaks GCM's security**.

## Why authenticated encryption

Plain encryption hides content but doesn't stop tampering. With GCM, decrypting modified data or using the wrong key **throws an error**, so you never silently get garbage or an attacker-controlled result.

## What a stored message needs

`salt + iv + ciphertext (with tag)`. Not the passphrase. In this lab the salt is fixed to keep the code short; real systems generate a **random salt per message** (the Crypto workbench on the Tools page does).

## Good practice

- Use a long passphrase (several random words).
- Never hard-code keys.
- Send the passphrase by a different channel from the ciphertext.
- Use vetted libraries; never write your own cipher.

## Try it first

Open the **Crypto workbench → AES encrypt / decrypt** on the Tools page. Encrypt a message, decrypt it, then change one character of the ciphertext or the passphrase and see decryption fail.

## Your task

Implement `encrypt` and `decrypt` with the Web Crypto API by following the plan.
