import type { Lesson } from "./types";

/** Batch 6b: more lessons for existing tracks (original text). */
export const BATCH6B_LESSONS: Lesson[] = [
  /* ---------------- Networking ---------------- */
  {
    id: "service-identification",
    track: "networking",
    title: "Network Discovery & Service Identification (Defender's View)",
    summary: "Build an accurate inventory of live hosts and exposed services.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Why do defenders scan their own networks regularly?",
          options: ["To keep an accurate inventory and find unexpected hosts or exposed services", "To slow the network", "To impress auditors only"],
          answer: 0,
          why: "You can't protect assets you don't know about. Rogue devices and forgotten services are common findings.",
        },
        {
          q: "Service identification (version detection) matters because:",
          options: ["Software versions map to known vulnerabilities and patch needs", "It encrypts services", "It hides ports"],
          answer: 0,
          why: "Knowing 'Apache 2.4.49' lets you look up advisories and decide whether to patch.",
        },
        {
          q: "A port shows as 'filtered'. This most likely means:",
          options: ["A firewall is dropping or blocking the probes", "The service is fast", "The host is off for sure"],
          answer: 0,
          why: "Open, closed and filtered are different results; filtered often indicates a firewall.",
        },
        {
          q: "Before scanning a network you don't own, you need:",
          options: ["Written authorization that defines scope", "Nothing, scanning is harmless", "A faster computer"],
          answer: 0,
          why: "Scanning without permission can be illegal and can disrupt fragile devices.",
        },
      ],
    },
  },
  {
    id: "vpn-firewall-concepts",
    track: "networking",
    title: "Firewalls & VPNs: pfSense and OpenVPN Concepts",
    summary: "Rule order, stateful inspection, NAT, DMZs and encrypted tunnels.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "In most firewalls, rules are evaluated:",
          options: ["Top to bottom, and the first matching rule wins", "Randomly", "Bottom to top"],
          answer: 0,
          why: "Order matters: a broad allow placed above a specific deny can silently defeat it.",
        },
        {
          q: "A stateful firewall:",
          options: ["Tracks connections and allows return traffic for sessions it has seen", "Only checks IP addresses", "Is always a hardware box"],
          answer: 0,
          why: "That is why you can allow outbound web browsing without opening inbound ports.",
        },
        {
          q: "A DMZ is:",
          options: ["A separate network segment for public-facing servers, isolated from the internal LAN", "A type of VPN", "A password policy"],
          answer: 0,
          why: "If a DMZ server is compromised, segmentation limits access to the internal network.",
        },
        {
          q: "An OpenVPN (or any VPN) tunnel mainly provides:",
          options: ["Encrypted, authenticated connectivity across an untrusted network", "Faster internet", "Antivirus protection"],
          answer: 0,
          why: "Remote users or sites connect as if on the private network. Strong authentication (certificates, MFA) is essential.",
        },
        {
          q: "Safest default for an internet-facing firewall's inbound policy?",
          options: ["Deny by default, allow only required services", "Allow all", "Allow only HTTP"],
          answer: 0,
          why: "Least privilege applies to network traffic too.",
        },
      ],
    },
  },
  {
    id: "wireless-bluetooth-security",
    track: "networking",
    title: "Wireless & Bluetooth Security",
    summary: "Wi-Fi encryption, rogue access points and Bluetooth risks.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which Wi-Fi security protocol is the best current choice for a home or office network?",
          options: ["WPA3 (or WPA2-AES with a strong passphrase)", "WEP", "Open network"],
          answer: 0,
          why: "WEP is broken. Use WPA3 where available; WPA2 with AES and a long passphrase is acceptable.",
        },
        {
          q: "A rogue access point is:",
          options: ["An unauthorized AP connected to or mimicking a legitimate network", "A fast router", "A VPN"],
          answer: 0,
          why: "Evil-twin style APs trick users into connecting. Defend with WPA3/802.1X and wireless monitoring.",
        },
        {
          q: "A sensible Bluetooth hygiene practice is:",
          options: ["Turn it off when not needed, keep devices updated, and avoid pairing in public", "Leave devices discoverable always", "Share PINs"],
          answer: 0,
          why: "Bluetooth flaws have existed in pairing and protocol implementations; reduce exposure and patch.",
        },
        {
          q: "Why is public Wi-Fi riskier?",
          options: ["Others on the network may observe or tamper with unencrypted traffic", "It is always slower", "It blocks HTTPS"],
          answer: 0,
          why: "Use HTTPS everywhere and a VPN when you can't trust the network.",
        },
      ],
    },
  },

  /* ---------------- Systems ---------------- */
  {
    id: "windows-security-domain-controllers",
    track: "systems-servers",
    title: "Windows Security & Domain Controllers",
    summary: "Local policy, domain controller roles, auditing and updates.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "A domain controller (DC) is:",
          options: ["A server that stores the Active Directory database and authenticates users", "A firewall", "A backup tape"],
          answer: 0,
          why: "Because DCs hold credentials for the whole domain, they need the strictest protection and patching.",
        },
        {
          q: "Where can an administrator enforce password length and lockout rules on a Windows domain?",
          options: ["Group Policy (domain password policy)", "The desktop wallpaper settings", "Task Manager"],
          answer: 0,
          why: "Domain-wide password and account lockout policy is set in Group Policy.",
        },
        {
          q: "Which is a good practice for administrator accounts?",
          options: ["Use separate admin accounts only for admin tasks, with least privilege", "Use one shared admin login", "Log in as admin all day"],
          answer: 0,
          why: "Limits the blast radius if everyday credentials are phished.",
        },
        {
          q: "Auditing failed logon events helps because:",
          options: ["Repeated failures can reveal password guessing or misconfiguration", "It speeds up logins", "It deletes bad accounts"],
          answer: 0,
          why: "Windows security event 4625 records failed logons; feed it to a SIEM and alert on spikes.",
        },
        {
          q: "Why keep Windows and applications patched?",
          options: ["Known vulnerabilities are a leading way attackers get in", "Patches change the wallpaper", "It's optional"],
          answer: 0,
          why: "Patch management and vulnerability scanning reduce exposure to known issues.",
        },
      ],
    },
  },

  /* ---------------- AI ---------------- */
  {
    id: "model-evaluation-metrics",
    track: "ai-engineering",
    title: "Evaluating Classifiers: Precision, Recall & F1",
    summary: "Why accuracy lies when attacks are rare.",
    minutes: 25,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement metrics(tp, fp, fn) returning {precision, recall, f1}. Use 0 (not NaN) when a denominator is 0.",
      starter: `function metrics(tp, fp, fn) {
  // precision = tp / (tp + fp)   recall = tp / (tp + fn)   f1 = 2 * p * r / (p + r)
  return { precision: 0, recall: 0, f1: 0 };
}
`,
      harness: `
{
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  const m = metrics(8, 2, 4);
  const z = metrics(0, 0, 0);
  const ok = near(m.precision, 0.8) && near(m.recall, 8 / 12) && near(m.f1, 8 / 11) && z.precision === 0 && z.recall === 0 && z.f1 === 0;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(m));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Guard each division: `tp + fp === 0 ? 0 : tp / (tp + fp)`.", "If precision + recall is 0, f1 is 0."],
      solution: `function metrics(tp, fp, fn) {
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { precision, recall, f1 };
}`,
    },
  },

  /* ---------------- Automation ---------------- */
  {
    id: "ci-cd-github-actions",
    track: "automation",
    title: "CI/CD & GitHub Actions Basics",
    summary: "Run tests and checks automatically on every push.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Continuous integration (CI) means:",
          options: ["Automatically building and testing every change when it is pushed", "Never testing", "Deploying once a year"],
          answer: 0,
          why: "Fast automated feedback catches bugs and security issues early.",
        },
        {
          q: "Where do GitHub Actions workflow files live?",
          options: [".github/workflows/ as YAML files", "In the README", "In node_modules"],
          answer: 0,
          why: "Each workflow defines triggers (push, pull_request, schedule) and jobs made of steps.",
        },
        {
          q: "How should a workflow use an API token?",
          options: ["Store it as an encrypted repository secret and reference it, never commit it", "Paste it into the YAML", "Email it to the team"],
          answer: 0,
          why: "Secrets in Git history are compromised secrets.",
        },
        {
          q: "Which security check belongs in CI?",
          options: ["Dependency vulnerability scanning and secret scanning", "Only spell check", "Nothing"],
          answer: 0,
          why: "Tools like npm audit, Dependabot and secret scanners catch problems before release.",
        },
      ],
    },
  },

  /* ---------------- Ethical hacking (defensive framing) ---------------- */
  {
    id: "web-app-scanning-zap",
    track: "ethical-hacking",
    title: "Web App Security Testing with OWASP ZAP (Authorized Targets)",
    summary: "Passive vs active scanning and how to triage the findings.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "OWASP ZAP is:",
          options: ["A free, open-source web application security scanner and proxy", "A password manager", "An operating system"],
          answer: 0,
          why: "It sits between your browser and a web app to observe and test traffic.",
        },
        {
          q: "Passive scanning:",
          options: ["Analyzes traffic and responses without sending attack payloads", "Floods the server", "Needs no permission ever"],
          answer: 0,
          why: "Active scanning sends test payloads and must only target apps you're authorized to test.",
        },
        {
          q: "Where should you run an active scan?",
          options: ["Only against applications you own or have written permission to test (ideally a test environment)", "Any public site", "A competitor's site"],
          answer: 0,
          why: "Active tests can modify data or disrupt services.",
        },
        {
          q: "A scanner reports a 'medium' alert. What next?",
          options: ["Verify it manually to confirm it's real, rate the risk, and fix or document it", "Ignore all alerts", "Assume every alert is critical"],
          answer: 0,
          why: "Scanners produce false positives and miss logic flaws; human triage is essential.",
        },
      ],
    },
  },
  {
    id: "malware-analysis-methods",
    track: "ethical-hacking",
    title: "Malware Analysis Methods (Defensive)",
    summary: "Static vs dynamic analysis, safe labs and indicators of compromise.",
    minutes: 30,
    xp: 70,
    level: "advanced",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Static analysis examines a sample:",
          options: ["Without running it (hashes, strings, headers, disassembly)", "Only while running it", "By emailing it"],
          answer: 0,
          why: "Static work is safer; dynamic analysis observes behavior in an isolated sandbox.",
        },
        {
          q: "Where should suspicious files be executed for analysis?",
          options: ["An isolated, snapshot-able VM with no access to real networks or data", "Your daily laptop", "A coworker's PC"],
          answer: 0,
          why: "Treat every sample as live malware: isolate, snapshot, and never reuse real credentials.",
        },
        {
          q: "An 'indicator of compromise' (IOC) is:",
          options: ["An observable such as a file hash, IP, domain or registry key linked to malicious activity", "A password", "A software license"],
          answer: 0,
          why: "IOCs power detection rules and threat intelligence sharing.",
        },
        {
          q: "Exploitation frameworks such as Metasploit are appropriately used for:",
          options: ["Authorized testing and training in controlled labs to validate vulnerabilities and defenses", "Attacking any system", "Replacing patching"],
          answer: 0,
          why: "They help defenders prove risk and test detection, only within an agreed scope.",
        },
      ],
    },
  },

  /* ---------------- Security foundations: analysis methods ---------------- */
  {
    id: "ach-analysis",
    track: "security-foundations",
    title: "Analysis of Competing Hypotheses (ACH)",
    summary: "Reduce bias by trying to disprove explanations, not confirm them.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "In an ACH matrix each row is a piece of evidence and each column a hypothesis. Cells are 'C' (consistent), 'I' (inconsistent) or 'N' (neutral). Implement leastInconsistent(matrix) returning the column index with the FEWEST 'I' ratings (ties go to the lowest index).",
      starter: `function leastInconsistent(matrix) {
  // TODO: count the "I" cells in each column and return the index of the smallest count
  return -1;
}
`,
      harness: `
{
  const m1 = [["C", "I", "N"], ["I", "I", "C"], ["C", "I", "C"]];
  const m2 = [["I", "C"], ["C", "I"]];
  const ok = leastInconsistent(m1) === 2 && leastInconsistent(m2) === 0;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Make an array of counts, one per column.", "Loop over rows, and for each column add 1 when the cell is 'I'.", "Pick the first index holding the minimum."],
      solution: `function leastInconsistent(matrix) {
  const counts = matrix[0].map(() => 0);
  for (const row of matrix) row.forEach((c, j) => { if (c === "I") counts[j]++; });
  return counts.indexOf(Math.min(...counts));
}`,
    },
  },
  {
    id: "threat-vulnerability-analysis",
    track: "security-foundations",
    title: "Threat & Vulnerability Analysis, Reliability Block Diagrams",
    summary: "Model systems, find weak points, and compute reliability.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "A reliability block diagram combines components. Implement seriesReliability(rs) (all must work: the product) and parallelReliability(rs) (at least one must work: 1 minus the product of failure chances).",
      starter: `function seriesReliability(rs) {
  return 0;
}
function parallelReliability(rs) {
  return 0;
}
`,
      harness: `
{
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  const ok =
    near(seriesReliability([0.9, 0.8]), 0.72) &&
    near(parallelReliability([0.9, 0.8]), 0.98) &&
    near(seriesReliability([0.99, parallelReliability([0.9, 0.9])]), 0.9801);
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Series: multiply every reliability.", "Parallel: `1 - product of (1 - r)`.", "Redundancy (parallel components) raises overall reliability; a series chain is only as strong as the product."],
      solution: `function seriesReliability(rs) {
  return rs.reduce((p, r) => p * r, 1);
}
function parallelReliability(rs) {
  return 1 - rs.reduce((p, r) => p * (1 - r), 1);
}`,
    },
  },
  {
    id: "stats-for-security",
    track: "security-foundations",
    title: "Statistics for Security Analysts",
    summary: "Mean, median and standard deviation for spotting outliers.",
    minutes: 25,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Compute the mean, the median and the POPULATION standard deviation of the daily failed-login counts. Print them as `mean median sd` with 1, 1 and 2 decimals.",
      starter: String.raw`import math

counts = [4, 8, 6, 5, 3, 9, 7, 6, 6, 10]

mean = 0.0     # TODO: sum(counts) / len(counts)
median = 0.0   # TODO: middle value of the sorted list (average the two middle values if the length is even)
sd = 0.0       # TODO: sqrt of the average squared distance from the mean

print(f"{mean:.1f} {median:.1f} {sd:.2f}")
`,
      expected: "6.4 6.0 2.06",
      hints: ["`s = sorted(counts)`; with 10 items the median is `(s[4] + s[5]) / 2`.", "variance = `sum((x - mean) ** 2 for x in counts) / len(counts)`, then `math.sqrt`."],
      solution: String.raw`mean = sum(counts) / len(counts)
s = sorted(counts)
mid = len(s) // 2
median = (s[mid - 1] + s[mid]) / 2 if len(s) % 2 == 0 else s[mid]
sd = math.sqrt(sum((x - mean) ** 2 for x in counts) / len(counts))
`,
    },
  },
];
