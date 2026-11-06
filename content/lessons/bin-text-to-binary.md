## Everything is a number

Computers don't store letters. They store **numbers**, and a table (ASCII, extended to Unicode) says which number means which character.

| Character | Decimal | Binary (8 bits) | Hex |
| --- | --- | --- | --- |
| `A` | 65 | `01000001` | `41` |
| `H` | 72 | `01001000` | `48` |
| `a` | 97 | `01100001` | `61` |
| `0` (the digit) | 48 | `00110000` | `30` |
| space | 32 | `00100000` | `20` |

Notice lowercase letters are exactly 32 more than uppercase (one bit differs).

## Bits, bytes, hex

- A **bit** is a 0 or 1; a **byte** is 8 bits (0-255).
- **Hexadecimal** (base 16) is a shorthand: one hex digit is exactly **4 bits**, so a byte is two hex digits. `01001000` is `0100 1000` = `4 8` = `48`.
- Hex uses `0-9` and `a-f` (a=10 ... f=15).

## Use the Tools page

The **Tools** page (top menu) has a **Binary & number converter**: type text and see its binary, hex and decimal; paste binary and decode it; and see the division steps that produce a binary number. Use it to check your work after each lab.

## Why security people need this

Hashes, keys, memory dumps, packet captures, IP addresses and malware strings are all shown in hex or binary. Being fluent means you can read them instead of fearing them.

## Your task

Write `textToBinary` using `charCodeAt`, `toString(2)` and `padStart`.

## Walk-through: one letter, step by step

**1. Letter to number.** Computers store each character as a number from an agreed table (**ASCII**). The capital letter `A` is **65**. `a` is 97. The digit `0` is 48. In JavaScript, `"A".charCodeAt(0)` returns `65`.

**2. Number to binary.** 65 in binary: find which place values add up to 65.

```
128  64  32  16  8  4  2  1
  0   1   0   0  0  0  0  1     = 64 + 1 = 65
```

So `A` is `01000001`.

**3. Always 8 digits.** A byte is 8 bits. `(5).toString(2)` gives just `101`, so pad with zeros at the front: `"101".padStart(8, "0")` gives `00000101`.

**4. A whole word.** For `Hi`: `H` = 72 = `01001000`, `i` = 105 = `01101001`. Join with a space:

```
01001000 01101001
```

## In code

Split the text into characters, convert each one to 8-digit binary, and join with a space:

```js
text.split("").map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
```

Read it left to right: characters, then numbers, then padded binary, then glued with spaces.

## If something goes wrong

- Groups are different lengths: you forgot `padStart(8, "0")`.
- The result has no spaces: the `join` separator should be `" "`.
- Numbers instead of binary: `toString(2)` converts to base 2.

## Check yourself

What is `a` in binary? (97 = 64 + 32 + 1 = `01100001`.) Use the Tools page converter to confirm.
