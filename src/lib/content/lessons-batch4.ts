import type { Lesson } from "./types";

/**
 * Fourth batch: Kali-style pentest lab, wargame-style challenges, privilege escalation,
 * and Security Foundations (risk, crypto, OSINT, Windows/AD, forensics).
 * All lesson text is original; see /resources for the free external platforms that inspired these topics.
 */
export const BATCH4_LESSONS: Lesson[] = [
  /* ---------------- Kali Pentest Lab (simulated) ---------------- */
  {
    id: "kali-intro",
    track: "kali-pentest",
    title: "Meet Kali: The Pentester's Toolkit",
    summary: "What Kali Linux is, how to run it safely, and the pentest phases.",
    minutes: 20,
    xp: 40,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What is Kali Linux?",
          options: ["A Linux distribution preloaded with security and penetration-testing tools", "A Windows antivirus", "A cloud hosting provider"],
          answer: 0,
          why: "Kali (from Offensive Security) bundles hundreds of tools such as nmap, Burp Suite, John the Ripper and Metasploit.",
        },
        {
          q: "The safest way to run Kali for practice is:",
          options: ["In a virtual machine on an isolated network", "As your only daily operating system on a work laptop", "On a company network without asking"],
          answer: 0,
          why: "A VM isolates the tools and any mistakes. Never run tools against systems you don't own or lack written permission to test.",
        },
        {
          q: "Which is the usual order of a penetration test?",
          options: [
            "Scoping, reconnaissance, scanning/enumeration, exploitation, post-exploitation, reporting",
            "Exploitation, reporting, scoping",
            "Reporting, then scanning",
          ],
          answer: 0,
          why: "Authorization and scope come first; the report (with fixes) is the real deliverable.",
        },
        {
          q: "This app's Kali lab is:",
          options: ["A simulation of the tools against a fictional network", "Real Kali attacking real servers", "A remote hacking service"],
          answer: 0,
          why: "Nothing here touches a real network. Use it to learn the workflow, then practice with real Kali in a VM.",
        },
      ],
    },
  },
  {
    id: "pentest-report",
    track: "kali-pentest",
    title: "Writing a Pentest Report That Gets Fixed",
    summary: "Findings, severity, evidence and remediation.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What makes a finding useful to the client?",
          options: ["Clear title, severity, evidence/steps to reproduce, impact and a concrete fix", "A screenshot with no explanation", "Only the tool's raw output"],
          answer: 0,
          why: "The point of testing is getting problems fixed. Reproducible evidence plus a practical remediation does that.",
        },
        {
          q: "Telnet exposed on a camera with a default password is best rated:",
          options: ["High: plaintext, remotely reachable, trivial to abuse", "Informational", "Not a finding"],
          answer: 0,
          why: "Rate by likelihood and impact (e.g. CVSS): easy exploitation plus device control is serious.",
        },
        {
          q: "You discover personal data on a test system. You should:",
          options: ["Stop, limit access, document minimally and report per the rules of engagement", "Copy it all as proof", "Post it publicly"],
          answer: 0,
          why: "Handle data minimally and securely. The goal is proof of access, never collection.",
        },
        {
          q: "An executive summary should:",
          options: ["Explain business risk in plain language", "List every nmap flag used", "Be omitted"],
          answer: 0,
          why: "Leaders decide on budget and priority; give them risk and recommendations without jargon.",
        },
      ],
    },
  },

  /* ---------------- Linux wargame & privesc ---------------- */
  {
    id: "wargame-find-files",
    track: "linux-shell",
    title: "Wargame: Tricky Filenames & find",
    summary: "Files with dashes, spaces and sizes: classic shell puzzles.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "wargame",
      prompt: "Capture all three flags described in ~/README.txt (a dashed filename, a filename with spaces, and a file found by exact size).",
      answers: ["FLAG{dash_file}", "FLAG{spaces_need_quotes}", "FLAG{find_by_size}"],
      hints: [
        "A leading dash looks like an option. Use a path prefix: `cat ./-file00` (or `cat -- -file00`).",
        "Quote it: `cat \"spaces in this filename\"`, or escape each space with a backslash.",
        "`find ~/maybehere -size 19c` matches files exactly 19 bytes.",
      ],
    },
  },

  /* ---------------- Security Foundations ---------------- */
  {
    id: "risk-assessment",
    track: "security-foundations",
    title: "Risk Assessment & the CIA Triad",
    summary: "Think like a risk analyst: assets, threats, likelihood, impact.",
    minutes: 25,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "The CIA triad stands for:",
          options: ["Confidentiality, Integrity, Availability", "Control, Inspection, Audit", "Cyber, Intelligence, Analysis"],
          answer: 0,
          why: "Every control protects at least one: keep data secret, unaltered, and accessible when needed.",
        },
        {
          q: "A simple risk score is:",
          options: ["Likelihood x Impact", "Cost + Time", "Threats - Controls only"],
          answer: 0,
          why: "A likely but trivial event and a rare catastrophic one can score the same. Both deserve a decision.",
        },
        {
          q: "Choosing to buy cyber insurance is which risk treatment?",
          options: ["Transfer", "Accept", "Avoid"],
          answer: 0,
          why: "The four treatments: mitigate, transfer, accept, avoid.",
        },
        {
          q: "Ransomware encrypting your files mostly attacks which property?",
          options: ["Availability", "Confidentiality only", "Non-repudiation"],
          answer: 0,
          why: "Many ransomware crews also steal data (confidentiality), but the encryption hits availability.",
        },
      ],
    },
  },
  {
    id: "crypto-fundamentals",
    track: "security-foundations",
    title: "Cryptography Fundamentals: XOR & Keys",
    summary: "Symmetric vs asymmetric, hashing, and a hands-on XOR cipher.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement xorHex(plain, key): XOR each character with the repeating key and return the result as lowercase 2-digit hex.",
      starter: `function xorHex(plain, key) {
  // TODO: for each character code, XOR with the key character at (i % key.length)
  // and join the 2-digit hex strings
  return "";
}
`,
      harness: `
{
  const ok = xorHex("AB", "K") === "0a09" && xorHex("hello", "k") === "030e070704" && xorHex("", "k") === "";
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + xorHex("AB", "K"));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`plain.charCodeAt(i) ^ key.charCodeAt(i % key.length)`", "`.toString(16).padStart(2, '0')`"],
      solution: `function xorHex(plain, key) {
  let out = "";
  for (let i = 0; i < plain.length; i++) {
    const b = plain.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}`,
    },
  },
  {
    id: "osint-basics",
    track: "security-foundations",
    title: "OSINT: Open-Source Intelligence",
    summary: "Collect public information responsibly and legally.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "OSINT means gathering information from:",
          options: ["Publicly available sources", "Hacked databases", "Private messages"],
          answer: 0,
          why: "Search engines, DNS, certificate transparency, social media, code repos, job postings, public records.",
        },
        {
          q: "Which is a passive recon technique?",
          options: ["Reading the target's public DNS and certificate records", "Port-scanning the target", "Trying default passwords"],
          answer: 0,
          why: "Passive means you never touch the target's systems directly.",
        },
        {
          q: "Why do defenders run OSINT on their own company?",
          options: ["To see what attackers can learn and reduce exposure", "To post it publicly", "It's required by Linux"],
          answer: 0,
          why: "Leaked keys in GitHub, exposed staff details and forgotten subdomains are common findings.",
        },
        {
          q: "An ethical OSINT investigator should:",
          options: ["Stay within the law, scope and privacy norms", "Impersonate people to extract data", "Ignore terms of service"],
          answer: 0,
          why: "Public does not mean unlimited. Document sources and respect individuals' privacy.",
        },
      ],
    },
  },
  {
    id: "windows-ad-basics",
    track: "security-foundations",
    title: "Windows & Active Directory Basics",
    summary: "Domains, users and groups, Kerberos and common attack paths.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Active Directory is:",
          options: ["Microsoft's directory service for centrally managing users, computers and policies", "A backup program", "A web browser"],
          answer: 0,
          why: "Most enterprises authenticate staff through AD, so it's a prime attack target.",
        },
        {
          q: "Group Policy (GPO) is used to:",
          options: ["Push security and configuration settings to many machines", "Encrypt email", "Block all traffic"],
          answer: 0,
          why: "Well-built GPOs enforce password rules, disable risky features and deploy settings consistently.",
        },
        {
          q: "Which protocol does AD use by default for authentication?",
          options: ["Kerberos", "Telnet", "FTP"],
          answer: 0,
          why: "Kerberos issues tickets. Attacks like Kerberoasting target weak service-account passwords.",
        },
        {
          q: "Best defense against password-spray and reuse in AD?",
          options: ["MFA, long unique passwords, least-privilege admin accounts, monitoring logons", "Shorter passwords", "Share admin accounts"],
          answer: 0,
          why: "Tiered admin accounts and monitoring event IDs (e.g. 4625, 4768) slow attackers down.",
        },
      ],
    },
  },
  {
    id: "digital-forensics-basics",
    track: "security-foundations",
    title: "Digital Forensics: Reading the Evidence",
    summary: "Chain of custody, working on copies, and shell-history analysis.",
    minutes: 25,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "dfir",
      prompt: "Analyze the attacker's shell history in ~/evidence. Submit (one at a time): the IP that hosted the downloaded script, and the script's filename.",
      answers: ["203.0.113.66", "x.sh"],
      hints: ["The history file is hidden: `ls -a ~/evidence`", "Look for wget or curl commands: `grep wget ~/evidence/.bash_history`"],
    },
  },
];
