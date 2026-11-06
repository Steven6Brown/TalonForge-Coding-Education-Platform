import { ShellError, normalize } from "./vfs";
import type { Cmd } from "./shell";

/**
 * Simulated Kali-style pentest toolset. NOTHING here touches a real network: every tool reads from a fictional,
 * in-memory lab network (KaliNet). Output imitates the real tools so the habits transfer, but this is a teaching
 * simulation, not real Kali Linux. Learners should install real Kali in an isolated VM for real practice.
 */

export type KaliService = { port: number; service: string; version: string; banner?: string };
export type KaliHost = {
  ip: string;
  name: string;
  services: KaliService[];
  /** path -> HTTP response, keyed by port ("80:/admin"). */
  web?: Record<string, { status: number; body: string }>;
};
export type KaliNet = {
  hosts: KaliHost[];
  /** hash (lowercase hex) -> plaintext password, used by the `john` simulator. */
  hashes: Record<string, string>;
  exploits: { terms: string[]; title: string; cve: string }[];
};

const ipToInt = (ip: string) => ip.split(".").reduce((a, o) => (a << 8) + Number(o), 0) >>> 0;

function findHost(net: KaliNet, t: string): KaliHost | undefined {
  const lower = t.toLowerCase();
  return net.hosts.find((h) => h.ip === t || h.name.toLowerCase() === lower);
}

function expandTargets(net: KaliNet, target: string): { hosts: KaliHost[]; total: number } {
  const cidr = /^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/.exec(target);
  if (cidr) {
    const bits = Number(cidr[2]);
    if (bits < 24 || bits > 32) throw new ShellError("nmap: this simulator only scans /24 to /32 ranges");
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    const base = ipToInt(cidr[1]) & mask;
    return { hosts: net.hosts.filter((h) => (ipToInt(h.ip) & mask) === base), total: 2 ** (32 - bits) };
  }
  const h = findHost(net, target);
  return { hosts: h ? [h] : [], total: 1 };
}

function parsePorts(spec: string | undefined): (p: number) => boolean {
  if (!spec) return (p) => p >= 1 && p <= 1000; // the simulator's "default" range is deliberately small
  if (spec === "-") return (p) => p >= 1 && p <= 65535;
  const ranges = spec.split(",").map((part) => {
    const [a, b] = part.split("-").map(Number);
    return [a, b ?? a] as const;
  });
  return (p) => ranges.some(([lo, hi]) => p >= lo && p <= hi);
}

function parseUrl(net: KaliNet, raw: string): { host: KaliHost; port: number; path: string } | null {
  const m = /^(?:https?:\/\/)?([^/:]+)(?::(\d+))?(\/.*)?$/.exec(raw);
  if (!m) return null;
  const host = findHost(net, m[1]);
  if (!host) return null;
  return { host, port: m[2] ? Number(m[2]) : 80, path: m[3] || "/" };
}

export function makeKaliCommands(net: KaliNet): { commands: Record<string, Cmd>; help: Record<string, string> } {
  const commands: Record<string, Cmd> = {
    nmap: (_c, a) => {
      const flags = new Set(a.filter((x) => x.startsWith("-") && !x.startsWith("-p")));
      let portSpec: string | undefined;
      const targets: string[] = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i] === "-p") portSpec = a[++i];
        else if (a[i].startsWith("-p") && a[i].length > 2) portSpec = a[i].slice(2);
        else if (!a[i].startsWith("-")) targets.push(a[i]);
      }
      if (!targets.length) throw new ShellError("nmap: no target specified. Example: nmap -sV 10.10.10.0/29");
      const version = flags.has("-sV") || flags.has("-A");
      const inRange = parsePorts(portSpec);
      let out = "Starting Nmap 7.94 ( https://nmap.org ) [SIMULATED]\n";
      let up = 0;
      let total = 0;
      for (const t of targets) {
        const { hosts, total: n } = expandTargets(net, t);
        total += n;
        if (!hosts.length && n === 1) out += `Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn\n`;
        for (const h of hosts) {
          up++;
          out += `\nNmap scan report for ${h.name} (${h.ip})\nHost is up (0.00031s latency).\n`;
          const open = h.services.filter((s) => inRange(s.port)).sort((x, y) => x.port - y.port);
          if (!open.length) {
            out += "All scanned ports are closed or filtered.\n";
            continue;
          }
          out += `PORT      STATE SERVICE${version ? "  VERSION" : ""}\n`;
          for (const s of open) {
            out += `${(s.port + "/tcp").padEnd(9)} open  ${s.service.padEnd(version ? 8 : 0)}${version ? " " + s.version : ""}\n`;
          }
        }
      }
      out += `\nNmap done: ${total} IP address${total === 1 ? "" : "es"} (${up} host${up === 1 ? "" : "s"} up) scanned in 0.84 seconds\n`;
      return out;
    },

    gobuster: (c, a) => {
      if (a[0] !== "dir") throw new ShellError("gobuster: this simulator supports: gobuster dir -u URL -w WORDLIST");
      let url = "";
      let wl = "";
      for (let i = 1; i < a.length; i++) {
        if (a[i] === "-u") url = a[++i] ?? "";
        else if (a[i] === "-w") wl = a[++i] ?? "";
      }
      if (!url || !wl) throw new ShellError("gobuster: both -u URL and -w WORDLIST are required");
      const u = parseUrl(net, url);
      if (!u) throw new ShellError(`gobuster: error: unable to connect to ${url}`);
      const words = c.vfs
        .readFile(normalize(wl, c.shell.cwd), "gobuster")
        .split("\n")
        .map((w) => w.trim())
        .filter((w) => w && !w.startsWith("#"));
      let out = `===============================================================\nGobuster v3.6 [SIMULATED]\n[+] Url: ${url}\n[+] Wordlist: ${wl}\n===============================================================\n`;
      for (const w of words) {
        const r = u.host.web?.[`${u.port}:/${w}`];
        if (r) out += `/${w.padEnd(20)} (Status: ${r.status}) [Size: ${r.body.length}]\n`;
      }
      return out + "===============================================================\nFinished\n";
    },

    curl: (_c, a) => {
      const headersOnly = a.includes("-I");
      const showHeaders = a.includes("-i") || headersOnly;
      const raw = a.find((x) => !x.startsWith("-"));
      if (!raw) throw new ShellError("curl: try 'curl http://host/path'");
      const u = parseUrl(net, raw);
      if (!u) throw new ShellError(`curl: (6) Could not resolve host: ${raw}`);
      if (!u.host.services.some((s) => s.port === u.port)) throw new ShellError(`curl: (7) Failed to connect to ${u.host.name} port ${u.port}: Connection refused`);
      const r = u.host.web?.[`${u.port}:${u.path}`] ?? { status: 404, body: "404 Not Found\n" };
      const head = `HTTP/1.1 ${r.status} ${r.status === 200 ? "OK" : r.status === 403 ? "Forbidden" : "Not Found"}\nServer: ${u.host.services.find((s) => s.port === u.port)?.version ?? "unknown"}\nContent-Length: ${r.body.length}\n\n`;
      return (showHeaders ? head : "") + (headersOnly ? "" : r.body.endsWith("\n") ? r.body : r.body + "\n");
    },

    nc: (_c, a) => {
      const [h, p] = a.filter((x) => !x.startsWith("-"));
      const host = h ? findHost(net, h) : undefined;
      const svc = host?.services.find((s) => s.port === Number(p));
      if (!host || !svc) throw new ShellError(`nc: connect to ${h} port ${p} (tcp) failed: Connection refused`);
      return (svc.banner ?? `${svc.service} service (${svc.version})`) + "\n";
    },

    ping: (_c, a) => {
      const target = a.filter((x) => !x.startsWith("-") && !/^\d+$/.test(x)).pop() ?? "";
      const h = findHost(net, target);
      if (!h) throw new ShellError(`ping: ${target}: Name or service not known`);
      return `PING ${h.name} (${h.ip}) 56(84) bytes of data.\n64 bytes from ${h.ip}: icmp_seq=1 ttl=64 time=0.31 ms\n64 bytes from ${h.ip}: icmp_seq=2 ttl=64 time=0.29 ms\n\n--- ${h.name} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss\n`;
    },

    nslookup: (_c, a) => {
      const t = a[0] ?? "";
      const h = findHost(net, t);
      if (!h) throw new ShellError(`** server can't find ${t}: NXDOMAIN`);
      return `Server:  10.10.10.1\nAddress: 10.10.10.1#53\n\nName:    ${h.name}.lab.example\nAddress: ${h.ip}\n`;
    },

    searchsploit: (_c, a) => {
      const terms = a.filter((x) => !x.startsWith("-")).map((x) => x.toLowerCase());
      if (!terms.length) throw new ShellError("searchsploit: usage: searchsploit apache 2.4");
      const hits = net.exploits.filter((e) => terms.every((t) => e.title.toLowerCase().includes(t)));
      if (!hits.length) return "Exploits: No Results\n";
      return (
        "Exploit Title                                                        | CVE\n" +
        "---------------------------------------------------------------------+---------------\n" +
        hits.map((e) => `${e.title.padEnd(68)} | ${e.cve}`).join("\n") +
        "\n"
      );
    },

    hashid: (_c, a) => {
      const h = a[0] ?? "";
      const kinds: Record<number, string> = { 32: "MD5", 40: "SHA-1", 64: "SHA-256", 128: "SHA-512" };
      return /^[0-9a-f]+$/i.test(h) && kinds[h.length] ? `Analyzing '${h}'\n[+] ${kinds[h.length]}\n` : "Analyzing... No hash type matched.\n";
    },

    john: (c, a) => {
      let wl = "";
      const files: string[] = [];
      for (const x of a) {
        if (x.startsWith("--wordlist=")) wl = x.slice(11);
        else if (!x.startsWith("-")) files.push(x);
      }
      if (!wl) throw new ShellError("john: no wordlist given. Use: john --wordlist=/usr/share/wordlists/rockyou-mini.txt hashes.txt");
      if (!files.length) throw new ShellError("john: no password hash file given");
      const words = new Set(
        c.vfs
          .readFile(normalize(wl, c.shell.cwd), "john")
          .split("\n")
          .map((w) => w.trim()),
      );
      const lines = c.vfs.readFile(normalize(files[0], c.shell.cwd), "john").split("\n").filter(Boolean);
      let out = `Using default input encoding: UTF-8\nLoaded ${lines.length} password hashes (Raw-MD5) [SIMULATED]\n`;
      let cracked = 0;
      for (const line of lines) {
        const [user, hash] = line.includes(":") ? line.split(":") : ["?", line];
        const pw = net.hashes[hash.toLowerCase()];
        if (pw && words.has(pw)) {
          out += `${pw.padEnd(16)} (${user})\n`;
          cracked++;
        }
      }
      return out + `${cracked}g 0:00:00:01 DONE\nSession completed.\n`;
    },
  };

  const help: Record<string, string> = {
    nmap: "nmap [-sV] [-p PORTS|-p-] TARGET|CIDR - port scan (default scans ports 1-1000 only!)",
    gobuster: "gobuster dir -u URL -w WORDLIST - brute-force web paths",
    curl: "curl [-i|-I] URL - make an HTTP request",
    nc: "nc HOST PORT - connect to a port and read its banner",
    ping: "ping HOST - check reachability",
    nslookup: "nslookup HOST - DNS lookup",
    searchsploit: "searchsploit TERMS - search known exploits",
    hashid: "hashid HASH - guess the hash type",
    john: "john --wordlist=FILE HASHFILE - password cracking (John the Ripper)",
  };
  return { commands, help };
}
