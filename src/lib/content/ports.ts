export type PortCategory = "Web" | "Mail" | "Remote access" | "File transfer" | "Directory & auth" | "Database" | "Network services" | "VPN" | "Monitoring & logging" | "Windows";

export type PortInfo = {
  port: number;
  proto: "TCP" | "UDP" | "TCP/UDP";
  service: string;
  category: PortCategory;
  /** What it does, in plain English. */
  what: string;
  /** Security note or the safer alternative. */
  note: string;
  /** True when traffic is unencrypted by default (high-value for attackers and for defenders to review). */
  insecure?: boolean;
};

/** Well-known and commonly seen ports. Accurate to common default assignments (IANA) and typical use. */
export const PORTS: PortInfo[] = [
  { port: 20, proto: "TCP", service: "FTP data", category: "File transfer", what: "Carries file data in active-mode FTP.", note: "FTP sends data and credentials in clear text. Use SFTP (22) or FTPS.", insecure: true },
  { port: 21, proto: "TCP", service: "FTP control", category: "File transfer", what: "FTP commands and login.", note: "Clear-text credentials. Replace with SFTP or FTPS; disable anonymous access.", insecure: true },
  { port: 22, proto: "TCP", service: "SSH / SFTP / SCP", category: "Remote access", what: "Encrypted remote shell and secure file transfer.", note: "Use keys, disable root and password login, rate-limit or restrict by IP. Most-attacked service on the internet." },
  { port: 23, proto: "TCP", service: "Telnet", category: "Remote access", what: "Old remote terminal.", note: "Everything, including passwords, is clear text. Replace with SSH. Seeing Telnet open is a finding.", insecure: true },
  { port: 25, proto: "TCP", service: "SMTP", category: "Mail", what: "Mail transfer between mail servers.", note: "Open relays enable spam. Use STARTTLS, SPF, DKIM and DMARC." },
  { port: 53, proto: "TCP/UDP", service: "DNS", category: "Network services", what: "Turns names into IP addresses (UDP for queries, TCP for large answers and zone transfers).", note: "Restrict zone transfers, watch for tunneling and odd query volumes. DNS logs reveal malware callbacks." },
  { port: 67, proto: "UDP", service: "DHCP server", category: "Network services", what: "Hands out IP addresses to clients.", note: "Rogue DHCP servers can redirect traffic; use DHCP snooping." },
  { port: 68, proto: "UDP", service: "DHCP client", category: "Network services", what: "Port clients use to receive DHCP replies.", note: "Pairs with port 67." },
  { port: 69, proto: "UDP", service: "TFTP", category: "File transfer", what: "Very simple file transfer, used for network device configs and PXE boot.", note: "No authentication or encryption. Restrict to internal management networks.", insecure: true },
  { port: 80, proto: "TCP", service: "HTTP", category: "Web", what: "Web traffic in clear text.", note: "Redirect to HTTPS and use HSTS.", insecure: true },
  { port: 88, proto: "TCP/UDP", service: "Kerberos", category: "Directory & auth", what: "Ticket-based authentication (Active Directory).", note: "Weak service-account passwords make Kerberos tickets crackable offline; monitor ticket requests." },
  { port: 110, proto: "TCP", service: "POP3", category: "Mail", what: "Downloads email from a server.", note: "Clear text. Use POP3S on 995.", insecure: true },
  { port: 111, proto: "TCP/UDP", service: "RPC portmapper", category: "Network services", what: "Maps RPC services (NFS and others) to ports on Unix.", note: "Don't expose to the internet." },
  { port: 123, proto: "UDP", service: "NTP", category: "Network services", what: "Keeps clocks in sync.", note: "Accurate time is vital for logs and Kerberos. Misconfigured servers can be abused for amplification DDoS." },
  { port: 135, proto: "TCP", service: "Microsoft RPC", category: "Windows", what: "Windows remote procedure call endpoint mapper.", note: "Never expose to the internet; heavily used in lateral movement." },
  { port: 137, proto: "UDP", service: "NetBIOS name", category: "Windows", what: "Legacy Windows name service.", note: "Disable where possible.", insecure: true },
  { port: 139, proto: "TCP", service: "NetBIOS session", category: "Windows", what: "Legacy Windows file sharing over NetBIOS.", note: "Legacy; prefer SMB on 445 with modern versions.", insecure: true },
  { port: 143, proto: "TCP", service: "IMAP", category: "Mail", what: "Reads email stored on a server.", note: "Clear text unless STARTTLS. Use IMAPS on 993.", insecure: true },
  { port: 161, proto: "UDP", service: "SNMP", category: "Monitoring & logging", what: "Monitors and manages network devices.", note: "SNMPv1/v2c use a community string sent in clear text (default 'public'). Use SNMPv3.", insecure: true },
  { port: 162, proto: "UDP", service: "SNMP trap", category: "Monitoring & logging", what: "Devices send alerts (traps) to a manager.", note: "Same SNMP version concerns." },
  { port: 389, proto: "TCP/UDP", service: "LDAP", category: "Directory & auth", what: "Directory queries (Active Directory).", note: "Clear text by default. Use LDAPS (636) or StartTLS.", insecure: true },
  { port: 443, proto: "TCP", service: "HTTPS", category: "Web", what: "Encrypted web traffic over TLS (HTTP/3 also uses UDP 443).", note: "Encrypted does not mean safe: the site and app can still be vulnerable or malicious." },
  { port: 445, proto: "TCP", service: "SMB", category: "Windows", what: "Windows file and printer sharing.", note: "Never expose to the internet. Disable SMBv1. Frequent target for worms and ransomware." },
  { port: 465, proto: "TCP", service: "SMTPS", category: "Mail", what: "Mail submission over implicit TLS.", note: "Preferred for clients sending mail securely." },
  { port: 500, proto: "UDP", service: "IKE / ISAKMP", category: "VPN", what: "Negotiates keys for IPsec VPNs.", note: "IPsec also uses UDP 4500 for NAT traversal." },
  { port: 514, proto: "UDP", service: "Syslog", category: "Monitoring & logging", what: "Sends log messages to a central log server or SIEM.", note: "UDP syslog is unreliable and unauthenticated. Prefer TLS syslog (6514).", insecure: true },
  { port: 587, proto: "TCP", service: "SMTP submission", category: "Mail", what: "Email clients submit outgoing mail (with STARTTLS and authentication).", note: "Require authentication and TLS." },
  { port: 636, proto: "TCP", service: "LDAPS", category: "Directory & auth", what: "LDAP over TLS.", note: "Preferred over plain LDAP." },
  { port: 993, proto: "TCP", service: "IMAPS", category: "Mail", what: "IMAP over TLS.", note: "Encrypted mailbox access." },
  { port: 995, proto: "TCP", service: "POP3S", category: "Mail", what: "POP3 over TLS.", note: "Encrypted mail download." },
  { port: 1194, proto: "UDP", service: "OpenVPN", category: "VPN", what: "Default OpenVPN port (can use TCP too).", note: "Use certificates plus MFA." },
  { port: 1433, proto: "TCP", service: "Microsoft SQL Server", category: "Database", what: "SQL Server database connections.", note: "Never expose to the internet; restrict to application servers." },
  { port: 1521, proto: "TCP", service: "Oracle DB listener", category: "Database", what: "Oracle database connections.", note: "Restrict and patch the listener." },
  { port: 3306, proto: "TCP", service: "MySQL / MariaDB", category: "Database", what: "MySQL connections.", note: "Bind to localhost or a private interface; never public." },
  { port: 3389, proto: "TCP", service: "RDP", category: "Remote access", what: "Windows Remote Desktop.", note: "Top ransomware entry point when exposed. Use a VPN or gateway, MFA and Network Level Authentication." },
  { port: 5060, proto: "TCP/UDP", service: "SIP", category: "Network services", what: "Voice-over-IP call signaling (5061 for TLS).", note: "Watch for toll fraud and scanning." },
  { port: 5432, proto: "TCP", service: "PostgreSQL", category: "Database", what: "PostgreSQL connections.", note: "Restrict by network and require TLS." },
  { port: 5900, proto: "TCP", service: "VNC", category: "Remote access", what: "Remote screen sharing.", note: "Often weakly protected. Tunnel through SSH or a VPN.", insecure: true },
  { port: 6379, proto: "TCP", service: "Redis", category: "Database", what: "In-memory data store.", note: "No authentication by default in older setups; never expose it.", insecure: true },
  { port: 8080, proto: "TCP", service: "HTTP alternate", category: "Web", what: "Common alternate web port, proxies and dev servers.", note: "Often forgotten: check what's listening here.", insecure: true },
  { port: 8443, proto: "TCP", service: "HTTPS alternate", category: "Web", what: "Alternate TLS web port, management consoles.", note: "Admin consoles should not face the internet." },
  { port: 9200, proto: "TCP", service: "Elasticsearch", category: "Database", what: "Search and analytics API (used by many SIEMs).", note: "Exposed instances have leaked huge datasets; require authentication.", insecure: true },
  { port: 27017, proto: "TCP", service: "MongoDB", category: "Database", what: "MongoDB connections.", note: "Exposed, unauthenticated instances are a classic breach cause." },
  { port: 51820, proto: "UDP", service: "WireGuard", category: "VPN", what: "Default WireGuard VPN port.", note: "Modern, small and fast VPN." },
];

export const PORT_RANGES = [
  { range: "0-1023", name: "Well-known (system) ports", note: "Assigned for standard services; binding them usually needs administrator rights." },
  { range: "1024-49151", name: "Registered ports", note: "Assigned to specific applications by IANA on request (databases, apps)." },
  { range: "49152-65535", name: "Dynamic / ephemeral ports", note: "Chosen temporarily by your computer as the source port of outgoing connections." },
];

export const PORT_CATEGORIES: PortCategory[] = [
  "Web", "Mail", "Remote access", "File transfer", "Directory & auth", "Database", "Network services", "VPN", "Monitoring & logging", "Windows",
];
