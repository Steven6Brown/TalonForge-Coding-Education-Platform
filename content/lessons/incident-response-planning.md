## Why plan ahead

During an incident there's no time to invent a process. An **incident response (IR) plan** defines roles, steps and communications in advance. NIST Special Publication 800-61 is a widely used guide.

## The life cycle

1. **Preparation:** policies, tools, training, contacts, an IR team.
2. **Detection and analysis:** spot signs of an incident, confirm it, scope it and prioritize.
3. **Containment, eradication and recovery:** stop the spread, remove the cause, restore systems.
4. **Post-incident activity:** lessons learned, evidence handling and plan updates (which feeds back into preparation).

## Key terms

- **Asset:** a resource being protected (logical or physical).
- **Threat** and **threat agent:** a potential cause of harm, and a specific instance that can exploit a weakness.
- **Vulnerability:** a flaw in procedures, design, implementation or controls.
- **Exploit:** a technique that targets a specific vulnerability.
- **Control / safeguard / countermeasure:** a mechanism that reduces risk.
- **Propagation vector:** how malicious code spreads (a trojan spreads through social engineering).
- **Polymorphism:** malware that changes shape to evade signature detection.

## Planning structure

The **business impact analysis (BIA)** goes to the incident response planning committee, which shares it with sub-teams for IR, disaster recovery and business continuity. Plans are tested with drills.

## Plan for unusual incidents

Not every incident is a network outage or DDoS. Connected devices (smart locks, cameras, fitness trackers that publish location data) create unusual scenarios. Good plans cover them too.

## Lessons from failures

A faulty update to a kernel-level driver can crash machines at boot; weak change management and no rollback plan magnify the damage. Test updates and keep rollback options.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Business impact analysis (BIA).** The BIA identifies an organization's **critical functions** and **how long each can be down** before the damage becomes unacceptable. Its results are handed to the planning committees that build the incident response, disaster recovery and business continuity plans.
- **RTO, RPO and MTD.** **Recovery Time Objective (RTO)** is how quickly a system must be **restored** after an outage. **Recovery Point Objective (RPO)** is the point in time to which data must be recoverable, meaning how much data loss is acceptable (an RPO of 1 hour means you can lose at most an hour of data). **Maximum Tolerable Downtime (MTD)** is the longest total downtime the owner will accept; RTO must be shorter than MTD.
- **BCP versus DR.** **Business continuity planning (BCP)** keeps **critical functions running by alternate means** (a backup site, manual procedures) during a disruption. **Disaster recovery (DR)** focuses on **restoring normal operations at the primary site**. Both are driven by the BIA and tested with exercises and drills.
