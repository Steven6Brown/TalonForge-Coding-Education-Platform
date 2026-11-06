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
