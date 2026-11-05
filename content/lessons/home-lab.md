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
