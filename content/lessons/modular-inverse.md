## Clock arithmetic

`a mod m` is the remainder after dividing by `m`. Working "mod m" wraps numbers around like a clock.

A **modular inverse** of `a` mod `m` is a number `x` where `a * x ≡ 1 (mod m)`. It exists only when `gcd(a, m) = 1`. Example: `3 * 4 = 12 ≡ 1 (mod 11)`, so 4 is the inverse of 3 mod 11.

## Extended Euclidean algorithm

The Euclidean algorithm gives the GCD. Working backward through its equations expresses the GCD as a **linear combination**:

```
gcd(a, b) = a*s + b*t     for some integers s and t
```

When `gcd(a, m) = 1`, this reads `1 = a*s + m*t`. Taking both sides mod `m` leaves `a*s ≡ 1`, so `s` (reduced into the range 0 to m-1) is the inverse.

Example: for `a = 17, m = 3120` the algorithm gives `s = -367`, and `-367 mod 3120 = 2753`. Check: `17 * 2753 = 46801 = 15*3120 + 1`.

## Why it matters

In RSA, the private exponent `d` is the modular inverse of the public exponent `e` modulo `(p-1)(q-1)`. Computing it is exactly this algorithm.

## Your task

Implement `modInverse(a, m)`. Return `null` when no inverse exists.
