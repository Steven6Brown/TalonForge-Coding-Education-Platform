import { c, type Scenario } from "./types";

/** More help desk scenarios, mostly beginner and intermediate. Written for someone doing this for the first time. */
export const HELPDESK2: Scenario[] = [
  {
    id: "hd-slow-computer", kind: "helpdesk", title: "\"My computer is really slow\"", priority: "P4", difficulty: "beginner",
    ticket: { id: "INC-20801", requester: "Alex Kim, Marketing", channel: "Chat" },
    summary: "A user says their laptop has become very slow over the last few days.",
    skills: ["Questioning", "Basic troubleshooting", "Closing the loop"],
    takeaways: ["Ask what 'slow' means and when it started before touching anything.", "Check the simple, common causes first: low disk space, too many startup programs, pending restarts and updates.", "Confirm the fix with the user and note what you did."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Alex", text: "\"My laptop has been super slow since last week. Can you fix it?\"", choices: [
        c("Ask what is slow (startup, browser, one program), when it began, whether anything changed, and when they last restarted.", 3, "technical", "s2", "Good questions turn a vague complaint into a testable problem."),
        c("Tell them to buy a new laptop.", 0, "service", "s2", "Not your call, and it skips diagnosis."),
        c("Reinstall Windows right away.", 1, "technical", "s2", "Drastic and risky: it can lose data. Diagnose first."),
      ] },
      s2: { id: "s2", who: "Alex", text: "\"Everything is slow, mostly after I log in. I haven't restarted in about three weeks. Lots of Chrome tabs open.\"", choices: [
        c("Have them restart, then check free disk space, startup programs and pending updates using Task Manager.", 3, "technical", "s3", "A long uptime, many tabs and slow login point at memory, startup load and pending updates."),
        c("Disable the antivirus to speed things up.", 0, "security", "s3", "Never turn off security software as a speed fix."),
        c("Ask them to close Chrome and call back later.", 1, "service", "s3", "A partial answer: you also want to look at the machine itself."),
      ] },
      s3: { id: "s3", who: "System", text: "After a restart, Task Manager shows disk at 96% full and 14 programs set to launch at startup.", choices: [
        c("Help them free space (Disk Cleanup, empty the Downloads folder with their OK) and disable unneeded startup items, then retest.", 3, "technical", "s4", "Targets the actual causes and keeps the user in control of their files."),
        c("Delete files you think are unused.", 0, "security", "s4", "Never delete a user's data without their permission."),
        c("Ignore the disk space and just clear the browser cache.", 1, "technical", "s4", "Minor help at best when the disk is nearly full."),
      ] },
      s4: { id: "s4", who: "You", text: "It's faster. How do you wrap up?", choices: [
        c("Confirm with Alex, explain a monthly restart habit, and note the findings and actions in the ticket.", 3, "documentation", "end", "Fix plus prevention plus a record."),
        c("Close the ticket without a word.", 1, "service", "end", "Always confirm and communicate."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Laptop fast again", summary: "Questions first, simple causes next, confirmed with the user." } },
    },
  },
  {
    id: "hd-no-internet", kind: "helpdesk", title: "\"I have no internet\"", priority: "P3", difficulty: "beginner",
    ticket: { id: "INC-20822", requester: "Jordan Blake, Front desk", channel: "Phone" },
    summary: "One workstation can't reach websites. Practice the network troubleshooting ladder.",
    skills: ["Network basics", "Layered troubleshooting", "Scope"],
    takeaways: ["Work bottom to top: cable or Wi-Fi, IP address, gateway, DNS, then the website itself.", "Check scope first: is it one machine, or everyone?", "Ping an IP address and a name: if the IP works and the name fails, it's DNS."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Jordan", text: "\"I can't open any websites. My coworker next to me is fine.\"", choices: [
        c("Note the scope (only this PC), then check the physical layer: network cable or Wi-Fi connected, link light, Wi-Fi turned on.", 3, "technical", "s2", "One affected machine means the problem is probably local. Start at the lowest layer."),
        c("Reboot the main router for the whole office.", 0, "technical", "s2", "Disruptive and unjustified: a coworker is working fine."),
        c("Tell them to wait an hour.", 1, "service", "s2", "Not troubleshooting."),
      ] },
      s2: { id: "s2", who: "Jordan", text: "\"The cable is plugged in and the light is on. Windows says 'Connected, no internet'.\"", choices: [
        c("Run ipconfig and read the IP address, gateway and DNS server.", 3, "technical", "s3", "ipconfig shows the settings your computer is actually using."),
        c("Reinstall the browser.", 1, "technical", "s3", "Every site fails, so the browser is unlikely."),
        c("Replace the network card.", 0, "technical", "s3", "Premature."),
      ] },
      s3: { id: "s3", who: "ipconfig", text: "IPv4 Address: 169.254.31.7. Default gateway: (blank).", evidence: "169.254.x.x is an 'APIPA' address: Windows gave itself one because it could not get an address from DHCP.", choices: [
        c("Recognize that DHCP failed, then run ipconfig /release and ipconfig /renew and check the switch port and cable.", 3, "technical", "s4", "A 169.254 address means no DHCP answer. Renewing and checking the link is the right step."),
        c("Assign a random static IP address and move on.", 0, "technical", "s4", "A wrong static address can cause IP conflicts and hides the real problem."),
        c("Change the DNS server to 8.8.8.8.", 1, "technical", "s4", "DNS isn't the issue: there is no address or gateway at all."),
      ] },
      s4: { id: "s4", who: "ipconfig", text: "After /renew the PC gets 192.168.1.57, gateway 192.168.1.1. Websites load.", choices: [
        c("Confirm with Jordan, note the cause (DHCP lease failure, fixed by renew) and watch for repeats.", 3, "documentation", "end", "Documented, confirmed, and you noted the pattern to watch."),
        c("Close the ticket silently.", 1, "service", "end", "Always confirm."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Back online", summary: "You walked up the layers and found a DHCP failure." } },
    },
  },
  {
    id: "hd-printer-one-user", kind: "helpdesk", title: "Can't print to the shared printer", priority: "P4", difficulty: "beginner",
    ticket: { id: "INC-20840", requester: "Sam Ortiz, Finance", channel: "Ticket" },
    summary: "One user can't print while others can.",
    skills: ["Scoping", "Driver and queue basics", "User communication"],
    takeaways: ["If others can print, the printer and server are fine, so look at the user's computer.", "Check the default printer, the print queue and the driver.", "Test with a test page so you know it's really fixed."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Sam", text: "\"My documents go to the printer but nothing comes out. Others are printing fine.\"", choices: [
        c("Check Sam's print queue for stuck jobs and confirm the right printer is selected as default.", 3, "technical", "s2", "The printer works for others, so start with this user's queue and settings."),
        c("Replace the printer.", 0, "technical", "s2", "It's working for everyone else."),
        c("Restart the print server for everyone.", 1, "technical", "s2", "Too broad for a one-user issue."),
      ] },
      s2: { id: "s2", who: "System", text: "There are 6 jobs stuck 'Error - printing' in Sam's queue, and the default printer is a PDF printer.", choices: [
        c("Clear the stuck jobs, set the correct default printer, and send a test page.", 3, "technical", "s3", "Fixes both causes and verifies."),
        c("Clear the jobs only.", 1, "technical", "s3", "New jobs would keep going to the wrong printer."),
      ] },
      s3: { id: "s3", who: "You", text: "The test page prints. What next?", choices: [
        c("Ask Sam to print the real document, confirm it works and document the cause.", 3, "documentation", "end", "Verified with the real task."),
        c("Close without asking.", 1, "service", "end", "You haven't confirmed the real document works."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Printing again", summary: "Local queue and default printer fixed and verified." } },
    },
  },
  {
    id: "hd-shared-folder", kind: "helpdesk", title: "Access denied to a shared folder", priority: "P3", difficulty: "intermediate",
    ticket: { id: "INC-20877", requester: "Riley Chen, Sales", channel: "Ticket" },
    summary: "A user gets 'Access denied' on a team folder. Practice permissions and least privilege.",
    skills: ["Permissions and groups", "Approvals", "Least privilege"],
    takeaways: ["Never grant access just because a user asks: confirm the data owner approves.", "Grant access through a group, not to an individual account, so it's manageable and auditable.", "Use the least access needed (read before write), and document who approved it."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Riley", text: "\"I need the Q4 pricing folder. It says access denied. My boss said it's fine, just add me!\"", choices: [
        c("Identify the folder's owner and ask for approval through the ticket, noting what access level Riley needs.", 3, "security", "s2", "Data owners approve access. 'My boss said' isn't a record."),
        c("Add Riley with full control right now.", 0, "security", "s_bad", "Unapproved and excessive access."),
        c("Tell Riley no access is possible.", 1, "service", "s2", "The answer should be 'here's the approval process', not 'no'."),
      ] },
      s_bad: { id: "s_bad", text: "Riley later deletes a shared pricing file by accident, and an audit finds the access was never approved.", end: { title: "Audit finding", summary: "Granting access without approval creates risk and audit failures." } },
      s2: { id: "s2", who: "Data owner", text: "\"Riley may view the pricing files but shouldn't edit them.\"", choices: [
        c("Add Riley to the existing 'Pricing-Read' group, which has read-only access, and record the approval.", 3, "security", "s3", "Group-based, read-only, approved and documented."),
        c("Give Riley's account Modify rights directly on the folder.", 1, "security", "s3", "Direct grants are hard to track, and Modify is more than approved."),
        c("Share the owner's password with Riley.", 0, "security", "s_bad", "Never share credentials."),
      ] },
      s3: { id: "s3", who: "You", text: "Riley still sees access denied after you add the group.", choices: [
        c("Explain that group changes apply at next sign-in, ask Riley to sign out and in (or restart), then retest.", 3, "technical", "end", "Group membership is read into the session token at login."),
        c("Add Riley to every group to be safe.", 0, "security", "end", "That is privilege creep."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Access granted correctly", summary: "Approved, least-privilege, group-based and documented." } },
    },
  },
  {
    id: "hd-lost-laptop", kind: "helpdesk", title: "Lost laptop report", priority: "P2", difficulty: "intermediate",
    ticket: { id: "INC-20902", requester: "Morgan Diaz, Consulting", channel: "Phone" },
    summary: "An employee left a work laptop in a taxi. Time matters.",
    skills: ["Incident response basics", "Escalation", "Device management"],
    takeaways: ["Treat a lost device as a security incident: report to security immediately.", "Use device management to lock, locate or remote-wipe, and confirm disk encryption status.", "Revoke sessions and reset credentials for the user, and record the timeline."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Morgan", text: "\"I left my work laptop in a taxi about 40 minutes ago. It has client files on it. I'm so sorry!\"", choices: [
        c("Stay calm and thank them for reporting quickly. Collect details (when, where, taxi company) and open a security incident right away.", 3, "security", "s2", "Fast reporting is what you want to encourage."),
        c("Scold them for being careless.", 0, "service", "s2", "Blame makes people hide incidents next time."),
        c("Wait to see if the taxi returns it.", 0, "security", "s2", "Delays increase risk."),
      ] },
      s2: { id: "s2", who: "You", text: "What technical action comes first?", choices: [
        c("Check the management console: is the disk encrypted, when did it last check in, then lock the device and revoke the user's active sessions and tokens.", 3, "technical", "s3", "Encryption status determines the risk, and locking and revoking limits exposure."),
        c("Immediately wipe it without checking.", 1, "technical", "s3", "A wipe may be right, but lock first, check encryption and follow the incident process (it may be needed as evidence or for recovery)."),
        c("Do nothing: the laptop has a password.", 0, "security", "s3", "A password alone isn't enough protection."),
      ] },
      s3: { id: "s3", who: "Console", text: "The laptop is encrypted (BitLocker), last seen 12 minutes ago on an unknown network.", choices: [
        c("Lock it, schedule a remote wipe when it next connects, reset Morgan's password, and escalate to security and the client-data owner for a notification decision.", 3, "security", "s4", "Layered response with the right people informed."),
        c("Leave it as is because it's encrypted.", 1, "security", "s4", "Encryption helps, but you still revoke access and report."),
      ] },
      s4: { id: "s4", who: "You", text: "Documentation?", choices: [
        c("Timeline, device details, encryption status, actions taken, who was notified, and the outcome.", 3, "documentation", "end", "Everything an auditor or manager would need."),
        c("\"Laptop lost, locked.\"", 1, "documentation", "end", "Too thin."),
      ] },
      end: { id: "end", text: "Escalated.", end: { title: "Lost device contained", summary: "Reported quickly, locked, credentials revoked, escalated." } },
    },
  },
  {
    id: "hd-ticket-writing", kind: "helpdesk", title: "Write a ticket someone else can use", priority: "P4", difficulty: "beginner",
    ticket: { id: "TRAIN-001", requester: "Training exercise", channel: "Ticket" },
    summary: "Practice the single most-used help desk skill: documenting an issue clearly.",
    skills: ["Documentation", "Prioritization", "Communication"],
    takeaways: ["A good ticket states who, what, when, impact, steps tried, and what you need next.", "Impact and urgency determine priority, not how loudly someone asks.", "Write for the next person who has never heard of the problem."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Scenario", text: "A caller says: \"Excel keeps crashing whenever I open the budget file. Started this morning. I've tried restarting. Other files open fine. I need it by 3pm.\" Which ticket summary line is best?", choices: [
        c("Excel crashes when opening Budget_2026.xlsx (other files OK), began this morning, restart tried, deadline 3pm.", 3, "documentation", "s2", "Specific, scoped and actionable."),
        c("Excel broken.", 0, "documentation", "s2", "Tells nobody anything."),
        c("User is annoyed, needs help fast!!!", 0, "documentation", "s2", "Emotion is not information."),
      ] },
      s2: { id: "s2", who: "Scenario", text: "How should you set the priority?", choices: [
        c("P3: one user, one file, workaround possible (copy or repair), with a same-day deadline noted.", 3, "documentation", "s3", "Priority follows impact and workaround, and the deadline is recorded."),
        c("P1: the caller is stressed.", 1, "documentation", "s3", "Stress is not business impact."),
        c("P4: no deadline matters.", 1, "documentation", "s3", "Ignoring a same-day deadline would frustrate the user."),
      ] },
      s3: { id: "s3", who: "Scenario", text: "You try opening the file in Safe Mode and it works, so an add-in is likely the cause. What do you write as next steps?", choices: [
        c("Opened in safe mode: OK. Suspect add-in. Next: disable add-ins one at a time and retest. User notified of ETA.", 3, "documentation", "end", "Findings, hypothesis, next step and communication."),
        c("Working on it.", 1, "documentation", "end", "No findings; the next person starts from zero."),
      ] },
      end: { id: "end", text: "Done.", end: { title: "Ticket ready for handoff", summary: "Clear summary, justified priority, recorded findings." } },
    },
  },
  {
    id: "hd-onsite-vs-remote", kind: "helpdesk", title: "Handling an angry user", priority: "P3", difficulty: "intermediate",
    ticket: { id: "INC-20933", requester: "Pat Nguyen, Operations", channel: "Phone" },
    summary: "A frustrated user's issue has already been bounced between teams.",
    skills: ["De-escalation", "Ownership", "Follow-up"],
    takeaways: ["Listen first, acknowledge the frustration, then restate the problem.", "Own the ticket: promise only what you can deliver and give a time for the next update.", "Follow up even when it is not fixed yet."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Pat", text: "\"This is the THIRD time I've called! Nobody fixes my VPN problem, you people are useless!\"", choices: [
        c("Let Pat finish, acknowledge the frustration, apologize for the runaround and restate the issue to confirm you understand.", 3, "service", "s2", "People calm down when they feel heard."),
        c("Say 'calm down, it's not my fault'.", 0, "service", "s2", "Defensive, and escalates the conflict."),
        c("Transfer the call immediately.", 0, "service", "s2", "Another bounce is exactly what Pat is angry about."),
      ] },
      s2: { id: "s2", who: "You", text: "Ticket history shows two earlier agents closed it as 'cannot reproduce'. What do you do?", choices: [
        c("Take ownership: read the history, reproduce with Pat on the call, and set a specific next update time.", 3, "service", "s3", "Ownership plus a concrete commitment."),
        c("Promise it'll be fixed today without checking.", 0, "service", "s3", "A promise you can't keep makes things worse."),
        c("Reopen the ticket and tell Pat to wait.", 1, "service", "s3", "Better than nothing, but no time commitment."),
      ] },
      s3: { id: "s3", who: "You", text: "You find the VPN profile on Pat's laptop is outdated and needs a reinstall that takes an hour.", choices: [
        c("Explain what you found in plain language, get Pat's OK on timing, perform the fix, and call back to confirm.", 3, "technical", "end", "Clear, consented, and followed up."),
        c("Reinstall it without telling Pat.", 1, "service", "end", "Always explain and get consent for changes."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Turned around a bad experience", summary: "Listened, owned it, fixed it and followed up." } },
    },
  },
];
