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

## Key facts this lesson's quiz checks

- **A good incident ticket** contains the **timeline**, the **indicators** (IPs, domains, hashes, accounts), the **actions taken** and **who was notified**. The test: could someone else reproduce and continue your work without asking you anything?

## Worked example: tagging an incident with ATT&CK

An incident timeline from the earlier SIEM labs:

1. 03:35 to 03:41: 23 failed logins on `web-01`, then a success as `admin`.
2. 03:50: a new scheduled task appears.
3. 04:10: large outbound transfer to an unknown address.

**Map each step to a tactic (the goal) and, if you can, a technique (the method):**

| Step | Tactic | Example technique |
| --- | --- | --- |
| Many failures then a success | Credential Access | Brute Force (T1110) |
| New scheduled task | Persistence | Scheduled Task/Job (T1053) |
| Large outbound transfer | Exfiltration | Exfiltration Over C2 Channel or Web Service |

**Why bother?** The labels give the team a **common language**. You can ask "which techniques did we detect, and which did we miss?" and see gaps across the matrix. Reports become clearer: "Credential Access then Persistence then Exfiltration" tells a story at a glance.

## The SOC lifecycle, with this incident

- **Detect:** the brute-force alert.
- **Triage:** validate, classify as a true positive.
- **Investigate:** find the scheduled task and the transfer.
- **Contain:** block the IP, disable the account, remove the task.
- **Eradicate and recover:** clean up, restore, change credentials.
- **Document and improve:** write the ticket and add a detection for the transfer.

## Tactic versus technique in one line

The **tactic** is the *why* ("steal credentials"). The **technique** is the *how* ("guess passwords repeatedly").

## Self-check

1. Which tactic does brute force belong to? (Credential Access.)
2. What belongs in a good ticket? (Timeline, indicators, actions taken, who was notified.)
