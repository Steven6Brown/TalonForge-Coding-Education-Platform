## Storing passwords

Systems shouldn't store passwords, only **hashes**. On Unix, `/etc/shadow` holds a hash per account. At login the system hashes what you type and compares it to the stored value; it never needs the original.

Plain hashing isn't enough: identical passwords give identical hashes, and attackers precompute common ones. A **salt** is a random string added to the password before hashing, so the same password yields different hashes for different users and precomputation becomes useless. Production systems use a **slow, salted password hash** (bcrypt, scrypt, Argon2 or PBKDF2) rather than a single fast SHA round.

## Password attacks and countermeasures

- **Specific account attack:** guess passwords for one account. Countermeasure: **account lockout** after a small number of failed attempts (commonly no more than about five), plus rate limiting and monitoring.
- **Popular password attack:** try one common password against many accounts. Countermeasure: policies that block common passwords.
- **Workstation hijacking:** use a logged-in, unattended machine. Countermeasure: automatic **lock or logout after inactivity**.
- **Exploiting user mistakes:** written-down passwords and **social engineering**. Countermeasure: training, intrusion detection, simpler passwords combined with another factor.
- **Default password attack:** vendors' preconfigured admin passwords. Countermeasure: policy to change defaults.
- **Electronic monitoring:** sniffing a password sent across the network (Telnet). Encrypting only the password isn't enough if the encrypted value can be **replayed**; use secure protocols (SSH, TLS) with challenge-response or session keys.
- **Dictionary attack:** the attacker has the password file and compares hashes of common passwords. Countermeasures: protect the file, **detect** compromise, reissue passwords quickly.
- **Rainbow tables:** precomputed hash tables for many passwords. Countered by a **sufficiently large salt** and a strong, slow hash.

## Hash applications

Beyond passwords, hashes identify malware, support virus scanners, verify software authenticity and file integrity, and underpin keyed hashes (**MACs**) and digital signatures.

## Your task

Implement `saltedSha256Hex` with the browser's Web Crypto API (`crypto.subtle`). It is asynchronous, so the function is `async` and you `await` the digest.

## Walk-through: why a salt changes the hash

Hash the password `abc` with SHA-256:

```
abc          -> ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

Every user whose password is `abc` has this same hash, and an attacker can look it up in a precomputed table.

Now add a **salt**: random text stored next to the hash, unique per user. Hash `salt + password`, for example `x1abc`:

```
x1abc        -> 3390244a5393185ea2284c008d574d71c0e2290aadc49d7384bea0e37eb67307
```

Same password, completely different hash. A table built for unsalted hashes is useless, and the attacker must attack each user's hash separately.

## Writing it

```js
async function saltedSha256Hex(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  // turn the bytes into hex
}
```

Convert with `[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")`.

Check your function: `saltedSha256Hex("abc", "x1")` should start with `3390244a`.

## What the salt does and does not do

A salt defeats **precomputed tables** and **spotting duplicates**. It does **not** make guessing a single weak password slow, because SHA-256 is fast. For that, real systems use deliberately slow hashes (Argon2id, bcrypt, scrypt) with a unique salt each.

## If something goes wrong

- A Promise instead of text: add `await` and make the function `async`.
- Wrong hash: you put the salt after the password. The task says `salt + password`.

## Check yourself

Why store the salt in the database next to the hash? (It is not secret. It only has to be unique, and the server needs it to check a login.)
