## Why bases matter

Computers use **binary** (base 2). People read **hexadecimal** (base 16) because one hex digit is exactly 4 bits. You meet bases constantly: IP addresses and masks (binary), memory addresses and hashes (hex), Unix permissions (octal, base 8).

Digits in base `b` run from 0 to `b - 1`. For hex the extra digits are `a`-`f` (10-15).

## Base b to decimal

Multiply each digit by `b` raised to its position, then add:

```
(2607) in base 8 = 2*8^3 + 6*8^2 + 0*8^1 + 7*8^0 = 1024 + 384 + 0 + 7 = 1415
(a3b) in base 16 = 10*16^2 + 3*16 + 11 = 2560 + 48 + 11 = 2619
```

## Decimal to base b

Divide repeatedly by `b`. Each **remainder** is a digit; the first remainder is the rightmost digit. Stop when the quotient is 0.

```
6734 / 5 = 1346 r 4
1346 / 5 =  269 r 1
 269 / 5 =   53 r 4
  53 / 5 =   10 r 3
  10 / 5 =    2 r 0
   2 / 5 =    0 r 2     ->  (203414) in base 5
```

## Binary to hex shortcut

Group bits in fours from the right: `1011101` becomes `0101 1101` = `5d`.

## Your task

Implement `toBase(n, base)` using the divide-and-collect-remainders method.
