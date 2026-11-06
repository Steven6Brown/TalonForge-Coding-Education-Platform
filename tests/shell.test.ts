import { describe, expect, it } from "vitest";
import { Shell } from "@/lib/shell/shell";
import { FILESYSTEMS, CTF_FLAGS, authLog } from "@/lib/content/filesystems";

const sh = (fs: string) => new Shell(FILESYSTEMS[fs]);
const run = (s: Shell, c: string) => s.run(c).output;

describe("shell basics", () => {
  it("navigates and hides dotfiles unless -a", () => {
    const s = sh("basics");
    run(s, "cd mission/files");
    expect(run(s, "pwd")).toBe("/home/student/mission/files\n");
    expect(run(s, "ls")).not.toContain(".secret");
    expect(run(s, "ls -a")).toContain(".secret");
    expect(run(s, "cat .secret")).toContain("FLAG{hidden_in_plain_sight}");
  });

  it("supports pipes, redirects and && sequencing", () => {
    const s = sh("sandbox");
    run(s, "echo hello > a.txt && echo world >> a.txt");
    expect(run(s, "cat a.txt | wc -l")).toBe("2\n");
    // && short-circuits when the first command fails
    expect(run(s, "nosuchcmd && echo SHOULD_NOT_PRINT")).not.toContain("SHOULD_NOT_PRINT");
  });

  it("respects quotes and variables", () => {
    const s = sh("sandbox");
    expect(run(s, "echo '$HOME' \"$USER\"")).toBe("$HOME student\n");
  });

  it("denies reading protected files", () => {
    expect(run(sh("perms"), "cat /etc/shadow")).toContain("Permission denied");
  });

  it("never touches anything outside the VFS (unknown commands fail)", () => {
    expect(run(sh("sandbox"), "curl http://example.com")).toContain("command not found");
  });
});

describe("shell labs are solvable", () => {
  it("logs: top IP via pipeline", () => {
    const out = run(sh("logs"), "grep 'Failed password' /var/log/auth.log | grep -o 'from [0-9.]*' | cut -d' ' -f2 | sort | uniq -c | sort -rn | head -n 1");
    expect(out).toContain(authLog.topIp);
    expect(out.trim().startsWith("23")).toBe(true);
  });
  it("perms: find -perm 777", () => {
    const s = sh("perms");
    const found = run(s, "find /var/www -perm 777").trim();
    expect(found).toBe("/var/www/html/uploads/backup_old.php");
    expect(run(s, `cat ${found}`)).toContain("FLAG{world_writable_is_a_red_flag}");
  });
  it("recon: telnet host is findable", () => {
    const out = run(sh("recon"), "cat ~/scans/lab-scan.txt");
    expect(out.indexOf("10.10.10.4")).toBeLessThan(out.indexOf("23/tcp"));
  });
  it("ssh: PermitRootLogin visible", () => {
    expect(run(sh("ssh"), "grep -i root /etc/ssh/sshd_config")).toContain("PermitRootLogin yes");
  });
  it("net: the beacon host is findable", () => {
    expect(run(sh("net"), "grep evil-c2 ~/capture.txt | head -n 1")).toContain("10.0.0.31.51877 >");
  });
  it("forensics: backdoor UID 0 account is findable", () => {
    expect(run(sh("forensics"), "grep ':0:0:' /etc/passwd | cut -d: -f1")).toBe("root\nbackup2\n");
  });
  it("ctf: all three flags decode", () => {
    const s = sh("ctf");
    expect(run(s, "cat ctf/note1.b64 | base64 -d").trim()).toBe(CTF_FLAGS[0]);
    expect(run(s, "grep -o 'Message intercepted: .*' ctf/note2.txt | cut -d' ' -f3 | tr 'A-Za-z' 'N-ZA-Mn-za-m'").trim()).toBe(CTF_FLAGS[1]);
    expect(run(s, "grep -o 'FLAG{[a-z_]*}' ctf/access.log").trim()).toBe(CTF_FLAGS[2]);
  });
});

describe("editor, sed/awk/tee and sudo", () => {
  it("nano opens an edit session and saveFile writes it", () => {
    const s = sh("sandbox");
    run(s, "touch test.txt");
    expect(run(s, "cat test.txt")).toBe(""); // touch makes an EMPTY file
    const res = s.run("nano test.txt");
    expect(res.edit?.path).toBe("/home/student/test.txt");
    expect(s.saveFile(res.edit!.path, "hello\n")).toBeNull();
    expect(run(s, "cat test.txt")).toBe("hello\n");
  });
  it("sed, awk, tee, printf work", () => {
    const s = sh("sandbox");
    expect(run(s, "echo 'a:b:c' | awk -F: '{print $1, $3}'")).toBe("a c\n");
    expect(run(s, "echo hello | sed 's/l/L/g'")).toBe("heLLo\n");
    expect(run(s, "echo hi | tee out.txt")).toBe("hi\n");
    expect(run(s, "cat out.txt")).toBe("hi\n");
    expect(run(s, "printf '%s-%s\n' a b")).toBe("a-b\n");
  });
  it("sudo bypasses permission checks", () => {
    const s = sh("perms");
    expect(run(s, "cat /etc/shadow")).toContain("Permission denied");
    expect(run(s, "sudo cat /etc/shadow")).toContain("root:");
  });
});

describe("new labs are solvable", () => {
  it("wargame: dash file, spaces, find -size", () => {
    const s = sh("wargame");
    expect(run(s, "cat inhere/./-file00").trim()).toBe("FLAG{dash_file}");
    expect(run(s, "cat 'spaced/spaces in this filename'").trim()).toBe("FLAG{spaces_need_quotes}");
    const found = run(s, "find maybehere -size 19c").trim();
    expect(run(s, `cat ${found}`).trim()).toBe("FLAG{find_by_size}");
  });
  it("dfir: evidence is in a hidden file", () => {
    const s = sh("dfir");
    expect(run(s, "ls -a evidence")).toContain(".bash_history");
    expect(run(s, "grep wget evidence/.bash_history")).toContain("203.0.113.66/x.sh");
  });
});
