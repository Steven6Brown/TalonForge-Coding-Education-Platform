## The problem with HTTP

**HTTP** sends everything in clear text. Anyone on the path can read credit-card numbers or passwords and can alter pages. **HTTPS** is HTTP carried over an encrypted **SSL/TLS** channel. The address starts with `https://` and a secure channel is established **before** any sensitive data is sent.

One side effect: because the tunnel hides contents, network-based anti-malware appliances can't inspect HTTPS downloads unless the organization deliberately decrypts traffic.

## SSL and TLS history

- **SSL 1.0** (Netscape, 1994): never released publicly.
- **SSL 2.0** (1995): serious security flaws.
- **SSL 3.0** (1996): fixed SSL 2.0's problems, later also broken.
- **TLS 1.0** (1999, RFC 2246): based on SSL 3.0. **TLS 1.1** (2006), **TLS 1.2** (2008), **TLS 1.3** (2018).

Today use TLS 1.2 or 1.3; SSL and early TLS versions are deprecated.

## What TLS provides

**Privacy** (encryption) and **data integrity** between two applications over an insecure network, plus **authentication** of the server (and optionally the client). Web browsing, email, messaging and APIs all use it. TLS works at the application layer, peer to peer, and is made of sub-protocols: handshake, change cipher spec, alert and record.

Three phases:

1. **Negotiate** algorithms (key exchange, authentication, encryption, MAC).
2. **Key exchange and authentication:** the client authenticates the server with its certificate and they establish shared secrets (RSA or Diffie-Hellman).
3. **Protected data transfer:** bulk data is encrypted with a fast **symmetric** cipher (AES) and protected by message authentication codes.

## Diffie-Hellman key exchange

Two parties agree on a shared secret over a public channel, with no secret sent:

1. Publicly agree on a prime **p** and a base **g**.
2. Alice picks a secret **a**, sends **A = g^a mod p**. Bob picks **b**, sends **B = g^b mod p**.
3. Alice computes **B^a mod p**; Bob computes **A^b mod p**. Both equal **g^(ab) mod p**.

An eavesdropper sees p, g, A and B but computing a or b (the discrete logarithm) is infeasible for large numbers. Example with p = 23, g = 5, a = 6, b = 15: A = 8, B = 19 and the shared secret is 2.

Important limits: plain DH doesn't authenticate the parties, so a **man-in-the-middle** can sit between them. That's why TLS authenticates with certificates (and signatures) around the exchange. **Ephemeral** DH (DHE/ECDHE) generates fresh keys per session, giving **forward secrecy**: recorded traffic can't be decrypted later even if the server's long-term key leaks.

## Your task

Implement the Diffie-Hellman computation with BigInt and confirm both sides get the same secret.
