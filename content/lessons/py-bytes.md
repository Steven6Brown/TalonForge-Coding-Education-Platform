## Start here

**Before this lesson:** Python Foundations. If binary and hex feel fuzzy, open the **Tools** page (number converter) and the "Binary, Encryption, Hashing & Ports" track, which teaches them from scratch.

## What is a byte?

A computer stores everything as numbers. One **byte** is a number from 0 to 255 (8 bits). Text is just bytes plus an agreement (an **encoding**) about which number means which letter: in UTF-8 the letter `h` is 104 and `i` is 105.

People often write bytes in **hexadecimal** (base 16), two characters per byte: 104 is `68` and 105 is `69`, so the text `hi` becomes `6869`.

## Two different Python types

- `str` is text: `"hi"`
- `bytes` is raw bytes: `b"hi"` (note the `b` before the quote)

You convert with `"hi".encode()` (text to bytes) and `data.decode()` (bytes to text). `data.hex()` gives the hex text and `bytes.fromhex("6869")` goes back.

## The peeling-layers idea

The lab's flag was wrapped in layers, like a parcel: **text, then base64, then hex**. To open it you undo the layers in the **reverse** order they were applied:

1. Hex text to bytes: `bytes.fromhex(...)`.
2. Those bytes are base64 text: `base64.b64decode(...)` gives new bytes.
3. Decode those bytes into readable text with `.decode()`.

If a step gives gibberish or an error, you probably did the layers in the wrong order or skipped one. Print the result after each step to see where you are.

## Text vs bytes

Computers store **bytes** (numbers 0-255). Text is bytes interpreted with an *encoding* (usually UTF-8). Much of security is converting between representations.

```python
data = "hi".encode()          # str -> bytes   b'hi'
text = data.decode()          # bytes -> str   'hi'
data.hex()                    # '6869'
bytes.fromhex("6869")         # b'hi'
```

## Base64

Base64 turns bytes into printable characters so they survive email, URLs and JSON. It is **encoding, not encryption**: anyone can reverse it.

```python
import base64
base64.b64encode(b"hello")    # b'aGVsbG8='
base64.b64decode(b"aGVsbG8=") # b'hello'
```

Base64 often ends with `=` padding and uses letters, digits, `+` and `/`.

## Layers

Malware and CTF puzzles stack encodings: hex of base64 of text. Peel them one at a time from the outside in.

## Your task

The editor contains a hex string. Convert hex → bytes, base64-decode those bytes, then decode to text and print the flag.

Remember: encoding hides nothing. If a system "protects" passwords with base64, treat it as plaintext.
