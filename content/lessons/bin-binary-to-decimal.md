## Place values

We count in base 10 because each place is worth ten times the previous one. **Binary is base 2**: each place is worth **two** times the previous one.

```
place value:   128  64  32  16   8   4   2   1
bits:            1   1   0   1   0   1   1   0
adds up:       128 + 64      + 16     + 4 + 2 = 214
```

To convert binary to decimal, add the place value of every `1`.

## Powers of two to memorize

1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024. An 8-bit byte holds 0 to 255 (2^8 - 1). 255 is `11111111`; 256 needs a ninth bit.

## Decimal to binary

Divide by 2 repeatedly; the **remainders**, read from the bottom up, are the bits. 13: 13÷2=6 r1, 6÷2=3 r0, 3÷2=1 r1, 1÷2=0 r1 → `1101`. The converter tool on the Tools page shows these steps for any number.

## Quick tricks

- A binary number ending in `0` is even; ending in `1` is odd.
- `1000` (binary) is 8; adding a zero to the right **doubles** the number.
- `255.255.255.0` in binary is 24 ones followed by 8 zeros, which is `/24`.

## Your task

Convert binary text to a number using the doubling loop, without `parseInt`. Writing it yourself once makes binary stick.

## Walk-through: converting by hand before you code

Binary uses only the digits 0 and 1. Each position is worth double the one to its right. From the right, the place values are:

```
128  64  32  16  8  4  2  1
```

**Example 1: `1011`.** Write the digits under the *rightmost* place values:

```
 8  4  2  1
 1  0  1  1
```

Add the values wherever there is a 1: 8 + 2 + 1 = **11**.

**Example 2: `01001000`** (the letter H from the previous lesson):

```
128  64  32  16  8  4  2  1
  0   1   0   0  1  0  0  0
```

64 + 8 = **72**, which is the code for `H`.

**Example 3: the reverse (decimal to binary).** For 13: the biggest place value that fits is 8 (13 - 8 = 5), then 4 (5 - 4 = 1), then 1. So 8, 4 and 1 are on and 2 is off: `1101`.

## How the code does the same thing

Read the digits from left to right with a running total. For each digit, **double the total and add the digit**:

```
1011:  0 -> 0*2+1 = 1 -> 1*2+0 = 2 -> 2*2+1 = 5 -> 5*2+1 = 11
```

That loop is all the lab needs. (JavaScript can also do it for you with `parseInt("1011", 2)`, which is handy for checking your answer: the second number is the base.)

## Check yourself

What is `110` in decimal? (4 + 2 = 6.) What is 5 in binary? (`101`.) Use the Tools page to confirm.
