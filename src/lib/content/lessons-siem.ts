import type { Lesson } from "./types";
import { TRUTH } from "@/lib/siem/data";

const SIEM_SAMPLES = ["source=auth action=failure | stats count by src_ip | sort -count", "source=dns | top 5 query", "source=firewall | stats sum(bytes_out) as total by host | sort -total"];
const CONCEPTS = [
  { title: "Events, fields and the pipe", body: "A **SIEM** stores log lines as **events**. Each event has **fields** such as `host`, `user`, `src_ip` and `action`. You search by writing `field=value`, then use the **pipe** `|` to pass results to the next command, like `stats count by src_ip` (count events grouped by source IP) and `sort -count` (largest first)." },
];

/** SIEM and SOC analyst track. Labs search the fictional dataset in src/lib/siem/data.ts; answers come from TRUTH. */
export const SIEM_LESSONS: Lesson[] = [
  {
    id: "siem-concepts", track: "siem-soc", title: "What a SIEM Does and Why SOCs Use One",
    summary: "Log collection, normalization, correlation, alerting and the analyst workflow.", minutes: 20, xp: 50, level: "beginner",
    lab: { kind: "quiz", questions: [
      { q: "What is the main job of a SIEM?", options: ["Collect and correlate logs from many systems so analysts can detect and investigate threats", "Encrypt hard drives", "Replace the firewall", "Back up files"], answer: 0, why: "SIEMs centralize logs and add search, correlation and alerting." },
      { q: "Why normalize logs into common fields?", options: ["So one search works across many different sources", "To make logs smaller only", "To hide them from analysts", "To delete old logs"], answer: 0, why: "Normalization lets you query src_ip across firewalls, web servers and auth logs alike." },
      { q: "An alert fires but investigation shows it was an authorized vulnerability scan. This is a:", options: ["Benign true positive / false positive for security purposes", "Confirmed breach", "Zero-day", "Failed log source"], answer: 0, why: "Not malicious. Document it and tune the rule." },
      { q: "Why is a successful login right after many failures from one IP so serious?", options: ["It suggests a brute-force attack that worked", "It is always a typo", "It means the SIEM is broken", "It proves MFA is on"], answer: 0, why: "The success is the point where the attacker gains access." },
      { q: "Best first step when an alert fires?", options: ["Validate it with evidence before acting or closing", "Close it", "Shut down servers", "Email everyone"], answer: 0, why: "Triage means validating and scoping first." },
    ] },
  },
  {
    id: "siem-first-search", track: "siem-soc", title: "Your First SIEM Searches",
    summary: "Filter events, count them, and read results like an analyst.", minutes: 25, xp: 70, level: "beginner",
    lab: { kind: "siem", prompt: "How many authentication FAILURE events are in the data? Search source=auth action=failure and read the result count.", answers: [String(TRUTH.failureCount)], hints: ["Run: source=auth action=failure", "The number of results is shown above the table. Add | stats count to see it as a row."], samples: SIEM_SAMPLES, concepts: CONCEPTS, plan: ["Run the search source=auth action=failure.", "Read the result count, or run it with | stats count.", "Type that number in the answer box."] },
  },
  {
    id: "siem-brute-force", track: "siem-soc", title: "Hunting a Brute-Force Attack",
    summary: "Find the attacking IP, then the account it compromised.", minutes: 35, xp: 90, level: "intermediate",
    lab: { kind: "siem", prompt: "Which source IP produced the most failed logins, and which username did that same IP finally log in as successfully? Submit both answers (the IP and the username).", answers: [TRUTH.topFailureIp, TRUTH.compromisedUser], hints: ["source=auth action=failure | stats count by src_ip | sort -count  gives the top IP.", "Then search source=auth action=success src_ip=<that IP> to see the username.", "The attack pattern is many failures followed by one success."], samples: SIEM_SAMPLES, concepts: CONCEPTS, plan: ["Count failures by src_ip and sort high to low.", "Copy the top IP.", "Search for successful logins from that IP.", "Submit the IP and the username."] },
  },
  {
    id: "siem-dns-beacon", track: "siem-soc", title: "Spotting a DNS Beacon",
    summary: "Malware calls home on a timer. Find the infected host.", minutes: 30, xp: 90, level: "intermediate",
    lab: { kind: "siem", prompt: "One internal host repeatedly queries update-check.example-cdn.net. Which host is it?", answers: [TRUTH.beaconHost], hints: ["source=dns query=update-check.example-cdn.net | stats count by host", "Beacons repeat at regular intervals, so the count for the infected host is high."], samples: SIEM_SAMPLES, concepts: CONCEPTS, plan: ["Search the DNS events for that query.", "Count them by host.", "Submit the host with the highest count."] },
  },
  {
    id: "siem-exfil", track: "siem-soc", title: "Finding Data Exfiltration",
    summary: "Use outbound byte counts to find the host leaking data.", minutes: 30, xp: 90, level: "intermediate",
    lab: { kind: "siem", prompt: "Which host sent the most outbound bytes according to the firewall logs?", answers: [TRUTH.exfilHost], hints: ["source=firewall | stats sum(bytes_out) as total by host | sort -total", "Database servers normally send very little data outward."], samples: SIEM_SAMPLES, concepts: CONCEPTS, plan: ["Search source=firewall.", "Sum bytes_out per host.", "Sort descending and submit the top host."] },
  },
  {
    id: "soc-attack-framework", track: "siem-soc", title: "MITRE ATT&CK and the SOC Workflow",
    summary: "Speak the common language of attacker behavior and the triage lifecycle.", minutes: 25, xp: 60, level: "intermediate",
    lab: { kind: "quiz", questions: [
      { q: "What is MITRE ATT&CK?", options: ["A public knowledge base of real attacker tactics and techniques", "A firewall product", "A password manager", "An antivirus"], answer: 0, why: "It organizes observed adversary behavior so defenders can map detections and gaps." },
      { q: "Tactic vs technique?", options: ["Tactic is the goal (e.g. Credential Access); technique is how (e.g. Brute Force)", "They are identical", "Technique is the goal", "Tactics are only for malware"], answer: 0, why: "Tactics are the why, techniques are the how." },
      { q: "Repeated failed logins then a success maps best to:", options: ["Credential Access: Brute Force", "Impact: Data Destruction", "Exfiltration over C2", "Defense Evasion"], answer: 0, why: "Brute force is the credential access technique." },
      { q: "The usual SOC alert lifecycle is:", options: ["Detect, triage, investigate, contain, eradicate, recover, document", "Ignore, delete, hope", "Document only", "Reboot, close, repeat"], answer: 0, why: "Each stage feeds the next, with documentation throughout." },
      { q: "Which note belongs in a good incident ticket?", options: ["Timeline, indicators, actions taken and who was notified", "Only 'fixed'", "Personal opinions", "Passwords found"], answer: 0, why: "Others must be able to reproduce and continue your work." },
    ] },
  },
];
