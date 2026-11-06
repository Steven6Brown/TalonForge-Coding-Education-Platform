import type { LogEvent } from "./engine";

/**
 * Deterministic, fictional log data for the Mini-SIEM labs. Built from a seeded generator so the answers
 * below are computed from the data itself (never hand-typed), and every IP is a documentation range.
 */

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
const ts = (h: number, m: number, s = 0) => `2026-01-12T${pad(h)}:${pad(m)}:${pad(s)}Z`;

export function buildEvents(): LogEvent[] {
  const rnd = lcg(42);
  const ev: LogEvent[] = [];

  // ---- Authentication (source=auth) ----
  const attackers: [string, number][] = [["203.0.113.45", 23], ["198.51.100.23", 11], ["192.0.2.77", 8]];
  const users = ["root", "admin", "ubuntu", "test", "oracle", "svc-backup"];
  let t = 3 * 3600 + 10 * 60;
  for (const [ip, n] of attackers) {
    for (let i = 0; i < n; i++) {
      t += 7 + Math.floor(rnd() * 20);
      ev.push({
        _time: ts(Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60),
        source: "auth", host: "web-01", user: users[Math.floor(rnd() * users.length)], src_ip: ip, action: "failure",
        message: `Failed password for ${ip}`,
      });
    }
  }
  // The compromise: the top attacker finally succeeds against "admin".
  ev.push({ _time: ts(3, 41, 12), source: "auth", host: "web-01", user: "admin", src_ip: "203.0.113.45", action: "success", message: "Accepted password for admin" });
  // Normal staff activity
  const staff: [string, string][] = [["alice", "192.168.1.21"], ["bob", "192.168.1.34"], ["carol", "192.168.1.40"], ["dave", "192.168.1.52"]];
  staff.forEach(([u, ip], i) => {
    for (let k = 0; k < 3; k++) ev.push({ _time: ts(8 + i, 5 + k * 17, 3), source: "auth", host: "web-01", user: u, src_ip: ip, action: "success", message: `Accepted publickey for ${u}` });
  });
  // A few typos by real staff
  ev.push({ _time: ts(9, 3, 40), source: "auth", host: "web-01", user: "bob", src_ip: "192.168.1.34", action: "failure", message: "Failed password for bob" });
  ev.push({ _time: ts(10, 22, 9), source: "auth", host: "web-01", user: "carol", src_ip: "192.168.1.40", action: "failure", message: "Failed password for carol" });

  // ---- DNS (source=dns): ws-114 beacons every 60s to a suspicious domain ----
  for (let i = 0; i < 30; i++) {
    ev.push({ _time: ts(13, i, 0), source: "dns", host: "ws-114", user: "erin", src_ip: "10.0.5.114", action: "query", query: "update-check.example-cdn.net", message: "DNS query update-check.example-cdn.net" });
  }
  const normal = ["www.example.com", "mail.example.org", "intranet.corp.example", "cdn.example.net", "docs.example.com"];
  const dnsHosts: [string, string][] = [["ws-101", "10.0.5.101"], ["ws-102", "10.0.5.102"], ["ws-103", "10.0.5.103"], ["ws-114", "10.0.5.114"]];
  for (let i = 0; i < 60; i++) {
    const [h, ip] = dnsHosts[Math.floor(rnd() * dnsHosts.length)];
    const minute = Math.floor(rnd() * 60);
    const d = normal[Math.floor(rnd() * normal.length)];
    ev.push({ _time: ts(13, minute, Math.floor(rnd() * 59) + 1), source: "dns", host: h, user: "staff", src_ip: ip, action: "query", query: d, message: `DNS query ${d}` });
  }

  // ---- Network (source=firewall): outbound bytes ----
  const fwHosts: [string, string][] = [["web-01", "10.0.1.10"], ["app-01", "10.0.2.20"], ["db-02", "10.0.3.30"], ["ws-101", "10.0.5.101"]];
  for (let i = 0; i < 40; i++) {
    const [h, ip] = fwHosts[Math.floor(rnd() * fwHosts.length)];
    ev.push({ _time: ts(14, Math.floor(rnd() * 60), 5), source: "firewall", host: h, src_ip: ip, dest_ip: "198.51.100.8", dest_port: 443, action: "allow", bytes_out: 2000 + Math.floor(rnd() * 90000), message: "Outbound HTTPS allowed" });
  }
  // Data exfiltration: db-02 sends hundreds of MB to a rare destination
  for (let i = 0; i < 5; i++) {
    ev.push({ _time: ts(15, 10 + i * 4, 0), source: "firewall", host: "db-02", src_ip: "10.0.3.30", dest_ip: "198.51.100.99", dest_port: 443, action: "allow", bytes_out: 400_000_000 + i * 1_000_000, message: "Outbound HTTPS allowed" });
  }

  // ---- Web (source=web) ----
  const paths = ["/", "/index.html", "/login", "/products", "/about"];
  for (let i = 0; i < 50; i++) {
    ev.push({ _time: ts(11, Math.floor(rnd() * 60), 1), source: "web", host: "web-01", src_ip: `192.168.1.${20 + Math.floor(rnd() * 40)}`, action: "GET", status: 200, url: paths[Math.floor(rnd() * paths.length)], message: "HTTP request" });
  }
  for (const p of ["/admin", "/wp-login.php", "/backup.zip", "/.env"]) {
    for (let i = 0; i < 6; i++) ev.push({ _time: ts(12, 30 + i, 7), source: "web", host: "web-01", src_ip: "198.51.100.23", action: "GET", status: 404, url: p, message: "HTTP request" });
  }
  return ev.sort((a, b) => String(a._time).localeCompare(String(b._time)));
}

export const EVENTS = buildEvents();

/** Ground truth computed from the data (so lab answers can never drift out of sync). */
export const TRUTH = (() => {
  const failures = EVENTS.filter((e) => e.source === "auth" && e.action === "failure");
  const byIp = new Map<string, number>();
  failures.forEach((e) => byIp.set(String(e.src_ip), (byIp.get(String(e.src_ip)) ?? 0) + 1));
  const topIp = [...byIp.entries()].sort((a, b) => b[1] - a[1])[0];
  const success = EVENTS.find((e) => e.source === "auth" && e.action === "success" && e.src_ip === topIp[0])!;
  const beacons = new Map<string, number>();
  EVENTS.filter((e) => e.query === "update-check.example-cdn.net").forEach((e) => beacons.set(String(e.host), (beacons.get(String(e.host)) ?? 0) + 1));
  const bytes = new Map<string, number>();
  EVENTS.filter((e) => e.source === "firewall").forEach((e) => bytes.set(String(e.host), (bytes.get(String(e.host)) ?? 0) + Number(e.bytes_out)));
  const notFound = new Map<string, number>();
  EVENTS.filter((e) => e.status === 404).forEach((e) => notFound.set(String(e.url), (notFound.get(String(e.url)) ?? 0) + 1));
  return {
    failureCount: failures.length,
    topFailureIp: topIp[0],
    topFailureIpCount: topIp[1],
    compromisedUser: String(success.user),
    beaconHost: [...beacons.entries()].sort((a, b) => b[1] - a[1])[0][0],
    beaconCount: [...beacons.entries()].sort((a, b) => b[1] - a[1])[0][1],
    exfilHost: [...bytes.entries()].sort((a, b) => b[1] - a[1])[0][0],
    notFoundCount: [...notFound.values()].reduce((a, b) => a + b, 0),
  };
})();
