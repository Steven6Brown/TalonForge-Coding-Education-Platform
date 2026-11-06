import { c, type Hands, type Scenario } from "./types";
import type { Guide } from "./guides";
import { TRUTH } from "@/lib/siem/data";

/**
 * Hands-on scenarios: you run commands in a simulated terminal, change settings in a mock admin console,
 * write the ticket yourself, or search the SIEM for evidence. Everything is fictional and runs in the browser.
 */

const WIN = "C:\\Users\\you>";
const LIN = "support@server01:~$";

const winCmd = (example: string, does: string, pattern: string, output: string, id?: string, after?: string) => ({ example, does, pattern, output, id, after });

const NO_INTERNET: Hands = {
  tag: "technical", next: "s3",
  goal: "Find out why this PC has no internet, fix it, and prove it is fixed. Work like a technician: look at the address first.",
  hint: "Start with ipconfig to see the IP address. An address starting 169.254 means DHCP failed. Ask for a new address with ipconfig /renew, then run ipconfig again to check.",
  task: {
    kind: "terminal", os: "windows", prompt: WIN,
    required: ["ipconfig", "renew", "verify"],
    commands: [
      winCmd("ipconfig", "Show this computer's IP address and gateway.", "^ipconfig$", "Ethernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 169.254.31.7\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :\n\n(A 169.254.x.x address means Windows could not get an address from DHCP.)", "ipconfig"),
      winCmd("ipconfig /renew", "Ask the DHCP server for a new address.", "^ipconfig\\s+/renew$", "Renewing the address...\nEthernet adapter Ethernet: address renewed successfully.", "renew"),
      winCmd("ipconfig", "Check the address again.", "^ipconfig$", "Ethernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.57\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1\n\nLooks healthy: a real address and a gateway.", "verify", "renew"),
      winCmd("ping 192.168.1.1", "Test whether you can reach the router (gateway).", "^ping\\s+192\\.168\\.1\\.1$", "Request timed out.\nRequest timed out.\nRequest timed out.\nRequest timed out.\n\nNo reply: with no real address, the router can't be reached."),
      winCmd("ping 192.168.1.1", "Test the router again.", "^ping\\s+192\\.168\\.1\\.1$", "Reply from 192.168.1.1: bytes=32 time=1ms TTL=64\nReply from 192.168.1.1: bytes=32 time=1ms TTL=64", undefined, "renew"),
      winCmd("ping google.com", "Test internet and DNS.", "^ping\\s+google\\.com$", "Ping request could not find host google.com. Please check the name and try again.\n\n(There is nothing wrong with Google. This PC has no usable address yet.)"),
      winCmd("ping google.com", "Test internet and DNS again.", "^ping\\s+google\\.com$", "Reply from 142.250.80.46: bytes=32 time=12ms TTL=117", undefined, "renew"),
      winCmd("ipconfig /all", "Show every network setting (long output).", "^ipconfig\\s+/all$", "DHCP Enabled . . . . . . . . . . . : Yes\nDHCP Server . . . . . . . . . . . :\n(The DHCP server field is blank. No server answered.)"),
    ],
  },
};

const DNS_FAIL: Hands = {
  tag: "technical", next: "s3",
  goal: "Websites will not load, but a chat app still works. Use ping to decide whether the network or DNS is broken, then fix it.",
  hint: "Ping an IP address (8.8.8.8) first, then a name (example.com). If the IP works but the name doesn't, it's DNS. ipconfig /all shows the DNS server, and ipconfig /renew picks up the correct settings.",
  task: {
    kind: "terminal", os: "windows", prompt: WIN,
    required: ["pip", "pname", "ipall", "renew", "ok"],
    commands: [
      winCmd("ping 8.8.8.8", "Test reaching the internet by IP address (no DNS needed).", "^ping\\s+8\\.8\\.8\\.8$", "Reply from 8.8.8.8: bytes=32 time=14ms TTL=117\nReply from 8.8.8.8: bytes=32 time=13ms TTL=117\n\nThe connection to the internet works.", "pip"),
      winCmd("ping example.com", "Test a name, which needs DNS.", "^ping\\s+example\\.com$", "Ping request could not find host example.com. Please check the name and try again.", "pname"),
      winCmd("ipconfig /all", "Show all settings, including the DNS server.", "^ipconfig\\s+/all$", "IPv4 Address. . . . . : 192.168.1.44\nDefault Gateway. . . . : 192.168.1.1\nDNS Servers . . . . . . : 10.0.0.99\n\nThe DNS server 10.0.0.99 is an old server that no longer exists.", "ipall"),
      winCmd("nslookup example.com", "Ask the DNS server to look up a name.", "^nslookup\\s+example\\.com$", "DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  10.0.0.99\n*** Request to UnKnown timed out"),
      winCmd("ipconfig /flushdns", "Clear the DNS cache.", "^ipconfig\\s+/flushdns$", "Successfully flushed the DNS Resolver Cache.\n\n(Cleared the cache, but the PC still points at the dead DNS server.)"),
      winCmd("ipconfig /renew", "Get fresh settings (including DNS) from DHCP.", "^ipconfig\\s+/renew$", "Renewing...\nDNS Servers . . . . . . : 192.168.1.1\nSettings refreshed.", "renew"),
      winCmd("ping example.com", "Test the name again.", "^ping\\s+example\\.com$", "Reply from 93.184.216.34: bytes=32 time=18ms TTL=56\n\nNames resolve again.", "ok", "renew"),
    ],
  },
};

const DISK_FULL: Hands = {
  tag: "technical", next: "s3",
  goal: "A Linux web server says it is out of disk space. Find what is filling the disk and fix it safely without deleting anything important.",
  hint: "df -h shows how full each disk is. du -sh shows folder sizes so you can find the big one. Then rotate (compress and archive) the big log with logrotate instead of deleting it, and run df -h again to confirm.",
  task: {
    kind: "terminal", os: "linux", prompt: LIN,
    required: ["df", "du", "fix", "verify"],
    commands: [
      winCmd("df -h", "Show disk usage for each filesystem.", "^df\\s+-h$", "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        40G   40G     0 100% /", "df"),
      winCmd("du -sh /var/*", "Show how big each folder in /var is.", "^du\\s+-sh\\s+/var/\\*$", "120M    /var/cache\n 36G    /var/log\n 80M    /var/lib", "du"),
      winCmd("ls -lh /var/log/app", "List files in the app's log folder with sizes.", "^ls\\s+-lh\\s+/var/log/app$", "-rw-r--r-- 1 app app  35G Nov  6 09:02 app.log\n-rw-r--r-- 1 app app  14M Nov  5 00:00 app.log.1.gz"),
      winCmd("sudo logrotate -f /etc/logrotate.d/app", "Force a safe rotation: compress the old log and start a fresh one.", "^sudo\\s+logrotate\\s+-f\\s+/etc/logrotate\\.d/app$", "rotating log /var/log/app/app.log\ncompressing log with: /bin/gzip\nDone. The big log was compressed and a new empty one started.", "fix"),
      winCmd("df -h", "Check the disk again.", "^df\\s+-h$", "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        40G  9.4G   29G  25% /\n\nBack to a healthy level.", "verify", "fix"),
      winCmd("sudo rm -rf /var/log/*", "(Dangerous) delete every log.", "^sudo\\s+rm\\s+-rf\\s+/var/log", "Deleted... and now services are failing because their log files vanished, and you destroyed evidence needed for troubleshooting and audits. Never do this."),
    ],
  },
};

const consoleTask = (title: string, fields: Extract<Hands["task"], { kind: "console" }>["fields"]): Hands["task"] => ({ kind: "console", title, fields });

const PW_RESET: Hands = {
  tag: "security", next: "s3",
  goal: "You have verified the caller by calling back. Now fix the account in the admin console. Some options are traps.",
  hint: "A good reset: unlock the account, give a unique temporary password through a safe route, force a change at next sign-in, and never turn MFA off.",
  task: consoleTask("Admin console: user mlopez (Maria Lopez)", [
    { id: "unlock", label: "Unlock the account", type: "check", correct: true, why: "The account is locked, so it must be unlocked." },
    { id: "temp", label: "Set a unique temporary password", type: "check", correct: true, why: "She needs a new credential to get in." },
    { id: "force", label: "Require a password change at next sign-in", type: "check", correct: true, why: "You should not know her permanent password." },
    { id: "default", label: "Set the password to the company default 'Welcome1'", type: "check", correct: false, why: "Shared defaults are easy for attackers to guess." },
    { id: "mfa", label: "Disable MFA for this user", type: "check", correct: false, why: "Never weaken MFA to solve a lockout." },
    { id: "deliver", label: "Deliver the temporary password by", type: "select", options: ["Email to her personal address", "A self-service link to her registered company device", "A sticky note on her monitor"], correct: "A self-service link to her registered company device", why: "Only send credentials through a channel tied to her account." },
  ]),
};

const MFA_RESET: Hands = {
  tag: "security", next: "s3",
  goal: "Casey has a new phone and has been verified. Re-enrol MFA safely in the admin console.",
  hint: "Remove the lost phone, enrol the new one, give recovery codes, and never switch MFA off, even temporarily.",
  task: consoleTask("Admin console: user cpark (MFA devices)", [
    { id: "remove", label: "Remove the old phone's MFA registration", type: "check", correct: true, why: "The lost phone could still approve sign-ins." },
    { id: "enrol", label: "Have Casey enrol the new phone and test a sign-in", type: "check", correct: true, why: "Always test with the user while you are still on the call." },
    { id: "codes", label: "Generate recovery codes for Casey to store safely", type: "check", correct: true, why: "Backup codes prevent the next lockout." },
    { id: "off", label: "Turn MFA off for the account", type: "check", correct: false, why: "That leaves the account with only a password." },
    { id: "keep", label: "Leave the old phone registered as a backup", type: "check", correct: false, why: "A lost device should never remain trusted." },
  ]),
};

const GROUP_ACCESS: Hands = {
  tag: "security", next: "s3",
  goal: "The data owner approved READ-ONLY access to the Q4 pricing folder for Riley. Set it up the right way.",
  hint: "Use the read-only group, never give access directly to a person, record the approval, and remember group changes take effect at the next sign-in.",
  task: consoleTask("Admin console: folder Q4-Pricing, user rchen", [
    { id: "grp", label: "Add Riley to which group?", type: "select", options: ["Pricing-Read", "Pricing-Modify", "Domain Admins", "Everyone"], correct: "Pricing-Read", why: "Read-only matches what was approved (least privilege)." },
    { id: "direct", label: "Grant Riley's own account Modify rights directly on the folder", type: "check", correct: false, why: "Direct grants are hard to audit and exceed the approval." },
    { id: "approval", label: "Record the data owner's approval in the ticket", type: "check", correct: true, why: "An audit needs proof of who approved it." },
    { id: "signin", label: "Tell Riley to sign out and back in", type: "check", correct: true, why: "Group membership is applied when you sign in." },
  ]),
};

const TICKET: Hands = {
  tag: "documentation", next: "s3",
  goal: "Write the ticket for what just happened: Maria Lopez (Accounts Payable) called at 9:40 am. Her account was locked after 5 failed sign-ins. You verified her by calling back her directory number, unlocked the account, set a temporary password she must change, and she signed in successfully.",
  hint: "A strong ticket answers: who, what happened, when, how you verified identity, what you did, and the outcome. Write plain sentences; you do not need special formatting.",
  task: {
    kind: "ticket",
    fields: ["Summary (one line)", "What the user reported", "What you did", "Outcome and follow-up"],
    must: [
      { label: "Who the user is", keywords: ["maria", "lopez", "accounts payable"] },
      { label: "The symptom (locked out / failed sign-ins)", keywords: ["lock", "failed", "sign-in", "sign in", "login"] },
      { label: "When it happened", keywords: ["9:40", "9.40", "am", "morning"] },
      { label: "How identity was verified", keywords: ["verif", "callback", "called back", "call back", "directory"] },
      { label: "Actions taken (unlock, temporary password)", keywords: ["unlock", "temporary", "temp password", "reset"] },
      { label: "The outcome (confirmed working)", keywords: ["signed in", "sign in successfully", "resolved", "confirmed", "working", "fixed"] },
    ],
  },
};

const CONTAIN: Hands = {
  tag: "security", next: "s4",
  goal: "The IP 203.0.113.45 got in as admin on web-01. Choose the containment actions in the console. Some are harmful.",
  hint: "Block the attacker, cut off the account and its sessions, and keep the evidence. Do not wipe the server.",
  task: consoleTask("Response console: web-01 / admin", [
    { id: "ip", label: "Block 203.0.113.45 at the firewall", type: "check", correct: true, why: "Stops further access from that source." },
    { id: "acct", label: "Disable the admin account (or force a reset)", type: "check", correct: true, why: "The attacker knows the credentials." },
    { id: "sess", label: "Kill active sessions", type: "check", correct: true, why: "An open session keeps working after a password change." },
    { id: "logs", label: "Preserve logs and take a snapshot", type: "check", correct: true, why: "You need evidence for the investigation." },
    { id: "wipe", label: "Wipe and rebuild the server immediately", type: "check", correct: false, why: "That destroys evidence and may be unnecessary." },
  ]),
};

function siemScenario(opts: { id: string; title: string; summary: string; difficulty: Scenario["difficulty"]; alert: string; question: string; answers: string[]; hint: string; samples: string[]; priority: Scenario["priority"]; takeaways: string[]; verify: { text: string; right: string; why: string }; end: { title: string; summary: string } }): Scenario {
  return {
    id: opts.id, kind: "soc", title: opts.title, priority: opts.priority, difficulty: opts.difficulty,
    ticket: { id: "ALERT-" + (7000 + opts.id.length * 37), requester: "SIEM", channel: "SIEM" },
    summary: opts.summary, skills: ["SIEM searching", "Evidence gathering", "Triage"], takeaways: opts.takeaways,
    start: "s1",
    steps: {
      s1: { id: "s1", who: "SIEM alert", text: opts.alert, choices: [
        c("Search the SIEM to find the evidence myself before deciding.", 3, "technical", "s2", "Validate with evidence first."),
        c("Close it as noise.", 0, "security", "s2", "Never close without checking."),
      ] },
      s2: { id: "s2", who: "You", text: "Use the SIEM console below. The data is fictional but behaves like a real search tool.", hands: { tag: "technical", next: "s3", goal: opts.question, hint: opts.hint, task: { kind: "siem", question: opts.question, answers: opts.answers, samples: opts.samples } } },
      s3: { id: "s3", who: "You", text: opts.verify.text, choices: [
        c(opts.verify.right, 3, "security", "end", opts.verify.why),
        c("Take no action until tomorrow.", 0, "security", "end", "Active threats need action now."),
      ] },
      end: { id: "end", text: "Done.", end: opts.end },
    },
  };
}

export const HANDSON: Scenario[] = [
  {
    id: "hd-lab-no-internet", kind: "helpdesk", title: "Lab: Fix a PC with no internet", priority: "P3", difficulty: "beginner",
    ticket: { id: "LAB-101", requester: "Jordan Blake, Front desk", channel: "Phone" },
    summary: "Run real network commands in a simulated Windows prompt to find and fix the problem.",
    skills: ["ipconfig", "Reading an IP address", "DHCP", "Verifying a fix"],
    takeaways: ["Look at the IP address first: 169.254.x.x means DHCP failed.", "ipconfig /renew asks for a fresh address; always re-check afterwards.", "Test in order: address, router, then internet by name."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Jordan", text: "\"I can't open any website. The cable is plugged in and my coworker is fine.\" What do you do first?", choices: [
        c("Open a command prompt on Jordan's PC and look at the network settings.", 3, "technical", "s2", "Look at the facts the PC can show you."),
        c("Restart the office router.", 0, "technical", "s2", "A coworker is fine, so the router is not the problem."),
      ] },
      s2: { id: "s2", who: "Remote session", text: "You are connected to Jordan's PC. Use the terminal.", hands: NO_INTERNET },
      s3: { id: "s3", who: "You", text: "The PC is back online. What now?", choices: [
        c("Confirm with Jordan and document the cause and fix.", 3, "documentation", "end", "Verified and documented."),
        c("Close without telling Jordan.", 1, "service", "end", "Always confirm."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Back online", summary: "You diagnosed and fixed it with real commands." } },
    },
  },
  {
    id: "hd-lab-dns-fail", kind: "helpdesk", title: "Lab: Websites down but chat works (DNS)", priority: "P3", difficulty: "intermediate",
    ticket: { id: "LAB-102", requester: "Priya Shah, HR", channel: "Chat" },
    summary: "Decide whether the network or DNS is at fault using ping, ipconfig and nslookup.",
    skills: ["ping", "DNS troubleshooting", "ipconfig /all", "nslookup"],
    takeaways: ["Ping an IP first, then a name. IP works and name fails means DNS.", "ipconfig /all shows the DNS server the PC is really using.", "Fix the cause (bad DNS setting), not just the symptom, and verify."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Priya", text: "\"Chat works but every website says 'server not found'.\" What does that suggest?", choices: [
        c("The connection works but name lookup (DNS) may be failing. Test with ping.", 3, "technical", "s2", "Great deduction: chat apps often use IP addresses already known."),
        c("The internet is completely down.", 1, "technical", "s2", "Chat working proves the connection is up."),
      ] },
      s2: { id: "s2", who: "Remote session", text: "Use the terminal to prove which layer is broken and fix it.", hands: DNS_FAIL },
      s3: { id: "s3", who: "You", text: "Websites load again.", choices: [
        c("Confirm with Priya, document the old DNS server found, and tell the network team to check for other devices still using it.", 3, "documentation", "end", "You fixed it and prevented repeats."),
        c("Close the ticket.", 1, "service", "end", "Other devices may share the bad setting."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "DNS fixed", summary: "Narrowed it down with ping and fixed the DNS server setting." } },
    },
  },
  {
    id: "hd-lab-disk-full", kind: "helpdesk", title: "Lab: Linux server out of disk space", priority: "P2", difficulty: "intermediate",
    ticket: { id: "LAB-103", requester: "Monitoring alert", channel: "Alert" },
    summary: "Use df, du and logrotate in a simulated Linux terminal to find and fix a full disk safely.",
    skills: ["df and du", "Log management", "Safe fixes"],
    takeaways: ["df -h tells you which disk is full; du -sh tells you what's using it.", "Rotate or archive logs instead of deleting them.", "Verify with df -h and avoid destructive commands like rm -rf on system folders."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Alert", text: "web01 root disk at 100%. The site is returning errors. What is your first move?", choices: [
        c("Log in and check which disk is full and what is using the space.", 3, "technical", "s2", "Diagnose before you delete."),
        c("Delete random large files.", 0, "technical", "s2", "Could break the server or destroy evidence."),
      ] },
      s2: { id: "s2", who: "SSH session", text: "You are logged in to web01. Use the terminal.", hands: DISK_FULL },
      s3: { id: "s3", who: "You", text: "Disk is at 25%. What else should you do?", choices: [
        c("Note the cause, and ask the owner to set up log rotation and a disk alert at 80% so it doesn't happen again.", 3, "documentation", "end", "Prevention plus documentation."),
        c("Nothing. It's fixed.", 1, "documentation", "end", "It will fill up again without a root-cause fix."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Server healthy", summary: "Found the log, rotated it safely and verified." } },
    },
  },
  {
    id: "hd-lab-password-reset", kind: "helpdesk", title: "Lab: Reset a locked account in the admin console", priority: "P3", difficulty: "beginner",
    ticket: { id: "LAB-104", requester: "Maria Lopez, Accounts Payable", channel: "Phone" },
    summary: "Verify the caller, then actually change the account settings in a mock admin console.",
    skills: ["Account unlock", "Temporary passwords", "MFA safety"],
    takeaways: ["Verify first, then unlock, set a unique temporary password and force a change.", "Deliver credentials only through a trusted channel.", "Never disable MFA to fix a lockout."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Maria", text: "\"I'm locked out and in a hurry!\" What do you do before touching the account?", choices: [
        c("Verify her identity by calling back the number in the directory.", 3, "security", "s2", "Always verify first."),
        c("Reset it right away.", 0, "security", "s2", "Urgency is a classic social-engineering pressure."),
      ] },
      s2: { id: "s2", who: "Admin console", text: "Verification passed. Make the changes in the console.", hands: PW_RESET },
      s3: { id: "s3", who: "You", text: "She is back in.", choices: [
        c("Document how you verified her and what you changed.", 3, "documentation", "end", "Audit-ready."),
        c("Close the ticket as 'fixed'.", 1, "documentation", "end", "Too thin."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Account restored", summary: "Correct settings, safely delivered." } },
    },
  },
  {
    id: "hd-lab-mfa-reset", kind: "helpdesk", title: "Lab: Re-enrol MFA on a new phone", priority: "P3", difficulty: "beginner",
    ticket: { id: "LAB-105", requester: "Casey Park, Legal", channel: "Phone" },
    summary: "Use the admin console to move MFA to a new phone without weakening security.",
    skills: ["MFA management", "Device removal", "Recovery codes"],
    takeaways: ["Remove the lost device first.", "Test the new device with the user.", "Never turn MFA off, even temporarily."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Casey", text: "\"New phone, no codes. Turn MFA off for me!\" How do you respond?", choices: [
        c("Verify identity, then re-enrol MFA on the new phone rather than turning it off.", 3, "security", "s2", "Right approach."),
        c("Turn it off for the day.", 0, "security", "s2", "Leaves the account password-only."),
      ] },
      s2: { id: "s2", who: "Admin console", text: "Casey is verified. Update the MFA settings.", hands: MFA_RESET },
      s3: { id: "s3", who: "You", text: "Casey signs in with the new phone.", choices: [
        c("Document the verification and actions.", 3, "documentation", "end", "Complete record."),
        c("Skip the note.", 1, "documentation", "end", "No audit trail."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "MFA restored", summary: "Old device removed, new one tested." } },
    },
  },
  {
    id: "hd-lab-group-access", kind: "helpdesk", title: "Lab: Grant folder access with groups", priority: "P3", difficulty: "intermediate",
    ticket: { id: "LAB-106", requester: "Riley Chen, Sales", channel: "Ticket" },
    summary: "Apply an approved, least-privilege access request in a mock admin console.",
    skills: ["Security groups", "Least privilege", "Approvals"],
    takeaways: ["Use groups, not direct user grants.", "Give only the approved access level.", "Record the approval in the ticket."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Riley", text: "\"My boss said I can see the pricing folder.\" What do you need before changing anything?", choices: [
        c("Approval from the data owner, recorded in the ticket.", 3, "security", "s2", "Data owners approve access."),
        c("Nothing. Just add Riley.", 0, "security", "s2", "Unapproved access is a policy failure."),
      ] },
      s2: { id: "s2", who: "Admin console", text: "The data owner approved read-only access. Configure it.", hands: GROUP_ACCESS },
      s3: { id: "s3", who: "You", text: "Riley can open the folder.", choices: [
        c("Confirm with Riley and close with the approval referenced.", 3, "documentation", "end", "Verified and documented."),
        c("Close without checking.", 1, "service", "end", "Always confirm."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Access granted correctly", summary: "Least privilege, group-based, approved." } },
    },
  },
  {
    id: "hd-lab-write-ticket", kind: "helpdesk", title: "Lab: Write the ticket", priority: "P4", difficulty: "beginner",
    ticket: { id: "LAB-107", requester: "Training", channel: "Ticket" },
    summary: "You handled a call. Now write the ticket yourself and get it checked against what a good ticket must contain.",
    skills: ["Documentation", "Clear writing"],
    takeaways: ["A good ticket covers who, what, when, verification, actions and outcome.", "Write for the next person who has never heard of the problem.", "Specific beats vague."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "You", text: "You just finished a call and your manager says tickets are audited. Why is the ticket so important?", choices: [
        c("It's the record that lets someone else continue the work and proves you followed procedure.", 3, "documentation", "s2", "Exactly."),
        c("It isn't. Only the fix matters.", 0, "documentation", "s2", "Undocumented work is invisible and unauditable."),
      ] },
      s2: { id: "s2", who: "Ticket form", text: "Fill in the ticket from the facts you were given.", hands: TICKET },
      s3: { id: "s3", who: "You", text: "Ticket saved.", choices: [c("Move on to the next one.", 3, "service", "end", "Good habits compound.")] },
      end: { id: "end", text: "Done.", end: { title: "Ticket written", summary: "You documented a call so anyone could pick it up." } },
    },
  },
  siemScenario({
    id: "soc-lab-brute-force", title: "Lab: Investigate a brute-force alert in the SIEM", summary: "Search the logs yourself to find the attacker and the compromised account, then contain it.", difficulty: "intermediate", priority: "P2",
    alert: "Rule fired: many failed logins, then a success, on web-01. Find the attacking IP and the account it logged in as.",
    question: "Which source IP had the most failed logins, and which username did it finally log in as? (Answer 1: the IP. Answer 2: the username.)",
    answers: [TRUTH.topFailureIp, TRUTH.compromisedUser],
    hint: "Search: source=auth action=failure | stats count by src_ip | sort -count. Then: source=auth action=success src_ip=<that IP>.",
    samples: ["source=auth action=failure | stats count by src_ip | sort -count"],
    takeaways: ["Rank sources, then pivot on the top one.", "The success after many failures is the moment of compromise.", "Contain, preserve evidence, then scope."],
    verify: { text: "You found the attacker and the account. What is the best response?", right: "Block the IP, disable the account and kill sessions, preserve logs, and escalate to incident response.", why: "Contain quickly while preserving evidence." },
    end: { title: "Attack contained", summary: "You found the evidence yourself and contained it." },
  }),
  siemScenario({
    id: "soc-lab-dns-beacon", title: "Lab: Find the infected host from DNS logs", summary: "Search DNS events to find which host is beaconing to a rare domain.", difficulty: "intermediate", priority: "P2",
    alert: "Rule fired: periodic DNS queries to update-check.example-cdn.net. Which host is infected?",
    question: "Which host queried update-check.example-cdn.net the most times?",
    answers: [TRUTH.beaconHost],
    hint: "Search: source=dns query=update-check.example-cdn.net | stats count by host",
    samples: ["source=dns | top 5 query", "source=dns query=update-check.example-cdn.net | stats count by host"],
    takeaways: ["Regular timing to a rare domain suggests beaconing.", "Count by host to find the infected machine.", "Isolate the host, then hunt for the domain elsewhere."],
    verify: { text: "You found the host. What is the best next step?", right: "Isolate the host with EDR, block the domain, collect evidence and escalate.", why: "Contain and investigate without destroying evidence." },
    end: { title: "Beacon contained", summary: "You identified the infected host from the logs." },
  }),
  siemScenario({
    id: "soc-lab-exfil", title: "Lab: Which host is leaking data?", summary: "Use firewall byte counts to find the host sending the most data out.", difficulty: "intermediate", priority: "P1",
    alert: "Rule fired: large outbound transfer. Which host sent the most data out?",
    question: "Which host sent the most outbound bytes?",
    answers: [TRUTH.exfilHost],
    hint: "Search: source=firewall | stats sum(bytes_out) as total by host | sort -total",
    samples: ["source=firewall | stats sum(bytes_out) as total by host | sort -total"],
    takeaways: ["Compare against the baseline for each host.", "Database servers should send little data out.", "Declare an incident when the transfer is unexplained."],
    verify: { text: "It is unexplained and the host holds sensitive data. What do you do?", right: "Declare a P1 incident, block the destination, preserve evidence and notify the incident commander and data owner.", why: "Potential data loss is a major incident." },
    end: { title: "Exfiltration escalated", summary: "You found the leaking host and escalated correctly." },
  }),
  {
    id: "soc-lab-contain", kind: "soc", title: "Lab: Contain a compromised web server", priority: "P1", difficulty: "advanced",
    ticket: { id: "LAB-201", requester: "Incident commander", channel: "IR" },
    summary: "An attacker is in as admin. Choose the correct containment actions in the response console.",
    skills: ["Containment", "Evidence preservation", "Proportional response"],
    takeaways: ["Cut off the source, the account and the sessions.", "Preserve logs and snapshots before rebuilding.", "Don't wipe first: it destroys the evidence."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Incident commander", text: "\"203.0.113.45 is logged in to web-01 as admin right now. Contain it.\"", hands: CONTAIN },
      s4: { id: "s4", who: "You", text: "Containment applied. What next?", choices: [
        c("Scope other hosts and accounts for the same IP, check for persistence, and brief the incident commander.", 3, "security", "end", "Scoping is the next phase."),
        c("Close the incident.", 0, "security", "end", "It isn't over until scope and root cause are known."),
      ] },
      end: { id: "end", text: "Done.", end: { title: "Contained", summary: "Right actions in the right order." } },
    },
  },
];

const T = {
  ip: { term: "IP address", def: "A number that identifies a device on a network, like 192.168.1.57." },
  dhcp: { term: "DHCP", def: "The service that automatically gives devices an IP address and settings." },
  dns: { term: "DNS", def: "Turns names like example.com into IP addresses." },
  cmd: { term: "Command prompt / terminal", def: "A text window where you type commands. You type a command, press Enter and read the output." },
  console: { term: "Admin console", def: "The management screen IT uses to change accounts, groups and devices." },
  mfa: { term: "MFA", def: "A second proof of identity, such as a code from an app." },
  ticket: { term: "Ticket", def: "The written record of a problem: who, what, when, what was done and the outcome." },
  siem: { term: "SIEM", def: "A tool that collects logs from many systems and lets you search them." },
};

export const GUIDES_HANDSON: Record<string, Guide> = {
  "hd-lab-no-internet": { objective: "Use ipconfig and ping to find and fix a PC with no internet.", primer: [T.cmd, T.ip, T.dhcp, { term: "ping", def: "Sends a small test message to another device and shows whether it answers." }, { term: "ipconfig", def: "A Windows command that shows your IP address, gateway and DNS settings." }], coach: { s1: "A good technician looks at what the computer itself reports instead of guessing." } },
  "hd-lab-dns-fail": { objective: "Tell a DNS problem from a network problem using ping.", primer: [T.cmd, T.dns, T.ip, { term: "nslookup", def: "A command that asks a DNS server to look up a name." }], coach: { s1: "If chat works, the connection is up. What else do websites need that chat might not?" } },
  "hd-lab-disk-full": { objective: "Find what fills a Linux disk and free space safely.", primer: [T.cmd, { term: "df -h", def: "Disk Free: shows how full each disk is, in human-readable sizes." }, { term: "du -sh", def: "Disk Usage: shows how large folders are." }, { term: "Log rotation", def: "Compressing and archiving old logs so they don't grow forever." }, { term: "sudo", def: "Runs a command with administrator rights." }], coach: { s1: "Always diagnose before deleting. What two questions do you need answered?" } },
  "hd-lab-password-reset": { objective: "Reset a locked account safely in an admin console.", primer: [T.console, T.mfa, T.ticket, { term: "Temporary password", def: "A one-time password the user must change at their first sign-in." }], coach: { s1: "Why would an attacker want you to skip verification?" } },
  "hd-lab-mfa-reset": { objective: "Move MFA to a new phone without weakening security.", primer: [T.console, T.mfa, { term: "Recovery codes", def: "One-time backup codes used if the MFA device is unavailable." }], coach: { s1: "Is turning MFA off ever a good fix? What does it leave behind?" } },
  "hd-lab-group-access": { objective: "Grant approved, least-privilege access using groups.", primer: [T.console, { term: "Security group", def: "A named set of users that you grant access to, instead of granting each person directly." }, { term: "Least privilege", def: "Only the access needed, nothing more." }, { term: "Data owner", def: "The person who decides who may access a set of data." }], coach: { s1: "Whose permission do you need before sharing someone else's data?" } },
  "hd-lab-write-ticket": { objective: "Write a ticket someone else can use.", primer: [T.ticket, { term: "Audit", def: "A review that checks work was done according to the rules." }], coach: { s1: "Imagine a colleague opens this tomorrow knowing nothing. What would they need?" } },
  "soc-lab-brute-force": { objective: "Find an attack yourself in SIEM data.", primer: [T.siem, { term: "stats count by", def: "A search command that counts events grouped by a field, such as src_ip." }, { term: "Pivot", def: "Using something you found as the next search term." }], coach: { s1: "Evidence first. Where would you look to find who is hitting the server?" } },
  "soc-lab-dns-beacon": { objective: "Identify an infected host from DNS logs.", primer: [T.siem, T.dns, { term: "Beaconing", def: "Malware contacting its controller on a regular timer." }], coach: { s1: "Which host is making the suspicious lookups, and how many?" } },
  "soc-lab-exfil": { objective: "Find which host is sending out the most data.", primer: [T.siem, { term: "Exfiltration", def: "Attackers copying data out of your network." }, { term: "Baseline", def: "What is normal for a system." }], coach: { s1: "A search that adds up bytes per host and sorts the biggest first will show it." } },
  "soc-lab-contain": { objective: "Choose containment actions that stop an attacker without destroying evidence.", primer: [{ term: "Containment", def: "Limiting an attack's damage, such as blocking an IP or disabling an account." }, { term: "Session", def: "A logged-in connection. It can keep working after a password change." }, { term: "Evidence preservation", def: "Keeping logs and system state so investigators can learn what happened." }], coach: { s1: "Think: stop the source, stop the account, stop the open sessions, keep the evidence." } },
};
