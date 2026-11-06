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

## Walk-through: proving you know a secret without sending it

1. The server wants to check you know the shared secret `k`. It sends a random **challenge**, say `c`.
2. You compute an **HMAC-SHA256** of the challenge using the secret as the key and send back only the result:

```
HMAC-SHA256(key = "k", message = "c")
  = 7aa2abf547bf1a1f096eedeeab61b60aa6435f34d7fb4f09abe3f30cf5c00f4f
```

3. The server computes the same value with its copy of the secret. If the two match, you must know the secret.

**Why this beats sending the password:** someone listening sees the challenge and the answer, but cannot reuse them. Next time the server sends a different challenge, so the old answer is useless (this blocks **replay** attacks). The secret itself never crosses the network.

## Writing it

```js
async function respond(secret, challenge) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(challenge));
  // convert the bytes to lowercase hex and return it
}
```

Hex conversion is the same as in the hashing lessons: `b.toString(16).padStart(2, "0")` per byte.

Check yourself against the example: `respond("k", "c")` should start with `7aa2abf5`.

## If something goes wrong

- A Promise instead of text: add `await` on both `importKey` and `sign`, and make the function `async`.
- Wrong value: HMAC is not the same as hashing `secret + challenge`. Use the HMAC functions.

## Check yourself

Why must the challenge be different every time? (If it repeated, an attacker could record one valid answer and replay it.)
