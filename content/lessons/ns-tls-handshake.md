## Three jobs, ten messages

A **TLS 1.2** handshake does three things:

1. **Exchange cipher-suite capabilities** and agree on one suite.
2. **Authenticate the server's certificate.**
3. **Generate a symmetric session key.**

After it finishes, the encrypted and authenticated connection begins and all data is protected by the session key.

## The messages in order

1. **ClientHello:** the client lists the cipher suites and options it supports and sends a random value (**client random**).
2. **ServerHello:** the server picks parameters from that list and sends its own random (**server random**).
3. **Certificate:** the server sends its certificate chain.
4. **ServerKeyExchange** (only for Diffie-Hellman suites): the server's DH parameters, signed.
5. **ServerHelloDone:** the server has sent everything.
6. **ClientKeyExchange:** the client's contribution to the key. With RSA the client generates a random **pre-master secret** and encrypts it with the server's public key; with DH it sends its DH public value.
7. **ChangeCipherSpec:** the client says it is switching to encrypted communication.
8. **Finished:** the first encrypted message, containing a MAC over the handshake, so tampering is detected.
9. The server derives the same keys (from the pre-master secret and both randoms) and sends **ChangeCipherSpec**.
10. The server's **Finished**, again with a MAC over the handshake.

## Certificate verification in detail

The CA computes a **hash** of the certificate's contents and signs it with its **private key**. The browser:

1. computes the hash of the received certificate fields,
2. uses the CA's **public key** to verify the signature (recover the signed hash), and
3. compares: if equal, the certificate is genuine.

It also **builds the chain** to a trusted root CA and checks **expiry**, **revocation** and that the **domain name matches**. Failing any check produces the browser warning.

## Versions in practice

TLS 1.2 remains widely deployed and has no known fundamental vulnerabilities when configured well; TLS 1.3 is faster (fewer round trips), removes obsolete options and encrypts more of the handshake. Many organizations support both.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **TLS versions.** **SSL 2.0 and 3.0 are obsolete** and insecure. **TLS 1.0 through 1.3** followed. **TLS 1.0 and 1.1 are deprecated**, so the versions in current use are **TLS 1.2 and 1.3**. **TLS 1.3** (2018) simplifies the handshake and removes weak options.

## Worked example: what happens when you open an HTTPS site

Follow a (simplified) TLS 1.3 connection to `shop.example`:

1. **Hello.** Your browser says: "Here are the encryption methods I support, and a random number." It also sends its half of a key exchange.
2. **Server hello and certificate.** The server picks a method, sends its own random number and key share, and presents its **certificate**.
3. **Check the certificate.** Your browser verifies: does the name match `shop.example`? Was it signed by a **certificate authority** the browser trusts? Is it within its dates and not revoked? If any check fails you see a warning.
4. **Agree on keys.** Both sides combine their key shares (a **Diffie-Hellman** exchange) into the same shared secret without ever sending it. Session keys are derived from it.
5. **Finished.** Each side proves it holds the same keys. From here on, everything is encrypted and tamper-evident.

An eavesdropper sees the certificate and the public values but cannot compute the shared secret.

## Why a certificate matters

Encryption alone does not tell you **who** you are talking to. The certificate ties the server's public key to its name, signed by someone you trust. Without that check, an attacker in the middle could pose as the server.

## Version cheat sheet

SSL 2.0 and 3.0: obsolete. TLS 1.0 and 1.1: deprecated. **TLS 1.2 and 1.3: current.** TLS 1.3 shortens the handshake and removes weak options.

## Self-check

1. What does the certificate prove? (That this public key belongs to this site, as vouched for by a trusted authority.)
2. Which versions should you still use? (TLS 1.2 and 1.3.)
