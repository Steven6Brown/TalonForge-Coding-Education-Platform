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
