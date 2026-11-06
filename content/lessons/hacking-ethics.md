## The line between hacker and criminal

The techniques are the same. The difference is **permission**.

Computer misuse laws (for example the U.S. Computer Fraud and Abuse Act and equivalents elsewhere) criminalize unauthorized access, even when no damage is done. This lesson is education, not legal advice; when in doubt, ask a lawyer and get it in writing.

## Rules of engagement

A professional engagement defines, in writing:

- **Scope:** which systems, IP ranges, apps and dates are in play
- **Out of scope:** systems you must not touch (production databases, third parties)
- **Methods:** whether social engineering, DoS or physical tests are allowed
- **Contacts and escalation:** who to call if something breaks
- **Data handling:** how to store and destroy any sensitive data you encounter

## Good habits

- Test only what you own or are explicitly authorized to test.
- Minimize impact: prove the vulnerability, don't exploit it destructively.
- Report responsibly, with clear steps to reproduce and remediation advice.
- Respect privacy. Don't read, copy or keep data you don't need.
- Join **bug bounty** programs (HackerOne, Bugcrowd) only within their published scope.

## Your path in the field

Certifications such as CompTIA Security+, PenTest+, eJPT, OSCP and Blue-team options like CySA+ or BTL1 give structure. Pair them with portfolio work: CTF write-ups, home-lab documentation, and open-source tools.

## Check yourself

Complete the quiz to finish.

## Key facts this lesson's quiz checks

- **Out-of-scope findings.** A penetration test has a written **scope**: the systems you may test. If you stumble on a weakness outside it, **stop, document it, and report it to the client**. Do not test it further. Scope protects both sides: the client has not agreed to risk on those systems, and you are only legally covered inside the agreement.
- **Where is it safe to practice password cracking?** Only on **your own data** (hashes you generated yourself) or purpose-built **labs and CTFs**. Cracking real people's credentials, even "just to see", causes real harm and can be a crime.
