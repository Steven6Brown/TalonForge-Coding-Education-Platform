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

## Walk-through: reading one rule, then parsing it

Take this rule:

```
alert tcp 192.168.1.0/24 any -> 10.0.0.5 80 (msg:"Possible web scan"; sid:1000001; rev:1;)
```

**Reading it like an analyst:** "Raise an alert for TCP traffic from any computer in 192.168.1.0/24, from any port, going to 10.0.0.5 on port 80. Call it *Possible web scan*."

**The seven header words**, in order:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- |
| `alert` | `tcp` | `192.168.1.0/24` | `any` | `->` | `10.0.0.5` | `80` |
| action | protocol | source | source port | direction | destination | destination port |

Then the **options** in parentheses: `msg:"Possible web scan"; sid:1000001; rev:1;`.

## How the parser works

1. **One regular expression captures the header and the options text.** Each `(\S+)` captures one word, `\s+` matches the spaces between them, and `\((.*)\)` captures everything between the parentheses. If the line does not match, the rule is malformed, so return `null`.
2. **Take the options text** (`msg:"Possible web scan"; sid:1000001; rev:1;`) and `split(";")`. You get pieces like `msg:"Possible web scan"` and ` sid:1000001`, plus an empty piece at the end (after the last `;`).
3. **For each piece,** find the first colon with `indexOf(":")`. If there is none (`-1`), skip the piece. Otherwise the text before it (trimmed) is the **name** and the text after it (trimmed, with surrounding quotes removed) is the **value**.
4. **Return** the object: `{ action, protocol, src, srcPort, direction, dst, dstPort, options }`.

Removing the quotes: `value.replace(/^"|"$/g, "")` deletes a quote at the start or the end.

## If something goes wrong

- Everything returns `null`: your header regex is too strict (check the `->` part and the spaces).
- `options` has an odd empty entry: you did not skip the piece after the final `;`.
- A value still has quotes: the `replace` ran before `trim`, or the pattern is wrong.

## Check yourself

Why might a rule be too broad? (It matches harmless traffic too, flooding analysts with false alarms. Add `content` or port restrictions to narrow it.)
