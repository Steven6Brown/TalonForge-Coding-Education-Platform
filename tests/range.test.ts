import { describe, expect, it } from "vitest";
import { Shell } from "@/lib/shell/shell";
import { FILESYSTEMS } from "@/lib/content/filesystems";
import { PROFILES } from "@/lib/content/profiles";
import { RANGE_PASSWORD } from "@/lib/content/filesystems-range";

function make(fsId: string): Shell {
  const p = PROFILES[fsId];
  const b = p?.build();
  return new Shell(FILESYSTEMS[fsId], { extra: b?.commands, extraHelp: b?.help, host: p?.host });
}
const run = (s: Shell, c: string) => s.run(c).output;

describe("host security lab", () => {
  it("audits accounts with sudo", () => {
    const s = make("hostsec");
    expect(run(s, "cat /etc/shadow")).toContain("Permission denied");
    const out = run(s, "sudo grep -Ev '!|\\*' /etc/shadow | cut -d: -f1");
    expect(out.trim().split("\n")).toEqual(["root", "jdoe", "tempadmin"]);
  });

  it("labcheck prints the flag only after every task is done", () => {
    const s = make("hostsec");
    expect(run(s, "labcheck")).not.toContain("FLAG{");
    expect(run(s, "ufw enable")).toContain("root"); // needs sudo
    for (const c of [
      "sudo ufw default deny incoming",
      "sudo ufw allow 22/tcp",
      "sudo ufw allow 443/tcp",
      "sudo ufw enable",
      "sudo systemctl stop avahi-daemon",
      "sudo systemctl disable avahi-daemon",
      "sudo systemctl stop cups",
      "sudo systemctl disable cups",
      "sudo chage -M 30 -W 14 jdoe",
    ]) {
      run(s, c);
    }
    expect(run(s, "labcheck")).toContain("FLAG{layers_of_hardening}");
    expect(run(s, "sudo ufw status verbose")).toContain("Default: deny (incoming)");
    expect(run(s, "chage -l jdoe")).toContain("Maximum number of days between password change\t\t: 30");
  });
});

describe("multi-machine range", () => {
  it("ssh with a password prompt switches machines; exit returns", () => {
    const s = make("range");
    const r = s.run("ssh student@web01");
    expect(r.prompt?.label).toContain("password");
    expect(s.answerPrompt("wrong")).toContain("Permission denied");
    expect(s.host).toBe("workstation");
    s.run("ssh student@web01");
    expect(s.answerPrompt(RANGE_PASSWORD)).toContain("Welcome to web01");
    expect(s.prompt()).toContain("@web01");
    const top = run(s, "grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1");
    expect(top).toContain("203.0.113.45");
    expect(run(s, "exit")).toContain("logout");
    expect(s.host).toBe("workstation");
  });

  it("scp copies a file back and db01 config exposes bind-address", () => {
    const s = make("range");
    s.run("ssh student@db01");
    s.answerPrompt(RANGE_PASSWORD);
    expect(run(s, "cat /etc/mysql/mysqld.cnf")).toContain("bind-address = 0.0.0.0");
    run(s, "exit");
    expect(run(s, "scp db01:/etc/motd motd.txt")).toContain("100%");
    expect(run(s, "cat motd.txt")).toContain("db01");
  });
});

describe("forensics integrity lab", () => {
  it("sha256sum -c flags the altered file", () => {
    const s = make("dfir2");
    const out = run(s, "cd case && sha256sum -c recorded-hashes.txt");
    expect(out).toContain("email_export.txt: OK");
    expect(out).toContain("browser_history.txt: FAILED");
    expect(out).toContain("notes.txt: OK");
  });
});

describe("text processing", () => {
  it("top failed IP has 23 attempts", () => {
    const s = new Shell(FILESYSTEMS.logs);
    const out = s.run("grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 1").output;
    expect(out.trim()).toMatch(/^23\s+203\.0\.113\.45$/);
  });
});
