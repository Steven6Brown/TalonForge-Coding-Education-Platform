import type { Lesson } from "./types";

/** Batch 7: network analysis and design, statistics, contingency and incident response planning, professional writing, and technology and conflict. Original text. */
export const BATCH7_LESSONS: Lesson[] = [
  {
    id: "packet-analysis-http-dns-arp",
    track: "networking",
    title: "Packet Analysis: ARP, DNS, TCP & HTTP",
    summary: "Read a packet list and follow one web request from start to finish.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "pcap",
      prompt: "Read ~/capture2.txt. Submit: (1) the DNS server's IP, (2) the HTTP response code, and (3) the path requested with HTTP GET.",
      answers: ["10.20.0.53", "200", "/deals/index.html"],
      hints: [
        "`grep DNS capture2.txt` shows the query and the response. The query's Destination is the DNS server.",
        "`grep HTTP capture2.txt` shows the GET and the response line.",
        "The path follows the word GET (not the full domain).",
      ],
    },
  },
  {
    id: "network-design-subnets",
    track: "networking",
    title: "Enterprise Network Design: Planning Subnets",
    summary: "Size each floor or department's subnet from its host count.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement prefixForHosts(n): return the LARGEST prefix length (smallest network) whose usable host count (2^(32-p) - 2) is at least n.",
      starter: `function prefixForHosts(n) {
  // TODO: try prefixes from /30 down to /1 and return the first one with enough usable hosts
  return 0;
}
`,
      harness: `
{
  const ok =
    prefixForHosts(25) === 27 && prefixForHosts(10) === 28 && prefixForHosts(2) === 30 &&
    prefixForHosts(254) === 24 && prefixForHosts(255) === 23;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + prefixForHosts(25));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Loop `p` from 30 down to 1.", "Return `p` as soon as `2 ** (32 - p) - 2 >= n`."],
      solution: `function prefixForHosts(n) {
  for (let p = 30; p >= 1; p--) {
    if (2 ** (32 - p) - 2 >= n) return p;
  }
  return 0;
}`,
    },
  },
  {
    id: "z-scores-normal",
    track: "security-foundations",
    title: "The Normal Distribution & Z-Scores",
    summary: "Turn raw values into probabilities, for example how unusual a breach size is.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Breach sizes have mean 100 and standard deviation 10. Implement zscore, then compute P(X >= 115) and P(85 <= X <= 115). Print them with 4 decimals.",
      starter: String.raw`import math

def phi(z):
    """Standard normal cumulative probability P(Z <= z)."""
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))

def zscore(x, mean, sd):
    # TODO: how many standard deviations x is from the mean
    return 0.0

mean, sd = 100, 10
p_above = 0.0    # TODO: P(X >= 115) = 1 - phi(z)
p_between = 0.0  # TODO: P(85 <= X <= 115) = phi(z_high) - phi(z_low)

print(f"{p_above:.4f} {p_between:.4f}")
`,
      expected: "0.0668 0.8664",
      hints: ["z = (x - mean) / sd; for 115 that is 1.5.", "Between two values: phi(z_high) - phi(z_low)."],
      solution: String.raw`def zscore(x, mean, sd):
    return (x - mean) / sd

p_above = 1 - phi(zscore(115, mean, sd))
p_between = phi(zscore(115, mean, sd)) - phi(zscore(85, mean, sd))
`,
    },
  },
  {
    id: "levels-of-measurement",
    track: "security-foundations",
    title: "Variables & Levels of Measurement",
    summary: "Nominal, ordinal, interval and ratio, and which statistic fits each.",
    minutes: 20,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "The location of an attack (US, Europe, Asia) is which level of measurement?",
          options: ["Nominal", "Ordinal", "Ratio"],
          answer: 0,
          why: "Nominal values only name categories; there is no order or distance.",
        },
        {
          q: "A hazard severity scale (1 catastrophic ... 4 negligible) is:",
          options: ["Ordinal: the order is known but the distances aren't equal", "Nominal", "Ratio"],
          answer: 0,
          why: "Ordinal scales rank values; the gap between 1 and 2 need not equal the gap between 3 and 4.",
        },
        {
          q: "What separates a ratio scale from an interval scale?",
          options: ["A true zero (zero means none of the quantity)", "More categories", "It is always discrete"],
          answer: 0,
          why: "Kelvin has a true zero (ratio); Celsius and Fahrenheit do not (interval).",
        },
        {
          q: "Which measure of center is best for nominal data?",
          options: ["Mode", "Mean", "Standard deviation"],
          answer: 0,
          why: "Use mode for nominal, median for ordinal (and skewed data), and mean for interval or ratio data without extreme outliers.",
        },
        {
          q: "In a study of response time vs people impacted, response time is the:",
          options: ["Independent variable (predictor)", "Dependent variable (outcome)", "Constant"],
          answer: 0,
          why: "The IV is the potential cause; the DV is the effect that depends on it.",
        },
      ],
    },
  },
  {
    id: "backups-rto-rpo",
    track: "security-foundations",
    title: "Backups, RTO/RPO & Business Continuity",
    summary: "Full, differential and incremental backups and recovery objectives.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement backupsNeeded(strategy, daysSinceFull): how many backup sets must be restored to recover the latest state? Strategies: 'full', 'differential', 'incremental'. Return null for an unknown strategy.",
      starter: `function backupsNeeded(strategy, daysSinceFull) {
  // full: just the latest full backup
  // differential: the last full + the latest differential (if any days have passed)
  // incremental: the last full + every incremental since
  return null;
}
`,
      harness: `
{
  const ok =
    backupsNeeded("full", 3) === 1 &&
    backupsNeeded("differential", 3) === 2 && backupsNeeded("differential", 0) === 1 &&
    backupsNeeded("incremental", 3) === 4 && backupsNeeded("incremental", 0) === 1 &&
    backupsNeeded("copy", 2) === null;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["A switch on `strategy` keeps it readable.", "Incremental: one full plus one backup per day since the full."],
      solution: `function backupsNeeded(strategy, daysSinceFull) {
  switch (strategy) {
    case "full":
      return 1;
    case "differential":
      return daysSinceFull === 0 ? 1 : 2;
    case "incremental":
      return 1 + daysSinceFull;
    default:
      return null;
  }
}`,
    },
  },
  {
    id: "incident-response-planning",
    track: "security-foundations",
    title: "Incident Response Planning (NIST SP 800-61)",
    summary: "Lifecycle, terminology and how planning committees work together.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which lists the phases of the NIST incident response life cycle?",
          options: [
            "Preparation; detection and analysis; containment, eradication and recovery; post-incident activity",
            "Scan; exploit; report",
            "Plan; build; ship",
          ],
          answer: 0,
          why: "NIST SP 800-61 describes these four phases, with lessons learned feeding back into preparation.",
        },
        {
          q: "A business impact analysis (BIA) feeds incident response and contingency planning by:",
          options: ["Identifying critical functions and how long they can be down", "Choosing the antivirus", "Writing the code"],
          answer: 0,
          why: "The BIA is passed to the planning committees that build the IR, disaster recovery and business continuity plans.",
        },
        {
          q: "Recovery Time Objective (RTO) is:",
          options: ["How quickly a system must be restored after an outage", "How much data can be lost", "The backup size"],
          answer: 0,
          why: "RPO is the point in time to which data must be recoverable (how much data loss is acceptable); MTD is the longest total downtime the owner will accept.",
        },
        {
          q: "Business continuity planning vs disaster recovery planning:",
          options: [
            "BCP keeps critical functions running by alternate means; DR restores normal operations at the primary site",
            "They are identical",
            "DR only covers phones",
          ],
          answer: 0,
          why: "Both are driven by the BIA and exercised through tests and drills.",
        },
        {
          q: "A threat agent is:",
          options: ["A specific, identifiable instance of a general threat that can exploit a vulnerability", "A type of firewall", "A backup"],
          answer: 0,
          why: "Core terms: asset, threat, threat agent, vulnerability, exploit, control (safeguard/countermeasure).",
        },
      ],
    },
  },
  {
    id: "security-writing-bluf",
    track: "security-foundations",
    title: "Writing for Security: BLUF, Headlines & Credible Sources",
    summary: "Put the bottom line first and write so busy readers act on it.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "BLUF stands for:",
          options: ["Bottom Line Up Front", "Basic Logging Using Firewalls", "Binary Layer Under Filter"],
          answer: 0,
          why: "State the conclusion or required action first, then support it.",
        },
        {
          q: "The first time you use an acronym in a document, you should:",
          options: ["Write out the full term with the acronym in parentheses", "Use only the acronym", "Avoid acronyms entirely"],
          answer: 0,
          why: "After that you can use the acronym alone.",
        },
        {
          q: "Which is a red flag when judging whether a news article is factual?",
          options: ["Vague attributions such as 'critics say' or 'experts say' with no named sources", "A named author", "Linked primary sources"],
          answer: 0,
          why: "Ask who the critics or experts are, and find at least two reliable sources for anything you rely on.",
        },
        {
          q: "In APA style, an in-text citation for a direct quote includes:",
          options: ["Author, year and page number", "Only the title", "Nothing"],
          answer: 0,
          why: "Example format: (Author, 2022, p. 31). Paraphrases need author and year.",
        },
      ],
    },
  },
  {
    id: "technology-and-conflict",
    track: "security-foundations",
    title: "Technology, Power & Conflict",
    summary: "International relations theory and how technology reshapes security.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "The 'security dilemma' describes:",
          options: ["Actions a state takes to increase its own security are seen as threats by others, who respond in kind", "A software bug", "A trade agreement"],
          answer: 0,
          why: "It can drive arms races, and cyber capabilities raise similar escalation risks.",
        },
        {
          q: "In international relations, a 'unipolar' system has:",
          options: ["One dominant power (a hegemon)", "Two great powers", "No powers"],
          answer: 0,
          why: "Bipolar means two great powers (for example the Cold War); multipolar means three or more.",
        },
        {
          q: "Which of these is a 'non-kinetic' tool of modern conflict?",
          options: ["Cyber operations and information campaigns", "Artillery", "Tanks"],
          answer: 0,
          why: "Hybrid conflict mixes cyber, information and conventional force.",
        },
        {
          q: "Why do critical infrastructure and connectivity create both advantage and risk?",
          options: ["Better information moves faster, but adversaries target and disrupt those networks", "They have no downside", "They only matter in peacetime"],
          answer: 0,
          why: "The side that gets accurate information to decision makers quickly and securely gains advantage, which is why connectivity becomes a target.",
        },
      ],
    },
  },
];
