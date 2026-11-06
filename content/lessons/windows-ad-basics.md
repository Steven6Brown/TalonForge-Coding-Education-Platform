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
