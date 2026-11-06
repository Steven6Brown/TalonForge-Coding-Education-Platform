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
