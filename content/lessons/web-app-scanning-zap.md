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

## Worked example: triaging a scanner finding

Suppose a passive scan of **your own test site** reports:

> **Missing Anti-clickjacking Header** (risk: Medium) on `/login`

Follow the triage steps:

1. **Read the alert.** The site does not send `X-Frame-Options` (or a CSP `frame-ancestors` rule), so another site could embed the login page invisibly in a frame and trick users into clicking (clickjacking).
2. **Verify manually.** Open the browser developer tools, Network tab, and look at the response headers for `/login`. Confirm the header really is missing. (Scanners sometimes report false positives.)
3. **Rate the risk.** Likelihood: moderate, since an attacker would need to lure users to a page. Impact: an unwanted action on a logged-in page. Medium is reasonable.
4. **Fix.** Add `X-Frame-Options: DENY` (or `Content-Security-Policy: frame-ancestors 'none'`).
5. **Re-scan** to confirm the alert is gone.

## Passive versus active, by example

- **Passive:** ZAP reads the traffic your browser already generated and points out missing headers and insecure cookies. It sends no attack payloads, so it is generally safe.
- **Active:** ZAP sends test payloads such as `<script>` strings and SQL fragments to find injection and XSS. It can create or change data. Only run it against a test copy that you own or have **written permission** to test.

## What a scanner cannot do

It misses **business-logic** flaws, such as "a user can change the price in the cart". Humans find those by thinking like a user and an attacker.

## Self-check

1. Which scan needs authorization and a test environment? (Active.)
2. What should you do before fixing a finding? (Verify it manually.)
3. Name two apps built for legal practice. (OWASP Juice Shop and DVWA.)
