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
