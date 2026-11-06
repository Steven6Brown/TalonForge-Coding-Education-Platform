import type { FsDef } from "@/lib/shell/vfs";

const sudo = (date: string, time: string, user: string, cmd: string) =>
  `${date} ${time} host sudo: ${user} : TTY=pts/0 ; PWD=/home/${user} ; USER=root ; COMMAND=${cmd}`;

/** Fictional auth log mixing sudo and sshd lines (used for Linux log-analysis practice). */
export const sudolog: FsDef = {
  "/home/student/README.txt":
    "Log triage drill on ~/access1.log (fictional).\nQ1: how many sudo entries did harrypotter make in April?\nQ2: which user ran sudo the most overall?\nTools: grep, grep -c, awk '{print $6}', sort, uniq -c, sort -rn\n",
  "/home/student/access1.log":
    [
      sudo("Apr 02", "08:01:11", "harrypotter", "/bin/ls"),
      "Apr 02 08:05:40 host sshd[311]: Accepted password for jabber from 89.11.192.14 port 51220 ssh2",
      sudo("Apr 05", "09:15:02", "hermione", "/usr/bin/apt update"),
      sudo("Apr 07", "10:22:45", "harrypotter", "/bin/cat /etc/hosts"),
      sudo("Apr 12", "14:30:09", "harrypotter", "/usr/bin/systemctl status ssh"),
      "Apr 12 14:41:02 host sshd[402]: Accepted password for jabber from 89.11.192.20 port 51888 ssh2",
      sudo("Apr 15", "16:02:33", "hermione", "/bin/ls /root"),
      sudo("Apr 21", "07:55:18", "harrypotter", "/usr/bin/vim /etc/fstab"),
      sudo("Apr 28", "18:10:50", "hermione", "/usr/bin/tail /var/log/syslog"),
      sudo("Apr 29", "19:20:01", "harrypotter", "/bin/df -h"),
      "Apr 30 21:00:13 host sshd[512]: Failed password for root from 203.0.113.9 port 40111 ssh2",
      sudo("May 03", "08:00:00", "harrypotter", "/bin/ls"),
      sudo("May 09", "11:11:11", "harrypotter", "/usr/bin/apt upgrade"),
    ].join("\n") + "\n",
};
