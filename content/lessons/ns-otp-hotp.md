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
