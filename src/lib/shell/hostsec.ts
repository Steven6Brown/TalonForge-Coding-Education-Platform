import { ShellError } from "./vfs";
import type { Cmd } from "./shell";

/**
 * Simulated Linux host-hardening tools (ufw, systemctl, chage, labcheck) with per-terminal state.
 * Mirrors what a sysadmin does when securing a server: restrict the firewall, turn off unneeded
 * services and enforce password aging. Everything is in memory; nothing touches a real system.
 */

type Rule = { to: string; action: "ALLOW" | "DENY"; from: string };
type Svc = { desc: string; active: boolean; enabled: boolean };

const NAMED_PORTS: Record<string, string> = { ssh: "22/tcp", http: "80/tcp", https: "443/tcp", telnet: "23/tcp" };

export function makeHostSecCommands(): { commands: Record<string, Cmd>; help: Record<string, string> } {
  const ufw = { enabled: false, defIn: "allow", defOut: "allow", rules: [] as Rule[] };
  const services: Record<string, Svc> = {
    sshd: { desc: "OpenSSH server daemon", active: true, enabled: true },
    cron: { desc: "Regular background program processing daemon", active: true, enabled: true },
    "avahi-daemon": { desc: "Avahi mDNS/DNS-SD Stack", active: true, enabled: true },
    cups: { desc: "CUPS Scheduler (printing)", active: true, enabled: true },
    apache2: { desc: "The Apache HTTP Server", active: true, enabled: true },
  };
  const aging: Record<string, { max: number; warn: number }> = { jdoe: { max: 99999, warn: 7 }, tempadmin: { max: 99999, warn: 7 } };

  const needRoot = (c: Parameters<Cmd>[0], what: string) => {
    if (!c.vfs.root) throw new ShellError(what);
  };
  const svcName = (s: string) => s.replace(/\.service$/, "");

  const commands: Record<string, Cmd> = {
    ufw: (c, a) => {
      needRoot(c, "ERROR: You need to be root to run this script (try: sudo ufw ...)");
      const [sub, ...rest] = a;
      switch (sub) {
        case "enable":
          ufw.enabled = true;
          return "Firewall is active and enabled on system startup\n";
        case "disable":
          ufw.enabled = false;
          return "Firewall stopped and disabled on system startup\n";
        case "reset":
          ufw.enabled = false;
          ufw.defIn = "allow";
          ufw.defOut = "allow";
          ufw.rules = [];
          return "Resetting all rules to installed defaults.\n";
        case "default": {
          const [policy, dir] = rest;
          if (!["allow", "deny"].includes(policy) || !["incoming", "outgoing"].includes(dir)) {
            throw new ShellError("ERROR: usage: ufw default allow|deny incoming|outgoing");
          }
          if (dir === "incoming") ufw.defIn = policy;
          else ufw.defOut = policy;
          return `Default ${dir} policy changed to '${policy}'\n(be sure to update your rules accordingly)\n`;
        }
        case "allow":
        case "deny": {
          const action = sub === "allow" ? "ALLOW" : "DENY";
          let from = "Anywhere";
          let to = "";
          const fi = rest.indexOf("from");
          if (fi >= 0) {
            from = rest[fi + 1] ?? "Anywhere";
            const pi = rest.indexOf("port");
            to = pi >= 0 ? (rest[pi + 1] ?? "") : "Anywhere";
          } else to = NAMED_PORTS[rest[0]] ?? rest[0] ?? "";
          if (!to) throw new ShellError("ERROR: Need 'to' or 'from' clause");
          if (to !== "Anywhere" && !/^\d+(\/(tcp|udp))?$/.test(to)) throw new ShellError(`ERROR: Bad port '${to}'`);
          ufw.rules.push({ to, action, from });
          return "Rule added\n";
        }
        case "delete": {
          const [act, spec] = rest;
          const to = NAMED_PORTS[spec] ?? spec;
          const before = ufw.rules.length;
          ufw.rules = ufw.rules.filter((r) => !(r.action === (act ?? "").toUpperCase() && r.to === to));
          return ufw.rules.length < before ? "Rule deleted\n" : "Could not delete non-existent rule\n";
        }
        case "status": {
          if (!ufw.enabled) return "Status: inactive\n";
          const verbose = rest[0] === "verbose";
          let out = "Status: active\n";
          if (verbose) out += `Logging: on (low)\nDefault: ${ufw.defIn} (incoming), ${ufw.defOut} (outgoing), disabled (routed)\nNew profiles: skip\n`;
          out += "\nTo                         Action      From\n--                         ------      ----\n";
          for (const r of ufw.rules) out += `${r.to.padEnd(26)} ${(r.action + " IN").padEnd(11)} ${r.from}\n`;
          return out;
        }
        default:
          throw new ShellError("ufw: usage: ufw enable|disable|status [verbose]|default|allow|deny|delete|reset");
      }
    },

    systemctl: (c, a) => {
      const [sub, ...rest] = a;
      if (sub === "list-units") {
        const wantActive = a.includes("--state=active");
        const rows = Object.entries(services).filter(([, s]) => !wantActive || s.active);
        return (
          "UNIT                  LOAD   ACTIVE SUB     DESCRIPTION\n" +
          rows.map(([n, s]) => `${(n + ".service").padEnd(21)} loaded ${s.active ? "active" : "inactive"} ${s.active ? "running" : "dead   "} ${s.desc}`).join("\n") +
          `\n\n${rows.length} loaded units listed.\n`
        );
      }
      const name = svcName(rest[0] ?? "");
      const svc = services[name];
      if (!["status", "stop", "start", "restart", "disable", "enable"].includes(sub ?? "")) {
        throw new ShellError("systemctl: usage: systemctl list-units --type=service --state=active | status|stop|start|disable|enable NAME");
      }
      if (!svc) throw new ShellError(`Failed to ${sub} ${rest[0] ?? ""}: Unit ${rest[0] ?? ""} not found.`);
      if (sub === "status") {
        return `● ${name}.service - ${svc.desc}\n   Loaded: loaded (/lib/systemd/system/${name}.service; ${svc.enabled ? "enabled" : "disabled"})\n   Active: ${svc.active ? "active (running)" : "inactive (dead)"}\n`;
      }
      needRoot(c, `Failed to ${sub} ${name}.service: Access denied (try: sudo systemctl ${sub} ${name})`);
      if (sub === "stop") svc.active = false;
      else if (sub === "start" || sub === "restart") svc.active = true;
      else if (sub === "disable") svc.enabled = false;
      else if (sub === "enable") svc.enabled = true;
      return sub === "disable" ? `Removed /etc/systemd/system/multi-user.target.wants/${name}.service.\n` : sub === "enable" ? `Created symlink for ${name}.service.\n` : "";
    },

    chage: (c, a) => {
      const user = a[a.length - 1];
      const rec = aging[user];
      if (!rec) throw new ShellError(`chage: user '${user}' does not exist`);
      if (a.includes("-l")) {
        return `Last password change\t\t\t\t\t: Jan 01, 2026\nPassword expires\t\t\t\t\t: ${rec.max >= 99999 ? "never" : `after ${rec.max} days`}\nMaximum number of days between password change\t\t: ${rec.max}\nNumber of days of warning before password expires\t: ${rec.warn}\n`;
      }
      needRoot(c, "chage: Permission denied (try: sudo chage ...)");
      for (let i = 0; i < a.length - 1; i++) {
        if (a[i] === "-M") rec.max = Number(a[++i]);
        else if (a[i] === "-W") rec.warn = Number(a[++i]);
      }
      return "";
    },

    labcheck: () => {
      const has = (port: string) => ufw.rules.some((r) => r.action === "ALLOW" && (r.to === port || r.to === `${port}/tcp`));
      const checks: [string, boolean][] = [
        ["Firewall enabled", ufw.enabled],
        ["Default incoming policy is deny", ufw.defIn === "deny"],
        ["SSH (22) allowed", has("22")],
        ["HTTPS (443) allowed", has("443")],
        ["Telnet (23) not allowed", !has("23")],
        ["avahi-daemon stopped and disabled", !services["avahi-daemon"].active && !services["avahi-daemon"].enabled],
        ["cups stopped and disabled", !services.cups.active && !services.cups.enabled],
        ["sshd still running", services.sshd.active],
        ["jdoe password max age 30 days, warning 14", aging.jdoe.max === 30 && aging.jdoe.warn === 14],
      ];
      let out = checks.map(([l, ok]) => `${ok ? "[x]" : "[ ]"} ${l}`).join("\n") + "\n";
      if (checks.every(([, ok]) => ok)) out += "\nAll checks passed. FLAG{layers_of_hardening}\n";
      return out;
    },
  };

  const help: Record<string, string> = {
    ufw: "sudo ufw enable|status verbose|default deny incoming|allow 22/tcp|deny 23 - firewall (simulated)",
    systemctl: "systemctl list-units --type=service --state=active | sudo systemctl stop|disable NAME",
    chage: "sudo chage -M DAYS -W DAYS USER | chage -l USER - password aging",
    labcheck: "labcheck - show which hardening tasks are complete",
  };
  return { commands, help };
}
