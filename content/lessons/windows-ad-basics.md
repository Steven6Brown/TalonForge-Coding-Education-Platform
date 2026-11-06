## Why Active Directory matters

Most large organizations run **Active Directory (AD)**: a central database of users, computers and groups, with policies applied across the network. Compromising AD often means compromising the company, so defenders and testers both study it.

## Key concepts

- **Domain:** a boundary of administration. A **domain controller (DC)** holds the directory and authenticates logins.
- **Users, groups, OUs:** accounts, collections of accounts, and folders to organize and delegate them.
- **Group Policy (GPO):** settings pushed to many machines (password rules, firewall, software restrictions).
- **Kerberos:** the default authentication protocol. Users get tickets instead of sending passwords around.
- **Service accounts:** non-human accounts that run applications; often over-privileged with weak passwords.

## Defender checklist

- Use **tiered administration**: separate everyday accounts from admin accounts.
- Require **MFA** and long unique passwords; rotate service-account secrets.
- Patch domain controllers first; limit who can log on to them.
- Monitor Windows event logs: failed logons (4625), account changes, privileged group changes.

## Practice safely

Build a small AD lab in virtual machines (Windows Server evaluation edition plus a Windows client) on an isolated network, and explore with PowerShell.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Active Directory (AD)** is Microsoft's **directory service**: a central database of users, computers, groups and policies for an organization. Most enterprises sign staff in through AD, which makes it a prime target for attackers.
- **Group Policy (GPO)** pushes **security and configuration settings to many machines at once**: password rules, disabling risky features, deploying settings consistently. One policy change can protect thousands of computers.

## An analogy for beginners

Think of a large office building. **Active Directory** is the security desk: it keeps the master list of every person (users), every device (computers) and every team (groups), and it decides who may enter which room.

- The **domain** is the building.
- The **domain controller (DC)** is the security desk itself, the server that checks IDs. Protect it above everything else.
- **Users and groups** are the people and teams on the list. You give access to a **group** and add or remove people, instead of touching every door.
- An **OU (organizational unit)** is a folder for organizing them, like "Finance floor". Rules can be applied to a whole OU.
- **Group Policy** is a rulebook posted in the building: password rules, which programs may run, firewall settings. One change applies to every machine in scope.
- **Kerberos** is how you prove who you are: you show your ID once and get a **ticket** (like a day pass) to use at each door, instead of showing your password over and over.

## What defenders look for

- A **service account** (a login used by software, not a person) with a weak password and too much access.
- People using one all-powerful account for everything (email, browsing and admin).
- Event **4625** in the Windows logs means a failed sign-in. Many of them for one account is a password-guessing sign.

## Where you will meet this

Almost every company with Windows computers uses AD, so help desk, sysadmin and SOC roles all touch it. The Careers section has scenarios on resetting accounts and granting access through groups, which are AD tasks.

## Check yourself

Why give access to a group rather than to each person? (It is easier to manage and audit: add or remove one person from the group instead of changing many resources.)
