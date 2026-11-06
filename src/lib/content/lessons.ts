import type { Lesson, Track } from "./types";
import { authLog, CTF_FLAGS, rot13 } from "./filesystems";
import { EXTRA_LESSONS } from "./lessons-extra";
import { BATCH3_LESSONS } from "./lessons-batch3";
import { BATCH4_LESSONS } from "./lessons-batch4";
import { BATCH5_LESSONS } from "./lessons-batch5";

const hex = (s: string) => [...s].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
const caesar = (s: string, k: number) =>
  s.replace(/[A-Z]/g, (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + k) % 26) + 65));

const LAYERED_FLAG = "FLAG{layers_of_encoding}";
const CAESAR_PLAIN = "MEET AT THE EAGLES NEST AT NOON";

export const TRACKS: Track[] = [
  {
    id: "linux-shell",
    title: "Linux & the Shell",
    tagline: "Own the command line",
    icon: ">_",
    description:
      "Every server, every pentest box, every incident response starts in a terminal. Learn to navigate, search, filter and secure a Linux system.",
    lessons: ["shell-navigation", "shell-pipes", "shell-permissions", "bash-scripting", "wargame-find-files"],
  },
  {
    id: "python-security",
    title: "Python for Security",
    tagline: "Automate everything",
    icon: "py",
    description:
      "Python is the security professional's duct tape. Parse logs, decode data, break toy ciphers and write real tooling.",
    lessons: ["py-basics", "py-bytes", "py-log-analysis", "py-caesar", "py-hashing", "py-regex-iocs"],
  },
  {
    id: "web-js",
    title: "Web & JavaScript",
    tagline: "How the web works - and breaks",
    icon: "js",
    description:
      "Understand HTTP, the browser, and the classic web bugs. Write JavaScript that defends instead of exposes.",
    lessons: ["js-basics", "http-anatomy", "xss-escape", "sql-injection"],
  },
  {
    id: "math-crypto",
    title: "Math for Security",
    tagline: "The discrete math under crypto and ML",
    icon: "math",
    description:
      "Number bases, the Euclidean algorithm, modular inverses, toy RSA, logic and proofs, and Bayes' theorem: the math behind cryptography and security analytics.",
    lessons: ["number-bases", "euclid-gcd", "modular-inverse", "rsa-from-scratch", "logic-and-proofs", "probability-bayes"],
  },
  {
    id: "kali-pentest",
    title: "Kali Pentest Lab",
    tagline: "Scan, enumerate, crack, report",
    icon: "kali",
    description:
      "A simulated Kali-style toolkit against a fictional network: nmap, gobuster, curl, John the Ripper and searchsploit, finishing with how to write a report that gets fixed.",
    lessons: ["kali-intro", "pentest-report"],
  },
  {
    id: "security-foundations",
    title: "Security Foundations",
    tagline: "The theory behind the tools",
    icon: "sec",
    description:
      "Risk assessment, cryptography, OSINT, Windows and Active Directory, and digital forensics: the knowledge that turns tool users into analysts.",
    lessons: ["risk-assessment", "crypto-fundamentals", "osint-basics", "windows-ad-basics", "digital-forensics-basics", "malware-landscape", "security-governance", "tech-law-basics"],
  },
  {
    id: "automation",
    title: "Automation & Scripting",
    tagline: "Make the computer do the boring work",
    icon: "auto",
    description:
      "Turn repetitive tasks into reliable scripts: organize files, build reports, call APIs, retry safely and schedule jobs.",
    lessons: ["automation-mindset", "py-file-organizer", "py-csv-json", "js-api-pagination", "py-retry-logging", "cron-scheduling"],
  },
  {
    id: "ai-engineering",
    title: "Building AI",
    tagline: "From gradient descent to LLM apps",
    icon: "ai",
    description:
      "Understand how machine learning and LLMs work, then build with them safely: embeddings, retrieval, validated outputs and AI security.",
    lessons: [
      "ai-fundamentals",
      "ml-from-scratch",
      "embeddings-similarity",
      "prompt-engineering",
      "llm-output-validation",
      "rag-basics",
      "ml-spam-classifier",
      "ai-security",
    ],
  },
  {
    id: "networking",
    title: "Networking Essentials",
    tagline: "See the wire",
    icon: "net",
    description:
      "IPs, ports, DNS, subnets and packet captures: the language every attacker, defender and sysadmin must speak.",
    lessons: ["net-fundamentals", "subnetting", "packet-reading"],
  },
  {
    id: "systems-servers",
    title: "Systems & Servers",
    tagline: "Build the lab. Harden the box.",
    icon: "sys",
    description:
      "Flash a USB, install an OS, stand up a server, lock down SSH and the firewall, and build a safe home lab to practice in.",
    lessons: ["imaging-and-install", "server-setup-ssh", "firewalls-services", "home-lab", "powershell-basics"],
  },
  {
    id: "ethical-hacking",
    title: "Ethical Hacking",
    tagline: "Think like an attacker - legally",
    icon: "hk",
    description:
      "Rules of engagement, recon, password attacks and capture-the-flag practice, always inside authorized, legal boundaries.",
    lessons: ["hacking-ethics", "recon-basics", "owasp-top10", "incident-response", "ctf-warmup"],
  },
];

const CORE_LESSONS: Lesson[] = [
  /* ---------------- Linux & Shell ---------------- */
  {
    id: "shell-navigation",
    track: "linux-shell",
    title: "Navigating the Filesystem",
    summary: "pwd, ls, cd, cat - and why hidden files matter.",
    minutes: 15,
    xp: 30,
    level: "beginner",
    lab: {
      kind: "shell",
      fs: "basics",
      prompt: "Find the hidden file inside ~/mission/files and read it. Submit the flag you find.",
      answers: ["FLAG{hidden_in_plain_sight}"],
      hints: [
        "Start with `cd mission` then look around with `ls`.",
        "Files starting with a dot are hidden. `ls -a` shows them.",
        "The hidden file is in ~/mission/files. Use `cat` to read it.",
      ],
    },
  },
  {
    id: "shell-pipes",
    track: "linux-shell",
    title: "Pipes, grep & Log Hunting",
    summary: "Chain small tools to answer big questions about a log.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "shell",
      fs: "logs",
      prompt: "Which IP address has the most failed SSH password attempts in /var/log/auth.log? Submit the IP.",
      answers: [authLog.topIp],
      hints: [
        "`grep 'Failed password' /var/log/auth.log` shows only the failures.",
        "The IP follows the word 'from'. `grep -o` can pull out just a pattern, e.g. `grep -o 'from [0-9.]*'`.",
        "Pipe to `cut -d' ' -f2`, then `sort`, then `uniq -c`, then `sort -n` (or `sort -r`) and `head`.",
      ],
    },
  },
  {
    id: "shell-permissions",
    track: "linux-shell",
    title: "Users & Permissions",
    summary: "Read rwx, spot dangerous modes, use find -perm.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "shell",
      fs: "perms",
      prompt: "Find the single world-writable (777) file under /var/www and read it. Submit the flag inside.",
      answers: ["FLAG{world_writable_is_a_red_flag}"],
      hints: [
        "`ls -l` shows permissions. 777 looks like -rwxrwxrwx.",
        "`find /var/www -perm 777` searches by exact mode.",
        "Once you know the path, `cat` it.",
      ],
    },
  },

  /* ---------------- Python ---------------- */
  {
    id: "py-basics",
    track: "python-security",
    title: "Python Basics for Hackers",
    summary: "Variables, loops, conditions - with port numbers.",
    minutes: 20,
    xp: 30,
    level: "beginner",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Count how many ports in the list are well-known ports (below 1024) and print the number.",
      starter: String.raw`ports = [22, 80, 443, 3306, 8080, 53, 5432]

# TODO: count the ports that are < 1024
count = 0

print(count)
`,
      expected: "4",
      hints: ["Loop with `for p in ports:`", "Use `if p < 1024:` and add 1 to `count`."],
      solution: String.raw`ports = [22, 80, 443, 3306, 8080, 53, 5432]
count = 0
for p in ports:
    if p < 1024:
        count += 1
print(count)
`,
    },
  },
  {
    id: "py-bytes",
    track: "python-security",
    title: "Bytes, Hex & Base64",
    summary: "Decode layered encodings like a CTF player.",
    minutes: 20,
    xp: 40,
    level: "beginner",
    lab: {
      kind: "code",
      language: "python",
      prompt: "The message below is base64 text that was then written out as hex. Decode both layers and print the flag.",
      starter: String.raw`import base64

HEX = "${hex(btoa(LAYERED_FLAG))}"

# 1) hex string -> bytes        (bytes.fromhex)
# 2) base64 bytes -> raw bytes  (base64.b64decode)
# 3) raw bytes -> text          (.decode())
message = ""

print(message)
`,
      expected: LAYERED_FLAG,
      hints: ["`bytes.fromhex(HEX)` gives you the base64 bytes.", "`base64.b64decode(...)` then `.decode()`."],
      solution: String.raw`import base64
HEX = "..."
message = base64.b64decode(bytes.fromhex(HEX)).decode()
print(message)
`,
    },
  },
  {
    id: "py-log-analysis",
    track: "python-security",
    title: "Parsing Logs with Python",
    summary: "Count failed logins per IP with a Counter.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Print the IP address with the most failed password attempts.",
      starter: String.raw`from collections import Counter

LOG = """${authLog.text}"""

failures = Counter()
for line in LOG.splitlines():
    # TODO: if the line contains "Failed password", find the IP after "from"
    # and add 1 to failures[ip]
    pass

top_ip, count = failures.most_common(1)[0]
print(top_ip)
`,
      expected: authLog.topIp,
      hints: [
        "`line.split()` breaks a line into words.",
        "`parts.index('from') + 1` is the position of the IP.",
        "`failures[ip] += 1` updates the Counter.",
      ],
      solution: String.raw`from collections import Counter
LOG = """..."""
failures = Counter()
for line in LOG.splitlines():
    if "Failed password" in line:
        parts = line.split()
        ip = parts[parts.index("from") + 1]
        failures[ip] += 1
top_ip, count = failures.most_common(1)[0]
print(top_ip)
`,
    },
  },
  {
    id: "py-caesar",
    track: "python-security",
    title: "Breaking the Caesar Cipher",
    summary: "Brute force all 26 shifts and spot the plaintext.",
    minutes: 20,
    xp: 50,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Implement shift() and brute-force every key. Print the candidate that contains the word EAGLE.",
      starter: String.raw`CIPHER = "${caesar(CAESAR_PLAIN, 7)}"

def shift(text, k):
    # TODO: shift every A-Z letter forward by k (wrapping around), keep other characters
    return text

for k in range(26):
    guess = shift(CIPHER, k)
    if "EAGLE" in guess:
        print(guess)
`,
      expected: CAESAR_PLAIN,
      hints: [
        "`ord('A')` is 65. Convert a letter to 0-25 with `ord(ch) - 65`.",
        "Add k, use `% 26`, then convert back with `chr(... + 65)`.",
        "Only shift when `ch.isalpha()`.",
      ],
      solution: String.raw`def shift(text, k):
    out = ""
    for ch in text:
        if ch.isalpha():
            out += chr((ord(ch) - 65 + k) % 26 + 65)
        else:
            out += ch
    return out
`,
    },
  },
  {
    id: "py-hashing",
    track: "python-security",
    title: "Hashing & Dictionary Attacks",
    summary: "Why unsalted hashes fail, in 10 lines of Python.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "A leaked, unsalted SHA-256 hash is below. Try each wordlist entry and print the password that matches.",
      starter: String.raw`import hashlib

TARGET = "a9c43be948c5cabd56ef2bacffb77cdaa5eec49dd5eb0cc4129cf3eda5f0e74c"
WORDLIST = ["password", "123456", "letmein", "qwerty", "dragon", "monkey", "sunshine", "iloveyou"]

for word in WORDLIST:
    # TODO: hash the word with SHA-256 and compare to TARGET
    # If it matches, print(word)
    pass
`,
      expected: "dragon",
      hints: [
        "`hashlib.sha256(word.encode()).hexdigest()` gives the hex digest.",
        "Compare it to TARGET with ==.",
      ],
      solution: String.raw`import hashlib
for word in WORDLIST:
    if hashlib.sha256(word.encode()).hexdigest() == TARGET:
        print(word)
`,
    },
  },

  /* ---------------- Web & JS ---------------- */
  {
    id: "js-basics",
    track: "web-js",
    title: "JavaScript in the Sandbox",
    summary: "Arrays, filter, map, sort - parse a scan result.",
    minutes: 20,
    xp: 30,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "From the scan results, print the OPEN ports in ascending order, comma-separated (e.g. 22,80).",
      starter: `const scan = [
  { port: 443, state: "open" },
  { port: 23, state: "closed" },
  { port: 80, state: "open" },
  { port: 8080, state: "open" },
  { port: 22, state: "open" },
  { port: 25, state: "filtered" },
];

// TODO: filter -> map -> sort -> join
console.log("");
`,
      expected: "22,80,443,8080",
      hints: [
        "`scan.filter(r => r.state === 'open')`",
        "`.map(r => r.port)` then `.sort((a, b) => a - b)` (default sort is alphabetical!)",
        "`.join(',')`",
      ],
      solution: `console.log(
  scan.filter(r => r.state === "open").map(r => r.port).sort((a, b) => a - b).join(",")
);`,
    },
  },
  {
    id: "http-anatomy",
    track: "web-js",
    title: "Anatomy of an HTTP Request",
    summary: "Methods, headers, cookies - parse a raw request.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement parseHeaders(raw) so it returns an object of lowercase header names to values.",
      starter: `const RAW =
  "GET /login HTTP/1.1\\r\\n" +
  "Host: example.com\\r\\n" +
  "User-Agent: curl/8.4.0\\r\\n" +
  "Cookie: session=abc123\\r\\n" +
  "\\r\\n";

function parseHeaders(raw) {
  // TODO: skip the request line, read "Name: value" lines until the blank line
  return {};
}
`,
      harness: `
{
  const h = parseHeaders(RAW);
  console.log(
    h["host"] === "example.com" && h["user-agent"] === "curl/8.4.0" && h["cookie"] === "session=abc123"
      ? "ALL TESTS PASSED"
      : "TESTS FAILED: got " + JSON.stringify(h)
  );
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "`raw.split('\\r\\n')` gives lines; `slice(1)` skips the request line.",
        "Stop at the first empty line.",
        "Split on the FIRST colon only: use `indexOf(':')` and `slice`.",
      ],
      solution: `function parseHeaders(raw) {
  const out = {};
  for (const line of raw.split("\\r\\n").slice(1)) {
    if (!line) break;
    const i = line.indexOf(":");
    out[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return out;
}`,
    },
  },
  {
    id: "xss-escape",
    track: "web-js",
    title: "XSS: Spot It, Fix It",
    summary: "Understand cross-site scripting and write an HTML escaper.",
    minutes: 25,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Write escapeHtml(s) that neutralizes & < > \" and ' so user input can't inject markup.",
      starter: `function escapeHtml(s) {
  // TODO: replace & < > " ' with HTML entities (& must come first!)
  return s;
}
`,
      harness: `
{
  const t = [
    [escapeHtml("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;"],
    [escapeHtml('"><img src=x onerror=alert(1)>'), "&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"],
    [escapeHtml("it's & ok"), "it&#39;s &amp; ok"],
  ];
  const bad = t.filter(([got, want]) => got !== want);
  console.log(bad.length === 0 ? "ALL TESTS PASSED" : "FAILED: " + JSON.stringify(bad[0]));
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "Chain `.replace(/&/g, '&amp;')` first, otherwise you double-escape.",
        "Entities: &lt; &gt; &quot; &#39;",
      ],
      solution: `function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}`,
    },
  },

  /* ---------------- Systems & Servers ---------------- */
  {
    id: "imaging-and-install",
    track: "systems-servers",
    title: "Flashing, Imaging & Installing an OS",
    summary: "USB boot media, BIOS/UEFI, checksums, dual-boot and VMs.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Why should you verify the SHA-256 checksum of an ISO before flashing it?",
          options: [
            "It makes the download faster",
            "It proves the file wasn't corrupted or tampered with (if the checksum came from a trusted source)",
            "It encrypts the USB drive",
          ],
          answer: 1,
          why: "A matching hash from a trusted channel shows integrity. A hash hosted on the same compromised page proves much less - verify signatures when available.",
        },
        {
          q: "You flash an installer to a USB drive. What happens to the drive's existing files?",
          options: ["They are kept", "They are overwritten and lost", "They move to a hidden folder"],
          answer: 1,
          why: "Imaging writes the whole device. Always double-check the target device before you click Start (or run dd).",
        },
        {
          q: "Which firmware setting often must be adjusted to boot some Linux installers or older tools?",
          options: ["Secure Boot / boot order", "Screen brightness", "Wi-Fi channel"],
          answer: 0,
          why: "You choose the USB in the boot menu (often F12/F2/Esc) and may need to adjust Secure Boot or enable UEFI/legacy modes.",
        },
        {
          q: "Safest way to try a new OS without touching your main machine?",
          options: ["Install it over your main OS", "Run it in a virtual machine", "Skip the checksum"],
          answer: 1,
          why: "VMs (VirtualBox, VMware, Proxmox) isolate experiments and give you snapshots to roll back.",
        },
      ],
    },
  },
  {
    id: "server-setup-ssh",
    track: "systems-servers",
    title: "Setting Up a Server & Hardening SSH",
    summary: "From fresh install to a locked-down remote login.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "ssh",
      prompt: "Inspect /etc/ssh/sshd_config. Which setting allows direct root login over SSH? Submit the setting name.",
      answers: ["PermitRootLogin"],
      hints: ["`cat /etc/ssh/sshd_config` or `grep -i root /etc/ssh/sshd_config`.", "It's the line with 'root' in it."],
    },
  },
  {
    id: "firewalls-services",
    track: "systems-servers",
    title: "Firewalls, Ports & Services",
    summary: "Default-deny, least exposure, and what 'listening' means.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What is the safest default stance for an inbound firewall policy?",
          options: ["Allow all, block known-bad", "Deny all, allow only what's needed", "Disable it on internal networks"],
          answer: 1,
          why: "Default-deny shrinks attack surface to the ports you consciously expose.",
        },
        {
          q: "A service is 'listening' on 0.0.0.0:3306. What does that mean?",
          options: [
            "It's reachable from any network interface the host has",
            "It's only reachable from the same machine",
            "It's offline",
          ],
          answer: 0,
          why: "0.0.0.0 means all interfaces. Databases should usually bind to 127.0.0.1 or a private interface.",
        },
        {
          q: "Which tool lists listening sockets on a modern Linux server?",
          options: ["ss -tulpn", "ls -l", "chmod"],
          answer: 0,
          why: "`ss -tulpn` shows TCP/UDP listeners and the owning process. `netstat` is the older equivalent.",
        },
        {
          q: "You expose SSH to the internet. Which control helps most against password guessing?",
          options: ["Key-only auth and disabling password login", "A longer hostname", "Changing the MOTD"],
          answer: 0,
          why: "Public-key authentication (plus fail2ban or rate limiting) makes brute force impractical.",
        },
      ],
    },
  },
  {
    id: "home-lab",
    track: "systems-servers",
    title: "Building Your Home Lab",
    summary: "Isolated VMs, vulnerable targets, snapshots, and safety rules.",
    minutes: 30,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Where should you practice attacking intentionally vulnerable machines?",
          options: [
            "On any website you're curious about",
            "In an isolated lab network you own (host-only/NAT-isolated VMs)",
            "On your neighbor's Wi-Fi",
          ],
          answer: 1,
          why: "Only attack systems you own or have written permission to test. Isolate lab VMs so they can't reach your real devices.",
        },
        {
          q: "Why take a snapshot before a risky experiment?",
          options: ["It speeds up the VM", "You can roll back to a known-good state", "It deletes logs"],
          answer: 1,
          why: "Snapshots make destructive learning cheap and repeatable.",
        },
        {
          q: "Which is a legal, free practice target?",
          options: ["A deliberately vulnerable VM/app like DVWA or Metasploitable in your lab", "Your school's login page", "A random company's server"],
          answer: 0,
          why: "DVWA, Juice Shop, Metasploitable and VulnHub images exist precisely so you can practice legally.",
        },
      ],
    },
  },

  /* ---------------- Ethical Hacking ---------------- */
  {
    id: "hacking-ethics",
    track: "ethical-hacking",
    title: "Rules of Engagement & the Law",
    summary: "Authorization, scope, and what separates pentesting from a crime.",
    minutes: 15,
    xp: 40,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What turns a security test from a crime into a legitimate engagement?",
          options: ["Good intentions", "Written authorization defining scope", "Using open-source tools"],
          answer: 1,
          why: "Without written permission from the system owner, even 'well-meaning' testing may violate computer misuse laws (e.g., the CFAA in the US). This is education, not legal advice.",
        },
        {
          q: "You find a bug outside the agreed scope. What do you do?",
          options: ["Exploit it to prove impact", "Stop, document, and report it to the client", "Ignore it forever"],
          answer: 1,
          why: "Scope exists to protect everyone. Report out-of-scope findings; don't test them.",
        },
        {
          q: "Which is a safe place to practice password cracking?",
          options: ["Hashes you generated yourself or from a CTF/lab", "Leaked breach data of real people", "A coworker's laptop"],
          answer: 0,
          why: "Use your own data or purpose-built labs. Cracking real people's credentials causes real harm.",
        },
      ],
    },
  },
  {
    id: "recon-basics",
    track: "ethical-hacking",
    title: "Reconnaissance: Reading a Scan",
    summary: "Turn scan output into a list of risky exposed services.",
    minutes: 20,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "recon",
      prompt: "Read ~/scans/lab-scan.txt. Which host (IP) has Telnet (port 23) open? Submit the IP.",
      answers: ["10.10.10.4"],
      hints: ["`cat ~/scans/lab-scan.txt`", "`grep -n telnet ~/scans/lab-scan.txt` tells you the line; the host is the 'Scan report' line above it."],
    },
  },
  {
    id: "ctf-warmup",
    track: "ethical-hacking",
    title: "CTF Warm-Up: Three Flags",
    summary: "Base64, ROT13 and log forensics in one challenge.",
    minutes: 30,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "shell",
      fs: "ctf",
      prompt: "Find and submit all three flags hidden in ~/ctf. Submit them one at a time.",
      answers: CTF_FLAGS,
      hints: [
        "Flag 1: `cat note1.b64 | base64 -d`",
        "Flag 2: ROT13 swaps A<->N. Try `tr 'A-Za-z' 'N-ZA-Mn-za-m'`.",
        "Flag 3: `grep -i flag access.log`",
      ],
    },
  },
];

export const LESSONS: Lesson[] = [...CORE_LESSONS, ...EXTRA_LESSONS, ...BATCH3_LESSONS, ...BATCH4_LESSONS, ...BATCH5_LESSONS];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const trackById = (id: string) => TRACKS.find((t) => t.id === id);
export const lessonsOfTrack = (trackId: string) =>
  (trackById(trackId)?.lessons ?? []).map((id) => lessonById(id)).filter((l): l is Lesson => !!l);
export const rot13Check = rot13; // exported for tests
