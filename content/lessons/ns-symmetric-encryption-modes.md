## Encryption in one line

**Encryption** turns **plaintext** into **ciphertext**; **decryption** reverses it. Types: symmetric (one shared key), asymmetric (key pairs), and hashing/signatures. A **key** is a binary value; longer keys are generally stronger against brute force.

## Symmetric: block and stream ciphers

- **Stream ciphers** encrypt data **a byte (or bit) at a time**. They are fast with low hardware complexity (RC4 secured wireless and other links, but is now deprecated because of weaknesses).
- **Block ciphers** encrypt **fixed-size blocks** (64 or 128 bits) using a key. They protect files, databases and email. A **mode of operation** defines how blocks are combined for long messages.

## Modes of operation

- **ECB (Electronic Codebook):** each block is encrypted independently. Identical plaintext blocks give **identical ciphertext blocks**, so patterns survive. The classic demonstration is an encrypted image whose outline is still visible. Avoid ECB for real data.
- **CBC (Cipher Block Chaining):** each plaintext block is **XORed with the previous ciphertext block** before encryption, so each ciphertext block depends on everything before it. The first block uses an **initialization vector (IV)**.
- **CFB, OFB, CTR:** turn a block cipher into something like a stream cipher; each needs an IV (or nonce/counter).

## IVs

The IV is a dummy starting block that randomizes the output. Rules: **never reuse an IV with the same key**. Reusing it in CBC or CFB leaks information about the first block and any shared prefix; in OFB or CTR, reuse **destroys security**. In CBC the IV should also be **unpredictable** (random).

XOR (exclusive OR) outputs 1 when the inputs differ: `0^0=0, 0^1=1, 1^0=1, 1^1=0`.

## DES, 3DES and AES

- **DES** (1976): 64-bit blocks, 64-bit key of which **56 bits** are used (8 are parity), 16 rounds. The key is too short: a purpose-built machine broke DES in 56 hours (1998) and a distributed effort in about 22 hours (1999). Withdrawn as a standard in 2005.
- **Triple DES:** three DES operations (encrypt-decrypt-encrypt with up to three keys, about 168 key bits). Slower, more secure than DES, but retired in favor of AES.
- **AES (Rijndael):** 128-bit blocks, 128, 192 or 256-bit keys, standardized by NIST in 2001 (FIPS 197). The standard choice today, normally used in an authenticated mode such as GCM.

## Your task

With a deliberately toy cipher (`E(x) = x XOR key`), implement ECB and CBC and see how chaining removes repeated patterns.
