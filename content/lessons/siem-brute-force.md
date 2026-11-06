## The pattern

A **brute-force** (or password-guessing) attack tries many passwords. In logs it looks like many **failures** from one source IP, sometimes followed by one **success**. The success is the moment of compromise.

## How an analyst investigates

1. **Rank sources:** count failures per `src_ip` and sort descending. One IP far above the rest stands out.
2. **Pivot:** take that IP and search for any **success** from it. A pivot means using a value you found as the next search term.
3. **Identify impact:** which account was used, on which host, at what time?
4. **Decide containment:** block the IP, disable or reset the account, revoke sessions, then look for what the account did next.

## Mapping to ATT&CK

This is **Credential Access, Brute Force (T1110)**. Naming the technique helps teammates and reports speak the same language.

## Your task

Use the console to find the IP and the compromised username. Then try the Simulators page: the scenario "many failed logins, then a success" walks through the same decisions.

## Walk-through: the investigation, step by step

Real analysts follow the same loop every time: **ask a question, search, read, pivot**.

1. **Question:** "Who is trying to guess passwords?" Failures from one address are the clue. Search: `source=auth action=failure | stats count by src_ip | sort -count`. The address at the top with a far bigger count than the rest is your suspect. (Normal mistyped passwords give small counts spread over many people.)
2. **Question:** "Did that address ever get in?" Take the suspect address and search for its **successes**: `source=auth action=success src_ip=<the suspect>`. A success right after many failures means the guessing worked.
3. **Question:** "Which account was compromised?" Read the `user` column of that success row. That is the account you would disable and reset first.
4. **Question:** "What did they do next?" Search everything from that address: `src_ip=<the suspect>`, and look at the other sources (web, firewall) for the time after the success.

## What you would do in a real incident

Block the address, disable the account, end active sessions, keep the logs as evidence and escalate. The Careers section has a scenario that walks through these decisions.

## Check yourself

Why look at the *success* and not only the failures? (Failures are only attempts. The success is the moment the attacker gets access, so that is where the real damage starts.)
