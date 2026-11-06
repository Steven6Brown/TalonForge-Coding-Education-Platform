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

## Walk-through: one address by hand

An IPv4 address like `192.168.1.10` is four numbers (**octets**), each 0 to 255, written in decimal. A computer sees each octet as **8 bits**, so an address is 32 bits in total.

**Convert one octet.** Use the place values `128 64 32 16 8 4 2 1`:

- `192`: 128 fits (64 left), 64 fits (0 left). So `11000000`.
- `168`: 128 fits (40 left), 32 fits (8 left), 8 fits. So `10101000`.
- `1`: only the 1 place. So `00000001` (always pad to 8 digits).
- `10`: 8 and 2. So `00001010`.

So `192.168.1.10` is `11000000.10101000.00000001.00001010`.

## Why subnet masks look odd

A **subnet mask** marks which bits identify the network (1s) and which identify the host (0s). `255.255.255.0` is 255 = `11111111` three times and 0 = `00000000`:

```
11111111.11111111.11111111.00000000   =  /24  (24 ones)
```

That is why `/24` is called "slash twenty-four": 24 bits are the network part. The last 8 bits give 2^8 = 256 addresses (254 usable hosts, since the first is the network address and the last is the broadcast).

## How the code does it

For each octet: `Number(part).toString(2)` gives the binary digits, and `.padStart(8, "0")` adds the missing leading zeros so every octet is 8 digits. `split(".")` breaks the address into its four parts and `join(".")` puts the groups back together.

## Check yourself

What is `255` in binary? (`11111111`.) What is `128`? (`10000000`.)
