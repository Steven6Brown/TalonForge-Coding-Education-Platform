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

## Walk-through: finding an inverse by hand

**What "inverse mod m" means.** In ordinary numbers the inverse of 3 is 1/3 (because 3 x 1/3 = 1). With **mod 11** we only use whole numbers, and the inverse of 3 is the number `x` where `3 x x` leaves remainder **1** when divided by 11.

Try small numbers: 3 x 1 = 3, 3 x 2 = 6, 3 x 3 = 9, 3 x 4 = 12 and 12 mod 11 = 1. So the inverse of 3 mod 11 is **4**.

**Why it exists here but not always.** An inverse exists only when `gcd(a, m) = 1` (they share no factors). Mod 12 has no inverse for 4, because 4 times anything is a multiple of 4 and can never leave remainder 1.

**Finding it without guessing (extended Euclid).** For 3 and 11, run Euclid and then work backwards:

```
11 = 3 x 3 + 2
 3 = 1 x 2 + 1
 2 = 2 x 1 + 0        gcd is 1, so an inverse exists
```

Work back from the 1:

```
1 = 3 - 1 x 2
  = 3 - 1 x (11 - 3 x 3)
  = 4 x 3 - 1 x 11
```

So `4 x 3 = 1 + 11`, which means `4 x 3 ≡ 1 (mod 11)`. The coefficient of 3 is **4**: that is the inverse. A negative coefficient would be fixed by adding `m` until it is positive.

## What the code tracks

The loop updates two remainders and two coefficients together (`oldR, r` and `oldS, s`) using `q = Math.floor(oldR / r)`. At the end, if `oldR` (the gcd) is not 1, return `null`; otherwise `((oldS % m) + m) % m` makes the answer a positive number below `m`.

## Why RSA needs this

RSA picks a public exponent `e` and computes the private exponent `d` as the **inverse of e** modulo a special number. Anyone who can compute that inverse quickly (which needs the secret factors) can decrypt.

## Check yourself

What is the inverse of 7 mod 10? (7 x 3 = 21, remainder 1, so 3.) Does 4 have an inverse mod 8? (No: gcd(4, 8) = 4, not 1.)
