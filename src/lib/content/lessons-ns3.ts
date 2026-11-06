import type { Lesson } from "./types";

/** Network Security series, part 3: access control, device vulnerabilities, authentication protocols and database security. Text and labs are original. */
export const NS3_LESSONS: Lesson[] = [
  {
    id: "ns-access-control",
    track: "network-security",
    title: "Access Control: Subjects, Objects, Rights, DAC, MAC and RBAC",
    summary: "How systems decide who may do what, and how auditing keeps it accountable.",
    minutes: 45,
    xp: 110,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "In access control terminology, which pair is correct?",
          options: [
            "Subjects are users, applications or processes; objects are resources such as files, services and networks",
            "Subjects are files; objects are users",
            "Both words mean the same thing",
          ],
          answer: 0,
          why: "Access rights describe how a subject may access an object (read, write, execute, delete, create, search).",
        },
        {
          q: "Which access right includes read access?",
          options: ["Write", "Execute", "Search"],
          answer: 0,
          why: "Write access (add, modify, delete data) includes read access; read includes the ability to copy or print.",
        },
        {
          q: "In discretionary access control (DAC):",
          options: [
            "The owner of an object decides who else may access it, and can pass permissions on",
            "A central administrator assigns sensitivity labels",
            "Access depends only on job role",
          ],
          answer: 0,
          why: "Windows file sharing and Unix permissions are DAC. Access control lists (ACLs) attach permissions to an object.",
        },
        {
          q: "A major weakness of DAC is:",
          options: [
            "It depends on users setting permissions correctly, and programs inherit the user's privileges (so malware runs with them)",
            "It cannot give anyone access",
            "It requires classification labels",
          ],
          answer: 0,
          why: "Operating systems reduce the inheritance problem with prompts and least privilege.",
        },
        {
          q: "In mandatory access control (MAC), who can change an object's label?",
          options: ["Only administrators under a central policy, not the data owner", "The owner", "Any user"],
          answer: 0,
          why: "MAC compares the object's classification label with the subject's clearance; owners can't grant exceptions.",
        },
        {
          q: "RBAC (role-based access control) assigns access rights to:",
          options: ["Roles (job functions), then assigns users to roles", "Individual users only", "IP addresses"],
          answer: 0,
          why: "It scales to large organizations: when someone changes jobs you change their roles. It supports least privilege and separation of duties.",
        },
        {
          q: "Auditing (accounting) is:",
          options: [
            "Maintaining a record of a subject's activity so subjects can be held accountable and violations found",
            "Encrypting files",
            "Granting permissions",
          ],
          answer: 0,
          why: "Audits can also identify rogue accounts and separation-of-duty conflicts.",
        },
      ],
    },
  },
  {
    id: "ns-mac-labels",
    track: "network-security",
    title: "Mandatory Access Control: Clearance, Labels, No Read-Up, No Write-Down",
    summary: "Implement the confidentiality rules of a multilevel security system.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Levels in increasing sensitivity: unclassified, confidential, secret, top secret. Implement macAllows(clearance, label, op) with op 'read' or 'write': READ is allowed when clearance >= label (no read-up); WRITE is allowed when clearance <= label (no write-down, which prevents leaking secrets downward).",
      starter: `const LEVELS = ["unclassified", "confidential", "secret", "top secret"];

function macAllows(clearance, label, op) {
  // TODO
  return false;
}
`,
      harness: `
{
  const t = (c, l, o) => macAllows(c, l, o);
  const ok =
    t("secret", "unclassified", "read") === true &&
    t("secret", "top secret", "read") === false &&
    t("secret", "secret", "read") === true &&
    t("secret", "top secret", "write") === true &&
    t("secret", "unclassified", "write") === false &&
    t("secret", "secret", "write") === true;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`LEVELS.indexOf(...)` turns names into comparable numbers.", "read: `c >= l`; write: `c <= l`."],
      solution: `function macAllows(clearance, label, op) {
  const c = LEVELS.indexOf(clearance);
  const l = LEVELS.indexOf(label);
  return op === "read" ? c >= l : op === "write" ? c <= l : false;
}`,
    },
  },
  {
    id: "ns-rbac-hierarchy",
    track: "network-security",
    title: "RBAC Role Hierarchies and Effective Permissions",
    summary: "Resolve inherited permissions across a role hierarchy.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Each role has its own permissions and may inherit from other roles. Implement effectivePermissions(roleName, roles): return the sorted list of unique permissions the role has directly or through inheritance (including inheritance through several levels).",
      starter: `const ROLES = {
  engineer: { perms: ["read"], inherits: [] },
  productionEngineer: { perms: ["deploy"], inherits: ["engineer"] },
  qualityEngineer: { perms: ["test"], inherits: ["engineer"] },
  projectLead: { perms: ["approve"], inherits: ["productionEngineer", "qualityEngineer"] },
};

function effectivePermissions(roleName, roles) {
  // TODO: collect this role's perms plus the effective permissions of every inherited role
  return [];
}
`,
      harness: `
{
  const j = JSON.stringify;
  const ok =
    j(effectivePermissions("engineer", ROLES)) === j(["read"]) &&
    j(effectivePermissions("productionEngineer", ROLES)) === j(["deploy", "read"]) &&
    j(effectivePermissions("projectLead", ROLES)) === j(["approve", "deploy", "read", "test"]) &&
    j(effectivePermissions("unknown", ROLES)) === j([]);
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + j(effectivePermissions("projectLead", ROLES)));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Use recursion and a Set so diamond-shaped inheritance doesn't duplicate permissions.", "Return `[]` for an unknown role.", "Finish with `[...set].sort()`."],
      solution: `function effectivePermissions(roleName, roles) {
  const out = new Set();
  const visit = (name) => {
    const r = roles[name];
    if (!r) return;
    r.perms.forEach((p) => out.add(p));
    r.inherits.forEach(visit);
  };
  visit(roleName);
  return [...out].sort();
}`,
    },
  },
  {
    id: "ns-device-vulns-cvss",
    track: "network-security",
    title: "Network Device Vulnerabilities, Patching, CVE and CVSS",
    summary: "Misconfiguration, defaults, firmware, zero-days and how severity is scored.",
    minutes: 40,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement cvssSeverity(score): return the CVSS v3 qualitative rating 'none' (0.0), 'low' (0.1-3.9), 'medium' (4.0-6.9), 'high' (7.0-8.9) or 'critical' (9.0-10.0).",
      starter: `function cvssSeverity(score) {
  // TODO
  return "none";
}
`,
      harness: `
{
  const cases = [[0, "none"], [0.1, "low"], [3.9, "low"], [4.0, "medium"], [6.9, "medium"], [7.0, "high"], [8.9, "high"], [9.0, "critical"], [10, "critical"]];
  const bad = cases.filter(([s, want]) => cvssSeverity(s) !== want);
  console.log(bad.length === 0 ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(bad[0]));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Check the highest ranges first and work down.", "A score of exactly 0 is 'none'."],
      solution: `function cvssSeverity(score) {
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "none";
}`,
    },
  },
  {
    id: "ns-challenge-response",
    track: "network-security",
    title: "Authentication Protocols: Challenge-Response and Shared Keys",
    summary: "Prove you know a secret without sending it, implemented with HMAC.",
    minutes: 40,
    xp: 120,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement async respond(secret, challenge): return the lowercase hex HMAC-SHA256 of the challenge using the secret as the key. The server sends a random challenge; the client returns this value instead of the password.",
      starter: `async function respond(secret, challenge) {
  // 1) crypto.subtle.importKey("raw", encoded secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  // 2) crypto.subtle.sign("HMAC", key, encoded challenge)
  // 3) convert the bytes to lowercase hex
  return "";
}
`,
      harness: `
{
  const known = await respond("key", "The quick brown fox jumps over the lazy dog");
  const a = await respond("pw", "challenge-1");
  const b = await respond("pw", "challenge-2");
  const ok = known === "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8" && a !== b;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Both the secret and the challenge go through `new TextEncoder().encode(...)`.", "`[...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')`"],
      solution: `async function respond(secret, challenge) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(challenge));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}`,
    },
  },
  {
    id: "ns-database-security",
    track: "network-security",
    title: "Database Security: Access Control, Attacks and Defense in Depth",
    summary: "Relational concepts, DBMS authorization, SQL injection and the protections around a database.",
    minutes: 45,
    xp: 120,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement validateInput(value, rule) for input validation. rule is {type: 'digits'|'alnum', min, max}. Return true only if the string value is entirely digits (or letters/digits) and its length is between min and max inclusive. Never trust input: type, length, format and range.",
      starter: `function validateInput(value, rule) {
  // TODO
  return false;
}
`,
      harness: `
{
  const id = { type: "digits", min: 1, max: 6 };
  const user = { type: "alnum", min: 3, max: 12 };
  const ok =
    validateInput("12345", id) === true &&
    validateInput("12a45", id) === false &&
    validateInput("1 OR 1=1", id) === false &&
    validateInput("", id) === false &&
    validateInput("1234567", id) === false &&
    validateInput("alice99", user) === true &&
    validateInput("ab", user) === false &&
    validateInput("o'brien", user) === false;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Use an allowlist regex per type: `/^\\d+$/` and `/^[A-Za-z0-9]+$/`.", "Check the length separately against min and max."],
      solution: `function validateInput(value, rule) {
  if (typeof value !== "string") return false;
  const re = rule.type === "digits" ? /^\\d+$/ : /^[A-Za-z0-9]+$/;
  return re.test(value) && value.length >= rule.min && value.length <= rule.max;
}`,
    },
  },
];
