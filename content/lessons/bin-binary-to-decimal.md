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
