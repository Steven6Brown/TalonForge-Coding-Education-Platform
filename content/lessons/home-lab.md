## Your personal cyber range

A home lab is where you break things safely. You don't need much: a laptop with 16 GB RAM is plenty.

## Starter architecture

- **Hypervisor:** VirtualBox (free, easy), VMware Workstation Player, or Proxmox on spare hardware.
- **Attacker VM:** Kali Linux or Parrot OS.
- **Targets (intentionally vulnerable):** Metasploitable 2/3, DVWA, OWASP Juice Shop, VulnHub machines.
- **Defender VM:** Ubuntu Server with logging; later add Wazuh or Security Onion.
- **Network:** a **host-only** or **internal** virtual network so lab traffic never reaches your real LAN.

## Rules for a safe lab

1. Isolate lab networks from home devices.
2. Take a **snapshot** of every VM once it's working.
3. Never reuse real passwords inside the lab.
4. Keep vulnerable VMs off the public internet - they will be compromised.
5. Only target machines you own or have written permission to test.

## Free places to practice besides your lab

- OverTheWire (Bandit) for shell skills
- OWASP Juice Shop & WebGoat for web bugs
- PicoCTF, CTFlearn, HackTheBox free tiers, TryHackMe free rooms
- This app's labs and challenges

## Project ideas

- Build a 3-VM lab and capture traffic with Wireshark while you scan a target.
- Stand up a web server, intentionally misconfigure it, then fix it.
- Write a Python script that parses `auth.log` and emails a daily summary.

## Check yourself

Finish with the short quiz.

## Key facts this lesson's quiz checks

- **Snapshots.** A **snapshot** saves the exact state of a virtual machine at one moment: its disk, settings and optionally memory. If an experiment goes wrong (malware, a broken configuration, a deleted system file) you **roll back** to the snapshot in seconds. That makes destructive learning cheap and repeatable. Take a snapshot of a clean machine before every risky experiment, and revert afterwards.

## Worked example: a starter home lab you can build in an evening

**Goal:** a safe place to practice that cannot hurt your real network.

1. **Install a hypervisor** (VirtualBox or VMware Workstation Player). It runs virtual machines.
2. **Create an isolated network.** In the VM settings choose **Host-only** or **Internal** networking so the VMs can talk to each other but not to your home network or the internet.
3. **Build three machines:**

| VM | Role | Purpose |
| --- | --- | --- |
| Kali Linux | Attacker/toolbox | Run the tools |
| An intentionally vulnerable target (for example Metasploitable or OWASP Juice Shop) | Target | Something legal to test |
| A Windows or Ubuntu server | Defender practice | Harden it, read its logs |

4. **Snapshot each machine** right after setup. Name it "clean".
5. **Practice a loop:** experiment, then **revert to the snapshot**. Breaking things stops being scary.

## Safety rules

- Never attach the vulnerable VM to your real network. It is built to be hacked.
- Keep your host system patched and avoid running malware samples on it.
- Only test machines you own or built for the purpose.

## What to practice first

Scan the target and read the results, then harden the server (firewall rules, disable unused services) and watch what changes in the logs.

## Self-check

1. Why take a snapshot? (To roll back to a known-good state after a risky experiment.)
2. Which network mode keeps the lab off your home network? (Host-only or internal.)
