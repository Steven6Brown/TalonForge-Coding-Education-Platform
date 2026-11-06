## Vulnerabilities, threats and attacks

- A **vulnerability** is a latent weakness in a system, its security procedures, internal controls or implementation. A single SQL injection flaw could expose sensitive data. They are grouped by asset class:
  - **Hardware:** susceptibility to humidity or dust, unprotected storage
  - **Software:** insufficient testing, design flaws
  - **Network:** unprotected communication lines, insecure architecture
  - **Personnel:** weak hiring practices, poor security awareness
  - **Physical site:** flood-prone area, unreliable power
  - **Organizational:** no regular audits, no continuity plans
- A **threat** is a potential harm to an asset that exploits a vulnerability.
- An **attack** is an action that uses one or more vulnerabilities to realize a threat. Attacks can be logical (viruses, trojans) or physical (theft or damage), internal or external, malicious or the result of careless staff.

## Threats across assets

Each asset class can be hit in three ways. For example, a stolen server hurts *availability*, an unencrypted stolen disc hurts *confidentiality*, and a modified working program hurts *integrity*. Messages on networks can be destroyed (availability), read (confidentiality) or altered, delayed, reordered, duplicated or forged (integrity).

## Passive and active attacks

- **Passive:** learn or use information without affecting system resources. Two types: **release of message contents** (eavesdropping) and **traffic analysis** (observing who talks to whom, how often and how much, even when content is encrypted). Hard to detect, so **prevent** them (encryption).
- **Active:** alter resources or affect their operation. Four categories: **replay**, **masquerade** (pretending to be someone else), **modification of messages** and **denial of service**. Easier to detect, hard to prevent completely, so **detect and recover**.

## Attack surface

The reachable and exploitable points in a system: **network** (links, DoS), **software** (application and operating system code) and **human** (social engineering, human error, trusted insiders).

## Countermeasures

Anything that **prevents**, **detects** or helps **recover** from an attack, from better design and code to better operational practice. Example: an application that doesn't validate input is exposed to buffer overflows, SQL injection and cookie manipulation. Countermeasure: *never trust input* and validate **length, range, format and type**.

## Impact levels

Organizations rate the effect of a loss of confidentiality, integrity or availability as:

- **Low:** limited effect (functions work, but effectiveness is noticeably reduced; minor damage or loss)
- **Moderate:** serious effect (significant degradation, damage or loss; significant harm to individuals but not loss of life)
- **High:** severe or catastrophic effect (inability to perform primary functions, major damage or loss, or severe harm including loss of life)

## Check yourself

Take the quiz below.
