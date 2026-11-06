## A map of how a goal can be reached

An **attack tree** is a branching, hierarchical diagram of the ways an adversary could reach a goal.

- The **root** is the attacker's goal (for example, "take over an online banking session").
- **Branches** and **sub-nodes** are ways to get there.
- **OR nodes:** any one child is enough.
- **AND nodes:** every child is required.
- **Leaves** are concrete actions or events, which you can annotate with cost, effort, likelihood or required skill.

## Why analysts use them

- They document attacks in a structured form that reveals **key vulnerabilities**.
- They guide the **design** of systems and the **choice and strength of countermeasures**: if the cheapest path goes through a weak control, strengthen it.
- They bring together knowledge of attack patterns, including how real attacks have worked.

## Evaluating a tree

Assign each leaf a number (say, attacker cost) and work upward:

- **OR** node: the attacker picks the **cheapest** child, so use the minimum.
- **AND** node: the attacker must do **all** children, so **sum** them.

That gives the cheapest attack overall. Defenders then add controls that raise the cost of the cheapest path and re-evaluate. The same recursion works for likelihood (multiply probabilities at AND nodes, combine at OR nodes).

## Example: online banking authentication

An analyst might model goals such as "learn the user's credentials" (via phishing, malware or shoulder surfing) and "bypass the second factor" (via SIM swap or session theft). Comparing leaf costs shows where adding a hardware token or user training changes the cheapest path.

## Your task

Write a recursive evaluator that returns the minimum cost to achieve the root goal.

## Walk-through: costing a small attack tree

Goal: **read a company's private file**. An attacker has two options (OR):

- **Option 1:** buy stolen credentials. Cost 50.
- **Option 2:** do **both** of the following (AND): trick an employee with a phishing email (cost 10) **and** install a keylogger (cost 15).

```
Read private file (OR)
├── Buy credentials ............. 50
└── Phish + keylogger (AND)
    ├── Phishing email .......... 10
    └── Install keylogger ....... 15
```

**Work from the leaves upward:**

- The AND node needs **all** its children: `10 + 15 = 25`.
- The OR node takes the **cheapest** option: `min(50, 25) = 25`.

So the cheapest attack costs **25**. A defender can use this: raising the cost of the cheapest path (for example, MFA makes phished credentials useless) improves security more than hardening an expensive path nobody would take.

## Recursion, step by step

`cheapestAttack(node)` calls itself on each child:

1. **Base case:** a leaf (`node.children` is missing) returns `node.cost`.
2. Otherwise compute the cost of every child with `node.children.map(cheapestAttack)`.
3. If the node is `"OR"`, return the smallest (`Math.min(...costs)`); otherwise (AND) return their sum.

## Check yourself

If the keylogger cost 40, what would the cheapest attack cost? (AND = 50, OR = min(50, 50) = 50.)
