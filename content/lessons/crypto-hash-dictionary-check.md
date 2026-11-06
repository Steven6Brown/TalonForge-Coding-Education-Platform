## What you'll build

A tiny **dictionary check**: hash each word in a list and compare it to a target hash. It's how weak passwords are found in leaked databases, and how defenders test their own password policies.

> Only do this on hashes you own or have been given for training. Cracking real people's leaked credentials is harmful and often illegal.

## Hashes in the browser

Browsers include the **Web Crypto API**. `crypto.subtle.digest("SHA-256", bytes)` returns the hash as raw bytes (it is asynchronous, so you `await` it). Convert bytes to the familiar 64-character hex string to compare.

## Why this works (and what stops it)

- The same input always gives the same hash, so matching a hash proves you found an input that produces it.
- Common passwords are guessed quickly because plain SHA-256 is **fast**: billions of guesses per second on a GPU.
- Defenses: **long, unique passwords**, **salts** (so one precomputed table can't be reused across users), and **slow hashes** (Argon2id, bcrypt, scrypt) that make each guess expensive. Also breached-password checks and MFA.

## Practice

On the Tools page, hash words with SHA-256 and compare lengths with MD5 and SHA-1. Then change one character and watch the whole hash change.

## Your task

Write `sha256Hex` (async, using Web Crypto) and `findPassword` that loops over a wordlist.

## Walk-through: hashing a word, step by step

**1. Text to bytes.** Hash functions work on bytes, not text. `new TextEncoder().encode("abc")` returns the bytes of the text.

**2. Hash it.** `crypto.subtle.digest("SHA-256", bytes)` returns a **Promise** because the browser does the work in the background. Put `await` before it, and mark your function `async`:

```js
async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  // buf is raw bytes; now turn them into hex text
}
```

**3. Bytes to hex text.** Wrap the buffer in `new Uint8Array(buf)` so you can loop over the numbers. For each number `b`, `b.toString(16).padStart(2, "0")` gives two hex characters (padding makes `5` into `05`). Join them all with `.join("")` and you have the 64-character hash.

You can check your function against a known value: the SHA-256 of `abc` begins `ba7816bf`.

**4. The dictionary loop.** An `async` function can `await` inside a loop:

```js
async function findPassword(targetHash, words) {
  for (const w of words) {
    if (await sha256Hex(w) === targetHash) return w;
  }
  return null;
}
```

Hash each candidate and compare it with the target. The first match is the answer.

## If something goes wrong

- Your result prints `[object Promise]`: you forgot `await`.
- `Unexpected reserved word` (a SyntaxError about `await`): the function containing `await` is not marked `async`.
- The hash looks too short: you forgot `padStart(2, "0")`, so bytes below 16 lost a digit.

## Check yourself

Why does the dictionary method find weak passwords quickly? (The hash is fast to compute, so an attacker can try huge lists of common passwords.)
