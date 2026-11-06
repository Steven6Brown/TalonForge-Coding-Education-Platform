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
