import type { Lesson } from "./types";

/** Second content batch. Merged into LESSONS in lessons.ts. */
export const EXTRA_LESSONS: Lesson[] = [
  {
    id: "net-fundamentals",
    track: "networking",
    title: "IP, Ports, DNS & TCP",
    summary: "How a request finds a server and what the layers mean.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What does DNS do?",
          options: ["Encrypts web traffic", "Translates names like example.com into IP addresses", "Assigns IPs to devices on a LAN"],
          answer: 1,
          why: "DNS is the internet's phone book. Attackers abuse it for tunneling and C2, so defenders log DNS queries.",
        },
        {
          q: "Which statement about TCP vs UDP is correct?",
          options: [
            "TCP is connection-oriented with delivery guarantees; UDP is connectionless and faster but unreliable",
            "UDP always encrypts data",
            "TCP cannot be used for web traffic",
          ],
          answer: 0,
          why: "HTTP/HTTPS and SSH use TCP; DNS, VoIP and streaming commonly use UDP.",
        },
        {
          q: "The TCP three-way handshake is:",
          options: ["SYN, SYN-ACK, ACK", "GET, POST, PUT", "ping, pong, ack"],
          answer: 0,
          why: "A SYN scan sends SYN and watches for SYN-ACK to discover open ports without completing the handshake.",
        },
        {
          q: "An address like 192.168.1.20 is:",
          options: ["A public internet address", "A private (RFC 1918) address used inside local networks", "A DNS server only"],
          answer: 1,
          why: "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Routers use NAT to reach the public internet.",
        },
      ],
    },
  },
  {
    id: "subnetting",
    track: "networking",
    title: "Subnetting & CIDR",
    summary: "Count the usable hosts in any network block.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement hostsInCidr(cidr) returning the number of USABLE host addresses (network and broadcast excluded) for prefixes /1 to /30.",
      starter: `function hostsInCidr(cidr) {
  // TODO: read the prefix length after "/" then compute 2^(32 - prefix) - 2
  return 0;
}
`,
      harness: `
{
  const cases = [["10.0.0.0/24", 254], ["172.16.0.0/16", 65534], ["192.168.1.0/30", 2], ["10.1.2.0/29", 6]];
  const bad = cases.filter(([c, want]) => hostsInCidr(c) !== want);
  console.log(bad.length === 0 ? "ALL TESTS PASSED" : "FAILED: " + JSON.stringify(bad[0]));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`Number(cidr.split('/')[1])` gives the prefix.", "Use `2 ** (32 - prefix) - 2`."],
      solution: `function hostsInCidr(cidr) {
  const prefix = Number(cidr.split("/")[1]);
  return 2 ** (32 - prefix) - 2;
}`,
    },
  },
  {
    id: "packet-reading",
    track: "networking",
    title: "Reading a Packet Capture",
    summary: "Find a malware beacon in tcpdump-style output.",
    minutes: 20,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "net",
      prompt: "Which internal host asked DNS to resolve evil-c2.example? Submit its IP.",
      answers: ["10.0.0.31"],
      hints: ["`cat ~/capture.txt` to see the lines.", "`grep evil-c2 ~/capture.txt`", "The source is the first IP on the line (the number after the last dot is the port)."],
    },
  },
  {
    id: "bash-scripting",
    track: "linux-shell",
    title: "Bash Scripting & Automation",
    summary: "Variables, loops, conditionals, exit codes, cron.",
    minutes: 25,
    xp: 50,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Why quote variables in scripts, like \"$file\"?",
          options: ["It makes scripts faster", "It prevents word splitting and glob expansion on spaces or special characters", "It's required by the kernel"],
          answer: 1,
          why: "Unquoted variables break on spaces and can enable injection bugs when the value is attacker-controlled.",
        },
        {
          q: "What does `set -euo pipefail` at the top of a script do?",
          options: ["Stops on errors, unset variables and failed pipeline stages", "Encrypts the script", "Makes it run as root"],
          answer: 0,
          why: "Fail-fast scripts avoid silently continuing after something goes wrong.",
        },
        {
          q: "Which cron schedule runs a job every day at 02:30?",
          options: ["30 2 * * *", "2 30 * * *", "* * 2 30 *"],
          answer: 0,
          why: "Fields are minute, hour, day-of-month, month, day-of-week.",
        },
        {
          q: "How do you check whether the previous command succeeded?",
          options: ["$? equals 0", "$? equals 1", "$# equals 0"],
          answer: 0,
          why: "Exit code 0 means success; anything else is an error.",
        },
      ],
    },
  },
  {
    id: "py-regex-iocs",
    track: "python-security",
    title: "Regex: Extracting Indicators",
    summary: "Pull IP addresses out of a threat report with re.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Extract every unique IPv4 address from the report and print them sorted, comma-separated.",
      starter: String.raw`import re

REPORT = """Host 10.1.1.5 contacted 203.0.113.9 and 198.51.100.7.
Later 10.1.1.5 contacted 203.0.113.9 again.
Phish sent from alerts@bank-secure.example to victim@corp.example via 192.0.2.44."""

# TODO: use re.findall with an IPv4 pattern such as r"\b(?:\d{1,3}\.){3}\d{1,3}\b"
ips = []

print(",".join(sorted(set(ips))))
`,
      expected: "10.1.1.5,192.0.2.44,198.51.100.7,203.0.113.9",
      hints: ["`re.findall(pattern, REPORT)` returns a list of matches.", "A set removes duplicates; sorted() orders them."],
      solution: String.raw`import re
ips = re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", REPORT)
print(",".join(sorted(set(ips))))
`,
    },
  },
  {
    id: "sql-injection",
    track: "web-js",
    title: "SQL Injection & Parameterized Queries",
    summary: "See how string-built queries break, then fix them.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "buildLogin currently concatenates user input into SQL. Rewrite it to return a parameterized query: placeholders (?) in sql and the values in params.",
      starter: `function buildLogin(username, passwordHash) {
  // VULNERABLE: user input is pasted into the SQL text
  return {
    sql: "SELECT id FROM users WHERE username = '" + username + "' AND password_hash = '" + passwordHash + "'",
    params: [],
  };
}
`,
      harness: `
{
  const evil = "' OR '1'='1";
  const q = buildLogin(evil, "x");
  const ok = !q.sql.includes(evil) && (q.sql.match(/\\?/g) || []).length === 2 && q.params[0] === evil && q.params[1] === "x";
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(q));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Use two ? placeholders in the SQL string.", "Return the values in order: [username, passwordHash]."],
      solution: `function buildLogin(username, passwordHash) {
  return {
    sql: "SELECT id FROM users WHERE username = ? AND password_hash = ?",
    params: [username, passwordHash],
  };
}`,
    },
  },
  {
    id: "owasp-top10",
    track: "ethical-hacking",
    title: "OWASP Top 10 Tour",
    summary: "The web's most common weaknesses, in plain English.",
    minutes: 30,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Broken Access Control means:",
          options: ["Users can act outside their intended permissions, e.g. viewing another user's record by changing an ID", "Passwords are too short", "The server is slow"],
          answer: 0,
          why: "It tops the OWASP list. Always check authorization on the server for every object (IDOR).",
        },
        {
          q: "Which is the best fix for injection flaws?",
          options: ["Blocklist bad characters", "Parameterized queries / safe APIs plus input validation", "Hide the error messages"],
          answer: 1,
          why: "Separate code from data; never build commands or queries by string concatenation.",
        },
        {
          q: "SSRF (server-side request forgery) lets an attacker:",
          options: ["Make the server send requests to internal or arbitrary URLs", "Steal browser cookies directly", "Crack passwords offline"],
          answer: 0,
          why: "Cloud metadata endpoints and internal services are common targets. Use allowlists for outbound requests.",
        },
        {
          q: "Using components with known vulnerabilities is best prevented by:",
          options: ["Inventory + patching + dependency scanning (npm audit, Dependabot)", "Never updating, to avoid breakage", "Hiding version numbers only"],
          answer: 0,
          why: "Log4Shell and many breaches came from unpatched libraries.",
        },
      ],
    },
  },
  {
    id: "incident-response",
    track: "ethical-hacking",
    title: "Incident Response: Hunt the Backdoor",
    summary: "Spot a persistence mechanism on a compromised Linux box.",
    minutes: 20,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "forensics",
      prompt: "Besides root, which account in /etc/passwd has UID 0? Submit the username.",
      answers: ["backup2"],
      hints: ["`cut -d: -f1,3 /etc/passwd` shows name and UID.", "Or `grep ':0:0:' /etc/passwd`."],
    },
  },
  {
    id: "powershell-basics",
    track: "systems-servers",
    title: "PowerShell for Windows Admins",
    summary: "Objects, the pipeline, and key security cmdlets.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What makes PowerShell's pipeline different from Bash's?",
          options: ["It passes .NET objects, not just text", "It only works offline", "It can't filter"],
          answer: 0,
          why: "You can filter on properties: Get-Process | Where-Object CPU -gt 100.",
        },
        {
          q: "Which cmdlet lists local users?",
          options: ["Get-LocalUser", "ls-users", "whoami /all only"],
          answer: 0,
          why: "Get-LocalUser, Get-LocalGroupMember and Get-WinEvent are staples for audits and incident response.",
        },
        {
          q: "Execution policy in PowerShell is:",
          options: ["A safety guard against accidentally running scripts, not a security boundary", "A firewall", "Antivirus"],
          answer: 0,
          why: "It's easily bypassed, so rely on application control and logging (Script Block Logging) instead.",
        },
      ],
    },
  },
];
