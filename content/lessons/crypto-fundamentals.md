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
