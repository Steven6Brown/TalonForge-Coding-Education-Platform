## MITRE ATT&CK

**ATT&CK** is a public catalog of how real attackers behave, organized as a matrix.

- **Tactics** are goals: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact.
- **Techniques** are the methods, with IDs like T1110 (Brute Force) or T1566 (Phishing).

SOCs use it to label alerts, find gaps in detection and write clearer reports.

## The alert lifecycle

1. **Detect:** an alert fires or a user reports something.
2. **Triage:** validate with evidence and classify (true, benign, false positive). Set priority.
3. **Investigate:** scope hosts, accounts, timeline and indicators of compromise.
4. **Contain:** limit damage proportionally, preserve evidence.
5. **Eradicate and recover:** remove the cause, restore service.
6. **Document and improve:** write the ticket, tune detections.

## Good ticket notes

Timeline, indicators (IPs, domains, hashes, accounts), the queries you ran, actions with times, who was notified, and the final classification. If someone else can pick it up without asking you anything, it is a good ticket.

Now try the **Simulators** page to practice these decisions.
