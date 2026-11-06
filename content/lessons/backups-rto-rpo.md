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
