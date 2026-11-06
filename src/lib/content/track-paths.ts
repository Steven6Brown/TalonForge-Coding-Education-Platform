/**
 * Recommended order between tracks, so subjects build on each other. Shown on each track page as
 * "Do these first". Foundations tracks have no prerequisites and everything else points back to them.
 */
export const TRACK_PREREQS: Record<string, string[]> = {
  "js-foundations": [],
  "python-foundations": [],
  "security-foundations": [],
  networking: [],
  "linux-shell": [],
  "databases-sql": [],
  "crypto-hands-on": ["js-foundations"],
  "web-js": ["js-foundations"],
  "math-crypto": ["js-foundations"],
  "python-security": ["python-foundations"],
  automation: ["python-foundations", "js-foundations"],
  "ai-engineering": ["python-foundations", "js-foundations"],
  "digital-forensics": ["linux-shell"],
  "systems-servers": ["linux-shell", "networking"],
  "cyber-range": ["linux-shell", "networking"],
  "ethical-hacking": ["linux-shell", "networking"],
  "kali-pentest": ["linux-shell", "networking"],
  "network-security": ["networking", "crypto-hands-on"],
  "malware-analytics": ["js-foundations", "security-foundations"],
  "siem-soc": ["networking", "security-foundations"],
};
