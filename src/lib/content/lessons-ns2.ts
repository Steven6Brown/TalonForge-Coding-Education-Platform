import type { Lesson } from "./types";

/** Network Security series, part 2: IPsec/VPN, TLS and authentication. Text and labs are original. */
export const NS2_LESSONS: Lesson[] = [
  {
    id: "ns-ipsec-vpn",
    track: "network-security",
    title: "IPsec & VPNs: AH, ESP, Modes and Security Associations",
    summary: "Securing the network layer, including anti-replay protection.",
    minutes: 45,
    xp: 120,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement checkPacket(state, seq) for an IPsec-style anti-replay window. state = {top, size, seen: Set}. Reject a packet whose sequence number is too old (seq <= top - size) or already seen; otherwise accept it, record it, and raise top if seq is larger. Return 'accept' or 'reject'.",
      starter: `function checkPacket(state, seq) {
  // TODO
  return "reject";
}
`,
      harness: `
{
  const state = { top: 0, size: 4, seen: new Set() };
  const got = [1, 2, 2, 5, 1, 2, 3, 3, 10, 5].map((s) => checkPacket(state, s));
  const want = ["accept", "accept", "reject", "accept", "reject", "reject", "accept", "reject", "accept", "reject"];
  console.log(JSON.stringify(got) === JSON.stringify(want) ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(got));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Check the two rejection cases first: too old, then already seen.", "On accept: `state.seen.add(seq)` and, if `seq > state.top`, set `state.top = seq`."],
      solution: `function checkPacket(state, seq) {
  if (seq <= state.top - state.size) return "reject";
  if (state.seen.has(seq)) return "reject";
  state.seen.add(seq);
  if (seq > state.top) state.top = seq;
  return "accept";
}`,
    },
  },
  {
    id: "ns-tls-https",
    track: "network-security",
    title: "HTTPS, SSL/TLS & Diffie-Hellman Key Exchange",
    summary: "Why plain HTTP is unsafe, what TLS provides, and how two parties agree on a secret in public.",
    minutes: 40,
    xp: 110,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement diffieHellman(p, g, a, b) with BigInt. Alice's public value is A = g^a mod p and Bob's is B = g^b mod p. Return {A, B, aliceSecret, bobSecret} where aliceSecret = B^a mod p and bobSecret = A^b mod p (they must be equal).",
      starter: `function modPow(base, exp, mod) {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

function diffieHellman(p, g, a, b) {
  // TODO use modPow
  return { A: 0n, B: 0n, aliceSecret: 0n, bobSecret: 0n };
}
`,
      harness: `
{
  const r = diffieHellman(23n, 5n, 6n, 15n);
  const ok = r.A === 8n && r.B === 19n && r.aliceSecret === 2n && r.bobSecret === 2n;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + JSON.stringify(r, (k, v) => (typeof v === "bigint" ? v.toString() : v)));
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`const A = modPow(g, a, p)` and `const B = modPow(g, b, p)`.", "Each side raises the OTHER side's public value to its own secret: `modPow(B, a, p)` and `modPow(A, b, p)`."],
      solution: `function diffieHellman(p, g, a, b) {
  const A = modPow(g, a, p);
  const B = modPow(g, b, p);
  return { A, B, aliceSecret: modPow(B, a, p), bobSecret: modPow(A, b, p) };
}`,
    },
  },
  {
    id: "ns-tls-handshake",
    track: "network-security",
    title: "The TLS 1.2 Handshake, Step by Step",
    summary: "Cipher suites, certificate checks and the session key.",
    minutes: 30,
    xp: 80,
    level: "intermediate",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "What are the three main parts of a TLS 1.2 handshake?",
          options: [
            "Exchange cipher-suite capabilities, authenticate the server's certificate, and generate a symmetric session key",
            "Scan, exploit, report",
            "Hash, compress, delete",
          ],
          answer: 0,
          why: "After the handshake, application data is protected with the symmetric session key.",
        },
        {
          q: "Which message does the client send first?",
          options: ["ClientHello (its supported cipher suites and a client random)", "Finished", "Certificate"],
          answer: 0,
          why: "The server answers with ServerHello (chosen parameters and a server random), its Certificate chain and ServerHelloDone.",
        },
        {
          q: "How does the client verify the server's certificate?",
          options: [
            "It checks the CA's signature (recomputed hash versus the signed hash), builds the chain to a trusted CA, and checks expiry and the domain name",
            "It trusts any certificate",
            "It asks the user for a password",
          ],
          answer: 0,
          why: "The CA signs a hash of the certificate fields with its private key; the browser verifies with the CA's public key.",
        },
        {
          q: "In RSA key exchange, how does the client contribute to the session key?",
          options: [
            "It generates a random pre-master secret and encrypts it with the server's public key",
            "It sends its password",
            "It sends the key unencrypted",
          ],
          answer: 0,
          why: "Both sides then derive the same session keys from the pre-master secret and the two randoms. With (EC)DHE, the key is derived from a Diffie-Hellman exchange instead, which provides forward secrecy.",
        },
        {
          q: "What do the 'Change Cipher Spec' and 'Finished' messages do?",
          options: [
            "Signal the switch to encrypted communication, and carry a MAC proving the handshake wasn't tampered with",
            "End the connection",
            "Request a certificate",
          ],
          answer: 0,
          why: "The Finished message is the first one protected by the new keys and covers the whole handshake.",
        },
        {
          q: "Which statement about TLS versions is accurate?",
          options: [
            "SSL 2.0 and 3.0 are obsolete; TLS 1.0-1.3 followed, with TLS 1.2 and 1.3 the versions in current use",
            "SSL 1.0 is the newest",
            "TLS 1.0 is recommended today",
          ],
          answer: 0,
          why: "TLS 1.3 (2018) simplifies the handshake and removes weak options; TLS 1.0 and 1.1 are deprecated.",
        },
      ],
    },
  },
  {
    id: "ns-authentication",
    track: "network-security",
    title: "Identification, Authentication, Authorization & Access Control",
    summary: "Four means of authentication, multi-factor models and biometrics.",
    minutes: 35,
    xp: 90,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "Which sequence matches the standard definitions?",
          options: [
            "Identification presents an identity; authentication validates it; authorization decides what it may do; access control grants or denies resources",
            "Authorization comes before identification",
            "They are all the same",
          ],
          answer: 0,
          why: "Keep the four distinct: who you claim to be, proof, permissions, enforcement.",
        },
        {
          q: "A fingerprint is which authentication factor?",
          options: ["Something you are (static biometric)", "Something you know", "Something you have"],
          answer: 0,
          why: "Typing rhythm, voice pattern and handwriting are dynamic biometrics: something you do.",
        },
        {
          q: "A password plus a code from an authenticator app is:",
          options: ["Two-factor authentication (know + have)", "One factor", "Biometric"],
          answer: 0,
          why: "Two different factor categories. Two passwords would still be a single factor.",
        },
        {
          q: "Why are biometrics harder to deploy than passwords?",
          options: [
            "They rely on pattern recognition, cost more and have error rates, since samples from one person never match exactly",
            "Fingerprints change daily",
            "They don't work at all",
          ],
          answer: 0,
          why: "Systems must trade off false accepts versus false rejects, and a compromised biometric can't be reset.",
        },
        {
          q: "Network devices often ship with default accounts and passwords. The policy response is:",
          options: ["Require changing all default credentials before deployment", "Leave them in place", "Share them widely"],
          answer: 0,
          why: "Default passwords are among the first things attackers try.",
        },
        {
          q: "Which user behavior weakens passwords most?",
          options: ["Using personal information, dictionary words, sequences or the same password everywhere", "Using a password manager", "Using a long passphrase"],
          answer: 0,
          why: "Also avoid reuse and storing passwords insecurely; use a manager and MFA.",
        },
      ],
    },
  },
  {
    id: "ns-password-policy",
    track: "network-security",
    title: "Password Policy: Complexity Rules (and Their Limits)",
    summary: "Implement a classic complexity checker, then see why modern guidance favors length.",
    minutes: 30,
    xp: 80,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement passwordProblems(pw, username) returning an array (in this order) of the rules that FAIL: 'too short' (fewer than 8 chars), 'contains username' (case-insensitive), 'needs 3 of 4 character types' (uppercase, lowercase, digits, symbols).",
      starter: `function passwordProblems(pw, username) {
  // TODO
  return [];
}
`,
      harness: `
{
  const j = (x) => JSON.stringify(x);
  const ok =
    j(passwordProblems("Abcdef1!", "bob")) === "[]" &&
    j(passwordProblems("short1!", "bob")) === '["too short"]' &&
    j(passwordProblems("BobSecret1!", "bob")) === '["contains username"]' &&
    j(passwordProblems("alllowercase", "bob")) === '["needs 3 of 4 character types"]' &&
    j(passwordProblems("bob1", "bob")) === '["too short","contains username","needs 3 of 4 character types"]';
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Count categories with tests like `/[A-Z]/`, `/[a-z]/`, `/\\d/` and `/[^A-Za-z0-9]/`.", "Only check the username when it is non-empty."],
      solution: `function passwordProblems(pw, username) {
  const out = [];
  if (pw.length < 8) out.push("too short");
  if (username && pw.toLowerCase().includes(username.toLowerCase())) out.push("contains username");
  const kinds = [/[A-Z]/, /[a-z]/, /\\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (kinds < 3) out.push("needs 3 of 4 character types");
  return out;
}`,
    },
  },
  {
    id: "ns-password-storage-attacks",
    track: "network-security",
    title: "Password Storage, Salting & Password Attacks",
    summary: "Hashes, salts, dictionary and rainbow-table attacks, and their countermeasures.",
    minutes: 40,
    xp: 110,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement async saltedSha256Hex(password, salt): return the lowercase hex SHA-256 of salt + password (string concatenation, UTF-8). Use crypto.subtle.digest.",
      starter: `async function saltedSha256Hex(password, salt) {
  // TODO: new TextEncoder().encode(...), await crypto.subtle.digest("SHA-256", data), then convert to hex
  return "";
}
`,
      harness: `
{
  const known = await saltedSha256Hex("c", "ab"); // SHA-256("abc")
  const a = await saltedSha256Hex("hunter2", "s1");
  const b = await saltedSha256Hex("hunter2", "s2");
  const a2 = await saltedSha256Hex("hunter2", "s1");
  const ok = known === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" && a !== b && a === a2;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["`[...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')`", "Same password with different salts must give different hashes: that is the whole point."],
      solution: `async function saltedSha256Hex(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}`,
    },
  },
  {
    id: "ns-otp-hotp",
    track: "network-security",
    title: "One-Time Passwords: HOTP and TOTP",
    summary: "How authenticator apps generate codes, implemented against the RFC test vectors.",
    minutes: 45,
    xp: 130,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement async hotp(secret, counter, digits = 6) per RFC 4226: HMAC-SHA1 of the 8-byte big-endian counter, dynamic truncation (offset = low 4 bits of the last byte; take 4 bytes, mask the top bit), then modulo 10^digits, zero-padded. The secret is a plain string used as the key.",
      starter: `async function hotp(secret, counter, digits = 6) {
  // 1) importKey("raw", encoded secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
  // 2) 8-byte big-endian counter (DataView.setBigUint64)
  // 3) sign, then dynamic truncation
  return "";
}
`,
      harness: `
{
  const codes = [];
  for (let i = 0; i < 5; i++) codes.push(await hotp("12345678901234567890", i));
  console.log(codes.join(",") === "755224,287082,359152,969429,338314" ? "ALL TESTS PASSED" : "TESTS FAILED: " + codes.join(","));
}`,
      expected: "ALL TESTS PASSED",
      hints: [
        "`const msg = new ArrayBuffer(8); new DataView(msg).setBigUint64(0, BigInt(counter));`",
        "`const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));`",
        "`const o = h[h.length - 1] & 0x0f; const code = ((h[o] & 0x7f) << 24) | (h[o+1] << 16) | (h[o+2] << 8) | h[o+3];`",
      ],
      solution: `async function hotp(secret, counter, digits = 6) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new ArrayBuffer(8);
  new DataView(msg).setBigUint64(0, BigInt(counter));
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = h[h.length - 1] & 0x0f;
  const code = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(code % 10 ** digits).padStart(digits, "0");
}`,
    },
  },
];
