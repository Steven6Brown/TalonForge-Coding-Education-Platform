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

## Worked scenarios: what would you do?

**Scenario 1: scope.** Your agreement lets you test `app.client.com`. While testing you notice `payroll.client.com`, which looks vulnerable.
- Right action: **do not test it.** Stop, write down what you observed without exploiting it, and tell the client so they can add it to scope or fix it.

**Scenario 2: you found real customer data.** A test exposes a table of customer records.
- Right action: stop at proof (a screenshot with the sensitive fields blurred), report it immediately, and do not copy or keep the data.

**Scenario 3: a friend asks you to "check" their ex's account.**
- Right action: refuse. Without authorization from the account owner this is unauthorized access, which is illegal however it is described.

## What makes testing legal and ethical

- **Written authorization** from someone who has the right to give it.
- A defined **scope**: which systems, which dates, which techniques.
- **Rules of engagement** (for example, no denial-of-service, no social engineering of staff).
- A promise to **report findings** and protect any data you touch.

## Where to practice legally

Your own virtual machines, intentionally vulnerable apps (DVWA, Juice Shop), CTF competitions, and bug bounty programs that publish a scope and rules. Hashes you generated yourself are fine for learning password cracking; real people's leaked credentials are not.

## Self-check

1. Who can authorize a test of a company's systems? (A person with the authority to do so, in writing: not you, a friend or a rival.)
2. What do you do with an out-of-scope finding? (Stop, document, report.)
