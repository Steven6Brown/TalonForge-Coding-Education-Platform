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

## Walk-through: gcd and lcm by hand, then in code

**Example: gcd(48, 18).** Repeat "divide, keep the remainder" until the remainder is 0. The last non-zero remainder is the answer.

```
48 = 2 x 18 + 12      (remainder 12)
18 = 1 x 12 + 6       (remainder 6)
12 = 2 x 6  + 0       (remainder 0, stop)
```

The last non-zero remainder is **6**, so `gcd(48, 18) = 6`.

**From gcd to lcm.** Use the link `gcd x lcm = a x b`, so `lcm = a x b / gcd`:

```
lcm(48, 18) = 48 x 18 / 6 = 864 / 6 = 144
```

**Check by listing multiples:** 18, 36, 54, 72, 90, 108, 126, **144**. And 48 goes into 144 exactly three times. 144 is the first number that appears in both lists.

## How the loop does it

Each round replaces the pair `(a, b)` with `(b, a % b)`. The `%` (remainder) operator gives exactly the "remainder" column above:

```
(48, 18) -> (18, 12) -> (12, 6) -> (6, 0)   stop: gcd is 6
```

In JavaScript, `[a, b] = [b, a % b]` updates both at the same time using their *old* values. Keep going `while (b !== 0)`, then `return a`.

## Your plan

1. Write `gcd(a, b)` with that loop and return `a` when `b` reaches 0.
2. Write `lcm(a, b)` as `a / gcd(a, b) * b` (dividing first keeps numbers smaller).
3. Run the checks.

## If something goes wrong

- Infinite loop: nothing changes `b`, or you forgot to update both variables.
- Wrong answer for `gcd(0, 5)`: the loop should return 5 (when `a` is 0 and `b` is not, the first round swaps them).

## Check yourself

What is `gcd(100, 75)`? (100 = 1 x 75 + 25; 75 = 3 x 25 + 0, so 25.)
