## Intrusion detection with rules

An **intrusion detection system (IDS)** watches network traffic and raises alerts when it matches a rule. **Snort** is a well-known open-source IDS/IPS (an IPS can also block). Analysts write and tune rules to catch real threats without drowning in false alarms.

## Rule anatomy

```
alert tcp 192.168.1.0/24 any -> 10.0.0.5 80 (msg:"Possible web scan"; sid:1000001; rev:1;)
```

**Header:** `action protocol source-address source-port direction destination-address destination-port`

- Actions: `alert`, `log`, `pass`, `drop`...
- `any` matches any address or port; `->` means source to destination.

**Options** (inside parentheses, separated by semicolons):

- `msg`: text shown in the alert
- `sid`: unique rule id (custom rules usually start at 1,000,000)
- `rev`: revision number
- `content`, `flow`, `threshold`: what to match and how often

## Tuning

Rules that are too broad generate noise; too narrow and you miss variants. Good analysts test rules on real traffic, version them (`rev`) and review alerts regularly.

## Your task

Write a parser for this rule format. Parsing text into structured data is the first step toward tooling such as rule validators.
