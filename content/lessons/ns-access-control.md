## The access control chain

Access control grants or denies **objects** (resources) to **subjects** (users) after three steps:

1. **Identification:** present an identity (user name, ID, email).
2. **Authentication:** prove it (one, two or three factors).
3. **Authorization:** decide what the proven identity may do, based on permissions and policy.

Access control is the technique that regulates who or what can view or use resources. **Auditing (accounting)** then records subject activity so people are accountable.

## Vocabulary

- **Subjects:** users, applications or processes. Classic classes: **owner** (the creator, or an administrator for system resources), **group** (named users who share rights; a user can be in several), **world/public** (everyone else, usually the least access).
- **Objects:** records, files, directories, mailboxes, messages, programs, and in some systems ports, devices or network nodes.
- **Access rights:** **read** (view, copy, print), **write** (add, modify, delete; includes read), **execute**, **delete**, **create**, **search** (list a directory).

## Discretionary access control (DAC)

The owner of an object decides who else may access it and may pass on permissions. Windows file sharing and Unix permissions work this way. **Access control lists (ACLs)** attach to an object a list of which subjects have which rights; conceptually an access matrix with subjects on one axis and objects on the other.

Weaknesses: it **relies on users** to set permissions correctly, and a program **inherits the user's privileges**, so malware run by an administrator-level user has the same power.

## Mandatory access control (MAC)

Objects have **classification labels** (unclassified, confidential, secret, top secret) and subjects have **clearances**. A central policy compares them; owners can only assign labels, never grant exceptions. In the standard confidentiality model:

- **No read up:** you may read only at or below your clearance.
- **No write down:** you may write only at or above your level, so secrets can't leak downward.

Only administrators change labels. MAC is access by **label matching, not identity**.

## Role-based access control (RBAC)

Rights are assigned to **roles** (job functions), and users are assigned to roles. Elements: **users, roles, permissions, sessions** (a session activates a user's roles). Roles can form a **hierarchy**: a senior role inherits the rights of the roles below it (a project lead includes the production engineer and quality engineer roles, which both include the engineer role). One user can have several roles; one role can have many users.

Advantages: easier administration at scale (change roles when someone changes jobs; remove them when they leave), natural support for **least privilege** and **separation of duties**, and quick updates across systems. Challenges: initial role design, keeping assignments current, and unclear organizational roles. RBAC doesn't express data sensitivity levels the way MAC does. Operating systems such as SELinux and Windows Server (Authorization Manager) support it.

## Auditing

Auditing detects rogue accounts, separation-of-duty conflicts and policy violations, and helps maintain the integrity of identity attributes by comparing records with an authoritative list.

## Check yourself

Take the quiz below.
