## How RSA works (the toy version)

RSA is **asymmetric**: a public key encrypts, a private key decrypts.

1. Pick two primes: `p = 61`, `q = 53`.
2. `n = p * q = 3233` (public). `phi = (p-1)(q-1) = 3120`.
3. Choose `e` coprime to `phi` (here `e = 17`).
4. Compute `d`, the modular inverse of `e` mod `phi` (here `d = 2753`).
5. **Public key:** `(n, e)`. **Private key:** `d`.

**Encrypt:** `c = m^e mod n`. **Decrypt:** `m = c^d mod n`.

With message `m = 65`: `65^17 mod 3233 = 2790`, and `2790^2753 mod 3233 = 65`.

## Square-and-multiply

Real keys use numbers hundreds of digits long, so `m^e` can't be computed then reduced. **Modular exponentiation** reduces as it goes: for each bit of the exponent, square the base, and multiply into the result when the bit is 1. It takes about as many steps as the exponent has bits.

## Why it is secure (and when it is not)

Security rests on the difficulty of **factoring** `n` back into `p` and `q`. Toy numbers factor instantly. Real RSA uses 2048+ bit keys, **padding** (OAEP), and vetted libraries. Never use textbook RSA like this in production.

## Your task

Implement `modPow` with BigInt. Hidden tests run the toy encryption and decryption above.
