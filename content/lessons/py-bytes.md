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
