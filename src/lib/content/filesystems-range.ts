import type { FsDef } from "@/lib/shell/vfs";
import { sha256Hex } from "@/lib/shell/hash";
import type { RangeMachine } from "@/lib/shell/range";
import { authLog } from "./authlog";

/* Lab data for host hardening, the multi-machine range and the forensics integrity lab. Fictional systems only. */

export const hostsec: FsDef = {
  "/home/student/README.txt":
    "Linux host security lab (simulated).\nYou are 'student' with sudo rights. Use sudo for privileged commands.\n\nAccount audit questions: see the lesson.\nHardening tasks (type `labcheck` to see progress):\n  1. Firewall: default deny incoming, allow SSH (22) and HTTPS (443), enable it\n  2. Stop AND disable the unneeded services avahi-daemon and cups (keep sshd running)\n  3. Force jdoe to change passwords every 30 days, with a 14-day warning (chage -M 30 -W 14 jdoe)\n",
  "/etc/passwd": [
    "root:x:0:0:root:/root:/bin/bash",
    "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
    "student:x:1000:1000::/home/student:/bin/bash",
    "jdoe:x:1001:1001:John Doe:/home/jdoe:/bin/bash",
    "tempadmin:x:1002:1002:Temporary admin:/home/tempadmin:/bin/bash",
    "www-data:x:33:33::/var/www:/usr/sbin/nologin",
  ].join("\n") + "\n",
  "/etc/shadow": {
    c: [
      "root:$6$rs$aaaaaaaa:19000:0:99999:7:::",
      "daemon:*:19000:0:99999:7:::",
      "student:!:19000:0:99999:7:::",
      "jdoe:$6$js$bbbbbbbb:19000:0:99999:7:::",
      "tempadmin:$6$ts$cccccccc:19000:0:99999:7:::",
      "www-data:*:19000:0:99999:7:::",
    ].join("\n") + "\n",
    m: 0o640,
  },
};

export const RANGE_PASSWORD = "Forge-Lab-1!";

const webFs: FsDef = {
  "/home/student/notes.txt": "web01: public web server. Logs: /var/log/auth.log\n",
  "/etc/motd": "web01 - ACME Corp public web server (SIMULATED). Authorized users only.\n",
  "/var/log/auth.log": { c: authLog.text },
  "/var/www/html/index.html": { c: "<h1>ACME</h1>\n", o: "www-data" },
};

const dbFs: FsDef = {
  "/home/student/notes.txt": "db01: internal database server. Config: /etc/mysql/mysqld.cnf\n",
  "/etc/motd": "db01 - ACME Corp database server (SIMULATED). Internal use only.\n",
  "/etc/mysql/mysqld.cnf": "[mysqld]\nport = 3306\nbind-address = 0.0.0.0\nskip-name-resolve\nlocal-infile = 0\n",
};

export const range: FsDef = {
  "/home/student/README.txt":
    `Cyber range lab (simulated). You start on the admin workstation.\nMachines: web01 (web server), db01 (database server).\nLog in with:  ssh student@web01   (password for all lab machines: ${RANGE_PASSWORD})\nUse 'exit' to return. 'scp web01:/etc/motd motd.txt' copies a file back here.\n\nTasks:\n  1. On web01, find the IP address with the most failed SSH password attempts in /var/log/auth.log\n  2. On db01, find the risky network setting in /etc/mysql/mysqld.cnf (the bind-address value)\nSubmit both answers.\n`,
};

export const RANGE_MACHINES: Record<string, RangeMachine> = {
  web01: { fs: webFs, password: RANGE_PASSWORD },
  db01: { fs: dbFs, password: RANGE_PASSWORD },
};

/* ---- Forensics integrity lab: one evidence file was altered after its hash was recorded ---- */
const ev = {
  email: "From: alice@acme.example\nTo: bob@acme.example\nSubject: Q3 numbers\nBody: Attached are the final numbers.\n",
  browser: "2026-01-10 09:14 https://intranet.acme.example/reports\n2026-01-10 09:20 https://files.example.net/upload\n",
  notes: "Collected on a write-blocked copy. Analyst: student.\n",
};

export const dfir2: FsDef = {
  "/home/student/README.txt":
    "Evidence integrity drill. Hashes were recorded when the evidence was collected (recorded-hashes.txt).\nOne file was modified afterwards. Verify every file and submit the filename that no longer matches.\nTry: sha256sum -c recorded-hashes.txt\n",
  "/home/student/case/email_export.txt": ev.email,
  // This file was altered after collection (one URL changed), so its hash no longer matches.
  "/home/student/case/browser_history.txt": ev.browser.replace("files.example.net", "files.example.org"),
  "/home/student/case/notes.txt": ev.notes,
  "/home/student/case/recorded-hashes.txt":
    [
      `${sha256Hex(ev.email)}  email_export.txt`,
      `${sha256Hex(ev.browser)}  browser_history.txt`,
      `${sha256Hex(ev.notes)}  notes.txt`,
    ].join("\n") + "\n",
};
