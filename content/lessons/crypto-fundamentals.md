## Three building blocks

- **Symmetric encryption** (AES): one shared secret key encrypts and decrypts. Fast; the hard part is sharing the key.
- **Asymmetric encryption** (RSA, elliptic curves): a public key encrypts or verifies, a private key decrypts or signs. Solves key distribution; slower.
- **Hashing** (SHA-256): a one-way fingerprint for integrity checks. Not encryption.

TLS (the padlock in your browser) combines all three.

## Rules of thumb

- **Never invent your own cryptography.** Use vetted libraries and modern algorithms.
- Keys are secrets; protect and rotate them.
- Encryption provides confidentiality; add **authentication** (such as AES-GCM) for integrity.

## XOR: the simplest cipher idea

XOR combines bits: equal bits give 0, different bits give 1. XORing twice with the same key restores the original, so it is its own inverse. A **one-time pad** (a truly random key as long as the message, used once) is unbreakable. A short **repeating key** is trivially broken, which is why this toy cipher is for learning only.

```
'A' (0x41) XOR 'K' (0x4b) = 0x0a
```

## Your task

Implement `xorHex(plain, key)`: XOR each character with the repeating key and output lowercase hex. Hidden tests check known values.

## Walk-through: XOR with a repeating key

**XOR** compares two numbers bit by bit and outputs 1 only where the bits differ. Try one character: encrypt the letter `H` with the key letter `k`.

```
H = 72  = 01001000
k = 107 = 01101011
XOR     = 00100011 = 35 = 0x23  (hex "23")
```

For `"Hi"` with key `"k"`: `H` gives `23`, and `i` (105 = `01101001`) XOR `k` gives `00000010`, hex `02`. The result is `2302`. Each byte is written as **two** hex characters, so pad with a leading zero (`2` becomes `02`).

**Decrypting is the same operation.** XOR with the same key again returns the original: `0x23 ^ 107 = 72 = H`. That is why XOR appears inside many ciphers, and why a short repeating key is weak (patterns leak).

**A key shorter than the message repeats.** Character `i` uses key character `i % key.length`: with key `"ab"`, positions 0, 1, 2, 3 use `a, b, a, b`.

## In code

For each position `i`: `plain.charCodeAt(i) ^ key.charCodeAt(i % key.length)`, then `.toString(16).padStart(2, "0")`, appended to the output string.

## If something goes wrong

- Output has odd length: you forgot `padStart(2, "0")`.
- Wrong bytes: you used `key[i]` (which runs off the end) instead of `key[i % key.length]`.

## Check yourself

What is `5 ^ 5`? (`0`: any number XOR itself is zero.) What is `(9 ^ 3) ^ 3`? (`9`.)
