import type { Lesson } from "./types";

/** Batch 8: malware analytics, digital forensics and Linux log analysis. Defensive focus; all text and data are original and fictional. */
export const BATCH8_LESSONS: Lesson[] = [
  {
    id: "malware-types-taxonomy",
    track: "malware-analytics",
    title: "Malware Types & Countermeasures",
    summary: "Viruses, worms, trojans, rootkits, RATs, botnets and how to defend against them.",
    minutes: 30,
    xp: 70,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What must a computer virus have, according to its typical definition?",
          options: ["A replication mechanism, an activation mechanism and an objective", "Only a network connection", "A digital signature"],
          answer: 0,
          why: "A virus attaches to a host file, spreads when that file is shared, activates when the file runs, and carries a payload objective.",
        },
        {
          q: "How does a worm differ from a virus?",
          options: ["A worm spreads across networks by itself without needing a host file or user action", "A worm only infects documents", "They are the same"],
          answer: 0,
          why: "Worms usually exploit unpatched vulnerabilities, which is why patching matters.",
        },
        {
          q: "Botnets versus RATs:",
          options: ["Botnets control many hosts for mass attacks (like DDoS); RATs control a few victims in targeted attacks", "RATs control millions of hosts", "They are legitimate tools only"],
          answer: 0,
          why: "Both often call out over common ports such as 80 and 443 to blend in.",
        },
        {
          q: "Which firmware feature helps block boot-level rootkits?",
          options: ["UEFI Secure Boot (requires a signed operating system)", "A bigger hard drive", "Pop-up blockers"],
          answer: 0,
          why: "Rootkits that load before the OS can hide from scanners; Secure Boot and anti-rootkit tools reduce that risk.",
        },
        {
          q: "A logic bomb:",
          options: ["Stays dormant until predefined conditions (such as a date) are met", "Runs immediately on download", "Only displays ads"],
          answer: 0,
          why: "Time or event triggers let it evade early notice.",
        },
        {
          q: "Which set is a sound baseline of countermeasures?",
          options: [
            "Patch OS and browsers, run updated anti-malware with real-time protection, use a host firewall, and limit risky cookies and pop-ups",
            "Disable all updates",
            "Use one shared admin account",
          ],
          answer: 0,
          why: "Layered, regularly updated defenses cover the common infection paths.",
        },
      ],
    },
  },
  {
    id: "hashing-and-malware-identification",
    track: "malware-analytics",
    title: "Hashing & the Avalanche Effect",
    summary: "Why one changed bit changes the whole fingerprint, and how hashes identify files.",
    minutes: 25,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement hexDiffBits(a, b): given two hex strings of equal length, return how many BITS differ between them (this is how you measure the avalanche effect between two hashes).",
      starter: `function hexDiffBits(a, b) {
  // TODO: for each hex digit, XOR the two values and count the 1 bits
  return -1;
}
`,
      harness: `
{
  const ok = hexDiffBits("00", "ff") === 8 && hexDiffBits("a3", "a2") === 1 && hexDiffBits("ffff", "0000") === 16 && hexDiffBits("1234", "1234") === 0;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`parseInt(ch, 16)` turns one hex digit into 0-15.", "Count set bits: loop `while (x) { count += x & 1; x >>= 1; }`."],
      solution: `function hexDiffBits(a, b) {
  let bits = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) {
      bits += x & 1;
      x >>= 1;
    }
  }
  return bits;
}`,
    },
  },
  {
    id: "pe-imports-static-triage",
    track: "malware-analytics",
    title: "Static Triage: Reading a Program's Imports",
    summary: "What a Windows executable's imported functions reveal about its capabilities.",
    minutes: 30,
    xp: 90,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement capabilityReport(imports): each import looks like \"dll!Function\". Look up the function (case-insensitive, also trying it without a trailing A/W) in CAPS and return the UNIQUE capability labels, sorted alphabetically. Ignore unknown functions.",
      starter: `const CAPS = {
  createfile: "file access", readfile: "file access", writefile: "file access",
  regsetvalueex: "registry access", regopenkeyex: "registry access",
  connect: "network communication", send: "network communication", recv: "network communication", internetopen: "network communication",
  setwindowshookex: "input hooking", getasynckeystate: "input hooking",
  createprocess: "process creation", openprocess: "process access",
};

function capabilityReport(imports) {
  // TODO
  return [];
}
`,
      harness: `
{
  const got = JSON.stringify(
    capabilityReport(["kernel32.dll!CreateFileA", "advapi32.dll!RegSetValueExA", "ws2_32.dll!connect", "user32.dll!SetWindowsHookExA", "kernel32.dll!CreateFileW", "kernel32.dll!Sleep"])
  );
  const ok = got === JSON.stringify(["file access", "input hooking", "network communication", "registry access"]) && capabilityReport([]).length === 0;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + got);
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`const fn = imp.split('!')[1].toLowerCase()`", "`CAPS[fn] ?? CAPS[fn.slice(0, -1)]` handles the ANSI (A) and wide (W) variants.", "Use a Set for uniqueness, then `[...set].sort()`."],
      solution: `function capabilityReport(imports) {
  const found = new Set();
  for (const imp of imports) {
    const fn = (imp.split("!")[1] || "").toLowerCase();
    const cap = CAPS[fn] ?? CAPS[fn.slice(0, -1)];
    if (cap) found.add(cap);
  }
  return [...found].sort();
}`,
    },
  },
  {
    id: "dynamic-analysis-filters",
    track: "malware-analytics",
    title: "Dynamic Analysis: Monitoring Events & Filters",
    summary: "How Process Monitor-style filters combine, and what to watch.",
    minutes: 30,
    xp: 90,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement matchesFilters(event, filters). filters is an array of {attr, value}. An event matches when, for EVERY attribute that has filters, at least one of that attribute's values equals the event's value (values for the same attribute are OR'd; different attributes are AND'd). No filters means match everything.",
      starter: `function matchesFilters(event, filters) {
  // TODO
  return false;
}
`,
      harness: `
{
  const e1 = { process: "sample.exe", operation: "RegSetValue", path: "HKCU/Run" };
  const e2 = { process: "sample.exe", operation: "WriteFile", path: "C:/a.txt" };
  const e3 = { process: "notepad.exe", operation: "WriteFile", path: "C:/b.txt" };
  const f1 = [{ attr: "process", value: "sample.exe" }, { attr: "operation", value: "WriteFile" }, { attr: "operation", value: "RegSetValue" }];
  const f2 = [{ attr: "process", value: "sample.exe" }, { attr: "operation", value: "WriteFile" }];
  const ok =
    matchesFilters(e1, f1) && matchesFilters(e2, f1) && !matchesFilters(e3, f1) &&
    !matchesFilters(e1, f2) && matchesFilters(e2, f2) && matchesFilters(e3, []);
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Group the filters by attr into a Map of attr to a list of values.", "Every group must contain the event's value for that attr: use `every` over the groups and `includes` on the values."],
      solution: `function matchesFilters(event, filters) {
  const groups = new Map();
  for (const f of filters) {
    if (!groups.has(f.attr)) groups.set(f.attr, []);
    groups.get(f.attr).push(f.value);
  }
  return [...groups].every(([attr, values]) => values.includes(event[attr]));
}`,
    },
  },
  {
    id: "malware-triage-workflow",
    track: "malware-analytics",
    title: "The Malware Triage Workflow",
    summary: "From a suspicious file to indicators of compromise, safely.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What is a sensible order for initial analysis?",
          options: [
            "Hash and check reputation, extract strings and headers (static), then run in an isolated lab to observe behavior (dynamic)",
            "Run it on your laptop first",
            "Email it to coworkers",
          ],
          answer: 0,
          why: "Static steps are safer and shape what you look for during dynamic analysis.",
        },
        {
          q: "A packed program often shows:",
          options: ["Few readable strings and few imported libraries", "Many readable strings", "No code at all"],
          answer: 0,
          why: "Packing hides the real code; analysts then unpack it or observe it dynamically.",
        },
        {
          q: "Why filter process monitors by the sample's process name?",
          options: ["Thousands of unrelated events would otherwise bury the relevant ones", "To make the sample run faster", "Filtering deletes events"],
          answer: 0,
          why: "Filters only change the display; recorded events remain available.",
        },
        {
          q: "After each dynamic run in a lab you should:",
          options: ["Revert to a clean snapshot", "Keep using the infected image", "Connect it to the company network"],
          answer: 0,
          why: "Reset to a clean image so results aren't contaminated and nothing persists.",
        },
        {
          q: "Typical outputs of a triage are:",
          options: ["Indicators of compromise (hashes, domains, registry keys, file paths) and detection or response guidance", "Only a summary of feelings", "A new malware family"],
          answer: 0,
          why: "The goal is to help defenders detect, contain and remove the threat.",
        },
      ],
    },
  },
  {
    id: "digital-forensics-law-process",
    track: "digital-forensics",
    title: "Digital Forensics: Investigations, Law & Process",
    summary: "Public vs private investigations, warrants, policies and authority.",
    minutes: 30,
    xp: 70,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "The 'investigations triad' consists of:",
          options: [
            "Vulnerability/threat assessment and risk management (before attacks), intrusion detection and incident response (during), and digital investigations (after)",
            "Police, courts and prisons",
            "Scanning, exploiting and reporting",
          ],
          answer: 0,
          why: "Forensics sits in the 'after' part: reconstructing and proving what happened.",
        },
        {
          q: "How does digital forensics differ from data recovery?",
          options: ["Forensics preserves integrity for legal use and often doesn't know in advance what to find", "They are identical", "Data recovery produces court evidence"],
          answer: 0,
          why: "Data recovery targets known lost files; forensics must find and prove relevant evidence.",
        },
        {
          q: "In U.S. public-sector investigations, which protects against unreasonable search and seizure?",
          options: ["The Fourth Amendment", "The Computer Fraud and Abuse Act", "A company policy"],
          answer: 0,
          why: "Investigators generally need legal authority (such as a warrant supported by an affidavit); get legal counsel involved. This is education, not legal advice.",
        },
        {
          q: "Why do private organizations publish computer-use policies and display warning banners?",
          options: [
            "To set expectations that systems may be monitored and to define who has authority to investigate",
            "To slow users down",
            "They are required for backups",
          ],
          answer: 0,
          why: "Clear policy, a defined line of authority and an authorized requester reduce legal risk and reduce employees' assumed privacy.",
        },
        {
          q: "Who is typically an 'authorized requester' for a corporate investigation?",
          options: ["Corporate security, legal counsel, internal audit, or HR/ethics offices as defined by policy", "Any employee", "The suspect"],
          answer: 0,
          why: "Evidence handling and access should follow the defined chain of authority.",
        },
      ],
    },
  },
  {
    id: "log-triage-sudo",
    track: "cyber-range",
    title: "Log Triage: Counting sudo Activity by User and Month",
    summary: "grep, awk, sort and uniq to summarize privileged activity in a system log.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "sudolog",
      prompt: "In ~/access1.log: (1) how many sudo entries did harrypotter make in April, and (2) which user ran sudo the most overall? Submit both.",
      answers: ["5", "harrypotter"],
      hints: [
        "Lines with sudo look like `Apr 12 09:15:02 host sudo: harrypotter : ...`, so the user is field 6.",
        "`grep sudo access1.log | grep Apr | grep -c harrypotter` counts April entries for one user.",
        "`grep sudo access1.log | awk '{print $6}' | sort | uniq -c | sort -rn` ranks users by count.",
      ],
    },
  },
];
