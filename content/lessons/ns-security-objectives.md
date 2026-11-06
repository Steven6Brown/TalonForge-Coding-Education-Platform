## What does "secure" mean?

**Cyberspace** is hardware, software, networks, data, people and policies. **Security** is the state of being free from danger and not exposed to damage from accidents or attacks, and also the *process* of getting there. Its goal is protecting valuable **assets**, so first ask:

- What are the assets (equipment, information, both)?
- Are we protecting them from insiders, outsiders or both?
- What risks and potential losses exist?
- What measures are required, how much protection is enough, and what budget and people do we have?

## The five security aspects

1. **Confidentiality:** data is disclosed only to authorized people. Related: **privacy**, which ensures information is disclosed only to the intended individual (you can read your own home directory, not others'). Mechanisms: encryption, access control.
2. **Integrity:** data is modified only by authorized individuals in authorized ways. It can be broken by attackers, bad configuration (wrong file permissions) or programming errors (processing the same transaction twice).
3. **Availability:** assets and services can be used when needed. The opposite is denial of service. Physical damage to cables, servers or data also affects it.
4. **Authenticity:** a claimed identity (authentication) or a claimed data source (data-origin authentication) is genuine. Tools: passwords, MFA, digital signatures.
5. **Accountability:** actions can be traced to who did them. **Non-repudiation** has two forms: *proof of origin* (the sender can't deny sending) and *proof of delivery* (the receiver can't deny receiving). Tools: digital signatures and hashes.

Together, confidentiality, integrity and availability form the **CIA triad**, a model for guiding policy.

## Trust and policy

**Trust** is the foundation: technical mechanisms raise trust in identities and systems (multi-factor authentication provides more assurance than a password alone). **Policy** defines the rules: a strong password policy supports strong authentication, a VPN policy protects against unauthorized access, and an access policy protects sensitive information.

## Check yourself

Take the quiz below.

## Worked examples: which objective was broken?

For each incident, name the objective that failed: **confidentiality** (only authorized readers), **integrity** (only authorized changes), **availability** (accessible when needed), **authenticity** (genuine, from who it claims) or **accountability** (actions traceable to a person).

| Incident | Objective |
| --- | --- |
| A stolen laptop exposes customer records | Confidentiality |
| An attacker changes an account balance | Integrity |
| A DDoS attack takes a website offline | Availability |
| A forged email appears to come from the CEO | Authenticity |
| Two admins share one login, so nobody can tell who deleted a file | Accountability |
| A file's permissions were set wrong and it became editable by everyone | Integrity (a configuration error, not an attacker) |
| The same transaction is processed twice because of a programming bug | Integrity (an error, not an attacker) |

**Attackers are not the only cause.** Misconfiguration, mistakes and failures break these objectives too.

## Start with assets and risks

Before choosing protections, ask: *What are we protecting? From whom (insiders, outsiders or both)? What would a loss cost? How much protection is enough, and what is our budget?* Security is a process of answering these questions repeatedly, not a product you buy once.

## Self-check

1. Which objective does encryption mainly support? (Confidentiality.)
2. What does "accountability" need? (Individual accounts and logs so actions can be traced.)
