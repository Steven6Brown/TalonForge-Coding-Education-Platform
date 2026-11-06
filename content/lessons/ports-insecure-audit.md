## From a scan result to a to-do list

A port scan of your own systems gives a list of open ports. The valuable part is what you do next: for each port decide *should this be open?* and *is it protected properly?*

## Triage questions

1. **Is the service needed?** If not, disable it.
2. **Is it encrypted?** Clear-text services (Telnet 23, FTP 21, HTTP 80, POP3 110, IMAP 143, SNMPv1/v2c 161, LDAP 389, TFTP 69) should be replaced by encrypted versions.
3. **Who can reach it?** Databases (1433, 3306, 5432, 27017, 6379), SMB (445), RDP (3389) and management consoles should be reachable only from specific internal hosts or through a VPN, never from the whole internet.
4. **Is the software patched and authenticated?**

## Safer replacements

| Risky | Replace with |
| --- | --- |
| Telnet 23 | SSH 22 |
| FTP 21 | SFTP (22) or FTPS |
| HTTP 80 | HTTPS 443 (redirect + HSTS) |
| POP3 110 / IMAP 143 | POP3S 995 / IMAPS 993 |
| LDAP 389 | LDAPS 636 |
| SNMPv1/v2c | SNMPv3 |
| Exposed RDP 3389 | RDP behind a VPN/gateway with MFA |

## Your task

Write `auditPorts` that looks up each open port in a table of risky services and returns a readable finding for each. You'll use an object as a lookup table, a loop and `push`.

## Walk-through: from a list of ports to findings

**1. The lookup table.** In the lab, `RISKY` is an **object**: each key is a port number and each value is another small object with the service name and the fix:

```js
const RISKY = {
  21: { service: "FTP", fix: "use SFTP or FTPS" },
  23: { service: "Telnet", fix: "use SSH" },
};
```

Read a value with brackets: `RISKY[23]` is `{ service: "Telnet", fix: "use SSH" }`, and `RISKY[23].service` is `"Telnet"`. A port that is **not** in the table gives `undefined`, which is how you can tell "this one is not risky".

**2. The shape of one finding.** The task wants a text like `23 Telnet: use SSH`. Build it from the pieces:

```js
const info = RISKY[23];
console.log(23 + " " + info.service + ": " + info.fix);
```

Output: `23 Telnet: use SSH`. (A template literal does the same: `` `${port} ${info.service}: ${info.fix}` ``.)

**3. Loop over the open ports.** For each port in `openPorts`, look it up. If it exists, build the text and `push` it onto a results array. If it does not exist, do nothing and move on. Return the array at the end. Because you loop in the order of `openPorts`, the findings keep that order automatically.

```js
const found = [];
for (const port of openPorts) {
  const info = RISKY[port];
  if (info) {
    // build the text and push it to found
  }
}
```

## What the audit teaches

Open ports are not all bad: SSH on 22 is normal. The question is whether each one is **needed**, **encrypted** and **reachable only by the right people**. A scan result becomes a to-do list: "replace Telnet with SSH", "put RDP behind a VPN", "close the database port to the internet".

## If something goes wrong

- A finding is missing: the port is not in `RISKY` (that is expected for ports like 22), or you skipped a port in the loop.
- You see `[object Object]` in your text: you used `RISKY[port]` directly; use its `.service` and `.fix` parts.
- Everything is `undefined`: check you spelled `service` and `fix` exactly as in the table.

## Check yourself

What does `RISKY[9999]` return when 9999 is not in the table? (`undefined`, so the `if (info)` test is false.)
