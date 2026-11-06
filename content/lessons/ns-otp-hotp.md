## One-time passwords

A **one-time password (OTP)** is valid for a single use or a short time, so stealing it is far less useful than stealing a static password. The most common kind is a **time-synchronized OTP** shown on a hardware or software **token**: a code that changes about every 30-60 seconds.

How it works: the token and an authentication server share a **secret seed** (random, different per token) and the same algorithm. The token has a clock. The server tracks **clock drift** for each token and adjusts the codes it expects.

## HOTP and TOTP

- **HOTP (RFC 4226):** an **HMAC-based** OTP driven by a **counter**.
- **TOTP (RFC 6238):** the same algorithm where the counter is **the current time divided by a step** (usually 30 seconds), `counter = floor(unix_time / 30)`.

## The HOTP algorithm

1. Compute **HMAC-SHA1(secret, counter)** where the counter is an **8-byte big-endian** integer. This gives 20 bytes.
2. **Dynamic truncation:** the low 4 bits of the last byte give an **offset**; take the 4 bytes starting there, and clear the top bit (so the value is a positive 31-bit integer).
3. Take that integer **modulo 10^digits** (usually 6) and left-pad with zeros.

The RFC test secret is the ASCII string `12345678901234567890`; counters 0 to 4 produce `755224, 287082, 359152, 969429, 338314`.

## Security notes

- Authenticator apps are better than SMS codes (SIM swapping), but TOTP codes can still be **phished in real time**. Hardware keys and passkeys (FIDO2/WebAuthn) resist that.
- Servers accept a small window of counters or time steps, and should reject a code that was already used.
- Protect the shared secret like a password; apps scan it from a QR code.
- Always keep **recovery codes**.

## Your task

Implement HOTP with Web Crypto (`HMAC` with `SHA-1`) and match the official test vectors.

## Walk-through: the four steps with a known answer

The standard (RFC 4226) publishes test values. With the secret `12345678901234567890` and a 6-digit code, the codes for counters 0, 1 and 2 are:

```
counter 0 -> 755224
counter 1 -> 287082
counter 2 -> 359152
```

If your function returns these, it is correct.

**Step 1: make the message.** The counter becomes **8 bytes**, big-endian (most significant byte first). `new DataView(buffer).setBigUint64(0, BigInt(counter))` writes it.

**Step 2: HMAC it.** `crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])`, then `await crypto.subtle.sign("HMAC", key, buffer)`. The result is 20 bytes.

**Step 3: dynamic truncation.** Look at the **last byte** of those 20. Its lowest 4 bits (`& 0x0f`) give a number from 0 to 15, the **offset**. Take the 4 bytes starting at that offset and combine them into one 32-bit number, clearing the top bit (`& 0x7f` on the first of the four):

```js
const code = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
```

**Step 4: shorten.** `code % 10 ** digits` keeps the last 6 digits; `String(...).padStart(digits, "0")` restores leading zeros.

## TOTP is just HOTP with a clock

For an authenticator app, the counter is `Math.floor(currentTimeInSeconds / 30)`. Everyone with the secret computes the same code during the same 30 seconds.

## If something goes wrong

- All codes wrong: check the counter is 8 bytes and the hash is SHA-1.
- Code has too few digits: you forgot `padStart`.
- `TypeError` about BigInt: `setBigUint64` needs `BigInt(counter)`.

## Check yourself

Why does the code change every 30 seconds in an authenticator app? (The counter is derived from the time, and it increases every 30 seconds.)
