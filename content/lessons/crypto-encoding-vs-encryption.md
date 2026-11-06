## Three tools, three jobs

| | Encoding | Hashing | Encryption |
| --- | --- | --- | --- |
| Purpose | change **format** | create a **fingerprint** | provide **secrecy** |
| Reversible? | yes, by anyone | **no** (one-way) | yes, **with the key** |
| Uses a key? | no | no (or yes for HMAC) | yes |
| Examples | Base64, hex, URL encoding | SHA-256, bcrypt | AES-GCM, ChaCha20, RSA |

## Rules of thumb

- Need data to **survive transport** (binary in text, special characters in a URL)? **Encode**.
- Need to **verify integrity** or store passwords? **Hash** (use slow, salted hashes for passwords).
- Need to **keep data secret** but get it back later? **Encrypt** (authenticated mode such as AES-GCM), and protect the key.

## Common mistakes

- "The password is encrypted with Base64." It isn't; it is encoded and readable by anyone.
- Hashing without a salt, or with a fast hash (plain MD5/SHA-1/SHA-256) for passwords.
- Inventing your own encryption. Use vetted libraries.
- Reusing an IV/nonce with the same key.
- Storing the key next to the encrypted data.

## Use the Crypto workbench

On the **Tools** page, try each: encode text to Base64 and back, hash `password` and `Password` to see the avalanche effect, and encrypt a message with AES then try the wrong passphrase.

## Check yourself

Take the quiz below.
