## What ransomware does

Ransomware encrypts files (often after stealing a copy) and demands payment. Modern attacks start with phishing, exposed remote access or unpatched software, and spread through the network before encrypting.

## Respond in phases

1. **Detect and confirm:** unusual file changes, ransom notes, alerts.
2. **Contain:** isolate affected machines from the network quickly; disable compromised accounts. Avoid powering off if you need volatile evidence.
3. **Assess scope:** which systems, which data, what was copied.
4. **Eradicate:** remove the attacker's access and malware; rotate credentials.
5. **Recover:** restore from clean, tested backups; rebuild if needed.
6. **Review:** find the root cause, fix it, and update the plan.

## Plan before the crisis

- **Backups:** keep offline or immutable copies and **test restores**.
- **Incident response / contingency plan:** roles, contacts, decision authority, communication templates.
- **Legal and regulatory:** involve legal counsel and, where appropriate, law enforcement; some data-breach laws require notification.
- **Ransom decisions** are business and legal decisions with no guarantee of recovery; decide with leadership and counsel, not alone.

## Prevention

Patch, use MFA, limit admin rights, segment networks, filter email, and train users to report phishing.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **After recovery, find and fix the root cause.** Restoring files without removing the way the attackers got in (the phishing hole, an exposed service, stolen credentials) means **reinfection is likely**. Identify the **initial access**, close it, then **document lessons learned** and improve the plan, training and detections.

## Worked example: a ransomware response, in order

**Detection.** A user reports files renamed with a strange extension and a ransom note.

1. **Contain first.** Disconnect the affected machine from the network (cable out, Wi-Fi off) but **keep it powered on** so memory evidence survives. Isolate shared drives that it can reach. Ransomware spreads quickly through network shares.
2. **Declare an incident.** Escalate to the incident commander. Start a log with timestamps.
3. **Scope.** Which machines show encrypted files? Which accounts were used? Check the SIEM and endpoint tools for the same file extension and the same ransom note elsewhere.
4. **Preserve evidence.** Keep the ransom note and sample files. Capture memory and logs before wiping anything.
5. **Do not pay by reflex.** Payment is a leadership, legal and law-enforcement decision. It does not guarantee recovery.
6. **Eradicate and recover.** Rebuild affected systems from clean images and restore data from **backups you have verified are clean and offline**.
7. **Fix the cause.** Find the initial access (a phishing email? an exposed remote desktop port? an unpatched server?) and close it. Without this, **reinfection is likely**.
8. **Lessons learned.** Document what happened, what worked, and what to change.

## Why backups decide the outcome

Ransomware often targets backups too. Keep at least one copy **offline or immutable**, and practice restoring. A backup that has never been restored is only a hope.

## Self-check

1. Do you power off an infected machine? (No: disconnect it from the network but keep it on.)
2. What must happen before declaring recovery finished? (Root cause found and fixed; lessons documented.)
