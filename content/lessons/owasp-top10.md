## What is the OWASP Top 10?

A community-maintained list of the most critical web application risks. It's the shared vocabulary of AppSec, pentest reports and many compliance programs. Categories shift between editions; the themes below are stable.

## The themes

- **Broken access control**: users act outside their permissions (viewing `/orders/123` of someone else). Fix: enforce authorization on the server for every object; deny by default.
- **Cryptographic failures**: sensitive data sent or stored unprotected, weak algorithms. Fix: TLS everywhere, modern algorithms, no home-grown crypto.
- **Injection** (SQL, OS command, XSS): untrusted data interpreted as code. Fix: parameterized APIs and output encoding.
- **Insecure design**: missing security thinking before coding. Fix: threat modeling, abuse cases.
- **Security misconfiguration**: default passwords, verbose errors, open cloud buckets. Fix: hardening baselines, automated config scans.
- **Vulnerable and outdated components**: unpatched libraries. Fix: inventory, updates, dependency scanning.
- **Authentication failures**: weak passwords, no MFA, session fixation. Fix: MFA, rate limiting, secure sessions.
- **Integrity failures**: unsigned updates, insecure deserialization, tampered CI pipelines.
- **Logging and monitoring failures**: attacks go unnoticed. Fix: log security events and alert on them.
- **SSRF**: the server fetches attacker-chosen URLs, reaching internal services. Fix: allowlists, network segmentation.

## How to use it

For every feature ask: *who is allowed, what input is untrusted, what happens if this fails, how would I notice abuse?* Free practice: OWASP Juice Shop and WebGoat.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Fixing injection.** Injection happens when user input is glued into a command or query as text, so the input can change the meaning. The fix is to **separate code from data**: use **parameterized queries** or other safe APIs (the query shape and the values travel separately), plus **input validation**. Never build queries or shell commands by string concatenation.
- **SSRF (server-side request forgery).** The attacker tricks the **server** into making requests for them, to internal addresses or any URL. Internal services and cloud **metadata endpoints** (which can hand out credentials) are common targets, because the server can reach places the attacker cannot. Defend with **allowlists** of permitted destinations for outbound requests.
