## Testing your own web apps

**OWASP ZAP** (Zed Attack Proxy) is a free, open-source tool for finding vulnerabilities in web applications. It works as a proxy between your browser and the app, so it can observe and test traffic.

## Scan types

- **Passive scan:** analyzes the requests and responses that pass through ZAP and flags issues such as missing security headers, insecure cookies and information leaks. It sends no attack payloads.
- **Spidering / crawling:** discovers pages and parameters.
- **Active scan:** sends test payloads to look for flaws such as injection or XSS. This can change data or stress the app, so it requires **authorization** and is best done against a test environment.

## Triage the findings

1. Read the alert description and risk level.
2. **Verify** manually: scanners produce false positives and miss business-logic flaws.
3. Rate the real risk (impact and likelihood).
4. Fix, then re-scan to confirm.

## Related: reconnaissance of a web site

Passive reconnaissance (public pages, DNS records, certificate logs, technology fingerprints) shows what an outsider can learn without touching the system. Run it against your own sites, and test only applications you own or are authorized to assess; OWASP Juice Shop and DVWA are built for practice.

## Check yourself

Take the quiz below.
