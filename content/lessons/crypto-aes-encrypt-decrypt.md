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

## Walk-through: the steps, in plain language

Think of the process as building a lock from your passphrase, then locking and unlocking a box.

**Encrypting a message:**

1. **Turn the passphrase into a key.** A passphrase is not a usable key by itself. The helper `deriveKey` mixes it with a salt and runs it through PBKDF2 many times to produce a proper 256-bit key. (The lab provides this part so you can focus on the encryption itself.)
2. **Make a fresh random IV.** `crypto.getRandomValues(new Uint8Array(12))` fills 12 bytes with random numbers. A new one every time. It is not secret.
3. **Encrypt.** `await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes)` where `bytes` is your message turned into bytes with `new TextEncoder().encode(text)`. The result is the scrambled data plus the authentication tag.
4. **Package it.** Store the IV next to the ciphertext (they must travel together), usually joined into one array and converted to text such as hex or base64 so it is easy to save or send.

**Decrypting a message:**

1. Split the package back into the IV and the ciphertext.
2. Derive the **same key** from the **same passphrase** (and salt).
3. `await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext)`, then turn the bytes back into text with `new TextDecoder().decode(...)`.

If the passphrase is wrong, or even one byte of the ciphertext changed, `decrypt` **throws an error**. That is the authentication tag doing its job.

## Things that trip people up

- Everything in `crypto.subtle` is **async**: put `await` in front, and make your function `async`.
- Text and bytes are different: you must encode before encrypting and decode after decrypting.
- Using the **same IV twice with the same key** breaks the security. Always generate a new one.
- Keep the IV: without it decryption is impossible.

## Check yourself

Why does GCM throw when you change a byte of the ciphertext? (It includes an authentication tag that proves the data has not been altered.)
