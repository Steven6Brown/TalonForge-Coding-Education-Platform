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
