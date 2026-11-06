## What is Kali Linux?

**Kali Linux** is a Debian-based distribution maintained by Offensive Security. It ships with hundreds of security tools: **nmap** (scanning), **Burp Suite** (web proxy), **John the Ripper** and **hashcat** (password cracking), **Wireshark** (packet analysis), **Metasploit** (exploitation framework) and more.

It's a toolbox, not magic. The skill is knowing *which* tool to use, *why*, and *what the output means*.

## Run it safely

1. Install **VirtualBox** or **VMware** and download the official Kali VM image from kali.org.
2. Put the VM on a **host-only or internal network** with your practice targets (see the Home Lab lesson).
3. Take a **snapshot** after setup.
4. Never point tools at systems you don't own or lack **written permission** to test.

## The phases of a penetration test

1. **Scoping and authorization** (written rules of engagement)
2. **Reconnaissance** (passive and active)
3. **Scanning and enumeration** (what is running, which versions)
4. **Exploitation** (prove the weakness is real)
5. **Post-exploitation** (impact, pivoting, always within scope)
6. **Reporting** (findings, evidence, fixes)

## About this lab

The Kali lab in this app is a **simulation**. Tools like `nmap`, `gobuster`, `curl`, `john` and `searchsploit` read from a fictional network (`10.10.10.0/29`). The output imitates the real tools so the habits carry over. Nothing touches a real network.

Start the next lesson to scan your first target. Take the quiz below to finish this one.

## Vocabulary for a first-timer

- **Distribution (distro):** a packaged version of Linux. Kali is one, built for security work.
- **Virtual machine (VM):** a whole computer simulated inside a program (VirtualBox, VMware). If you break it, you restore it. It keeps risky tools away from your real system.
- **Target:** the system you are authorized to test.
- **Scope and rules of engagement:** the written agreement saying what you may test, when and how. Without it, scanning is not "practice", it can be a crime.
- **Enumeration:** collecting details about a target: open ports, services, versions.
- **Exploit:** code that takes advantage of a weakness. **Payload:** what runs after it works.

## What each tool is for (in one line)

| Tool | Job |
| --- | --- |
| `nmap` | Finds open ports and identifies the services behind them |
| `gobuster` | Guesses hidden web paths and folders |
| `curl` | Sends web requests from the command line so you can read the raw reply |
| `john` / `hashcat` | Test password hashes against wordlists (only on hashes you own or were given) |
| `searchsploit` | Searches a database of public exploits for a known software version |
| Wireshark | Shows the packets on a network |
| Burp Suite | A proxy that lets you read and modify web traffic |

The point is the habit, not the tool: **ask a question, pick the tool that answers it, and understand the output.**

## Before you use anything

Ask yourself two things every time: *Do I have written permission for this target?* and *Is it on an isolated lab network?* If either answer is no, stop.

## Check yourself

Why does a pentest start with scoping and not scanning? (The written scope is what makes the work legal and tells you what you may touch.)
