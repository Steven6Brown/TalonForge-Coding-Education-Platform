import { c, type Scenario } from "./types";

/**
 * SOC analyst alert-triage scenarios. Each one follows a real analyst workflow: understand the alert, gather
 * evidence, decide true or false positive, contain proportionally, escalate when needed and document.
 * Evidence matches the Mini-SIEM dataset used in the SIEM labs, so you can search for it yourself.
 */
export const SOC: Scenario[] = [
  {
    id: "soc-brute-force",
    kind: "soc",
    title: "Alert: many failed logins, then a success",
    priority: "P2",
    difficulty: "intermediate",
    ticket: { id: "ALERT-8841", requester: "SIEM rule: Brute force followed by success", channel: "SIEM" },
    summary: "web-01 saw many failed SSH logins from one external IP, followed by a successful login for 'admin'.",
    skills: ["Alert triage", "Log analysis", "Containment decisions", "Escalation"],
    takeaways: [
      "Failures followed by a success from the same external IP is a strong compromise indicator: treat as a true positive until disproven.",
      "Contain proportionally and quickly (block the IP, disable or reset the account, kill sessions) while preserving evidence.",
      "Scope the incident: other accounts, other hosts, what the attacker did after login. Escalate to incident response.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "SIEM alert",
        text: "Rule fired: 'Brute force followed by success'. Source IP 203.0.113.45 (external). Host web-01. Account: admin. What do you do first?",
        evidence: "source=auth src_ip=203.0.113.45 → 23 failures, 1 success (admin, 03:41:12Z)",
        choices: [
          c("Search the SIEM for all activity from that IP and check what the 'admin' session did after 03:41.", 3, "technical", "s2", "Validating and scoping first (with evidence) is the correct opening move."),
          c("Close it as noisy: brute force alerts are common.", 0, "security", "s_bad", "The success after the failures is the dangerous part. Never close without validating."),
          c("Immediately wipe the server.", 1, "technical", "s2", "Premature and destroys evidence. Contain proportionally and preserve data first."),
        ],
      },
      s_bad: { id: "s_bad", text: "Hours later, data from web-01 appears on a leak site. The alert was a real compromise.", end: { title: "Missed true positive", summary: "Ignoring a failures-then-success pattern let the intrusion continue." } },
      s2: {
        id: "s2", who: "You", text: "Searching shows that after logging in as admin, there was no staff-style activity; the IP is not in the company's ranges and the user normally logs in from 192.168.1.x. How do you classify it?",
        choices: [
          c("True positive: likely compromised credentials. Treat as an incident.", 3, "technical", "s3", "Correct: pattern, external source and abnormal location all agree."),
          c("False positive: admin sometimes works remotely.", 0, "technical", "s_bad", "No evidence supports that. Verify with the owner via a separate channel before assuming."),
          c("Benign: just a scan.", 0, "technical", "s_bad", "A successful login is not a scan."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "Which containment is best right now?",
        choices: [
          c("Block 203.0.113.45 at the firewall, disable the admin account (or force reset), kill active sessions, and snapshot/preserve logs.", 3, "security", "s4", "Targeted, fast and evidence-preserving."),
          c("Only block the IP and leave the account active.", 1, "security", "s4", "The attacker may already hold the credentials or a session/persistence elsewhere."),
          c("Do nothing until the next business day.", 0, "security", "s_bad", "Active intrusion: act now."),
        ],
      },
      s4: {
        id: "s4", who: "You", text: "What are the next steps?",
        choices: [
          c("Escalate to Tier 2 / incident response with a clear summary; hunt for the same IP and account on other systems; check for new accounts, keys and scheduled tasks; notify the system owner.", 3, "security", "s5", "Scoping and escalation are what turn an alert into an incident response."),
          c("Reset the password and close the ticket.", 1, "security", "s5", "Leaves possible persistence and other victims unaddressed."),
        ],
      },
      s5: {
        id: "s5", who: "You", text: "Write the incident note. Which is best?",
        choices: [
          c("Timeline (first failure to success), IOCs (IP, account, host), evidence queries, actions taken with times, and who was notified.", 3, "documentation", "end_done", "Complete, factual and actionable."),
          c("\"Blocked bad IP.\"", 0, "documentation", "end_done", "Can't be reproduced or escalated from this."),
        ],
      },
      end_done: { id: "end_done", text: "Escalated and documented.", end: { title: "Incident contained", summary: "Validated, contained, escalated and documented." } },
    },
  },
  {
    id: "soc-dns-beacon",
    kind: "soc",
    title: "Alert: periodic DNS queries to a rare domain",
    priority: "P2",
    difficulty: "intermediate",
    ticket: { id: "ALERT-8902", requester: "SIEM rule: Beaconing pattern", channel: "SIEM" },
    summary: "ws-114 queries 'update-check.example-cdn.net' exactly once a minute.",
    skills: ["Behavioral detection", "Threat intelligence", "Endpoint response"],
    takeaways: [
      "Regular, machine-like intervals to a rare domain suggest command-and-control beaconing.",
      "Enrich the indicator (reputation, first-seen, who else queried it) before deciding.",
      "Isolate the host (EDR network containment), collect evidence and hunt for the IOC across the environment.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "SIEM alert", text: "ws-114 (user: erin) made 30 DNS queries to update-check.example-cdn.net, one every 60 seconds, for 30 minutes. Other hosts never queried it.",
        evidence: "source=dns query=update-check.example-cdn.net | stats count by host → ws-114: 30",
        choices: [
          c("Enrich the domain: check reputation/age and whether any other host or user ever queried it.", 3, "technical", "s2", "Enrichment turns a suspicion into a decision."),
          c("Ignore: it's DNS, DNS is noisy.", 0, "technical", "s_bad", "Perfectly regular timing is the classic beacon signature."),
          c("Block the domain and move on.", 1, "technical", "s2", "Blocking helps, but you still need to deal with the infected host."),
        ],
      },
      s_bad: { id: "s_bad", text: "Weeks later a ransomware crew encrypts the network. The beacon was their foothold.", end: { title: "Missed early warning", summary: "Beaconing is often the earliest detectable sign." } },
      s2: {
        id: "s2", who: "Threat intel", text: "The domain was registered 3 days ago, has no legitimate site and is flagged by two feeds as a malware C2 domain.",
        choices: [
          c("True positive: treat ws-114 as compromised. Isolate it with EDR network containment and open an incident.", 3, "security", "s3", "Strong evidence plus the right containment action."),
          c("Reboot the machine and see if it stops.", 1, "technical", "s3", "Doesn't remove the malware and destroys volatile evidence."),
          c("Email the user asking if they installed something.", 1, "service", "s3", "Worth asking, but contain first."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "The host is isolated. What next?",
        choices: [
          c("Collect a memory and disk image, search EDR and the SIEM for the same domain/IPs elsewhere, extract IOCs, block the domain, and escalate to IR.", 3, "technical", "s4", "Evidence, scoping, blocking and escalation."),
          c("Reimage the machine immediately and close.", 1, "security", "s4", "Reimaging first loses evidence and the chance to find how it got in."),
        ],
      },
      s4: { id: "s4", who: "You", text: "How do you finish the ticket?", choices: [c("List IOCs (domain, IPs, file hashes found), timeline, actions, and detection improvements.", 3, "documentation", "end_done", "Feeds both response and future detection."), c("\"Isolated host.\"", 0, "documentation", "end_done", "Too thin.")] },
      end_done: { id: "end_done", text: "Escalated and documented.", end: { title: "C2 beacon contained", summary: "Detected by behavior, enriched, contained and scoped." } },
    },
  },
  {
    id: "soc-exfil",
    kind: "soc",
    title: "Alert: unusually large outbound transfer",
    priority: "P1",
    difficulty: "advanced",
    ticket: { id: "ALERT-8957", requester: "SIEM rule: Large outbound data transfer", channel: "SIEM" },
    summary: "A database server sent about 2 GB to an external address in under 20 minutes.",
    skills: ["Data-loss triage", "Business context", "Major incident response"],
    takeaways: [
      "Check the destination and business justification quickly: backups to a known provider are normal; a rare new IP is not.",
      "A confirmed exfiltration is a P1: contain, escalate to incident response, and involve legal/privacy per policy.",
      "Preserve evidence and avoid tipping off: follow the incident plan rather than improvising.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "SIEM alert", text: "db-02 (10.0.3.30) sent 5 transfers of ~400 MB each to 198.51.100.99:443 between 15:10 and 15:26. Normal outbound for this host is a few KB.",
        evidence: "source=firewall | stats sum(bytes_out) as total by host | sort -total → db-02 leads by far",
        choices: [
          c("Check whether 198.51.100.99 is a known, approved destination (backup, vendor) and whether a change or job explains it.", 3, "technical", "s2", "Always test the benign explanation first, quickly."),
          c("Immediately assume it's fine because it's HTTPS.", 0, "technical", "s_bad", "Encryption hides content, not volume or destination."),
          c("Shut down the entire data center.", 0, "security", "s2", "Wildly disproportionate."),
        ],
      },
      s_bad: { id: "s_bad", text: "The data was customer records. The breach is discovered by a news report.", end: { title: "Exfiltration missed", summary: "Volume anomalies on database hosts are high-fidelity signals." } },
      s2: { id: "s2", who: "Asset owner", text: "\"No backup or vendor job goes to that IP. We didn't change anything.\" The destination has no business relationship and no reverse DNS.", choices: [c("Declare a P1 incident, notify the incident commander, and contain the host's outbound path.", 3, "security", "s3", "Unexplained bulk transfer of sensitive data from a database is a major incident."), c("Wait until morning to see if it repeats.", 0, "security", "s_bad", "More data leaves every minute you wait.")] },
      s3: { id: "s3", who: "You", text: "Which containment is most appropriate?", choices: [c("Block the destination at the firewall, limit db-02 egress to required destinations, preserve logs and a disk image, and keep the host running for forensics unless the IC decides otherwise.", 3, "security", "s4", "Stops the leak while preserving evidence."), c("Delete the database to protect the data.", 0, "security", "s4", "Destroys evidence and the business's data.")] },
      s4: { id: "s4", who: "You", text: "Who else needs to know under a typical incident plan?", choices: [c("The incident commander, the data owner, legal/privacy and security leadership, following the escalation matrix.", 3, "security", "end_done", "Potential regulated-data loss triggers legal and privacy review."), c("Nobody: keep it quiet.", 0, "security", "end_done", "Silence violates the plan and can break breach-notification duties.")] },
      end_done: { id: "end_done", text: "Incident declared.", end: { title: "Major incident handled", summary: "Fast validation, containment and correct escalation." } },
    },
  },
  {
    id: "soc-phish-report",
    kind: "soc",
    title: "Alert: reported phishing email with an attachment",
    priority: "P3",
    difficulty: "beginner",
    ticket: { id: "ALERT-9010", requester: "User report: Phish button", channel: "Email security" },
    summary: "Three employees reported an email 'Invoice overdue' with a .zip attachment.",
    skills: ["Email triage", "IOC handling", "Mail-flow response"],
    takeaways: [
      "Check how many people received it and who opened/clicked, not just who reported.",
      "Analyze the attachment safely (hash lookup, sandbox), never open it on a normal workstation.",
      "Block the sender/hash/domain and remove the message from all mailboxes; contact anyone who opened it.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Reports", text: "Subject: 'Invoice overdue – action required'. Sender: accounts@invoice-center.example. Attachment: invoice_2026.zip. 3 reports so far.",
        choices: [
          c("Search mail logs for the same sender/subject/attachment hash to see how many mailboxes received it and who opened it.", 3, "technical", "s2", "Scope first: reports are only the tip."),
          c("Reply to the reporters 'thanks' and close.", 1, "service", "s2", "Thank them, but you still need to scope and respond."),
          c("Open the attachment on your own laptop to see what it does.", 0, "security", "s_bad", "Never open suspicious attachments on a normal machine."),
        ],
      },
      s_bad: { id: "s_bad", text: "Your workstation is infected and the analyst credentials are stolen.", end: { title: "Analyst compromised", summary: "Handle samples only in an isolated sandbox." } },
      s2: { id: "s2", who: "Mail logs", text: "47 mailboxes received it, 9 opened it, and 2 users have a process-creation event right after opening the attachment.", choices: [c("Treat the 2 users' machines as potentially compromised: isolate them, and open an incident.", 3, "security", "s3", "Evidence of execution after opening = likely infection."), c("Treat as spam only.", 0, "security", "s_bad", "Execution events change this from nuisance to incident.")] },
      s3: { id: "s3", who: "You", text: "What mail-flow actions do you take?", choices: [c("Block the sender domain and attachment hash, purge the message from all 47 mailboxes, and add the IOCs to detection.", 3, "technical", "s4", "Removes the threat from every inbox and prevents repeats."), c("Only ask people to delete it themselves.", 1, "technical", "s4", "Users miss it. Purge centrally.")] },
      s4: { id: "s4", who: "You", text: "Close-out communication?", choices: [c("Thank the reporters, notify the 9 who opened it with clear next steps, and share a short awareness note.", 3, "service", "end_done", "Reinforces the reporting habit."), c("No communication.", 1, "service", "end_done", "People need to know it was real and what to do.")] },
      end_done: { id: "end_done", text: "Closed.", end: { title: "Phishing campaign contained", summary: "Scoped, contained, purged and communicated." } },
    },
  },
  {
    id: "soc-false-positive",
    kind: "soc",
    title: "Alert: port scan from an internal host",
    priority: "P3",
    difficulty: "beginner",
    ticket: { id: "ALERT-9055", requester: "SIEM rule: Internal port scan", channel: "SIEM" },
    summary: "A host in the security subnet scanned hundreds of ports across several servers at 02:00.",
    skills: ["False-positive recognition", "Change calendars", "Detection tuning"],
    takeaways: [
      "Not every alert is an attack: authorized vulnerability scans trigger scan detections by design.",
      "Verify against the approved change/scan calendar and the scanner's identity before closing.",
      "Document the reason and propose tuning (allowlist the scanner's IP in that window) instead of just closing.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "SIEM alert", text: "Source 10.9.0.15 scanned 1,200 ports on 40 servers starting 02:00. The source is in the security tools subnet.",
        choices: [
          c("Check the vulnerability-scan calendar and asset inventory: is 10.9.0.15 the approved scanner and was a scan scheduled?", 3, "technical", "s2", "Verify before assuming either way."),
          c("Escalate immediately as an active attack.", 1, "technical", "s2", "An overreaction wastes responders' time. Verify first."),
          c("Close without checking: it's internal.", 0, "security", "s2", "Internal doesn't mean authorized. Insiders and compromised hosts scan too."),
        ],
      },
      s2: { id: "s2", who: "Calendar", text: "The weekly authenticated vulnerability scan is scheduled 02:00-04:00 from 10.9.0.15, approved by the security manager.", choices: [c("Classify as benign true positive (authorized scan), close with notes, and ask detection engineering to allowlist the scanner during its window.", 3, "documentation", "end_done", "Right outcome plus a tuning improvement."), c("Block the scanner.", 0, "technical", "end_done", "Would break an approved security control.")] },
      end_done: { id: "end_done", text: "Closed with notes.", end: { title: "Correctly closed", summary: "Verified against the calendar, documented and tuned." } },
    },
  },
  {
    id: "soc-impossible-travel",
    kind: "soc",
    title: "Alert: impossible travel sign-in",
    priority: "P2",
    difficulty: "intermediate",
    ticket: { id: "ALERT-9120", requester: "Identity provider: impossible travel", channel: "IdP" },
    summary: "A user signed in from the US, then from another continent 12 minutes later.",
    skills: ["Identity alerts", "User verification", "Session revocation"],
    takeaways: [
      "Check for innocent causes first (VPN/proxy egress, mobile carrier IPs) but don't assume.",
      "Verify with the user through a separate, trusted channel.",
      "If suspicious: revoke sessions and tokens, reset the password, review MFA changes and mailbox rules.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "IdP alert", text: "User jmartin: sign-in from Chicago (14:02) and from Lagos (14:14). Both succeeded. The second sign-in did not show MFA prompt history.",
        choices: [
          c("Review the sessions: IPs, device/user-agent, MFA result, and any new MFA devices or mailbox rules. Check whether the user is on a VPN.", 3, "technical", "s2", "Data first; both explanations remain possible."),
          c("Disable the user permanently.", 0, "service", "s2", "Disproportionate before facts."),
          c("Ignore: it's probably the VPN.", 1, "technical", "s2", "Possible, but unverified and the missing MFA is a red flag."),
        ],
      },
      s2: { id: "s2", who: "Evidence", text: "The Lagos session used an unfamiliar browser, no corporate VPN, and a new inbox forwarding rule was created 2 minutes later.", choices: [c("Contact the user via a trusted phone number to confirm, and immediately revoke sessions, reset the password, and remove the forwarding rule.", 3, "security", "s3", "Containment now, confirmation in parallel."), c("Email the user to ask if it was them.", 1, "security", "s3", "The attacker may read that mailbox. Use a separate channel.")] },
      s3: { id: "s3", who: "You", text: "The user says it wasn't them. What else?", choices: [c("Check for mail sent or data accessed from the session, re-register MFA, hunt for the source IP on other accounts, and document as account takeover.", 3, "technical", "end_done", "Impact assessment and scoping."), c("Close the ticket: password reset done.", 1, "technical", "end_done", "Misses what the attacker already did.")] },
      end_done: { id: "end_done", text: "Resolved.", end: { title: "Account takeover handled", summary: "Verified, contained and scoped." } },
    },
  },
];
