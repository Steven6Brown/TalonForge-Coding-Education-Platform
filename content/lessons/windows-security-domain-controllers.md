## Securing a Windows environment

## The pieces

- **Windows PC security:** keep the OS and applications patched, enable the built-in firewall and antimalware, use standard (non-admin) accounts for daily work, and encrypt drives (BitLocker).
- **Local Security Policy** controls password rules, account lockout and user rights on one machine.
- **Domain controllers (DCs)** run Active Directory Domain Services: they store the directory and authenticate users and computers for the whole domain.
- **Group Policy** pushes settings to many machines at once: password and lockout policy, firewall rules, software restrictions, logon banners.

## Protect domain controllers

DCs hold the keys to the kingdom: patch them first, restrict who can log on, keep them off the internet and back them up. Use **separate admin accounts** and the principle of least privilege.

## Audit and monitor

Enable auditing for logons, account changes and privileged group changes. Useful event IDs include **4624** (successful logon), **4625** (failed logon) and **4740** (account lockout). Send logs to a central system and alert on spikes.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Admin account hygiene.** Use **separate administrator accounts only for admin tasks**, and give them **least privilege**. Do your email and browsing with a normal account. If the everyday account is phished, the damage ("blast radius") stays small.
- **Why patch?** **Known vulnerabilities** are one of the leading ways attackers get in: they use public exploits against software that was never updated. **Patch management** and **vulnerability scanning** reduce that exposure.

## Worked example: hardening a small domain

**Problem.** Sam is an IT admin who reads email, browses the web, and administers servers, all with one powerful account.

**Why it is risky.** If Sam clicks a phishing link, the attacker has an account that can control everything.

**Better design (tiered administration):**

| Account | Used for | Rights |
| --- | --- | --- |
| `sam` | Email, browsing | Normal user |
| `sam-admin` | Server administration only | Administrator on servers, and only there |
| `sam-da` | Domain-level changes, rarely | Domain Admin, used only from a secured workstation |

Phishing `sam` now gives the attacker almost nothing. Least privilege limits the **blast radius**.

## A weekly hygiene checklist

1. **Patch** domain controllers and servers first, then workstations. Unpatched known vulnerabilities are one of the leading ways attackers get in.
2. **Review privileged groups** (Domain Admins, Administrators) and remove anyone who does not need to be there.
3. Require **MFA** and long unique passwords; rotate service-account passwords.
4. Check **event logs**: failed sign-ins (4625), new accounts, changes to privileged groups.
5. Restrict who can log on to domain controllers.

## Why domain controllers are special

The domain controller holds every account in the organization. Whoever controls it controls the network, so defenders protect it like the building's safe.

## Self-check

1. Why have a separate admin account? (To limit damage if the everyday account is phished.)
2. Why patch quickly? (Attackers use known, published vulnerabilities.)
