## Two keys instead of one

In **asymmetric (public-key) cryptography** each party has a **public key** (shared) and a **private key** (kept secret). Security rests on the difficulty of deriving the private key from the public key. It is slower than symmetric encryption, so it is typically used to exchange a symmetric session key or to sign.

Correct usage in practice:

- **Confidentiality:** encrypt **to** the recipient's **public** key; only their private key decrypts.
- **Authenticity and integrity (signatures):** the sender signs with their **private** key; anyone verifies with the sender's **public** key.

## Digital signatures

1. The sender **hashes** the message (a fixed-length fingerprint; changing one bit changes the hash).
2. The sender **signs the hash** with their private key.
3. The receiver recomputes the hash of the received message and **verifies** the signature with the sender's public key. If they match, the message is intact (**integrity**) and came from the key holder (**authenticity**, supporting **non-repudiation**).

Encrypting alone doesn't protect integrity: an encrypted message can be altered in transit without the receiver noticing, which is why signatures (or authenticated encryption) are added.

## Hash requirements

A cryptographic hash is **length-reducing** (any input, fixed output), **one-way** (hard to find an input for a given output) and **collision-resistant** (hard to find two inputs with the same hash). MD5 and SHA-1 have known collision attacks; use SHA-2 or SHA-3.

## The key-trust problem

How does your browser know that a public key really belongs to your bank? Through an **X.509 certificate**: a signed statement that binds an identity to a public key. It is like a driver's license: a trusted authority checked your identity and vouches for you.

A certificate contains the **subject**, the **subject's public key**, the **issuer** (certificate authority), a **serial number**, **validity dates**, **extensions** (permitted uses) and the **issuer's digital signature**.

## PKI: public key infrastructure

PKI is the system for creating, distributing, validating and revoking certificates:

- **Certificate Authority (CA):** signs certificates after verifying the requester.
- **Registration Authority (RA):** helps verify identities before the CA issues.
- **Repository:** where certificates (and revocation lists) are published.
- **Management system:** issuance, renewal and **revocation**.

To get a certificate you send a **certificate signing request** with your public key and proof you hold the private key; the CA checks your information, signs, and returns the certificate. Standards include PKCS#1 (RSA), PKCS#10 (certificate requests) and PKCS#12 (personal information exchange).

## Validating a certificate

A client checks that the **issuer is trusted** (the chain leads to a trusted root), that the certificate is **not revoked** (CRL or OCSP), that the **current time is within the validity period**, and that the signature verifies and the name matches the site. Certificates also secure TLS, can replace passwords for employee access and may be stored in browsers or on smart cards.

## Your task

Write the validity decision logic a client applies to a certificate.
