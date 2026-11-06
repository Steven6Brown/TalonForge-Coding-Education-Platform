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

## Walk-through: toy RSA with tiny numbers

Real RSA uses numbers hundreds of digits long, but the steps are the same. Use these small ones so you can check the arithmetic.

1. **Pick two primes:** `p = 3`, `q = 11`.
2. **Modulus:** `n = p x q = 33`.
3. **Totient:** `(p - 1) x (q - 1) = 2 x 10 = 20`.
4. **Public exponent** `e` with no common factor with 20: `e = 3`.
5. **Private exponent** `d`, the inverse of `e` mod 20: `d = 7`, because `3 x 7 = 21` and 21 mod 20 = 1.

Public key: `(n = 33, e = 3)`. Private key: `d = 7`.

**Encrypt** a message `m = 4`: `c = m^e mod n = 4^3 mod 33 = 64 mod 33 = 31`.

**Decrypt:** `m = c^d mod n = 31^7 mod 33 = 4`. We got the message back.

Anyone can encrypt with the public numbers. Only the person who knows `d` can decrypt. Computing `d` needs the totient, which needs the secret factors `p` and `q`; for real key sizes, factoring `n` is far too slow.

## The problem the lab solves: `modPow`

`31^7` is small here, but real RSA needs numbers like `m^65537 mod n` with enormous `n`. You cannot compute the huge power first and then take the remainder. The trick is **square and multiply**, reducing `mod n` at every step so numbers stay small:

```
result = 1
while exp > 0:
    if exp is odd: result = result * base mod n
    base = base * base mod n
    exp = exp halved
```

Test it by hand: `modPow(4, 13, 497)` should give `445` (a standard textbook example).

## In JavaScript

Use **BigInt** (numbers written like `4n`). Odd test: `exp & 1n`. Halving: `exp >>= 1n`. Keep every number a BigInt or you will get a `TypeError` about mixing types.

## Why not use this for real

Toy RSA has tiny keys and no padding, so it is trivial to break. Real systems use vetted libraries with 2048-bit or larger keys and secure padding (OAEP).

## Check yourself

With `n = 33, e = 3`, what does `m = 2` encrypt to? (2^3 = 8, so 8.)
