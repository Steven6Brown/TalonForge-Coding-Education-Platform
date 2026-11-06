import type { FsDef } from "@/lib/shell/vfs";
import { authLog, makeAuthLog } from "./authlog";
import { forensics, net } from "./filesystems-extra";
import { dfir, kali, privesc, wargame } from "./filesystems-kali";
import { dfir2, hostsec, range } from "./filesystems-range";
import { pcap } from "./filesystems-pcap";
import { sudolog } from "./filesystems-sudolog";

/* Fictional lab data. All hosts use documentation-reserved IP ranges (RFC 5737 / RFC 1918). */

export function rot13(s: string): string {
  return s.replace(/[a-z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export { authLog, makeAuthLog };

const basics: FsDef = {
  "/home/student/welcome.txt":
    "Welcome to the shell lab.\nYour mission folder is ~/mission. Not everything in Linux is visible by default.\nHint: ls has options. Try: ls -a\n",
  "/home/student/mission/briefing.txt": "Mission: find the hidden file inside ~/mission/files and read it.\n",
  "/home/student/mission/files/report.txt": "Nothing to see here.\n",
  "/home/student/mission/files/data.csv": "id,name\n1,alpha\n2,bravo\n",
  "/home/student/mission/files/.secret": "FLAG{hidden_in_plain_sight}\n",
  "/home/student/notes/todo.txt": "1. learn the shell\n2. learn python\n3. build a home lab\n",
  "/etc/hostname": "forge\n",
  "/etc/os-release": 'PRETTY_NAME="TalonForge Training Linux"\nID=talonforge\n',
};

const logs: FsDef = {
  "/home/student/README.txt":
    "A server was hit by a brute-force attack overnight.\nThe auth log is at /var/log/auth.log.\nQuestion: which IP address has the MOST failed password attempts?\nTools to consider: grep, cut, sort, uniq -c, head\n",
  "/var/log/auth.log": { c: authLog.text, m: 0o644 },
  "/var/log/syslog": "Jan 12 03:00:01 forge CRON[900]: (root) CMD (run-parts /etc/cron.hourly)\n",
};

const perms: FsDef = {
  "/home/student/README.txt":
    "You are auditing a web server for risky file permissions.\nMission: find the ONE file under /var/www that is world-writable (mode 777) and read it.\nTry: ls -l, find with -perm, and cat.\nNote: /etc/shadow is protected - see what happens if you try to read it.\n",
  "/var/www/html/index.html": { c: "<h1>Welcome</h1>\n", m: 0o644, o: "www-data" },
  "/var/www/html/about.html": { c: "<h1>About</h1>\n", m: 0o644, o: "www-data" },
  "/var/www/html/config.php": { c: "<?php // db config lives elsewhere ?>\n", m: 0o640, o: "root" },
  "/var/www/html/uploads/": { c: "", m: 0o775, o: "www-data" },
  "/var/www/html/uploads/avatar.png": { c: "PNG...", m: 0o644, o: "www-data" },
  "/var/www/html/uploads/backup_old.php": {
    c: "<?php /* FLAG{world_writable_is_a_red_flag} left by a careless admin: anyone can edit this file */ ?>\n",
    m: 0o777,
    o: "www-data",
  },
  "/etc/shadow": { c: "root:$6$redacted:19000:0:99999:7:::\n", m: 0o640, o: "root" },
  "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000::/home/student:/bin/bash\nwww-data:x:33:33::/var/www:/usr/sbin/nologin\n",
};

const recon: FsDef = {
  "/home/student/README.txt":
    "Recon exercise. You scanned your own lab network and saved the output to ~/scans/lab-scan.txt.\nQuestion: which host has TELNET (port 23) open? Answer with its IP address.\nHint: grep -n telnet shows which line matches; then read the file (cat -n) and look at the 'Scan report' line just above it.\n",
  "/home/student/scans/lab-scan.txt": `Starting scan of 10.10.10.0/29 (lab network, authorized)

Scan report for 10.10.10.1 (gateway)
PORT     STATE SERVICE
53/tcp   open  domain
80/tcp   open  http

Scan report for 10.10.10.2 (fileserver)
PORT     STATE SERVICE
22/tcp   open  ssh
445/tcp  open  microsoft-ds

Scan report for 10.10.10.4 (old-camera)
PORT     STATE SERVICE
23/tcp   open  telnet
80/tcp   open  http

Scan report for 10.10.10.5 (printer)
PORT     STATE SERVICE
631/tcp  open  ipp
9100/tcp open  jetdirect

Scan done: 4 hosts up
`,
};

const ssh: FsDef = {
  "/home/student/README.txt":
    "Review this SSH server config for risky settings.\nFile: /etc/ssh/sshd_config\nQuestion: which setting allows the root account to log in over SSH with a password? Answer with the setting NAME.\n",
  "/etc/ssh/sshd_config": `# sshd_config (training copy)
Port 22
Protocol 2
PermitRootLogin yes
PasswordAuthentication yes
PermitEmptyPasswords no
PubkeyAuthentication yes
X11Forwarding no
MaxAuthTries 6
`,
};

const flag1 = "FLAG{base64_is_not_encryption}";
const flag2 = "FLAG{rot13_is_a_toy_cipher}";
const flag3 = "FLAG{logs_remember_everything}";

const ctf: FsDef = {
  "/home/student/ctf/README.txt":
    "Three flags are hidden in ~/ctf. Each looks like FLAG{...}. Submit all three.\nnote1.b64  - looks like gibberish...\nnote2.txt  - looks like gibberish too...\naccess.log - a web server log. Someone left something odd in a request.\n",
  "/home/student/ctf/note1.b64": btoa(flag1) + "\n",
  "/home/student/ctf/note2.txt": `Message intercepted: ${rot13(flag2)}\n(Hint: a classic substitution cipher where A<->N. Try tr.)\n`,
  "/home/student/ctf/access.log": [
    '198.51.100.7 - - [12/Jan/2026:03:10:01] "GET /index.html HTTP/1.1" 200 512',
    '198.51.100.7 - - [12/Jan/2026:03:10:02] "GET /style.css HTTP/1.1" 200 1024',
    '203.0.113.45 - - [12/Jan/2026:03:11:40] "GET /login HTTP/1.1" 200 733',
    `203.0.113.45 - - [12/Jan/2026:03:11:41] "GET /admin?debug=${flag3} HTTP/1.1" 403 12`,
    '192.0.2.77 - - [12/Jan/2026:03:12:09] "GET /favicon.ico HTTP/1.1" 404 0',
  ].join("\n") + "\n",
};

const sandbox: FsDef = {
  "/home/student/hello.txt": "Hello from the sandbox!\n",
  "/home/student/projects/notes.md": "# Notes\nTry things here. Nothing can break.\n",
  "/var/log/auth.log": { c: authLog.text },
};

export const FILESYSTEMS: Record<string, FsDef> = { sudolog, pcap, hostsec, range, dfir2, kali, wargame, privesc, dfir, net, forensics, basics, logs, perms, recon, ssh, ctf, sandbox };
export type FsId = keyof typeof FILESYSTEMS;

export const CTF_FLAGS = [flag1, flag2, flag3];
