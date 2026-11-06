import type { Lesson } from "./types";

/**
 * Network Security series, part 1 (security fundamentals and cryptographic tools).
 * Based on the owner's IST 451 Network Security lecture PDFs; all text, examples and labs are original.
 */
export const NS1_LESSONS: Lesson[] = [
  {
    id: "ns-security-objectives",
    track: "network-security",
    title: "Security Objectives: CIA Plus Authenticity & Accountability",
    summary: "The five security aspects, trust, policy and how organizations define 'secure'.",
    minutes: 30,
    xp: 70,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "A program processes the same financial transaction twice and the balance is wrong. Which objective was violated?",
          options: ["Integrity", "Availability", "Confidentiality"],
          answer: 0,
          why: "Integrity means data is changed only by authorized parties in authorized ways; programming errors can break it as surely as attackers can.",
        },
        {
          q: "Which control mainly supports confidentiality?",
          options: ["Encryption and access control", "Redundant power supplies", "Load balancing"],
          answer: 0,
          why: "Power and load balancing support availability. Confidentiality keeps data from unauthorized readers.",
        },
        {
          q: "Authenticity (authentication) is about:",
          options: ["Proving a claimed identity or data origin is genuine", "Making data fast", "Compressing data"],
          answer: 0,
          why: "Logins and digital signatures are examples.",
        },
        {
          q: "Accountability, in the sense of non-repudiation, means:",
          options: ["The sender can't later deny sending a message, and the receiver can't deny receiving it", "Everyone shares one password", "Logs are deleted weekly"],
          answer: 0,
          why: "Digital signatures and hashes provide proof of origin; delivery receipts provide proof of delivery.",
        },
        {
          q: "Why is 'trust' called the foundation of security in cyberspace?",
          options: ["Technical mechanisms (such as multi-factor authentication) raise the level of trust in identities and systems", "Trust replaces controls", "Users trust everything by default"],
          answer: 0,
          why: "Higher assurance mechanisms justify more trust: one-factor versus multi-factor authentication is a classic example.",
        },
        {
          q: "Security policies matter because they:",
          options: ["Define the rules (passwords, VPN, access) that make the technical controls consistent and enforceable", "Replace firewalls", "Are optional paperwork"],
          answer: 0,
          why: "A strong password policy, a VPN policy and an access policy each protect a different asset.",
        },
        {
          q: "Before deciding how much protection is 'enough', an organization should answer which question?",
          options: [
            "What are the valuable assets, who are we protecting them from, what are the risks and losses, and what resources do we have?",
            "Which vendor is cheapest?",
            "How many users complain?",
          ],
          answer: 0,
          why: "Security is risk-based: asset value, threat sources, impact and budget decide proportionate controls.",
        },
      ],
    },
  },
  {
    id: "ns-threats-attacks",
    track: "network-security",
    title: "Vulnerabilities, Threats, Attacks & Countermeasures",
    summary: "Passive versus active attacks, attack surfaces and impact levels.",
    minutes: 35,
    xp: 80,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "A vulnerability is:",
          options: ["A latent weakness that a threat could exploit", "An attacker", "A firewall rule"],
          answer: 0,
          why: "Vulnerabilities exist in hardware, software, networks, personnel, physical sites and organizations (for example missing audits or continuity plans).",
        },
        {
          q: "Eavesdropping on traffic to learn its contents is which kind of attack?",
          options: ["Passive (release of message contents)", "Active (replay)", "Active (denial of service)"],
          answer: 0,
          why: "Passive attacks learn information without altering the system. Traffic analysis (observing patterns even when content is encrypted) is the other passive type.",
        },
        {
          q: "Which is NOT one of the four categories of active attack?",
          options: ["Traffic analysis", "Replay", "Masquerade"],
          answer: 0,
          why: "The active categories are replay, masquerade, modification of messages and denial of service. Traffic analysis is passive.",
        },
        {
          q: "Passive attacks are hard to detect. The best defense is therefore:",
          options: ["Prevention, such as encryption", "Waiting for alerts", "Deleting logs"],
          answer: 0,
          why: "Active attacks are easier to detect but harder to prevent completely, so detection and recovery matter for them.",
        },
        {
          q: "The three attack-surface categories are:",
          options: ["Network, software and human", "Cheap, fast and good", "Public, private and hybrid"],
          answer: 0,
          why: "Network attack surface (links, DoS), software (application and OS code) and human (social engineering, insiders, error).",
        },
        {
          q: "An application doesn't validate input. What is the right countermeasure?",
          options: ["Never trust input: validate length, range, format and type", "Hide the error messages only", "Allow longer inputs"],
          answer: 0,
          why: "Missing validation underlies buffer overflows, SQL injection and cookie manipulation.",
        },
        {
          q: "An impact is rated 'high' when the loss could:",
          options: ["Have a severe or catastrophic effect on operations, assets or individuals", "Cause minor inconvenience", "Be ignored"],
          answer: 0,
          why: "Low is a limited effect, moderate a serious effect, and high a severe or catastrophic one (a FIPS 199-style scale).",
        },
        {
          q: "Countermeasures fall into which three goals?",
          options: ["Prevent, detect and recover", "Buy, sell and hold", "Scan, exploit and report"],
          answer: 0,
          why: "A good design uses all three.",
        },
      ],
    },
  },
  {
    id: "ns-attack-trees",
    track: "network-security",
    title: "Attack Trees: Modeling How Systems Are Attacked",
    summary: "Compute the cheapest path through AND/OR attack trees.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "A node is either a leaf {cost} or {type: 'OR'|'AND', children: [...]}. An OR node can be satisfied by its CHEAPEST child; an AND node needs ALL children (the sum). Implement cheapestAttack(node) returning the minimum total cost to achieve the root goal.",
      starter: `function cheapestAttack(node) {
  // TODO: leaf -> node.cost; OR -> min of children; AND -> sum of children
  return 0;
}
`,
      harness: `
{
  const tree = {
    type: "OR",
    children: [
      { type: "AND", children: [{ cost: 30 }, { cost: 20 }] },   // 50
      { type: "OR", children: [{ cost: 80 }, { cost: 45 }] },    // 45
      { cost: 100 },
    ],
  };
  const ok = cheapestAttack(tree) === 45 && cheapestAttack({ cost: 7 }) === 7 && cheapestAttack({ type: "AND", children: [{ cost: 2 }, { cost: 3 }] }) === 5;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + cheapestAttack(tree));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["A leaf has a `cost` property and no `children`.", "Recurse with `node.children.map(cheapestAttack)`.", "OR: `Math.min(...costs)`; AND: add the costs."],
      solution: `function cheapestAttack(node) {
  if (!node.children) return node.cost;
  const costs = node.children.map(cheapestAttack);
  return node.type === "OR" ? Math.min(...costs) : costs.reduce((a, b) => a + b, 0);
}`,
    },
  },
  {
    id: "ns-symmetric-encryption-modes",
    track: "network-security",
    title: "Symmetric Encryption: Block Modes, IVs and AES",
    summary: "Why ECB leaks patterns, how CBC chaining hides them, and what IVs do.",
    minutes: 40,
    xp: 110,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Use a TOY 'block cipher' E(x) = x XOR key (for learning only, not secure). Implement ecbEncrypt(blocks, key) and cbcEncrypt(blocks, key, iv). In CBC each plaintext block is XORed with the previous ciphertext block (the IV for the first block) BEFORE encryption.",
      starter: `function ecbEncrypt(blocks, key) {
  return blocks;
}
function cbcEncrypt(blocks, key, iv) {
  return blocks;
}
`,
      harness: `
{
  const same = [5, 5, 5];
  const ecb = ecbEncrypt(same, 3);
  const cbc = cbcEncrypt(same, 3, 1);
  const ok =
    JSON.stringify(ecb) === "[6,6,6]" &&      // identical plaintext blocks -> identical ciphertext blocks
    JSON.stringify(cbc) === "[7,1,7]";        // chaining hides the pattern
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify([ecb, cbc]));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["ECB: `blocks.map(b => b ^ key)`.", "CBC: keep `prev = iv`; for each block compute `c = (b ^ prev) ^ key`, push it, then set `prev = c`."],
      solution: `function ecbEncrypt(blocks, key) {
  return blocks.map((b) => b ^ key);
}
function cbcEncrypt(blocks, key, iv) {
  const out = [];
  let prev = iv;
  for (const b of blocks) {
    const c = (b ^ prev) ^ key;
    out.push(c);
    prev = c;
  }
  return out;
}`,
    },
  },
  {
    id: "ns-asymmetric-signatures-pki",
    track: "network-security",
    title: "Public-Key Crypto, Digital Signatures & Certificates",
    summary: "How certificates and certificate authorities let a browser trust a key.",
    minutes: 40,
    xp: 110,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement validateCert(cert, now, trustedIssuers, revokedSerials). Return one of: 'untrusted issuer' (issuer not in trustedIssuers), 'revoked' (serial in revokedSerials), 'not yet valid' (now < notBefore), 'expired' (now > notAfter), otherwise 'valid'. Check in that order.",
      starter: `function validateCert(cert, now, trustedIssuers, revokedSerials) {
  // cert: { subject, issuer, serial, notBefore, notAfter }  (dates are numbers)
  return "valid";
}
`,
      harness: `
{
  const cert = { subject: "shop.example", issuer: "Example CA", serial: 1001, notBefore: 100, notAfter: 200 };
  const trusted = ["Example CA"];
  const ok =
    validateCert(cert, 150, trusted, []) === "valid" &&
    validateCert(cert, 150, ["Other CA"], []) === "untrusted issuer" &&
    validateCert(cert, 150, trusted, [1001]) === "revoked" &&
    validateCert(cert, 50, trusted, []) === "not yet valid" &&
    validateCert(cert, 250, trusted, []) === "expired";
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Use `trustedIssuers.includes(cert.issuer)` and `revokedSerials.includes(cert.serial)`.", "Return as soon as one check fails, in the stated order."],
      solution: `function validateCert(cert, now, trustedIssuers, revokedSerials) {
  if (!trustedIssuers.includes(cert.issuer)) return "untrusted issuer";
  if (revokedSerials.includes(cert.serial)) return "revoked";
  if (now < cert.notBefore) return "not yet valid";
  if (now > cert.notAfter) return "expired";
  return "valid";
}`,
    },
  },
];
