## Prime factors, GCD and LCM

Every integer greater than 1 factors uniquely into primes (the **Fundamental Theorem of Arithmetic**): `56 = 2^3 * 7` and `42 = 2 * 3 * 7`.

- **GCD** (greatest common divisor) takes the lowest power of shared primes: `gcd(56, 42) = 2 * 7 = 14`.
- **LCM** (least common multiple) takes the highest power of every prime: `lcm(56, 42) = 2^3 * 3 * 7 = 168`.
- They connect: `gcd(a, b) * lcm(a, b) = a * b`.

## The Euclidean algorithm

Factoring big numbers is slow, but the Euclidean algorithm finds the GCD without factoring. Repeat the division algorithm `n = d*q + r`, then use `(d, r)` as the next `(n, d)`. The GCD is the last non-zero remainder.

```
172 = 64*2 + 44
 64 = 44*1 + 20
 44 = 20*2 + 4
 20 =  4*5 + 0      -> gcd(172, 64) = 4
```

In code: `while (b !== 0) [a, b] = [b, a % b]`.

## Why security cares

RSA needs numbers that are **coprime** (gcd = 1) and the next lesson uses the extended version of this algorithm to compute private keys.

## Your task

Implement `gcd` and `lcm`.
