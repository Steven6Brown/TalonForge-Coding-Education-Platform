## The problem a SIEM solves

A company has hundreds of systems, and each writes its own logs: firewalls, servers, laptops, email, cloud apps. Checking each one by hand during an attack is impossible. A **SIEM** (Security Information and Event Management) pulls those logs into one place so you can search them together.

## What it does

1. **Collect:** agents, syslog and APIs send logs in.
2. **Normalize:** different formats are mapped to common fields (`src_ip`, `user`, `host`, `action`), so one search works everywhere.
3. **Store and search:** you query by field, time and text.
4. **Correlate:** rules combine events, like "10 failed logins then a success from the same IP within 5 minutes".
5. **Alert:** matching rules create alerts that analysts triage.

Well-known products: Splunk, Microsoft Sentinel, Elastic Security, IBM QRadar. The skills transfer: they all use fields, filters, aggregation and time ranges.

## The analyst workflow

**Detect, triage, investigate, contain, eradicate, recover, document.** Triage means deciding quickly whether an alert is a **true positive** (real malicious activity), a **benign true positive** (real activity but authorized, like a scheduled scan) or a **false positive** (the rule misfired). Always validate with evidence before closing or escalating.

## Why this matters for jobs

SOC analyst postings ask for log analysis, alert triage, ticket writing and knowledge of frameworks like MITRE ATT&CK. The next lessons let you practice searching, and the **Simulators** page lets you practice the full workflow.

## Key facts this lesson's quiz checks

- **Failures then a success.** Many failed logins from one IP followed by a **success** suggests a **brute-force attack that worked**. The success is the moment the attacker gains access, which is why that pattern is treated as serious even though each failure alone looks harmless.
