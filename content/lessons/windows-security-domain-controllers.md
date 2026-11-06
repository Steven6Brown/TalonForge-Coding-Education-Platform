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
