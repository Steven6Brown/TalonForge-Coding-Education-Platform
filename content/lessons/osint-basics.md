## Open-source intelligence

**OSINT** is collecting and analyzing information from public sources. Journalists, investigators, recruiters and security teams all use it.

## Common sources

- DNS records and **certificate transparency** logs (which subdomains exist)
- Search engines with advanced operators
- Code repositories (accidentally committed keys and internal hostnames)
- Job postings (which technologies a company runs)
- Public registries and archived web pages

## Passive vs active

**Passive** collection never touches the target's systems (reading public records). **Active** collection (port scans, probing logins) does, and needs authorization.

## Use it defensively

Run OSINT on **your own** organization: what could an attacker learn about staff, systems and exposed services? Remove leaked secrets, retire forgotten subdomains, and train staff on oversharing.

## Ethics

Public does not mean consequence-free. Stay within the law and platform terms, respect individuals' privacy, don't impersonate people, and document your sources.

## Check yourself

Take the quiz below.

## Walk-through: an OSINT review of your own organization (defensive)

Pretend you work for a small company called Example Corp. Here is how you would look at what the public can see, **passive only** (reading public information, never probing).

1. **What names exist?** Search for the company's domain in a certificate transparency search site. Each certificate lists names such as `www.example.com` and `old-test.example.com`. A forgotten `old-test` site is a risk: nobody maintains it.
2. **What do job postings reveal?** A posting asking for "experience with Cisco ASA 8.x and Apache Struts" tells attackers which technologies you run and which versions to look for.
3. **What is on the code sites?** Search public repositories for the company name. Developers sometimes commit passwords, API keys or internal host names by accident. If found: revoke the secret immediately.
4. **What do staff share?** Employee profiles can reveal org charts, phone formats and who has access to what. That is useful for phishing.
5. **What did the web archive keep?** Old pages may show things you have since removed.

## Turn findings into actions

| Finding | Fix |
| --- | --- |
| Forgotten subdomain | Remove it or secure and monitor it |
| Key in a public repo | Rotate (replace) the key, then clean the history |
| Detailed tech stack in postings | Keep versions vague |
| Oversharing staff | Short awareness training |

## Rules to stay on the right side of the line

Only collect what is public, do not pretend to be someone else, do not log in to things you are not authorized for, and write down where each fact came from.

## Check yourself

Is looking up a company's job postings passive or active? (Passive: you are reading public pages without touching their systems.)
