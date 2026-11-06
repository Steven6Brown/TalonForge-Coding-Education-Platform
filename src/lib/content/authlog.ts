/* Deterministic fake sshd log shared by several labs (kept in its own module to avoid import cycles). */

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Deterministic fake sshd log. Exported so the Python lab uses the exact same data. */
export function makeAuthLog(): { text: string; topIp: string; counts: Record<string, number> } {
  const failures: [string, number][] = [
    ["203.0.113.45", 23],
    ["198.51.100.23", 11],
    ["192.0.2.77", 8],
    ["198.51.100.200", 5],
    ["203.0.113.9", 3],
  ];
  const events: string[] = [];
  const counts: Record<string, number> = {};
  for (const [ip, n] of failures) {
    counts[ip] = n;
    for (let i = 0; i < n; i++) events.push(`F|${ip}`);
  }
  for (let i = 0; i < 6; i++) events.push("A|192.168.1.10");
  for (let i = 0; i < 4; i++) events.push("I|198.51.100.23");
  const rnd = lcg(7);
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [events[i], events[j]] = [events[j], events[i]];
  }
  const users = ["root", "admin", "ubuntu", "test", "oracle", "pi"];
  const lines = events.map((e, i) => {
    const [kind, ip] = e.split("|");
    const mm = String(14 + Math.floor(i / 20)).padStart(2, "0");
    const ss = String((i * 3) % 60).padStart(2, "0");
    const ts = `Jan 12 03:${mm}:${ss}`;
    const pid = 1200 + i;
    const port = 40000 + Math.floor(rnd() * 20000);
    const user = users[Math.floor(rnd() * users.length)];
    if (kind === "F") return `${ts} forge sshd[${pid}]: Failed password for ${user} from ${ip} port ${port} ssh2`;
    if (kind === "A") return `${ts} forge sshd[${pid}]: Accepted publickey for student from ${ip} port ${port} ssh2`;
    return `${ts} forge sshd[${pid}]: Invalid user ${user} from ${ip} port ${port}`;
  });
  return { text: lines.join("\n") + "\n", topIp: "203.0.113.45", counts };
}

export const authLog = makeAuthLog();
