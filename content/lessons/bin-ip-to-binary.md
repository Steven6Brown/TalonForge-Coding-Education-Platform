## IPv4 addresses are 32-bit numbers

`192.168.1.10` looks like four decimal numbers separated by dots, but it's really **32 bits** split into four **octets** of 8 bits each:

```
192      168      1        10
11000000.10101000.00000001.00001010
```

## Masks and prefixes

A **subnet mask** marks which bits are the network part. `255.255.255.0` is `11111111.11111111.11111111.00000000`: 24 ones, which is why it's written `/24`. Anything with the same first 24 bits is on the same network.

To find the network address, **AND** the address with the mask bit by bit. `192.168.1.10` AND `255.255.255.0` = `192.168.1.0`.

## Handy numbers in an octet

| Decimal | Binary | Meaning in a mask |
| --- | --- | --- |
| 128 | `10000000` | 1 network bit in this octet (/25 when this is the last octet) |
| 192 | `11000000` | 2 bits (/26) |
| 224 | `11100000` | 3 bits (/27) |
| 240 | `11110000` | 4 bits (/28) |
| 248 | `11111000` | 5 bits (/29) |
| 252 | `11111100` | 6 bits (/30) |
| 255 | `11111111` | all 8 bits |

## Your task

Convert a dotted-decimal address to dotted binary. You'll use `split`, `map` and `padStart` together.
