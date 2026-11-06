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

## Walk-through: three ways to write the same number

The number "twenty-six" can be written as:

- **Decimal** (base 10, digits 0-9): `26`
- **Binary** (base 2, digits 0-1): `11010`
- **Hexadecimal** (base 16, digits 0-9 and a-f): `1a`

In hex, a = 10, b = 11, c = 12, d = 13, e = 14, f = 15.

**Hex to decimal.** Each place is worth 16 times the one to its right. For `1a`: 1 x 16 + 10 = **26**. For `ff`: 15 x 16 + 15 = **255** (the biggest value of one byte).

**Why hex exists.** One byte (8 bits) is always exactly two hex digits: `11111111` is `ff`, `00001010` is `0a`. It is a compact way to read binary. That is why colors (`#ff0000`), MAC addresses and hashes are written in hex.

**Binary to hex in your head.** Split the bits into groups of four from the right and convert each group: `1010 1111` is `a` and `f`, so `af`.

## Using JavaScript to check yourself

```js
console.log(parseInt("1a", 16));     // 26   (text in base 16 -> number)
console.log((26).toString(2));        // "11010"
console.log((255).toString(16));      // "ff"
```

`parseInt(text, base)` reads text in the base you give. `number.toString(base)` writes a number in that base.

## Check yourself

What is `0x10` in decimal? (16.) What is 100 in hex? (`64`: 6 x 16 + 4.)
