/** Language Atlas: why you'd pick one language over another. Opinions are summarized guidance, not benchmarks. */

export type Goal =
  | "scripting"
  | "web"
  | "exploit-dev"
  | "reverse-engineering"
  | "systems"
  | "data"
  | "windows-admin"
  | "career";

export const GOALS: { id: Goal; label: string }[] = [
  { id: "scripting", label: "Automate & script" },
  { id: "web", label: "Web apps & web hacking" },
  { id: "exploit-dev", label: "Exploit development" },
  { id: "reverse-engineering", label: "Reverse engineering / malware analysis" },
  { id: "systems", label: "Fast systems & tools" },
  { id: "data", label: "Data, logs & databases" },
  { id: "windows-admin", label: "Windows / Active Directory" },
  { id: "career", label: "Getting hired (dev jobs)" },
];

export type Language = {
  id: string;
  name: string;
  kind: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  useFor: string;
  avoidFor: string;
  security: string;
  firstProject: string;
  /** 0-3 fit score per goal. */
  fit: Partial<Record<Goal, 0 | 1 | 2 | 3>>;
};

export const LANGUAGES: Language[] = [
  {
    id: "python",
    name: "Python",
    kind: "Interpreted, high-level",
    difficulty: 1,
    useFor: "Automation, log parsing, quick exploits, network tools, data analysis, machine learning, glue code.",
    avoidFor: "Raw speed, tiny embedded devices, shipping a single self-contained binary.",
    security: "The default security scripting language: Scapy, Impacket, pwntools, requests, and most pentest tooling.",
    firstProject: "A script that parses auth.log and reports top offending IPs.",
    fit: { scripting: 3, web: 2, "exploit-dev": 2, data: 3, career: 3, "reverse-engineering": 1 },
  },
  {
    id: "bash",
    name: "Bash",
    kind: "Shell scripting",
    difficulty: 2,
    useFor: "Linux administration, chaining tools, cron jobs, CTF one-liners, quick triage on servers.",
    avoidFor: "Complex logic, data structures, anything that grows beyond ~100 lines.",
    security: "Always available on Linux boxes you land on. Mind quoting and injection bugs.",
    firstProject: "A backup script that tars a folder and verifies the checksum.",
    fit: { scripting: 3, systems: 1, data: 1, career: 2 },
  },
  {
    id: "powershell",
    name: "PowerShell",
    kind: "Shell + scripting (objects)",
    difficulty: 2,
    useFor: "Windows and Active Directory administration, cloud (Azure/M365) automation, red/blue team tradecraft on Windows.",
    avoidFor: "Non-Windows-centric stacks (though PowerShell 7 is cross-platform).",
    security: "Heavily used by attackers and defenders; learn logging (Script Block Logging) alongside it.",
    firstProject: "List local admins and recent logon failures from the Event Log.",
    fit: { "windows-admin": 3, scripting: 2, career: 2 },
  },
  {
    id: "javascript",
    name: "JavaScript / TypeScript",
    kind: "Interpreted, runs in browsers and Node.js",
    difficulty: 2,
    useFor: "Web front ends, Node servers, browser extensions, understanding client-side bugs like XSS.",
    avoidFor: "Heavy number crunching or low-level system work.",
    security: "Essential for web security testing. TypeScript adds type safety that prevents whole bug classes.",
    firstProject: "A small web page that safely renders user comments.",
    fit: { web: 3, scripting: 1, career: 3 },
  },
  {
    id: "sql",
    name: "SQL",
    kind: "Declarative query language",
    difficulty: 2,
    useFor: "Querying databases, analyzing logs in SIEMs, understanding SQL injection.",
    avoidFor: "General-purpose programming.",
    security: "Learn parameterized queries: they are the cure for SQL injection.",
    firstProject: "Load a CSV into SQLite and find the top 10 most frequent IPs.",
    fit: { data: 3, web: 2, career: 3 },
  },
  {
    id: "c",
    name: "C",
    kind: "Compiled, low-level",
    difficulty: 4,
    useFor: "Operating systems, drivers, embedded devices, understanding memory, writing exploits and shellcode.",
    avoidFor: "Fast prototyping or anything where memory-safety bugs aren't acceptable.",
    security: "The source of buffer overflows and use-after-free bugs, so reading C is key to exploit dev and reversing.",
    firstProject: "Write a tiny program with a deliberate buffer overflow, then crash and fix it.",
    fit: { "exploit-dev": 3, "reverse-engineering": 3, systems: 3 },
  },
  {
    id: "assembly",
    name: "Assembly (x86-64 / ARM)",
    kind: "Machine-level",
    difficulty: 5,
    useFor: "Reverse engineering, malware analysis, exploit development, debugging.",
    avoidFor: "Anything you want to finish quickly. Learn to READ it first before writing it.",
    security: "Reading disassembly in Ghidra or IDA is core malware-analyst work.",
    firstProject: "Disassemble a hello-world binary and map each instruction to the C source.",
    fit: { "reverse-engineering": 3, "exploit-dev": 3 },
  },
  {
    id: "rust",
    name: "Rust",
    kind: "Compiled, memory-safe systems language",
    difficulty: 4,
    useFor: "Fast, safe CLI tools, network services, security tooling, modern malware and implants.",
    avoidFor: "Quick scripts; the learning curve is steep (ownership and borrowing).",
    security: "Eliminates most memory-safety bugs at compile time. Increasingly used for security tools.",
    firstProject: "A fast multi-threaded port scanner for your lab network.",
    fit: { systems: 3, "exploit-dev": 1, "reverse-engineering": 1, career: 2, scripting: 1 },
  },
  {
    id: "go",
    name: "Go",
    kind: "Compiled, garbage-collected",
    difficulty: 3,
    useFor: "Network services, cloud tooling, concurrent scanners, single static binaries that cross-compile easily.",
    avoidFor: "GUI apps, heavy data science.",
    security: "Many modern security tools (e.g. subfinder, nuclei, Sliver) are written in Go. Simple to learn, easy to ship.",
    firstProject: "A concurrent subdomain checker as a single binary.",
    fit: { systems: 3, scripting: 2, web: 1, career: 3 },
  },
  {
    id: "java",
    name: "Java / Kotlin",
    kind: "Compiled to JVM bytecode",
    difficulty: 3,
    useFor: "Enterprise back ends, Android apps, large corporate systems.",
    avoidFor: "Quick scripts; JVM startup and verbosity.",
    security: "Know deserialization bugs (Log4Shell, Spring). Android pentesting needs Java/Kotlin reading skills.",
    firstProject: "A REST API with input validation and unit tests.",
    fit: { career: 3, web: 2 },
  },
  {
    id: "csharp",
    name: "C# (.NET)",
    kind: "Compiled to .NET IL",
    difficulty: 3,
    useFor: "Windows apps, enterprise back ends, Unity games, offensive Windows tooling.",
    avoidFor: "Tiny scripts; Linux-first stacks (though .NET is cross-platform).",
    security: "Much red-team Windows tooling is C#. Pairs naturally with PowerShell and Active Directory work.",
    firstProject: "A Windows service that logs failed logons.",
    fit: { "windows-admin": 2, career: 3, "reverse-engineering": 1 },
  },
];

export function rankLanguages(goal: Goal | "all"): Language[] {
  if (goal === "all") return LANGUAGES;
  return [...LANGUAGES]
    .filter((l) => (l.fit[goal] ?? 0) > 0)
    .sort((a, b) => (b.fit[goal] ?? 0) - (a.fit[goal] ?? 0) || a.difficulty - b.difficulty);
}
