## Why not send the password?

Sending a password across a network exposes it to eavesdropping, and even an encrypted password can be **replayed** by an attacker who records it. **Challenge-response** authentication lets a client prove it knows a secret **without sending the secret**.

## The protocol

1. The client sends a login request.
2. The server replies with a **challenge**: a fresh, unpredictable value (a nonce).
3. The client combines the challenge with the shared secret (traditionally by encrypting it; modern designs use a keyed hash such as **HMAC**) and sends back the **response**.
4. The server performs the same computation with its copy of the secret. If the values match, the client knows the secret and is allowed on the network; if not, access is denied.

Because every challenge is different, a captured response is useless later: **replay protection**.

## Symmetric shared keys

Both sides know the user's password (or a key derived from it by hashing). One side proves knowledge by encrypting or authenticating something the other side can check with the same key. If the other party gets the expected result, the sender's identity is verified.

## Other models

- **X.509 certificates:** the client or server proves identity with a private key whose public key is in a CA-signed certificate (see the certificates lesson).
- **Kerberos:** a ticket-based protocol with a trusted third party; the foundation of Windows domain authentication.

## Design notes

- Use a **fresh random challenge** each time.
- Use a standard keyed construction (HMAC) rather than inventing one.
- Prove **both directions** (mutual authentication) when clients need to trust the server too.
- Protect the shared secret on the server; a stolen secret store lets attackers impersonate users.

## Your task

Implement the response function with HMAC-SHA256 using Web Crypto.
