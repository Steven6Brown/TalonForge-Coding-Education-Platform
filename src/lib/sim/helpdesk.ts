import { c, type Scenario } from "./types";

/**
 * IT Help Desk scenarios. They practice the habits that matter in a Tier 1/2 role: verify identity before
 * touching accounts, ask good questions, follow a troubleshooting order, escalate correctly and document.
 */
export const HELPDESK: Scenario[] = [
  {
    id: "hd-password-reset",
    kind: "helpdesk",
    title: "Locked out: password reset request",
    priority: "P3",
    difficulty: "beginner",
    ticket: { id: "INC-20418", requester: "Maria Lopez, Accounts Payable", channel: "Phone" },
    summary: "A caller says they are locked out of their account and need a password reset right now.",
    skills: ["Identity verification", "Account management", "Customer communication"],
    takeaways: [
      "Verify identity with a trusted method BEFORE resetting anything (callback to the directory number, manager approval, or self-service reset).",
      "Issue a temporary credential through a secure channel and force a change at next sign-in.",
      "Check MFA, and record exactly how identity was verified in the ticket.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Maria (caller)",
        text: "\"Hi, I'm Maria from Accounts Payable. I'm locked out and I have invoices due in an hour. Can you just reset my password quickly?\"",
        choices: [
          c("Reset it immediately. She sounds stressed and the invoices matter.", 0, "security", "s_bad", "Account takeover often starts with an urgent, friendly voice. Never reset before verifying identity."),
          c("Say you'll help right away, and first verify her identity using the company's standard method.", 3, "security", "s2", "Empathy plus process. Urgency is a common social-engineering pressure tactic, so verification is non-negotiable."),
          c("Tell her to email her manager and call back tomorrow.", 1, "service", "s2", "Safe but unhelpful: there are faster verified paths (callback to the directory number, self-service reset, manager approval)."),
        ],
      },
      s_bad: { id: "s_bad", text: "Later that day security reports the account was used to change vendor bank details. The caller was not Maria.", end: { title: "Outcome: account takeover", summary: "Resetting without verification handed an attacker the account. This is exactly how many real breaches happen." } },
      s2: {
        id: "s2", who: "You",
        text: "Which verification method is strongest and fits policy?",
        choices: [
          c("Ask for her employee ID and date of birth.", 1, "security", "s3", "Weak: this information is often leaked or easy to find. Use something only the real user or their manager controls."),
          c("Call her back on the number listed in the company directory and confirm with her manager through the ticketing system.", 3, "security", "s3", "Strong: you reach the real person through a channel the caller can't control."),
          c("Ask her to read her current password to confirm.", 0, "security", "s3", "Never ask for passwords. Staff must never share them, even with IT."),
        ],
      },
      s3: {
        id: "s3", who: "System",
        text: "Verification passed. The directory shows her account is locked after too many failed sign-ins. What do you do?",
        choices: [
          c("Unlock the account, set a temporary password, require a change at next sign-in, and confirm her MFA device still works.", 3, "technical", "s4", "Complete fix: unlock, temporary credential, forced change, and MFA check so she isn't locked out again."),
          c("Set her password to the company default so she remembers it.", 0, "security", "s4", "Shared defaults are easily guessed. Always use a unique temporary password."),
          c("Unlock only and tell her to try again.", 1, "technical", "s4", "She may have forgotten the password; unlock alone often brings the lockout right back."),
        ],
      },
      s4: {
        id: "s4", who: "You",
        text: "How do you deliver the temporary password?",
        choices: [
          c("Read it over the phone while she is on the verified call, then require an immediate change.", 2, "security", "s5", "Acceptable on a verified call. A secure self-service link or manager-delivered code is even better."),
          c("Email it to her personal address.", 0, "security", "s5", "Never send credentials to personal email."),
          c("Send a self-service reset link to her registered company device.", 3, "security", "s5", "Best: the credential goes only to a trusted channel tied to her account."),
        ],
      },
      s5: {
        id: "s5", who: "You",
        text: "She's back in. What do you put in the ticket before closing?",
        choices: [
          c("\"Fixed.\"", 0, "documentation", "end_done", "Too thin to be useful for the next person or for an audit."),
          c("Cause, verification method used, actions taken, MFA check, and that she confirmed access.", 3, "documentation", "end_done", "Great ticket: it tells the story and proves you followed security procedure."),
          c("Cause and actions, but not how identity was verified.", 1, "documentation", "end_done", "Missing the most audit-critical detail."),
        ],
      },
      end_done: { id: "end_done", text: "Ticket closed.", end: { title: "Ticket resolved", summary: "Verified, fixed and documented." } },
    },
  },
  {
    id: "hd-vpn-down",
    kind: "helpdesk",
    title: "VPN won't connect from home",
    priority: "P3",
    difficulty: "beginner",
    ticket: { id: "INC-20533", requester: "Tom Reyes, Sales", channel: "Chat" },
    summary: "A remote user can't connect to the company VPN.",
    skills: ["Troubleshooting method", "Questioning", "Escalation"],
    takeaways: [
      "Gather facts first: exact error, when it started, what changed, scope (just one user?).",
      "Troubleshoot from the simplest layer upward (internet, credentials/MFA, client, account, then server side).",
      "Escalate with evidence, not just 'VPN broken'.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Tom (chat)", text: "\"VPN won't connect. It just spins and fails. I have a customer demo in 30 minutes!\"",
        choices: [
          c("Ask for the exact error message, when it last worked, and whether anything changed (new router, updates, travel).", 3, "technical", "s2", "Good questions narrow the cause fast."),
          c("Tell him to reinstall the VPN client.", 1, "technical", "s2", "Maybe, but guessing wastes time and could make things worse."),
          c("Ask him for his password so you can test it.", 0, "security", "s2", "Never ask for passwords. You can test with your own account or reset his."),
        ],
      },
      s2: {
        id: "s2", who: "Tom", text: "\"Error says 'Authentication failed'. It worked yesterday. I changed my password this morning.\"",
        choices: [
          c("Check whether his account is locked or the old password is cached in the client, and confirm MFA prompts reach his phone.", 3, "technical", "s3", "A password change plus 'authentication failed' points to a stale saved credential or a lockout."),
          c("Open a ticket for the network team: VPN server down.", 0, "technical", "s3", "One user failing authentication isn't a server outage. Check scope first."),
          c("Ask him to restart his computer and try again.", 1, "technical", "s3", "Fine as a quick step, but the clues already point at credentials."),
        ],
      },
      s3: {
        id: "s3", who: "System", text: "You find the account is locked from repeated failed attempts with the old saved password.",
        choices: [
          c("Unlock the account, have him clear the saved credential and sign in with the new password, and confirm the connection.", 3, "technical", "s4", "Root cause fixed and verified with the user."),
          c("Disable the lockout policy so this stops happening.", 0, "security", "s4", "Never weaken a security control to solve one ticket."),
          c("Unlock it and close the ticket without confirming.", 1, "service", "s4", "Always confirm the user is actually working."),
        ],
      },
      s4: {
        id: "s4", who: "You", text: "He's connected with ten minutes to spare. What's the best finish?",
        choices: [
          c("Document the cause and fix, and tell him how to avoid it (update saved passwords after a change).", 3, "documentation", "end_done", "Fix plus prevention reduces repeat tickets."),
          c("Close the ticket silently.", 1, "service", "end_done", "Technically done, but a missed chance to help."),
        ],
      },
      end_done: { id: "end_done", text: "Resolved.", end: { title: "Resolved before the demo", summary: "Good question-first troubleshooting." } },
    },
  },
  {
    id: "hd-phishing-click",
    kind: "helpdesk",
    title: "User clicked a suspicious link",
    priority: "P2",
    difficulty: "intermediate",
    ticket: { id: "INC-20610", requester: "Priya Shah, HR", channel: "Phone" },
    summary: "A user is worried: she clicked a link in an email that asked her to 're-verify' her payroll login.",
    skills: ["Incident recognition", "Escalation", "Calm communication"],
    takeaways: [
      "Treat it as a possible security incident: stay calm, don't blame, gather facts, escalate to security quickly.",
      "Have the user stop using the device for sensitive work, and don't delete evidence.",
      "Credentials entered on a fake page must be reset and sessions revoked (by the right team).",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Priya", text: "\"I clicked a link and typed my password into a page. Then it looked weird. Am I in trouble? Please help!\"",
        choices: [
          c("Reassure her she did the right thing by calling, and ask what she clicked, when, and whether she entered credentials or opened a file.", 3, "service", "s2", "Calm, blame-free and fact-gathering: people report faster when they don't fear punishment."),
          c("Tell her to ignore it, it's probably fine.", 0, "security", "s2", "Never dismiss a possible credential theft."),
          c("Tell her it's against policy and she'll hear from her manager.", 0, "service", "s2", "Blame discourages future reporting."),
        ],
      },
      s2: {
        id: "s2", who: "Priya", text: "\"Yes, I entered my password about 10 minutes ago. I still have the email open.\"",
        choices: [
          c("Open a security incident, escalate to the security team immediately as P2, and ask her to leave the email open or forward it as an attachment (don't delete it).", 3, "security", "s3", "Right: credentials were likely stolen, speed matters, and the email is evidence."),
          c("Reset her password yourself and close the ticket.", 1, "security", "s3", "The reset is needed, but this may be part of a wider campaign and sessions/tokens must be revoked and others warned. Escalate."),
          c("Tell her to delete the email and forget about it.", 0, "security", "s3", "Deleting destroys evidence and leaves other recipients exposed."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "While security takes over, what do you tell Priya?",
        choices: [
          c("Don't enter more credentials, expect a forced password reset and MFA re-check, report anything odd, and security may contact her.", 3, "service", "s4", "Sets expectations and keeps her safe."),
          c("Nothing more: that's security's job now.", 1, "service", "s4", "Leaving her without guidance creates risk and anxiety."),
        ],
      },
      s4: {
        id: "s4", who: "You", text: "What should the ticket contain?",
        choices: [
          c("Timeline, the exact link/sender if known, what she entered, actions taken, the escalation and who owns it.", 3, "documentation", "end_done", "Precise facts speed up the investigation."),
          c("\"User clicked link, escalated.\"", 1, "documentation", "end_done", "Too little for security to act on."),
        ],
      },
      end_done: { id: "end_done", text: "Escalated.", end: { title: "Handled well", summary: "Fast escalation, evidence preserved, user supported." } },
    },
  },
  {
    id: "hd-ceo-bypass",
    kind: "helpdesk",
    title: "\"The CEO needs access now\"",
    priority: "P2",
    difficulty: "intermediate",
    ticket: { id: "INC-20691", requester: "Caller claiming to be Dana Whitfield's assistant", channel: "Phone" },
    summary: "A caller demands you disable MFA for an executive who is 'traveling and in an emergency'.",
    skills: ["Social-engineering resistance", "Policy adherence", "Escalation"],
    takeaways: [
      "Authority and urgency are classic pressure tactics. Policy applies to everyone, including executives.",
      "Offer approved alternatives: verified temporary MFA bypass through the security team, backup codes, or a verified callback.",
      "Report suspicious attempts: a failed social-engineering attempt is useful intelligence.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Caller", text: "\"This is Dana's assistant. She's at an airport, lost her phone and needs MFA turned off NOW for a board call. Do you know who she is?!\"",
        choices: [
          c("Politely say you want to help and will follow the executive-support procedure, which verifies her identity first.", 3, "security", "s2", "Firm and courteous. Executives need strong verification, not less."),
          c("Disable MFA. Pushing back on the CEO could get you in trouble.", 0, "security", "s_bad", "This is exactly the scenario attackers rehearse."),
          c("Refuse rudely and hang up.", 1, "service", "s2", "The decision is right but the delivery isn't. Stay professional and offer a path forward."),
        ],
      },
      s_bad: { id: "s_bad", text: "An attacker uses the unprotected account to approve wire transfers.", end: { title: "Outcome: executive account compromised", summary: "Removing MFA on request, with no verification, is a textbook breach." } },
      s2: {
        id: "s2", who: "You", text: "What is the right way to proceed?",
        choices: [
          c("Verify via a callback to Dana's number in the directory and a second approver in the security team, then follow the lost-device process (temporary MFA enrollment).", 3, "security", "s3", "Two independent checks plus the approved process."),
          c("Ask the caller to confirm Dana's birth date and employee ID.", 1, "security", "s3", "Weak: easy to research."),
          c("Take a verbal approval from the caller's \"manager\" on the same call.", 0, "security", "s3", "Approvals must come through a channel you control."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "The callback goes to voicemail. The caller insists you're costing the company millions.",
        choices: [
          c("Stay calm, escalate to the security team and the executive-support lead, offer to resume the moment identity is confirmed, and log the attempt.", 3, "security", "s4", "You protected the account, escalated and documented."),
          c("Give in: the pressure is too much.", 0, "security", "s_bad", "Pressure is the point of the attack."),
        ],
      },
      s4: { id: "s4", text: "The call ends. Security later confirms the call was a pretext attempt.", end: { title: "Attack stopped", summary: "You held the line politely and escalated." } },
    },
  },
  {
    id: "hd-onboarding",
    kind: "helpdesk",
    title: "New hire access request",
    priority: "P4",
    difficulty: "beginner",
    ticket: { id: "REQ-5521", requester: "HR onboarding", channel: "Ticket" },
    summary: "A new analyst starts Monday. HR asks for 'the same access as everyone in IT'.",
    skills: ["Least privilege", "Approvals", "Provisioning"],
    takeaways: [
      "Use role-based access: a standard role template plus specific approved requests.",
      "Get documented manager approval for anything beyond the baseline.",
      "Enforce MFA enrollment and a secure first-day credential process.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "HR", text: "\"Please give Sam the same access as the rest of IT, including admin rights on servers. Thanks!\"",
        choices: [
          c("Provision the new hire's standard role template, and ask the hiring manager to approve any additional access with business justification.", 3, "security", "s2", "Least privilege with approvals."),
          c("Copy a senior admin's account permissions to Sam.", 0, "security", "s2", "Copying a user is how privilege creep and excess access spread."),
          c("Refuse until Sam proves they need it.", 1, "service", "s2", "Right principle, wrong approach. Route the question to the manager."),
        ],
      },
      s2: {
        id: "s2", who: "Manager", text: "\"Sam only needs read-only access to monitoring tools for the first month.\"",
        choices: [
          c("Grant read-only monitoring access as approved, set an access review date, and document the approval.", 3, "documentation", "s3", "Time-bound, minimal, documented."),
          c("Grant full access 'to avoid more tickets'.", 0, "security", "s3", "Never over-provision for convenience."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "How do you deliver Sam's first-day credentials?",
        choices: [
          c("Create the account with a one-time temporary password delivered in person or via the manager, require MFA enrollment and a password change at first login.", 3, "security", "end_done", "Secure delivery plus enforced MFA."),
          c("Email the password to HR.", 0, "security", "end_done", "Credentials in email are a leak waiting to happen."),
        ],
      },
      end_done: { id: "end_done", text: "Done.", end: { title: "Onboarded safely", summary: "Standard role, approved extras, secure credentials." } },
    },
  },
  {
    id: "hd-printer-floor",
    kind: "helpdesk",
    title: "Printer down for a whole floor",
    priority: "P3",
    difficulty: "beginner",
    ticket: { id: "INC-20744", requester: "Finance floor (12 users)", channel: "Email" },
    summary: "Nobody on the third floor can print. Month-end close is tomorrow.",
    skills: ["Scope and impact", "Troubleshooting method", "Communication"],
    takeaways: [
      "Establish scope and impact first (one user versus many), and what changed recently.",
      "Work from simple to complex, one change at a time, verifying after each.",
      "Communicate status to affected users and set a time for the next update.",
    ],
    start: "s1",
    steps: {
      s1: {
        id: "s1", who: "Finance lead", text: "\"None of us can print since this morning. We have month-end reports to print!\"",
        choices: [
          c("Determine scope: all users or one printer? Any recent changes (updates, new server, network work)? What exactly happens when they print?", 3, "technical", "s2", "Scope and change history usually point straight at the cause."),
          c("Tell them to try another floor's printer and close the ticket.", 1, "service", "s2", "A workaround, not a fix. Keep the ticket open."),
          c("Replace the toner.", 0, "technical", "s2", "A guess. Diagnose before changing parts."),
        ],
      },
      s2: {
        id: "s2", who: "Finance lead", text: "\"Print jobs just sit in the queue. The printer shows online. Overnight updates ran on the print server.\"",
        choices: [
          c("Check the print server's spooler service and queue, look for the update's effect, and restart the spooler after clearing stuck jobs.", 3, "technical", "s3", "Symptoms (jobs stuck, printer healthy) and the recent change point at the print server."),
          c("Reinstall Windows on all 12 computers.", 0, "technical", "s3", "Massive overreaction."),
          c("Power-cycle the printer.", 1, "technical", "s3", "Harmless but unlikely to help, since the printer is fine."),
        ],
      },
      s3: {
        id: "s3", who: "You", text: "The spooler had stopped after the update. You restart it and printing resumes. Next?",
        choices: [
          c("Confirm with the finance lead, tell everyone it's fixed, note the cause, and flag the update to the server team to prevent a repeat.", 3, "service", "end_done", "Verified, communicated and prevented."),
          c("Close the ticket without telling anyone.", 1, "service", "end_done", "Users should hear the good news and what to do if it recurs."),
        ],
      },
      end_done: { id: "end_done", text: "Resolved.", end: { title: "Floor back online", summary: "Scoped, diagnosed, fixed and communicated." } },
    },
  },
];
