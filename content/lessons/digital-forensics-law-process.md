## Where forensics fits

Security work spans three moments, sometimes called the **investigations triad**:

- **Before an attack:** vulnerability and threat assessment, risk management
- **During an attack:** intrusion detection and incident response
- **After an attack:** digital investigations and forensics

**Digital forensics** applies computer science to produce legally usable evidence: collect data securely, preserve its integrity, examine it, and identify its content and origin. It differs from **data recovery**, where you already know what was lost.

## Public-sector investigations

Led by government agencies for criminal cases. Legal foundations include the **Fourth Amendment** (protection from unreasonable search and seizure), the Federal Rules of Evidence, the Computer Fraud and Abuse Act and case law. A typical process: an allegation is made, responders such as a **Digital Evidence First Responder** secure the scene, specialists analyze, an **affidavit** with exhibits supports a request, and a judge may sign a **search warrant** before evidence is collected. (This is an educational overview, not legal advice.)

## Private-sector investigations

Handle policy violations and disputes (misuse of computers, email or internet abuse, harassment, embezzlement, industrial espionage). To reduce legal risk, organizations:

- publish clear **policies** on acceptable use,
- define a **line of authority**: who may start an investigation, take evidence and access it,
- name **authorized requesters** (corporate security, legal, internal audit, HR or ethics),
- display **warning banners** stating that systems may be monitored, so employees don't assume privacy.

## Always

Preserve evidence, keep a chain of custody, work on copies and document everything.

## Check yourself

Take the quiz below.

## Worked example: a case from allegation to evidence

*(This is an educational outline, not legal advice, and details vary by jurisdiction.)*

**1. Allegation.** A company says an employee copied confidential designs and sold them.

**2. Authority to collect.** An employer can often examine **its own** equipment under its policies. In a **criminal** investigation by the government, the **Fourth Amendment** protects against unreasonable search and seizure, so investigators typically show a judge probable cause in an **affidavit** and obtain a **search warrant** before collecting.

**3. Secure the scene.** A **Digital Evidence First Responder** photographs and documents the devices, keeps them powered or off according to procedure (volatile data first, when appropriate), and starts the **chain of custody** form: who handled each item, when and why.

**4. Acquire.** Make a **forensic image** (an exact copy) of the drive using a **write blocker** (hardware that prevents changes). Compute the **hash** of the original and the image; they must match.

**5. Analyze the copy.** Examine files, deleted data, logs, registry, browser history and build a **timeline**. Never work on the original.

**6. Report.** Separate facts from conclusions, explain method and limits, and keep the findings traceable.

## Forensics versus data recovery

In **data recovery** you know what was lost and want it back. In **forensics** you do not know what you will find, and the goal is **legally usable evidence** with integrity preserved.

## Self-check

1. What protects against unreasonable search and seizure? (The Fourth Amendment.)
2. What proves the image equals the original? (Matching hash values.)
3. Why record chain of custody? (To show the evidence was handled properly and not tampered with.)
