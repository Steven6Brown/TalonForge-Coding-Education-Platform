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
