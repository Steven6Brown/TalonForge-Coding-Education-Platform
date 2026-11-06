## From Caesar to Vigenère

A **Caesar cipher** shifts every letter by the same amount, so there are only 25 possible keys and frequency analysis breaks it. In the 1500s the **Vigenère cipher** improved on it by using a **keyword**: each letter is shifted by the corresponding letter of the key, which then repeats. The same plaintext letter can encrypt to different ciphertext letters, hiding simple letter frequencies. It was called "le chiffre indéchiffrable" for about three centuries.

## Encrypting by hand

```
Plain:  A T T A C K A T D A W N
Key:    L E M O N L E M O N L E
Cipher: L X F O P V E F R N H R
```

Each column adds the numbers (A=0 ... Z=25) and wraps at 26: A(0) + L(11) = L; T(19) + E(4) = X(23).

## How it's broken

- **Kasiski examination** finds the key length from repeated sequences.
- Once the key length is known, each position is just a Caesar cipher and can be solved by **frequency analysis**.
- A key as long as the message that is truly random and never reused (a **one-time pad**) is unbreakable. Short keys are not.

## Modern takeaway

Strength comes from large key spaces **and** good design. Today use AES-256-GCM or ChaCha20-Poly1305 from a vetted library. Classical ciphers are for learning and puzzles.

## Try it

On the Tools page, **Classical ciphers** lets you encrypt and decrypt with Caesar, ROT13, Vigenère and XOR so you can check your lab results.

## Your task

Implement `vigenereEncrypt` for uppercase text.
