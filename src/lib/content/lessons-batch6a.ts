import type { Lesson } from "./types";

/**
 * Batch 6a: Cyber Range (host security, ssh admin, detection rules, log analytics), Digital Forensics,
 * and SQL / databases. Topics follow the owner's Penn State coursework (Cyber 100/262, SRA 221, IST 210/454,
 * Cyber 440); all text and data are original and fictional.
 */

const SQL_SETUP = `CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Marketing'),(3,'Finance');
CREATE TABLE employees (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, title TEXT NOT NULL,
  salary INTEGER NOT NULL, dept_id INTEGER REFERENCES departments(id), hired TEXT NOT NULL
);
INSERT INTO employees VALUES
 (1,'Ana','Programmer',90000,1,'2019-03-01'),
 (2,'Ben','Programmer',75000,1,'2021-07-15'),
 (3,'Cara','Programmer',80000,1,'2020-01-10'),
 (4,'Dev','Analyst',85000,3,'2018-09-09'),
 (5,'Eli','Programmer',95000,1,'2017-05-20'),
 (6,'Fay','Marketer',70000,2,'2022-02-02'),
 (7,'Gus','Marketer',72000,2,'2019-11-11'),
 (8,'Hal','Accountant',78000,3,'2016-04-04');`;

const SCHEMA_NOTE = `-- Tables you can query:
--   departments(id, name)
--   employees(id, name, title, salary, dept_id, hired)
`;

export const SQL_PLAYGROUND_SETUP = SQL_SETUP;

const HEADERS_LIST = `["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy"]`;

export const BATCH6A_LESSONS: Lesson[] = [
  /* ---------------- Cyber Range ---------------- */
  {
    id: "host-accounts-audit",
    track: "cyber-range",
    title: "Linux Host Security: Auditing Accounts",
    summary: "Find who can log in, and which accounts have usable passwords.",
    minutes: 25,
    xp: 70,
    level: "beginner",
    lab: {
      kind: "shell",
      fs: "hostsec",
      prompt:
        "Audit the server's accounts. Besides root, which two accounts in /etc/shadow have a usable password hash (not `!` or `*`)? Submit them one at a time. (Hint: /etc/shadow needs sudo.)",
      answers: ["jdoe", "tempadmin"],
      hints: [
        "`grep -v nologin /etc/passwd` lists accounts that have a login shell.",
        "`cat /etc/shadow` fails for a normal user. Try `sudo cat /etc/shadow`.",
        "`sudo grep -Ev '!|\\*' /etc/shadow` shows lines whose password field is NOT locked (`!`) or disabled (`*`).",
      ],
    },
  },
  {
    id: "linux-host-hardening",
    track: "cyber-range",
    title: "Hardening a Linux Server",
    summary: "Firewall, unneeded services and password aging, checked by a lab grader.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "hostsec",
      prompt: "Complete all three hardening tasks in ~/README.txt. Run `labcheck` to see progress; when every box is checked it prints a flag. Submit the flag.",
      answers: ["FLAG{layers_of_hardening}"],
      hints: [
        "Firewall: `sudo ufw default deny incoming`, `sudo ufw allow 22/tcp`, `sudo ufw allow 443/tcp`, then `sudo ufw enable`. Check with `sudo ufw status verbose`.",
        "Services: `systemctl list-units --type=service --state=active` shows what's running. Then `sudo systemctl stop avahi-daemon`, `sudo systemctl disable avahi-daemon`, and the same for cups.",
        "Password aging: `sudo chage -M 30 -W 14 jdoe`, then verify with `chage -l jdoe`.",
      ],
    },
  },
  {
    id: "ssh-remote-admin",
    track: "cyber-range",
    title: "Multi-Machine Range: Admin Over SSH",
    summary: "Log in to remote lab machines, read their logs and configs, copy files back.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "range",
      prompt: "Follow ~/README.txt. Find (1) the IP with the most failed SSH logins on web01 and (2) the risky bind-address value in db01's database config. Submit both.",
      answers: ["203.0.113.45", "0.0.0.0"],
      hints: [
        "`ssh student@web01` asks for a password; it's written in ~/README.txt. The prompt shows which machine you're on.",
        "On web01: `grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1`",
        "Type `exit` to return, then `ssh student@db01` and `cat /etc/mysql/mysqld.cnf`. 0.0.0.0 means the database listens on every network interface.",
      ],
    },
  },
  {
    id: "snort-rules",
    track: "cyber-range",
    title: "Detection Rules: Reading Snort-Style Rules",
    summary: "Parse an IDS rule into its header and options.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement parseSnortRule(rule). Return {action, protocol, src, srcPort, direction, dst, dstPort, options} (options is an object of name to value, quotes stripped), or null if the rule is malformed.",
      starter: `function parseSnortRule(rule) {
  // Header: action protocol src srcPort direction dst dstPort (options)
  // TODO: match the header with a regular expression, then split the options on ";"
  return null;
}
`,
      harness: `
{
  const r = parseSnortRule('alert tcp 192.168.1.0/24 any -> 10.0.0.5 80 (msg:"Possible web scan"; sid:1000001; rev:1;)');
  const ok =
    r && r.action === "alert" && r.protocol === "tcp" && r.src === "192.168.1.0/24" && r.srcPort === "any" &&
    r.direction === "->" && r.dst === "10.0.0.5" && r.dstPort === "80" &&
    r.options.msg === "Possible web scan" && r.options.sid === "1000001" && r.options.rev === "1" &&
    parseSnortRule("this is not a rule") === null;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(r));
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "Header regex: /^(\\w+)\\s+(\\w+)\\s+(\\S+)\\s+(\\S+)\\s+(->|<>)\\s+(\\S+)\\s+(\\S+)\\s*\\((.*)\\)\\s*$/",
        "Split the options on ';', then split each part at the FIRST ':' (use indexOf).",
        "Strip surrounding double quotes from values with .replace(/^\"|\"$/g, '').",
      ],
      solution: `function parseSnortRule(rule) {
  const m = /^(\\w+)\\s+(\\w+)\\s+(\\S+)\\s+(\\S+)\\s+(->|<>)\\s+(\\S+)\\s+(\\S+)\\s*\\((.*)\\)\\s*$/.exec(rule.trim());
  if (!m) return null;
  const options = {};
  for (const part of m[8].split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    options[part.slice(0, i).trim()] = part.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  return { action: m[1], protocol: m[2], src: m[3], srcPort: m[4], direction: m[5], dst: m[6], dstPort: m[7], options };
}`,
    },
  },
  {
    id: "log-analytics-regex",
    track: "cyber-range",
    title: "Log Analytics: Regex on Web Server Logs",
    summary: "Parse access logs and spot a directory-probing client.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Count the 404 responses per requested path and print the most common one as `path count`.",
      starter: String.raw`import re
from collections import Counter

LOG = """10.0.0.5 - - [12/Jan/2026:03:10:01] "GET /index.html HTTP/1.1" 200 512
10.0.0.9 - - [12/Jan/2026:03:10:02] "GET /admin HTTP/1.1" 404 120
10.0.0.9 - - [12/Jan/2026:03:10:02] "GET /wp-login.php HTTP/1.1" 404 120
10.0.0.9 - - [12/Jan/2026:03:10:03] "GET /admin HTTP/1.1" 404 120
10.0.0.5 - - [12/Jan/2026:03:10:04] "GET /style.css HTTP/1.1" 200 2048
10.0.0.9 - - [12/Jan/2026:03:10:05] "GET /wp-login.php HTTP/1.1" 404 120
10.0.0.9 - - [12/Jan/2026:03:10:06] "GET /admin HTTP/1.1" 404 120
10.0.0.7 - - [12/Jan/2026:03:10:07] "GET /login HTTP/1.1" 200 733
10.0.0.9 - - [12/Jan/2026:03:10:08] "GET /backup.zip HTTP/1.1" 404 120
10.0.0.9 - - [12/Jan/2026:03:10:09] "GET /admin HTTP/1.1" 404 120"""

not_found = Counter()
for line in LOG.splitlines():
    # TODO: use re.search to capture the path and status code, e.g. r'"(?:GET|POST) (\S+) HTTP/\d\.\d" (\d{3})'
    # then count the path when the status is "404"
    pass

path, count = not_found.most_common(1)[0]
print(path, count)
`,
      expected: "/admin 4",
      hints: ["`m = re.search(pattern, line)` returns None if there's no match: check it first.", "`m.group(1)` is the path and `m.group(2)` is the status code (a string).", "`not_found[path] += 1`"],
      solution: String.raw`for line in LOG.splitlines():
    m = re.search(r'"(?:GET|POST) (\S+) HTTP/\d\.\d" (\d{3})', line)
    if m and m.group(2) == "404":
        not_found[m.group(1)] += 1
`,
    },
  },

  /* ---------------- Digital Forensics ---------------- */
  {
    id: "forensic-imaging-hashing",
    track: "digital-forensics",
    title: "Evidence Integrity: Imaging & Hash Verification",
    summary: "Prove evidence hasn't changed by re-hashing and comparing.",
    minutes: 25,
    xp: 80,
    level: "beginner",
    lab: {
      kind: "shell",
      fs: "dfir2",
      prompt: "Verify every file in ~/case against recorded-hashes.txt. Which file no longer matches its recorded hash? Submit the filename.",
      answers: ["browser_history.txt"],
      hints: ["`cd case` then `cat recorded-hashes.txt`.", "`sha256sum -c recorded-hashes.txt` prints OK or FAILED for each file.", "Even a one-character change produces a completely different hash."],
    },
  },
  {
    id: "registry-analysis",
    track: "digital-forensics",
    title: "Windows Registry Forensics",
    summary: "Hives, user artifacts and what the registry reveals about activity.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which registry hive file stores local user account information (names, RIDs and password hashes)?",
          options: ["SAM", "SOFTWARE", "NTUSER.DAT only"],
          answer: 0,
          why: "SAM holds local accounts. SYSTEM, SOFTWARE and SECURITY are the other core system hives; each user also has an NTUSER.DAT.",
        },
        {
          q: "Where do user-specific settings and recent activity usually live?",
          options: ["The user's NTUSER.DAT hive", "Only in the SYSTEM hive", "The BIOS"],
          answer: 0,
          why: "NTUSER.DAT (HKEY_CURRENT_USER) holds per-user preferences, recently used items and run-history artifacts.",
        },
        {
          q: "Why do examiners work on a copy of the registry hives rather than a live system?",
          options: ["To preserve the original evidence and avoid changing it", "Hives can't be read live", "It's faster"],
          answer: 0,
          why: "Opening or booting the original changes timestamps and data. Image first, analyze the copy.",
        },
        {
          q: "The registry 'Run' keys are interesting to investigators because:",
          options: ["Programs listed there start automatically, a common persistence location", "They store web passwords", "They list firewall logs"],
          answer: 0,
          why: "Autostart locations are checked in almost every compromise investigation.",
        },
      ],
    },
  },
  {
    id: "data-carving",
    track: "digital-forensics",
    title: "Data Carving: Recovering Files by Signature",
    summary: "Find JPEG files in raw bytes using header and footer signatures.",
    minutes: 35,
    xp: 100,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement carveJpegs(hex): the input is raw bytes as a lowercase hex string. A JPEG starts with bytes ff d8 ff and ends at the next ff d9. Return an array of [start, end] byte offsets (end exclusive, so it includes the ff d9) in order.",
      starter: `function carveJpegs(hex) {
  // TODO: walk the bytes (2 hex characters each). When you see "ffd8ff", scan forward for "ffd9".
  return [];
}
`,
      harness: `
{
  const HEX = "0011ffd8ffe0aabbffd9" + "2233" + "ffd8ffe1ccffd9" + "44";
  const got = JSON.stringify(carveJpegs(HEX));
  console.log(got === "[[2,10],[12,19]]" ? "ALL TESTS PASSED" : "TESTS FAILED: " + got);
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "A byte at index i is `hex.slice(i * 2, i * 2 + 2)`.",
        "Check `hex.slice(i * 2, i * 2 + 6) === 'ffd8ff'` for a header and `hex.slice(j * 2, j * 2 + 4) === 'ffd9'` for a footer.",
        "After carving a file, continue scanning from its end offset.",
      ],
      solution: `function carveJpegs(hex) {
  const out = [];
  const n = hex.length / 2;
  let i = 0;
  while (i < n - 2) {
    if (hex.slice(i * 2, i * 2 + 6) === "ffd8ff") {
      let j = i + 3;
      while (j < n - 1 && hex.slice(j * 2, j * 2 + 4) !== "ffd9") j++;
      if (j < n - 1) {
        out.push([i, j + 2]);
        i = j + 2;
        continue;
      }
    }
    i++;
  }
  return out;
}`,
    },
  },
  {
    id: "memory-analysis",
    track: "digital-forensics",
    title: "Memory Forensics",
    summary: "What lives only in RAM and how analysts examine it.",
    minutes: 25,
    xp: 70,
    level: "advanced",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Why capture memory before powering a suspect machine off?",
          options: ["RAM holds volatile evidence (processes, connections, keys) that vanishes at shutdown", "RAM is more permanent than disk", "It makes the disk image faster"],
          answer: 0,
          why: "The order of volatility says to collect the most volatile data first.",
        },
        {
          q: "Which artifacts can a memory image reveal?",
          options: ["Running processes, network connections, loaded modules and sometimes unencrypted secrets", "Only deleted photos", "Nothing useful"],
          answer: 0,
          why: "Memory analysis can expose malware that never touches disk and processes hidden from normal tools.",
        },
        {
          q: "Volatility is best described as:",
          options: ["An open-source framework for analyzing memory images", "A disk encryption tool", "A packet sniffer"],
          answer: 0,
          why: "It parses memory dumps into process lists, network sockets, registry hives and more.",
        },
        {
          q: "Capturing memory changes the system slightly. What should the examiner do?",
          options: ["Document the tools and steps used, and hash the capture", "Hide the change", "Skip documentation"],
          answer: 0,
          why: "Forensic work must be repeatable and explainable: record what you ran and when.",
        },
      ],
    },
  },
  {
    id: "forensic-report-writing",
    track: "digital-forensics",
    title: "Writing a Forensic Analysis Report",
    summary: "Structure findings so a non-technical reader can act on them.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which section should come first in a forensic report?",
          options: ["An executive summary of what was found and why it matters", "Raw tool output", "Appendices"],
          answer: 0,
          why: "Decision makers read the summary; details follow for those who need them.",
        },
        {
          q: "Which belongs in the report to show evidence wasn't altered?",
          options: ["The hash value(s) of the image and verification steps", "The examiner's opinion only", "Nothing"],
          answer: 0,
          why: "Integrity is demonstrated with recorded hashes plus a documented chain of custody.",
        },
        {
          q: "A good report separates:",
          options: ["Facts observed from conclusions or opinions drawn from them", "Evidence from people", "Dates from times"],
          answer: 0,
          why: "Label what you saw, how you saw it, and what you infer; avoid overstating certainty.",
        },
        {
          q: "Typical sections of an image-analysis report include:",
          options: ["File system layout, user accounts, data files, application history and indicators of compromise", "Only screenshots", "A marketing summary"],
          answer: 0,
          why: "Organizing by these areas makes findings easy to verify and reuse.",
        },
      ],
    },
  },
  {
    id: "ransomware-response",
    track: "digital-forensics",
    title: "Ransomware: Response & Recovery",
    summary: "Contain, assess, recover, and decide with a plan, not panic.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "First priority when ransomware is detected spreading on a network?",
          options: ["Contain it: isolate affected systems from the network", "Pay immediately", "Delete all logs"],
          answer: 0,
          why: "Containment limits damage. Disconnect from the network but don't power off yet if you need memory evidence.",
        },
        {
          q: "The best protection against permanent data loss from ransomware is:",
          options: ["Tested, offline or immutable backups", "A longer wallpaper", "Disabling antivirus"],
          answer: 0,
          why: "Backups you have never restored are a hope, not a plan.",
        },
        {
          q: "Before deciding anything about a ransom demand, an organization should:",
          options: ["Involve leadership, legal counsel, law enforcement and the incident response plan", "Let one admin decide alone", "Reply to the attacker from a personal email"],
          answer: 0,
          why: "Payment carries legal, ethical and practical risks (no guarantee of recovery). A contingency plan decides roles in advance.",
        },
        {
          q: "After recovery, the team should:",
          options: ["Find the root cause (e.g. initial access) and fix it; document lessons learned", "Move on", "Reuse the same compromised credentials"],
          answer: 0,
          why: "Without removing the cause, reinfection is likely.",
        },
      ],
    },
  },

  /* ---------------- Databases & SQL ---------------- */
  {
    id: "database-design-basics",
    track: "databases-sql",
    title: "Database Design: Tables, Keys & Relationships",
    summary: "Entities, primary and foreign keys, and avoiding duplication.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "A primary key is:",
          options: ["A column (or set) that uniquely identifies each row", "The first column alphabetically", "A password"],
          answer: 0,
          why: "Primary keys can't be NULL or duplicated.",
        },
        {
          q: "A foreign key:",
          options: ["Refers to a primary key in another table, linking the rows", "Encrypts the table", "Must be unique always"],
          answer: 0,
          why: "Foreign keys keep related data consistent (referential integrity).",
        },
        {
          q: "Storing a department's name in every employee row (instead of a separate table) risks:",
          options: ["Inconsistent, duplicated data", "Faster queries always", "Nothing"],
          answer: 0,
          why: "Normalization splits repeated data into its own table and references it by key.",
        },
        {
          q: "In an ER diagram, a 'one-to-many' relationship between departments and employees means:",
          options: ["One department has many employees; each employee has one department", "One employee has many departments", "Each table has one row"],
          answer: 0,
          why: "The foreign key lives on the 'many' side (employees.dept_id).",
        },
      ],
    },
  },
  {
    id: "sql-select",
    track: "databases-sql",
    title: "SQL: SELECT, WHERE & ORDER BY",
    summary: "Query a single table with filters and sorting, in a real SQLite database.",
    minutes: 25,
    xp: 70,
    level: "beginner",
    lab: {
      kind: "code",
      language: "sql",
      prompt: "List the names of programmers earning at least 80000, in alphabetical order. (Select only the name column.)",
      setup: SQL_SETUP,
      starter: `${SCHEMA_NOTE}
-- Write your query here:
SELECT 'write a query' AS todo;
`,
      expected: "-- result: Ana;Cara;Eli",
      hints: ["`WHERE title = 'Programmer' AND salary >= 80000`", "`ORDER BY name` sorts A to Z.", "SELECT name FROM employees WHERE ... ORDER BY name;"],
      solution: `SELECT name FROM employees
WHERE title = 'Programmer' AND salary >= 80000
ORDER BY name;`,
    },
  },
  {
    id: "sql-joins-aggregates",
    track: "databases-sql",
    title: "SQL: JOINs & Aggregates",
    summary: "Combine tables and summarize with SUM, COUNT and GROUP BY.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "sql",
      prompt: "Show each department's name and its total payroll (SUM of salary) as `total`, largest total first.",
      setup: SQL_SETUP,
      starter: `${SCHEMA_NOTE}
-- Write your query here:
SELECT 'write a query' AS todo;
`,
      expected: "-- result: Engineering|340000;Finance|163000;Marketing|142000",
      hints: ["JOIN departments d ON e.dept_id = d.id", "GROUP BY d.name", "`SUM(e.salary) AS total` then `ORDER BY total DESC`"],
      solution: `SELECT d.name, SUM(e.salary) AS total
FROM employees e
JOIN departments d ON e.dept_id = d.id
GROUP BY d.name
ORDER BY total DESC;`,
    },
  },
  {
    id: "sql-subqueries",
    track: "databases-sql",
    title: "SQL: Subqueries",
    summary: "Use one query's result inside another.",
    minutes: 25,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "sql",
      prompt: "List the names of employees who earn MORE than the average salary of all employees, alphabetically.",
      setup: SQL_SETUP,
      starter: `${SCHEMA_NOTE}
-- Write your query here (hint: a subquery can compute the average):
SELECT 'write a query' AS todo;
`,
      expected: "-- result: Ana;Dev;Eli",
      hints: ["`SELECT AVG(salary) FROM employees` returns one number.", "`WHERE salary > (SELECT AVG(salary) FROM employees)`"],
      solution: `SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY name;`,
    },
  },
  {
    id: "sql-group-having",
    track: "databases-sql",
    title: "SQL: GROUP BY & HAVING",
    summary: "Filter groups, not rows.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "sql",
      prompt: "Show each department name and its head count (as `n`) only for departments with MORE than 2 employees.",
      setup: SQL_SETUP,
      starter: `${SCHEMA_NOTE}
-- Write your query here:
SELECT 'write a query' AS todo;
`,
      expected: "-- result: Engineering|4",
      hints: ["WHERE filters rows before grouping; HAVING filters groups after.", "`HAVING COUNT(*) > 2`"],
      solution: `SELECT d.name, COUNT(*) AS n
FROM employees e JOIN departments d ON e.dept_id = d.id
GROUP BY d.name
HAVING COUNT(*) > 2;`,
    },
  },
  {
    id: "sql-ddl-dml",
    track: "databases-sql",
    title: "SQL: CREATE, INSERT & UPDATE",
    summary: "Define a table, add rows and change them, then verify.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "sql",
      prompt: "Create the tickets table, insert three tickets (two 'open', one 'closed'), then change every 'open' ticket to 'triaged'. The final SELECT is already written.",
      starter: `-- 1) CREATE TABLE tickets (id INTEGER PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL);
-- 2) INSERT three rows: two with status 'open', one with status 'closed'
-- 3) UPDATE tickets SET status = 'triaged' WHERE status = 'open';

SELECT status, COUNT(*) FROM tickets GROUP BY status ORDER BY status;
`,
      expected: "-- result: closed|1;triaged|2",
      hints: ["Put your statements before the final SELECT; end each statement with a semicolon.", "`INSERT INTO tickets (title, status) VALUES ('Phishing report', 'open'), ...;`"],
      solution: `CREATE TABLE tickets (id INTEGER PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL);
INSERT INTO tickets (title, status) VALUES ('Phishing report', 'open'), ('Lost laptop', 'open'), ('Password reset', 'closed');
UPDATE tickets SET status = 'triaged' WHERE status = 'open';
SELECT status, COUNT(*) FROM tickets GROUP BY status ORDER BY status;`,
    },
  },

  /* ---------------- Extras for existing tracks ---------------- */
  {
    id: "text-processing-awk-sed",
    track: "linux-shell",
    title: "Text Processing: awk, sed & Pipelines",
    summary: "Pull fields out of logs and rewrite text from the command line.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "logs",
      prompt: "In /var/log/auth.log, how many failed password attempts came from the single most frequent IP? Submit the number.",
      answers: ["23"],
      hints: [
        "In a 'Failed password' line the IP is field 11: `awk '{print $11}'`.",
        "`grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1`",
        "uniq -c puts the count first.",
      ],
    },
  },
  {
    id: "py-json-feeds",
    track: "python-security",
    title: "Python: Parsing JSON Threat Feeds",
    summary: "Load JSON safely and filter indicators by severity.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Parse the feed and print the ids of indicators with severity 7 or higher, in the original order, comma-separated.",
      starter: String.raw`import json

FEED = '[{"id": "T-101", "severity": 9}, {"id": "T-102", "severity": 4}, {"id": "T-103", "severity": 7}, {"id": "T-104", "severity": 6}]'

items = []   # TODO: parse FEED with json.loads

urgent = []  # TODO: ids of items whose severity is >= 7

print(",".join(urgent))
`,
      expected: "T-101,T-103",
      hints: ["`json.loads(FEED)` returns a list of dicts.", "A list comprehension: `[i['id'] for i in items if i['severity'] >= 7]`"],
      solution: String.raw`items = json.loads(FEED)
urgent = [i["id"] for i in items if i["severity"] >= 7]
`,
    },
  },
  {
    id: "web-security-headers",
    track: "web-js",
    title: "Security Headers & Cookies",
    summary: "Audit a response for the headers that harden a site.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement auditHeaders(headers): return the recommended header names (lowercase, in the order of REQUIRED) that are MISSING from the response headers object. Header names are case-insensitive.",
      starter: `const REQUIRED = ${HEADERS_LIST};

function auditHeaders(headers) {
  // TODO
  return [];
}
`,
      harness: `
{
  const a = JSON.stringify(auditHeaders({ "Content-Type": "text/html", "X-Frame-Options": "DENY" }));
  const b = JSON.stringify(auditHeaders({ "Content-Security-Policy": "x", "Strict-Transport-Security": "x", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer" }));
  const ok = a === JSON.stringify(["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy"]) && b === "[]";
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + a);
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Lowercase every key of the input first: `Object.keys(headers).map(k => k.toLowerCase())`.", "Return `REQUIRED.filter(h => !present.includes(h))`."],
      solution: `function auditHeaders(headers) {
  const present = Object.keys(headers).map((k) => k.toLowerCase());
  return REQUIRED.filter((h) => !present.includes(h));
}`,
    },
  },
  {
    id: "csrf-cookies-sessions",
    track: "web-js",
    title: "Sessions, Cookies & CSRF",
    summary: "How logins persist, how they're stolen, and how to defend them.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which cookie attribute stops JavaScript from reading the cookie (limiting theft via XSS)?",
          options: ["HttpOnly", "Secure", "Path"],
          answer: 0,
          why: "Secure restricts the cookie to HTTPS; HttpOnly hides it from scripts; SameSite limits cross-site sending.",
        },
        {
          q: "CSRF tricks:",
          options: ["A logged-in user's browser into sending an unwanted request to a site", "The server into running SQL", "DNS into redirecting"],
          answer: 0,
          why: "Browsers attach cookies automatically, so a hostile page can trigger actions unless the site defends.",
        },
        {
          q: "Which is a standard CSRF defense?",
          options: ["Anti-CSRF tokens and SameSite cookies", "Longer URLs", "Hiding the form"],
          answer: 0,
          why: "A per-session unguessable token the attacker can't read, plus SameSite=Lax/Strict.",
        },
        {
          q: "After login, the app should issue a new session ID to prevent:",
          options: ["Session fixation", "SQL injection", "Port scans"],
          answer: 0,
          why: "Regenerate session identifiers on privilege changes, and expire them on logout.",
        },
      ],
    },
  },
];
