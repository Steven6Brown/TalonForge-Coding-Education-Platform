## Multilevel security

In **mandatory access control**, a central policy compares the **classification label** of an object with the **clearance** of a subject. Levels are ordered:

`unclassified < confidential < secret < top secret`

## The two classic rules

- **Simple security property ("no read up"):** a subject may read an object only if their clearance is **greater than or equal to** the label. A secret user can read unclassified and secret documents, not top secret.
- **Star property ("no write down"):** a subject may write only to objects at **their level or higher**. A secret user can write to a secret or top secret resource but not to an unclassified one, because that could move secret information to a lower level.

Together these protect **confidentiality**. (A different model, Biba, uses the opposite rules to protect **integrity**: no read down, no write up.)

## Why it is "mandatory"

Users and owners can't override it. Access depends on labels, not on who owns the data; a cleared person can't hand access to someone else; only administrators relabel data.

## Where you see it

Government and military systems, and operating-system security modules such as SELinux and AppArmor that enforce mandatory policies on processes.

## Your task

Implement `macAllows(clearance, label, op)` for `read` and `write`.

## Walk-through: no read up, no write down

The levels in order, from least to most sensitive: `unclassified` (0), `confidential` (1), `secret` (2), `top secret` (3).

A person with a **secret** clearance (2):

| Action | File label | Allowed? | Why |
| --- | --- | --- | --- |
| read | confidential (1) | yes | 2 >= 1: they may read things at or below their level |
| read | top secret (3) | **no** | 2 < 3: "no read up" |
| write | top secret (3) | yes | 2 <= 3: writing up is allowed (they cannot leak downward) |
| write | confidential (1) | **no** | 2 > 1: "no write down" would copy secrets into a lower file |

**Why block writing down?** If a secret-cleared person (or a program running as them) could write into a confidential file, secret information could leak to people who are only cleared for confidential. The rule stops that, even by accident.

## In code

1. Turn each level into a number: `LEVELS.indexOf(clearance)` and `LEVELS.indexOf(label)`.
2. For `"read"`: allowed when `clearance >= label`.
3. For `"write"`: allowed when `clearance <= label`.
4. Anything else: `false`.

## Where it is used

**Mandatory access control** is used where the system, not the file owner, decides access: military and government systems, and SELinux on Linux. In ordinary systems (discretionary access control) the owner can share a file as they wish.

## Check yourself

Can a `confidential` user write to a `secret` file? (Yes: 1 <= 2.) Can they read it? (No: 1 < 2.)
