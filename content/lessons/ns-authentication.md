## Four related ideas

- **Identification:** presenting an identity or credentials (a username).
- **Authentication:** validating that identity: checking the credentials are genuine, not fabricated.
- **Authorization:** deciding whether the authenticated identity may perform a task; enforcing policies.
- **Access control:** granting or denying resources and services based on security level and authorization.

Authentication applies to users (local, remote and network access), **devices**, **applications and services**, and **organization to organization** (federation).

## Four means of authenticating a user

1. **Something you know:** password, PIN, answers to prearranged questions.
2. **Something you have:** keycard, smart card, physical key, authenticator device (a **token**).
3. **Something you are** (static biometrics): fingerprint, retina, iris, face, hand geometry.
4. **Something you do** (dynamic biometrics): voice pattern, handwriting, typing rhythm.

A system can combine them. **Multi-factor authentication (MFA)** uses factors from different categories: one factor (password), two (password plus a code from a phone or token), three (adding a biometric), and some systems add a location factor. Use MFA for important systems; two passwords are still only one factor.

## Biometric authentication

Biometrics authenticate based on unique physical or behavioral characteristics using **pattern recognition**. They are technically complex and costlier than passwords or tokens.

- **Fingerprint:** pattern of ridges and furrows; systems extract features and store a numeric template rather than the whole image.
- **Hand geometry:** shape and finger lengths and widths.
- **Retina:** the vein pattern beneath the retinal surface, captured with low-intensity light. **Iris:** detailed iris structure.
- **Signature and voice:** vary from sample to sample, which makes matching harder.

Because two samples from the same person never match exactly, systems set a threshold and accept two kinds of error: **false rejects** (the real user is denied) and **false accepts** (an impostor passes). A stolen biometric can't be reset like a password, so store templates protected.

## Practical advice for users

Don't use personal information, dictionary words, words spelled backward, sequences or old passwords; don't reuse a password across accounts; use a password manager. Administrators must **change default passwords** on switches, routers and servers before deployment.

## Check yourself

Take the quiz below.
