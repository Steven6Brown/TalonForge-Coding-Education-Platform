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

## Worked examples: the four ideas in one login

You walk up to a bank's online site:

1. **Identification:** you type your username, `ana`. (You claimed an identity.)
2. **Authentication:** you type your password and approve a code on your phone. The bank **verifies** the claim.
3. **Authorization:** the bank decides what `ana` may do: view her own accounts, but not other customers'.
4. **Access control:** the system actually **enforces** it: a request for someone else's account is refused.

## Which factor is it?

| Method | Factor |
| --- | --- |
| Password, PIN, security question | Something you **know** |
| Smart card, phone authenticator, hardware key | Something you **have** |
| Fingerprint, iris, face | Something you **are** (static biometric) |
| Typing rhythm, voice pattern, handwriting | Something you **do** (dynamic biometric) |

**MFA means different categories.** A password plus a PIN is **two things you know**: that is one factor used twice, not true MFA. A password plus a phone code is two different factors.

**Authentication is not only for people.** Devices (a laptop proving it is company-owned), applications and services (an API using a key) and even organizations (federation between companies) authenticate too.

## Self-check

1. Is a fingerprint "something you know"? (No: something you are.)
2. Password and security question: MFA? (No: both are knowledge factors.)
3. Which step decides what you may do after logging in? (Authorization.)
