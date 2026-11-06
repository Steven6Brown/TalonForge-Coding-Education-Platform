## How infrastructure gets compromised

Attackers go after network devices (firewalls, routers, switches, access points) and servers through common weaknesses:

- **Misconfigured devices:** a firewall with too many open ports, a content filter that isn't filtering, or an access point that lets an outsider onto the corporate network as if they were an employee. Training admins to configure devices correctly is essential.
- **Weak security configurations:** old or outdated protocols, such as WEP instead of WPA2/WPA3 on wireless, or SHA-1 certificates instead of SHA-2.
- **Default configurations:** many devices ship with well-known default accounts and passwords that can be found with a quick web search. **Change defaults on every new device.**
- **Outdated firmware and software:** known flaws stay exploitable until patched. Examples: **Heartbleed** (2014) in older versions of the OpenSSL library, and **WannaCry** (2017), which spread through an unpatched Windows file-sharing (SMBv1) vulnerability although a patch had been available.
- **Hardcoded credentials:** the same password built into many devices or software copies, hard to rotate. A related mistake is using one super-user database password for everything instead of limiting access to what each function needs.
- **Easy physical access:** with physical access, attackers can often reset passwords or enter privileged modes on servers and routers. Restrict physical access, or other protections are useless.
- **Zero-day vulnerabilities:** flaws unknown to the vendor (or without a patch). Once publicly known and patched, an exploit is a *known* exploit.

## Patch policy

Keep operating systems, applications and firmware current. Because vulnerabilities are dynamic, subscribe to **vendor and independent vulnerability notification lists** (for example vendor security advisories, US-CERT and the SANS Internet Storm Center) and consider threat-intelligence services. In many cases administrators must **explicitly apply** patches, so patching needs a process with testing and tracking.

## CVE and CVSS

- **CVE (Common Vulnerabilities and Exposures)** gives each known vulnerability a unique ID (for example CVE-2014-0160 for Heartbleed). MITRE maintains the CVE list; NIST's **National Vulnerability Database (NVD)** adds analysis and scores.
- **CVSS (Common Vulnerability Scoring System)** rates severity from 0.0 to 10.0. The v3 qualitative bands are: **none** 0.0, **low** 0.1-3.9, **medium** 4.0-6.9, **high** 7.0-8.9 and **critical** 9.0-10.0.

Scanners such as OpenVAS discover vulnerabilities on hosts and report CVSS scores, which help prioritize fixes. Scores are a starting point: also consider whether the asset is exposed, how valuable it is and whether exploitation is already happening.

## Your task

Implement the CVSS severity band mapping.
