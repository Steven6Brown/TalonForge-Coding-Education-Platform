import type { FsDef } from "@/lib/shell/vfs";

/* Second batch of lab filesystems (networking + incident response). Fictional data, RFC 5737 / 1918 addresses. */

export const net: FsDef = {
  "/home/student/README.txt":
    "A suspected malware beacon was reported. Your capture is ~/capture.txt (tcpdump-style text).\nQuestion: which internal host asked the DNS server (10.0.0.1) to resolve the suspicious domain evil-c2.example? Answer with the host IP.\n",
  "/home/student/capture.txt":
    [
      "12:00:01 IP 10.0.0.15.52311 > 10.0.0.1.53: A? www.example.com",
      "12:00:02 IP 10.0.0.22.40122 > 10.0.0.1.53: A? updates.example.org",
      "12:00:03 IP 10.0.0.31.51877 > 10.0.0.1.53: A? evil-c2.example",
      "12:00:03 IP 10.0.0.1.53 > 10.0.0.31.51877: A 203.0.113.66",
      "12:00:04 IP 10.0.0.31.44120 > 203.0.113.66.443: Flags [S]",
      "12:00:05 IP 10.0.0.15.52312 > 10.0.0.1.53: A? cdn.example.net",
      "12:00:09 IP 10.0.0.22.40123 > 198.51.100.10.80: Flags [S]",
    ].join("\n") + "\n",
};

export const forensics: FsDef = {
  "/home/student/README.txt":
    "Incident response drill. A server may have a backdoor account.\nQuestion: besides root, which account has UID 0 in /etc/passwd? Answer with the username.\nHint: the 3rd colon-separated field of /etc/passwd is the UID.\n",
  "/etc/passwd":
    [
      "root:x:0:0:root:/root:/bin/bash",
      "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
      "student:x:1000:1000::/home/student:/bin/bash",
      "backup2:x:0:0:backup:/root:/bin/bash",
      "www-data:x:33:33::/var/www:/usr/sbin/nologin",
    ].join("\n") + "\n",
  "/etc/crontab": "# m h dom mon dow user command\n17 * * * * root cd / && run-parts /etc/cron.hourly\n",
};
