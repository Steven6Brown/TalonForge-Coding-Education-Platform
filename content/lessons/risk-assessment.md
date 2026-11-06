## Security is risk management

You can't protect everything equally. Risk assessment decides **what matters most** and **what to do about it**.

## The CIA triad

- **Confidentiality:** only authorized people can read the data.
- **Integrity:** data isn't altered without authorization.
- **Availability:** systems and data are accessible when needed.

## Risk vocabulary

- **Asset:** something of value (customer database, a web server, reputation)
- **Threat:** something that could cause harm (ransomware crew, insider, flood)
- **Vulnerability:** a weakness a threat can use (unpatched server)
- **Risk:** the chance of harm and how bad it would be

A simple model: **Risk = Likelihood x Impact**. Score each from 1 to 5 and rank.

## Treating risk

1. **Mitigate:** add controls (patching, MFA, backups)
2. **Transfer:** insurance, outsourcing contracts
3. **Accept:** consciously live with it (document who approved)
4. **Avoid:** stop the risky activity

## Control types

- **Preventive** (firewall, MFA), **detective** (logging, alerts), **corrective** (backups, incident response)
- **Administrative** (policy, training), **technical**, **physical** (locks, badges)

Frameworks like **NIST CSF** and **ISO 27001** organize this work: identify, protect, detect, respond, recover.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Simple risk score = Likelihood x Impact.** Rate each from, say, 1 to 5 and multiply. A very likely but trivial event (a typo in a log, 5 x 1 = 5) and a rare catastrophic one (a data center fire, 1 x 5 = 5) can score the same. Both still deserve a decision: accept, reduce, transfer (insurance) or avoid.

## Walk-through: a tiny risk register

Imagine a small clinic. List the **assets**, the **threats**, the **vulnerabilities**, then score each risk as likelihood x impact (1 = very low, 5 = very high).

| Asset | Threat | Vulnerability | Likelihood | Impact | Score |
| --- | --- | --- | --- | --- | --- |
| Patient records server | Ransomware | Unpatched software | 4 | 5 | **20** |
| Front-desk laptop | Theft | No disk encryption | 3 | 3 | **9** |
| Public website | Defacement | Weak admin password | 3 | 2 | **6** |
| Building | Fire | No offsite backup | 1 | 5 | **5** |

**Rank by score:** fix the ransomware risk first. The fire risk scores low because it is unlikely, but it is catastrophic, so you still **decide** about it (here, an offsite backup is cheap).

## Choose a treatment for each

- Ransomware: **mitigate**: patch quickly, keep offline backups, train staff.
- Laptop theft: **mitigate**: turn on disk encryption (BitLocker).
- Website defacement: **mitigate**: strong password, MFA.
- Fire: **transfer** (insurance) plus **mitigate** (offsite backups).

If the clinic decided to live with a low risk, that is **accept**, and someone senior should sign it off in writing.

## Which part of the CIA triad is hit?

- Ransomware locks the data: **availability** (and possibly confidentiality if data is stolen).
- A stolen laptop exposes data: **confidentiality**.
- A defaced site: **integrity**.

## Types of control, by example

- Preventive: MFA, firewall. Detective: logs and alerts. Corrective: restore from backup.
- Administrative: policy and training. Technical: encryption. Physical: locks and badges.

## Check yourself

Which risk would you tackle first if both had impact 4, one with likelihood 5 and one with likelihood 2? (The likelihood-5 one: score 20 versus 8.)
