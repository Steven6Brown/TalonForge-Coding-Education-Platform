## Backups

- **Full:** a complete copy of everything. Simplest to restore, biggest and slowest.
- **Differential:** everything changed since the last **full** backup. To restore you need the last full plus the latest differential. Backups grow each day until the next full.
- **Incremental:** only what changed since the **last backup of any kind**. Smallest and fastest to create, but a restore needs the last full plus **every** incremental since.
- **Copy:** a copy of specified files regardless of whether they changed.

Rule of thumb: incremental is cheapest to back up and slowest to restore; differential balances the two.

## Recovery objectives

- **RPO (Recovery Point Objective):** how far back in time you can lose data. A 1-hour RPO means backups at least hourly.
- **RTO (Recovery Time Objective):** how long recovery of a system may take.
- **MTD (Maximum Tolerable Downtime):** the longest outage the owner will accept. RTO must be shorter than MTD.

## Plans

- **Business continuity plan (BCP):** keeps critical functions running by alternate means until normal operations resume.
- **Disaster recovery plan (DRP):** restores normal operations at the primary site.
- **Business impact analysis (BIA):** identifies critical functions and their allowable downtime, and drives both plans.

## Virtualization helps

A **hypervisor** runs virtual machines on a host platform. VMs can be snapshotted, copied and restarted elsewhere, which speeds recovery.

## Test your restores

An untested backup is a hope, not a plan.

## Your task

Implement `backupsNeeded` for the three strategies.

## Walk-through: how many backups must you restore?

Suppose a **full backup** runs every Sunday, and smaller backups run on the other days. A disaster hits on **Wednesday evening**, after Wednesday's backup has run. Three days have passed since the full (Monday, Tuesday and Wednesday), so `daysSinceFull = 3`.

**Full only:** each backup holds everything. Restore the **1** latest full. Simple, but slow and heavy to take every day.

**Differential:** each day's backup holds everything that changed **since the last full**. To restore: the last full + **only the newest differential**, so **2** sets (or 1 if no days have passed). Each differential grows through the week.

**Incremental:** each day's backup holds only what changed **since the previous backup of any kind**. To restore: the last full + **every incremental since**. With 3 days passed that is `1 + 3 = 4` sets. Backups are small and fast, but restoring takes longer and one damaged set breaks the chain.

| Type | Backup size | Restore needs (3 days since full) |
| --- | --- | --- |
| Full | big | 1 |
| Differential | grows | 2 |
| Incremental | small | 4 |

## RTO and RPO: the two promises

- **RPO (recovery point objective):** how much data you can afford to lose, measured as time. If backups run nightly your RPO is up to a day.
- **RTO (recovery time objective):** how long you can afford to be down. If restoring takes 6 hours but the business can only tolerate 2, the plan fails.

Pick the backup type that meets both, then **test the restore**: a backup you have never restored is only a hope.

## In the lab

`backupsNeeded(strategy, daysSinceFull)` uses a `switch` on the strategy. Full is always 1. Differential is 1 when `daysSinceFull` is 0 and 2 otherwise. Incremental is `1 + daysSinceFull`. Unknown strategies return `null`.

## Check yourself

Which type restores fastest but costs the most space? (Full.) Which risks a broken chain? (Incremental.)
