import type { Lesson } from "./types";

/**
 * Fifth batch, built from the owner's own Penn State notes (IST 230 discrete math, Cyber 362 ML for security,
 * IST 456 security management, IST 432 technology law). Text and labs are written from scratch.
 */
export const BATCH5_LESSONS: Lesson[] = [
  /* ---------------- Math for Security ---------------- */
  {
    id: "number-bases",
    track: "math-crypto",
    title: "Number Bases: Binary, Octal & Hex",
    summary: "Convert between decimal and any base, the skill behind IPs, masks and hex dumps.",
    minutes: 25,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement toBase(n, base) for bases 2-16: return n written in that base using lowercase digits (0 returns \"0\").",
      starter: `function toBase(n, base) {
  // TODO: repeatedly divide by base; the remainders (read last to first) are the digits
  return "";
}
`,
      harness: `
{
  const ok =
    toBase(6734, 5) === "203414" && toBase(2619, 16) === "a3b" && toBase(1415, 8) === "2607" &&
    toBase(255, 2) === "11111111" && toBase(0, 2) === "0";
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + toBase(6734, 5));
}`,
      expected: "ALL TESTS PASSED",
      hints: ['Use a digit string: "0123456789abcdef"[remainder].', "Loop while n > 0: prepend digits[n % base], then n = Math.floor(n / base)."],
      solution: `function toBase(n, base) {
  if (n === 0) return "0";
  const digits = "0123456789abcdef";
  let out = "";
  while (n > 0) {
    out = digits[n % base] + out;
    n = Math.floor(n / base);
  }
  return out;
}`,
    },
  },
  {
    id: "euclid-gcd",
    track: "math-crypto",
    title: "The Euclidean Algorithm: GCD & LCM",
    summary: "Find the greatest common divisor fast, the first step toward RSA.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement gcd(a, b) with the Euclidean algorithm and lcm(a, b) using it.",
      starter: `function gcd(a, b) {
  // TODO: while b is not 0, replace (a, b) with (b, a % b)
  return 0;
}
function lcm(a, b) {
  return 0;
}
`,
      harness: `
{
  const ok = gcd(172, 64) === 4 && gcd(56, 42) === 14 && gcd(7, 0) === 7 && lcm(56, 42) === 168;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["gcd(172, 64): 172 = 64*2 + 44, then gcd(64, 44), and so on until the remainder is 0.", "lcm(a, b) = a / gcd(a, b) * b"],
      solution: `function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}`,
    },
  },
  {
    id: "modular-inverse",
    track: "math-crypto",
    title: "Modular Inverses (Extended Euclid)",
    summary: "Compute the number that undoes multiplication mod m, the heart of RSA key generation.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement modInverse(a, m): return x in [0, m) with (a * x) % m === 1, or null if gcd(a, m) is not 1.",
      starter: `function modInverse(a, m) {
  // TODO: run the extended Euclidean algorithm to find s and t with a*s + m*t = gcd(a, m)
  return null;
}
`,
      harness: `
{
  const ok = modInverse(17, 3120) === 2753 && modInverse(3, 11) === 4 && modInverse(2, 4) === null;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + modInverse(17, 3120));
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "Track (old_r, r) = (a, m) and (old_s, s) = (1, 0). Each step: q = floor(old_r / r), then swap-subtract both pairs.",
        "When the loop ends, old_r is the gcd. If it isn't 1, there is no inverse.",
        "Make the result non-negative with ((old_s % m) + m) % m.",
      ],
      solution: `function modInverse(a, m) {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if (oldR !== 1) return null;
  return ((oldS % m) + m) % m;
}`,
    },
  },
  {
    id: "rsa-from-scratch",
    track: "math-crypto",
    title: "RSA From Scratch (Toy Version)",
    summary: "Modular exponentiation and a tiny working RSA, to see why it works.",
    minutes: 35,
    xp: 100,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement modPow(base, exp, mod) with BigInt using square-and-multiply (do not compute base ** exp directly). Hidden tests run a toy RSA round trip.",
      starter: `function modPow(base, exp, mod) {
  // TODO: result = 1n; while exp > 0n: if exp is odd multiply result by base (mod); square base (mod); halve exp
  return 0n;
}
`,
      harness: `
{
  const ok =
    modPow(4n, 13n, 497n) === 445n &&
    modPow(65n, 17n, 3233n) === 2790n &&   // encrypt m=65 with e=17, n=61*53
    modPow(2790n, 2753n, 3233n) === 65n;   // decrypt with d=2753
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`exp & 1n` tests for odd; `exp >>= 1n` halves.", "Reduce with `% mod` after every multiplication to keep numbers small."],
      solution: `function modPow(base, exp, mod) {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}`,
    },
  },
  {
    id: "logic-and-proofs",
    track: "math-crypto",
    title: "Logic, Truth Tables & Proof Techniques",
    summary: "Propositions, conditionals, quantifiers and the main ways to prove things.",
    minutes: 30,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "For the conditional p → q, which statement is its contrapositive?",
          options: ["¬q → ¬p", "q → p", "¬p → ¬q"],
          answer: 0,
          why: "The contrapositive is always logically equivalent to the original. The converse (q → p) and inverse (¬p → ¬q) are not.",
        },
        {
          q: "When is p → q false?",
          options: ["Only when p is true and q is false", "When p is false", "When q is true"],
          answer: 0,
          why: "A conditional is vacuously true when p is false. It fails only when the premise holds and the conclusion doesn't.",
        },
        {
          q: "What is the negation of ∀x P(x)?",
          options: ["∃x ¬P(x)", "∀x ¬P(x)", "¬∃x P(x)"],
          answer: 0,
          why: "To negate a quantifier, flip it (∀ becomes ∃) and push the negation inward.",
        },
        {
          q: "Which proof technique assumes the statement is false and derives something impossible?",
          options: ["Proof by contradiction", "Direct proof", "Proof by induction"],
          answer: 0,
          why: "Euclid's proof that there are infinitely many primes is the classic example.",
        },
        {
          q: "De Morgan's law says ¬(p ∧ q) is equivalent to:",
          options: ["¬p ∨ ¬q", "¬p ∧ ¬q", "p ∨ q"],
          answer: 0,
          why: "Negating an AND turns it into an OR of the negations (and vice versa). Firewall rule logic uses this constantly.",
        },
      ],
    },
  },
  {
    id: "probability-bayes",
    track: "math-crypto",
    title: "Probability & Bayes' Theorem",
    summary: "Update beliefs with evidence: the math behind spam filters and alert triage.",
    minutes: 30,
    xp: 70,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Implement bayes(pBgivenA, pA, pB) returning P(A|B) = P(B|A) * P(A) / P(B).",
      starter: `function bayes(pBgivenA, pA, pB) {
  // TODO
  return 0;
}
`,
      harness: `
{
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  // 90% of spam contains "free", 20% of mail is spam, 30% of all mail contains "free"
  const ok = near(bayes(0.9, 0.2, 0.3), 0.6) && near(bayes(1, 0.5, 0.5), 1) && near(bayes(0.5, 0.5, 0.5), 0.5);
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["The formula is in the task: P(A|B) = P(B|A) * P(A) / P(B). Your three arguments are the three pieces: pBgivenA, pA and pB.", "Multiply the first two arguments, then divide by the third. Wrap the multiplication in parentheses so it happens first."],
      solution: `function bayes(pBgivenA, pA, pB) {
  return (pBgivenA * pA) / pB;
}`,
    },
  },

  /* ---------------- AI: spam classifier ---------------- */
  {
    id: "ml-spam-classifier",
    track: "ai-engineering",
    title: "Build a Spam Classifier (Naive Bayes)",
    summary: "Count words, apply Bayes' rule, and classify messages in plain Python.",
    minutes: 35,
    xp: 100,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "python",
      prompt: "Finish word_counts and score so the Naive Bayes classifier labels each test message. Print the labels comma-separated.",
      starter: String.raw`import math

SPAM = ["win free prize now", "free cash offer win", "urgent claim your prize"]
HAM = ["meeting at noon tomorrow", "lunch tomorrow at noon", "project meeting notes attached"]

def word_counts(messages):
    # TODO: return (counts, total) where counts maps word -> occurrences and total is the number of words
    return {}, 0

spam_counts, spam_total = word_counts(SPAM)
ham_counts, ham_total = word_counts(HAM)
vocab = set(spam_counts) | set(ham_counts)

def score(message, counts, total):
    # TODO: start at math.log(0.5) (equal priors) and add
    # math.log((counts.get(w, 0) + 1) / (total + len(vocab))) for every word w that is in vocab
    return 0.0

def classify(message):
    return "spam" if score(message, spam_counts, spam_total) > score(message, ham_counts, ham_total) else "ham"

tests = ["claim free cash", "noon meeting notes", "win prize tomorrow", "free lunch tomorrow"]
print(",".join(classify(m) for m in tests))
`,
      expected: "spam,ham,spam,ham",
      hints: [
        "Loop over messages, then over `message.split()`; use `counts[w] = counts.get(w, 0) + 1` and count the total.",
        "Adding 1 to every count (Laplace smoothing) stops a never-seen word from zeroing the probability.",
        "We add logs instead of multiplying probabilities to avoid underflow.",
      ],
      solution: String.raw`def word_counts(messages):
    counts, total = {}, 0
    for m in messages:
        for w in m.split():
            counts[w] = counts.get(w, 0) + 1
            total += 1
    return counts, total

def score(message, counts, total):
    s = math.log(0.5)
    for w in message.split():
        if w in vocab:
            s += math.log((counts.get(w, 0) + 1) / (total + len(vocab)))
    return s
`,
    },
  },

  /* ---------------- Security Foundations additions ---------------- */
  {
    id: "malware-landscape",
    track: "security-foundations",
    title: "The Threat Landscape & Malware Types",
    summary: "Worms, trojans, ransomware, botnets and how the cybercrime economy works.",
    minutes: 25,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What distinguishes a worm from other malware?",
          options: ["It self-replicates across networks without attaching to an existing program", "It disguises itself as legitimate software", "It only displays ads"],
          answer: 0,
          why: "A trojan disguises itself; a worm spreads on its own. Many real threats combine traits.",
        },
        {
          q: "A rootkit is mainly designed to:",
          options: ["Hide its presence while keeping unauthorized access", "Encrypt files for ransom", "Record keystrokes only"],
          answer: 0,
          why: "Rootkits hide processes, files and connections from users and security tools, which makes them hard to detect.",
        },
        {
          q: "A botnet is:",
          options: ["A network of infected machines controlled remotely, often used for DDoS", "A single compromised server", "A type of spam filter"],
          answer: 0,
          why: "Botnets are also rented out like cloud capacity, which is part of the cybercrime economy.",
        },
        {
          q: "Why is cybercrime so scalable compared with physical crime?",
          options: ["Low risk of being caught and a mature market for tools, malware distribution and stolen data", "It requires elite skill for every attack", "It is illegal everywhere"],
          answer: 0,
          why: "Pay-per-install malware distribution, exploit kits and data markets let low-skill actors profit, which is why defense needs layers and automation.",
        },
        {
          q: "Which is an example of a social-engineering technique used for information gathering?",
          options: ["Phishing", "Compiling code", "Defragmenting a disk"],
          answer: 0,
          why: "The user is often the weakest link, so training and technical controls both matter.",
        },
      ],
    },
  },
  {
    id: "security-governance",
    track: "security-foundations",
    title: "Security Governance, Planning & Ethics",
    summary: "How organizations direct security: strategy, policy, ethics and defense in depth.",
    minutes: 25,
    xp: 60,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Information security governance is best described as:",
          options: ["Responsibilities and practices of the board and executives that set direction and ensure objectives are met", "Installing antivirus", "Only the IT team's job"],
          answer: 0,
          why: "Security must be addressed at the top (board, executives, CEO) to align with the business and manage risk.",
        },
        {
          q: "Which is a tactical (not strategic) plan timeframe?",
          options: ["1-3 years", "5+ years", "Never"],
          answer: 0,
          why: "Strategic plans look about five years out, tactical plans one to three, and projects about a year, with a feedback loop between them.",
        },
        {
          q: "For deterrence to work, which three conditions are needed?",
          options: ["Fear of penalty, probability of being caught, probability the penalty is applied", "Strong passwords, firewalls and backups", "Low cost, high speed, good UI"],
          answer: 0,
          why: "Policies without enforcement or detection don't deter.",
        },
        {
          q: "Defense in depth means:",
          options: ["Layered controls designed to detect, delay, mitigate or prevent unauthorized access", "One very strong firewall", "Hiding systems"],
          answer: 0,
          why: "It applies to physical security (perimeter, access control, visibility, intrusion detection) as well as technical controls.",
        },
        {
          q: "Deontological ethics judges actions mainly by:",
          options: ["The rightness of intentions and duties, not just consequences", "Only the outcome", "Popular opinion"],
          answer: 0,
          why: "Utilitarian reasoning looks at consequences; deontological looks at duty and intent. Both appear in security decisions.",
        },
      ],
    },
  },
  {
    id: "tech-law-basics",
    track: "security-foundations",
    title: "Technology Law: Reading Cases & Thinking Like a Lawyer",
    summary: "Case law, case briefs and why security professionals need legal literacy.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What is case law?",
          options: ["Court-created precedent that guides how similar cases are handled", "Laws written by legislatures", "Company policy"],
          answer: 0,
          why: "Judges' decisions create precedent that lawyers use to predict outcomes and build arguments.",
        },
        {
          q: "In a case brief, the 'issue' is:",
          options: ["The specific legal question the court must answer, tied to the case's facts", "A summary of the whole story", "The final penalty"],
          answer: 0,
          why: "Typical elements: title and citation, facts, issue, decision and reasoning.",
        },
        {
          q: "Why do security professionals need to understand law as well as technology?",
          options: ["It guides informed decisions, keeps organizations honest, and helps shape better policy", "It replaces technical skill", "Laws never change"],
          answer: 0,
          why: "Incidents such as large data-misuse scandals show how law and technology interact.",
        },
        {
          q: "Which habit is part of thinking like a lawyer?",
          options: ["Scrutinizing sources and separating facts from bias before arguing", "Trusting the first headline", "Ignoring opposing views"],
          answer: 0,
          why: "Many famous cases are widely misunderstood; checking the facts matters. This is education, not legal advice.",
        },
      ],
    },
  },
];
