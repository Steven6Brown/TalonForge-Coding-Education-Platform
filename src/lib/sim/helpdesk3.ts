import { c, type Scenario } from "./types";
import type { Guide } from "./guides";

/** Third batch of help desk scenarios: more beginner practice plus the first advanced ones. */
export const HELPDESK3: Scenario[] = [
  {
    id: "hd-mfa-new-phone", kind: "helpdesk", title: "New phone, MFA codes gone", priority: "P3", difficulty: "beginner",
    ticket: { id: "INC-21010", requester: "Casey Park, Legal", channel: "Phone" },
    summary: "A user replaced their phone and can no longer approve sign-in prompts.",
    skills: ["MFA recovery", "Identity verification", "Documentation"],
    takeaways: ["MFA resets are high-risk: verify identity as strongly as for a password reset, or stronger.", "Remove the old device registration, enrol the new one and test it with the user.", "Never turn MFA off 'temporarily' to make life easier."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Casey", text: "\"I got a new phone and my authenticator app is empty. I can't sign in to anything. Can you just turn MFA off for me?\"", choices: [
        c("Explain that you can reset MFA but must verify identity first, then follow the standard verification steps.", 3, "security", "s2", "Empathy plus process. Turning MFA off removes the protection attackers hit hardest."),
        c("Turn MFA off for a day so Casey can work.", 0, "security", "s_bad", "That leaves the account protected by a password alone."),
        c("Tell Casey to wait for their old phone.", 1, "service", "s2", "Unhelpful: there is a standard reset path."),
      ] },
      s_bad: { id: "s_bad", text: "An attacker who already had Casey's password signs in during the window.", end: { title: "Account compromised", summary: "A temporary MFA bypass is still a bypass." } },
      s2: { id: "s2", who: "You", text: "How do you verify Casey?", choices: [
        c("Call back on the directory number and get manager confirmation in the ticket.", 3, "security", "s3", "Two independent channels the caller does not control."),
        c("Ask for the employee ID.", 1, "security", "s3", "Employee IDs are easy to learn."),
      ] },
      s3: { id: "s3", who: "You", text: "Verified. What is the correct fix?", choices: [
        c("Remove the old device registration, then have Casey enrol the new phone and test a sign-in while you stay on the line.", 3, "technical", "s4", "Old device removed, new one enrolled and tested."),
        c("Add the new phone but leave the old one registered.", 1, "security", "s4", "The lost phone could still approve prompts."),
      ] },
      s4: { id: "s4", who: "You", text: "Finish up.", choices: [
        c("Document verification, actions and test result, and remind Casey to save recovery codes somewhere safe.", 3, "documentation", "end", "Complete and prevents the next lockout."),
        c("Close the ticket.", 1, "documentation", "end", "Missing the audit trail."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "MFA restored", summary: "Verified, re-enrolled and documented." } },
    },
  },
  {
    id: "hd-software-request", kind: "helpdesk", title: "\"Please install this free tool\"", priority: "P4", difficulty: "beginner",
    ticket: { id: "REQ-5603", requester: "Dev Patel, Design", channel: "Ticket" },
    summary: "A user wants a free PDF converter they found online installed on their work computer.",
    skills: ["Software policy", "Risk awareness", "Offering alternatives"],
    takeaways: ["Unapproved software can contain malware or leak data, so route requests through the approval process.", "Look for an approved tool that does the same job before saying no.", "Explain the why in plain language."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Dev", text: "\"Can you install FastPDF-Free? I need to merge PDFs today. It's from a site that looks legit.\"", choices: [
        c("Ask what Dev needs to do, and check the approved software catalog for a tool that merges PDFs.", 3, "service", "s2", "Solve the real need safely."),
        c("Install it, it's only a PDF tool.", 0, "security", "s_bad", "Free installers often bundle malware."),
        c("Say no and close the ticket.", 1, "service", "s2", "Safe but leaves Dev stuck."),
      ] },
      s_bad: { id: "s_bad", text: "The installer included a keylogger. Security finds it a week later.", end: { title: "Malware installed", summary: "Unvetted software is a common infection path." } },
      s2: { id: "s2", who: "Catalog", text: "The company licenses Acrobat, which merges PDFs.", choices: [
        c("Install or enable the approved tool and show Dev how to merge files.", 3, "service", "s3", "Need met, risk avoided, user helped."),
        c("Tell Dev to look for it themselves.", 1, "service", "s3", "Technically correct, not helpful."),
      ] },
      s3: { id: "s3", who: "You", text: "How do you explain the decision?", choices: [
        c("In simple terms: unknown installers can hide malware, so we use vetted tools. Mention the request path for future software.", 3, "service", "end", "Respectful and educational."),
        c("Because policy says so.", 1, "service", "end", "True, but not persuasive."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Need solved safely", summary: "Approved tool provided, risk explained." } },
    },
  },
  {
    id: "hd-guest-wifi", kind: "helpdesk", title: "Guest Wi-Fi for a visitor", priority: "P4", difficulty: "beginner",
    ticket: { id: "REQ-5644", requester: "Reception", channel: "Chat" },
    summary: "A client visiting today asks to join the office network.",
    skills: ["Network segmentation", "Policy", "Customer service"],
    takeaways: ["Visitors get the guest network, not the corporate one.", "Guest Wi-Fi is separated from internal systems so a visitor's device can't reach company data.", "Be friendly: it is a service request, not a threat."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Reception", text: "\"Our client needs Wi-Fi for a presentation. Can you give them the staff password?\"", choices: [
        c("Offer the guest network, with its own password or voucher, and explain it is separate from the staff network.", 3, "security", "s2", "Right tool for a visitor."),
        c("Give the staff Wi-Fi password.", 0, "security", "s2", "Gives an unmanaged device access to internal systems."),
        c("Refuse any Wi-Fi.", 1, "service", "s2", "Overly strict. A guest network exists for this."),
      ] },
      s2: { id: "s2", who: "Reception", text: "\"The guest Wi-Fi connects but the client can't open the company's shared presentation site.\"", choices: [
        c("Explain that guests are blocked from internal sites by design, and suggest the client emails the file or uses an approved sharing link.", 3, "technical", "end", "The block is a feature, and there is a safe workaround."),
        c("Open the firewall for the guest network.", 0, "security", "end", "Defeats the separation."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Visitor connected safely", summary: "Guest network used, segmentation kept." } },
    },
  },
  {
    id: "hd-mailbox-full", kind: "helpdesk", title: "Mailbox full, can't send email", priority: "P4", difficulty: "beginner",
    ticket: { id: "INC-21044", requester: "Lee Romano, Procurement", channel: "Phone" },
    summary: "A user gets a 'mailbox full' warning and mail stops arriving.",
    skills: ["Reading error messages", "Mailbox management", "Teaching"],
    takeaways: ["Read the exact error message to the user and confirm what it says.", "Show the user how to find large items instead of deleting for them.", "Archiving beats deleting if records may be needed."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Lee", text: "\"Outlook says my mailbox is full and I can't send anything.\"", choices: [
        c("Ask Lee to read the exact message, then check the mailbox size and quota in the admin portal.", 3, "technical", "s2", "Facts before action."),
        c("Increase the quota to unlimited.", 1, "technical", "s2", "May break policy and hides the cause."),
        c("Delete old emails yourself.", 0, "security", "s2", "Never delete a user's mail without permission."),
      ] },
      s2: { id: "s2", who: "Portal", text: "Mailbox: 49.8 of 50 GB. Largest folder: Sent Items with large attachments.", choices: [
        c("Guide Lee to sort by size, archive old attachments to an archive file or folder and empty Deleted Items, with Lee choosing what to move.", 3, "technical", "s3", "Lee stays in control and learns for next time."),
        c("Empty the whole mailbox.", 0, "security", "s3", "Could destroy business records."),
      ] },
      s3: { id: "s3", who: "You", text: "Space is freed and mail flows again.", choices: [
        c("Confirm Lee can send and receive, note the cause, and share tips on archiving.", 3, "documentation", "end", "Verified, recorded and prevented."),
        c("Close it.", 1, "service", "end", "Always confirm."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Mail flowing", summary: "Cause found, user taught, outcome verified." } },
    },
  },
  {
    id: "hd-found-usb", kind: "helpdesk", title: "A USB drive found in the parking lot", priority: "P3", difficulty: "intermediate",
    ticket: { id: "INC-21102", requester: "Facilities", channel: "Phone" },
    summary: "A staff member found a USB drive labelled 'Payroll Q3' and wants to plug it in to find the owner.",
    skills: ["Threat recognition", "Physical security", "Escalation"],
    takeaways: ["Never plug in an unknown USB drive: attackers drop them on purpose (baiting).", "Handle it as potential evidence and hand it to security.", "Thank the person: reporting was the right instinct."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Facilities", text: "\"We found a USB stick in the lot labelled 'Payroll Q3'. Can I plug it into my computer to see whose it is?\"", choices: [
        c("Tell them not to plug it in, explain why, and ask them to keep it safe until security collects it.", 3, "security", "s2", "Baiting attacks rely on curiosity. The label is part of the bait."),
        c("Say it's fine on a non-work PC.", 0, "security", "s2", "Personal machines can be infected and carry malware back."),
        c("Plug it into your own computer to check.", 0, "security", "s2", "You'd infect an IT machine."),
      ] },
      s2: { id: "s2", who: "You", text: "What next?", choices: [
        c("Open a security ticket, arrange collection for analysis in an isolated lab, and note where and when it was found.", 3, "security", "s3", "Treated as a possible attack with evidence preserved."),
        c("Throw it away.", 1, "security", "s3", "Safe for you, but security loses the chance to analyze it."),
      ] },
      s3: { id: "s3", who: "You", text: "How do you close out with the staff member?", choices: [
        c("Thank them, explain the risk briefly, and remind them they can always report odd items.", 3, "service", "end", "Positive reinforcement keeps reports coming."),
        c("Tell them off for even asking.", 0, "service", "end", "They did the right thing by asking."),
      ] },
      end: { id: "end", text: "Escalated.", end: { title: "Baiting attempt contained", summary: "Not plugged in, reported and handed to security." } },
    },
  },
  {
    id: "hd-shared-login", kind: "helpdesk", title: "\"Can we all share one login?\"", priority: "P4", difficulty: "intermediate",
    ticket: { id: "REQ-5701", requester: "Team lead, Accounting", channel: "Ticket" },
    summary: "A team lead wants to buy one license and share one account across four people to save money.",
    skills: ["Accountability", "Licensing", "Policy communication"],
    takeaways: ["Shared accounts break accountability: logs can't show who did what.", "They usually violate vendor licenses and weaken MFA.", "Offer legitimate options: more seats, role-based access or delegation."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Team lead", text: "\"We only need it for 30 minutes a day each. Can we just share the login?\"", choices: [
        c("Explain that shared logins can't be audited and may breach the license, and ask what each person needs to do so you can propose options.", 3, "security", "s2", "Understand the need, explain the risk, offer a path."),
        c("Approve it to save the budget.", 0, "security", "s2", "Accountability and license compliance lost."),
        c("Reject it without explanation.", 1, "service", "s2", "Right answer, poor delivery."),
      ] },
      s2: { id: "s2", who: "Team lead", text: "\"Why does it matter who did what?\"", choices: [
        c("If something goes wrong (a mistake or a breach) logs show an individual, so you can fix it and prove compliance. Shared accounts also make MFA and offboarding unreliable.", 3, "service", "s3", "Plain language, real reasons."),
        c("Because the auditors said so.", 1, "service", "s3", "Doesn't help them understand."),
      ] },
      s3: { id: "s3", who: "You", text: "What alternative can you offer?", choices: [
        c("Request four seats or a cheaper tier, or use delegated access if the tool supports it, through the budget approval process.", 3, "technical", "end", "Legitimate options for the real constraint."),
        c("Quietly create the shared account.", 0, "security", "end", "You'd be breaking policy yourself."),
      ] },
      end: { id: "end", text: "Resolved.", end: { title: "Policy kept, need addressed", summary: "Explained the risk and proposed alternatives." } },
    },
  },
  {
    id: "hd-popups-malware", kind: "helpdesk", title: "Constant pop-ups and a fake virus warning", priority: "P2", difficulty: "intermediate",
    ticket: { id: "INC-21155", requester: "Drew Stone, Sales", channel: "Phone" },
    summary: "A user's browser shows 'Your PC is infected, call this number'.",
    skills: ["Recognizing scareware", "Containment", "Remediation"],
    takeaways: ["Fake 'call support' warnings are scams. Never call the number or allow remote access.", "If they already called or installed something, treat it as an incident and isolate the device.", "Scan, check for new extensions or software, and reset passwords if credentials may be exposed."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Drew", text: "\"A red page says my PC is infected and to call Microsoft support. It won't close.\"", choices: [
        c("Tell Drew not to call or click anything, and ask whether they already called, installed something or gave anyone access.", 3, "security", "s2", "Establish whether a scammer already has access."),
        c("Tell Drew to call the number to get help.", 0, "security", "s_bad", "That puts you in touch with the scammer."),
        c("Tell Drew to restart.", 1, "technical", "s2", "May close the page, but you've learned nothing."),
      ] },
      s_bad: { id: "s_bad", text: "The 'support agent' installs remote software and takes over the PC.", end: { title: "Scam succeeded", summary: "Calling the number gives scammers access." } },
      s2: { id: "s2", who: "Drew", text: "\"I called. A guy had me install a program so he could 'fix' it. I hung up when he asked for payment.\"", choices: [
        c("Treat it as an incident: disconnect the PC from the network, escalate to security, and plan a credential reset and a full scan.", 3, "security", "s3", "Remote-access software means an attacker may have been on the machine."),
        c("Uninstall the program and close the ticket.", 1, "security", "s3", "Doesn't address what the attacker saw or changed."),
      ] },
      s3: { id: "s3", who: "You", text: "What else belongs in the response?", choices: [
        c("Reset passwords used on that PC, check the bank and payroll apps for access, document the timeline and educate Drew about scareware.", 3, "documentation", "end", "Covers impact and prevention."),
        c("Nothing more.", 0, "security", "end", "Stolen passwords stay valid unless reset."),
      ] },
      end: { id: "end", text: "Escalated.", end: { title: "Scam handled", summary: "Isolated, escalated and cleaned up." } },
    },
  },
  {
    id: "hd-terminated-user", kind: "helpdesk", title: "Same-day employee termination", priority: "P1", difficulty: "advanced",
    ticket: { id: "REQ-5800", requester: "HR, confidential", channel: "Phone" },
    summary: "HR tells you an employee is being let go in 30 minutes and has broad access. Order matters.",
    skills: ["Offboarding", "Insider-risk awareness", "Coordination and timing"],
    takeaways: ["Disable access at the time of termination, not before or long after, and in a coordinated order.", "Revoke sessions and tokens, disable MFA devices, remote wipe or collect devices and transfer data ownership.", "Keep it confidential and document every action with timestamps."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "HR", text: "\"Alex in Finance is being terminated at 3:00 pm. They have access to payments and the shared drive. We need everything handled at the meeting.\"", choices: [
        c("Confirm the exact time and who authorizes it, prepare the account disable and session revocation steps, and keep it confidential.", 3, "security", "s2", "Prepared, authorized and discreet."),
        c("Disable the account now to be safe.", 1, "security", "s2", "Too early: it tips off the employee and may cause disruption before the meeting."),
        c("Mention it to the team so they can prepare.", 0, "security", "s2", "Breaks confidentiality and risks sabotage."),
      ] },
      s2: { id: "s2", who: "You", text: "3:00 pm arrives and HR says the meeting has started. What is the right action set?", choices: [
        c("Disable the account, revoke all sessions and tokens, remove MFA devices, disable VPN and email forwarding, and document the times.", 3, "security", "s3", "Complete and timed."),
        c("Disable the account only.", 1, "security", "s3", "Existing sessions and tokens can remain valid for hours."),
        c("Delete the account and its mailbox.", 0, "security", "s3", "Destroys data and evidence that legal or HR may need."),
      ] },
      s3: { id: "s3", who: "Finance manager", text: "\"I need Alex's files and mailbox for the audit tomorrow.\"", choices: [
        c("Transfer ownership of the files and delegate mailbox access to the manager through documented approval.", 3, "security", "s4", "Business continuity with a paper trail."),
        c("Give the manager Alex's old password.", 0, "security", "s4", "Never use or share a departed user's credentials."),
      ] },
      s4: { id: "s4", who: "You", text: "The employee left a laptop and a phone with company email.", choices: [
        c("Collect the devices, have security image them if required, and wipe or reset them afterwards per the policy.", 3, "security", "s5", "Devices handled in the right order."),
        c("Let them keep the laptop.", 0, "security", "s5", "Company data leaves with it."),
      ] },
      s5: { id: "s5", who: "You", text: "Close out?", choices: [
        c("Write up the timeline, actions, approvals and open items (shared mailbox, licenses to reclaim, later audit of recent access).", 3, "documentation", "end", "Evidence for HR, legal and audit."),
        c("Mark the ticket done.", 1, "documentation", "end", "No record."),
      ] },
      end: { id: "end", text: "Done.", end: { title: "Clean offboarding", summary: "Timed, complete and documented." } },
    },
  },
  {
    id: "hd-ransom-note", kind: "helpdesk", title: "\"My files have strange extensions and a note\"", priority: "P1", difficulty: "advanced",
    ticket: { id: "INC-21200", requester: "Frances Webb, Accounting", channel: "Phone" },
    summary: "Files are renamed and a text file demands payment. Every minute matters.",
    skills: ["Major incident recognition", "Immediate containment", "Escalation under pressure"],
    takeaways: ["Disconnect the machine from the network right away (pull the cable or turn off Wi-Fi) but do not power it off or wipe it.", "Escalate immediately as a P1: ransomware spreads to shares and other machines.", "Preserve the ransom note and do not contact the attackers or pay."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Frances", text: "\"All my documents now end in .locked and there's a note saying to pay in Bitcoin. I opened a file called invoice.zip an hour ago.\"", choices: [
        c("Tell Frances to unplug the network cable or turn off Wi-Fi immediately and leave the computer on, and to touch nothing else.", 3, "security", "s2", "Cuts off spread while keeping evidence in memory."),
        c("Tell Frances to power off and bring it to IT.", 1, "security", "s2", "Disconnecting is more important. Powering off loses memory evidence, though not catastrophic."),
        c("Tell Frances to pay a little to test it.", 0, "security", "s_bad", "Paying funds crime and guarantees nothing."),
      ] },
      s_bad: { id: "s_bad", text: "The data stays locked, and the attackers return with a larger demand.", end: { title: "Paid for nothing", summary: "Ransom payment is a leadership and legal decision, never a help desk action." } },
      s2: { id: "s2", who: "You", text: "Frances is disconnected. What is your next move?", choices: [
        c("Declare a P1, call the security team or incident commander immediately, and warn them that shared drives may also be affected.", 3, "security", "s3", "Ransomware moves fast across network shares."),
        c("Create a normal ticket and wait for the queue.", 0, "security", "s3", "Wrong urgency."),
      ] },
      s3: { id: "s3", who: "Security lead", text: "\"Good call. Check whether any other user has reported odd files, and don't touch Frances's PC.\"", choices: [
        c("Search recent tickets and ask the floor to report anything odd. Have the SIEM or EDR team check for the same file extension elsewhere.", 3, "technical", "s4", "Scoping the spread."),
        c("Reboot the file server to be safe.", 0, "technical", "s4", "May destroy evidence and interrupt recovery."),
      ] },
      s4: { id: "s4", who: "You", text: "What do you tell Frances and the team?", choices: [
        c("Frances did the right thing by calling. Keep the ransom note as is, do not contact the attackers, and expect to hear from the incident team. Do not discuss on social media.", 3, "service", "end", "Calm, clear and protects the response."),
        c("Nothing, security will handle it.", 1, "service", "end", "People need clear guidance."),
      ] },
      end: { id: "end", text: "Handed to incident response.", end: { title: "Ransomware contained early", summary: "Disconnected fast, escalated and scoped." } },
    },
  },
  {
    id: "hd-ticket-triage-shift", kind: "helpdesk", title: "The queue: prioritize four tickets", priority: "P2", difficulty: "advanced",
    ticket: { id: "SHIFT-01", requester: "Help desk queue", channel: "Queue" },
    summary: "Four tickets arrive at once. Choose the order of work and justify it.",
    skills: ["Prioritization", "Impact and urgency", "Communication under load"],
    takeaways: ["Priority = impact (how many people, how serious) combined with urgency (how soon).", "Security incidents and outages affecting many people come before single-user issues.", "Tell waiting users what to expect, even if you can't fix it yet."],
    start: "s1",
    steps: {
      s1: { id: "s1", who: "Queue", text: "A) CEO can't find a presentation file (needed in 3 days). B) Possible phishing click, user already entered a password. C) Printer toner low on one floor. D) Email down for the whole sales team. Which do you start with?", choices: [
        c("B: possible credential theft is time-critical and a security incident.", 3, "security", "s2", "Every minute gives the attacker a head start."),
        c("A: the CEO is important.", 1, "service", "s2", "Rank does not set priority. The file isn't urgent."),
        c("C: it's quick.", 0, "technical", "s2", "Low impact, low urgency."),
      ] },
      s2: { id: "s2", who: "You", text: "B is escalated to security. What do you work next?", choices: [
        c("D: an outage affecting a whole team has the highest remaining impact.", 3, "technical", "s3", "Many users, business-critical."),
        c("A: the CEO is waiting.", 1, "service", "s3", "Still lower impact than a team-wide outage."),
      ] },
      s3: { id: "s3", who: "You", text: "While you work on D, the CEO's assistant calls to ask about A.", choices: [
        c("Acknowledge the request, explain the current priorities, give an honest time estimate and update the ticket.", 3, "service", "s4", "Honest expectations beat vague promises."),
        c("Drop D and do A right now.", 1, "service", "s4", "Many people stay blocked."),
        c("Ignore the call.", 0, "service", "s4", "No communication creates escalations."),
      ] },
      s4: { id: "s4", who: "You", text: "D is resolved. What remains?", choices: [
        c("Finish A with a workaround or search, then C. Document each and tell each requester the outcome.", 3, "documentation", "end", "Orderly and documented."),
        c("Close all of them.", 0, "documentation", "end", "Tickets must reflect what happened."),
      ] },
      end: { id: "end", text: "Done.", end: { title: "Queue under control", summary: "Prioritized by impact and urgency, communicated throughout." } },
    },
  },
];

const P = {
  mfa: { term: "MFA", def: "A second proof of identity, such as an app code, in addition to the password." },
  verify: { term: "Identity verification", def: "Confirming a caller is the real person through a channel an attacker can't control, such as a callback to the directory number." },
  escalate: { term: "Escalate", def: "Hand the problem to a senior or specialist team with all the facts gathered." },
  priority: { term: "Priority (P1 to P4)", def: "How urgent the work is. It depends on how many people are affected and how serious the impact is." },
  ticket: { term: "Ticket", def: "The record of a problem or request: who, what, when, what you did and the outcome." },
};

export const GUIDES3: Record<string, Guide> = {
  "hd-mfa-new-phone": { objective: "Restore MFA safely after a device change.", primer: [P.mfa, P.verify, { term: "Recovery codes", def: "One-time backup codes you store safely and use if you lose your MFA device." }], coach: { s1: "Why might an attacker pretend to have a new phone? What does turning MFA off give them?", s2: "Pick verification only the real person or their manager could pass.", s3: "Think about the lost phone: could it still approve prompts?" } },
  "hd-software-request": { objective: "Say no to risk while still solving the person's problem.", primer: [{ term: "Approved software catalog", def: "The list of software the company has vetted and licensed." }, { term: "Malware", def: "Malicious software such as viruses, spyware or keyloggers." }, P.ticket], coach: { s1: "What does Dev actually need? Is there already a safe way to do it?", s2: "Helping is part of the job. How do you leave Dev able to continue working?" } },
  "hd-guest-wifi": { objective: "Connect a visitor without exposing the company network.", primer: [{ term: "Guest network", def: "A Wi-Fi network separated from the internal one. Visitors get internet access only." }, { term: "Segmentation", def: "Splitting a network into zones so a problem in one can't easily spread." }], coach: { s1: "Would you hand a stranger the keys to the whole building, or the lobby?", s2: "The block may be a feature, not a bug. What safe workaround exists?" } },
  "hd-mailbox-full": { objective: "Read the error, find the cause and teach the fix.", primer: [{ term: "Quota", def: "The maximum size a mailbox is allowed to be." }, { term: "Archive", def: "Moving old items to long-term storage so they stay available without filling the mailbox." }, P.ticket], coach: { s1: "Ask for the exact wording. Then look at the facts before changing anything.", s2: "Whose data is it? Who should decide what to move?" } },
  "hd-found-usb": { objective: "Recognize baiting and keep curiosity from becoming a breach.", primer: [{ term: "Baiting", def: "Leaving infected USB drives or similar items around, labelled to tempt someone into plugging them in." }, P.escalate, { term: "Isolated lab", def: "A separate machine with no network connection used to safely analyze suspicious devices." }], coach: { s1: "Why would someone label a stick 'Payroll'? What do attackers hope you will do?" } },
  "hd-shared-login": { objective: "Explain why shared accounts are risky and offer real alternatives.", primer: [{ term: "Accountability", def: "Being able to show exactly who did what. Individual accounts make this possible." }, { term: "License", def: "The terms of how a software product may be used and how many people may use it." }, P.mfa], coach: { s1: "The goal is saving money. Is there a way to meet that goal without losing accountability?" } },
  "hd-popups-malware": { objective: "Spot a scareware scam and respond if the user already engaged.", primer: [{ term: "Scareware", def: "Fake warnings that frighten you into calling a scam number or buying fake software." }, { term: "Remote access software", def: "Programs that let someone control your computer from elsewhere. In scams, they hand the attacker full control." }, P.escalate], coach: { s1: "Before you fix the computer, find out what Drew has already done." } },
  "hd-terminated-user": { objective: "Run an offboarding in the right order, at the right time.", primer: [{ term: "Offboarding", def: "Removing a departing person's access and recovering company property." }, { term: "Session / token", def: "Proof that you're already signed in. Disabling an account doesn't always end existing sessions." }, { term: "Insider risk", def: "Harm from someone who already has legitimate access, such as an upset employee." }, P.priority], coach: { s1: "Timing is everything: too early tips them off, too late leaves access open.", s2: "Think beyond the password: what else keeps someone signed in or able to reach data?" } },
  "hd-ransom-note": { objective: "Contain ransomware quickly without destroying evidence.", primer: [{ term: "Ransomware", def: "Malware that encrypts files and demands payment to unlock them." }, P.escalate, { term: "Evidence preservation", def: "Not changing or erasing a compromised machine so investigators can learn what happened." }, P.priority], coach: { s1: "What stops it spreading right now? What would you lose by shutting the machine down?", s2: "Is this a normal ticket or an emergency? Who needs to hear first?" } },
  "hd-ticket-triage-shift": { objective: "Choose the order of work using impact and urgency.", primer: [P.priority, { term: "Impact", def: "How many people are affected and how seriously." }, { term: "Urgency", def: "How soon the problem must be fixed." }, P.ticket], coach: { s1: "Ignore who is shouting and ask: what could get worse fastest, and who is affected?" } },
};
