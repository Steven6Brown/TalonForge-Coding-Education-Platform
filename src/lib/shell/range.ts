import { ShellError, VFS, normalize, parentOf, baseName, type FsDef } from "./vfs";
import type { Cmd } from "./shell";

/**
 * Multi-machine "cyber range" commands: ssh / scp / exit between simulated machines, each with its own
 * filesystem and prompt. Inspired by the cloud lab ranges used in cybersecurity courses. Fully simulated.
 * Every machine uses the account `student`; passwords are given in the lab's README.
 */

export type RangeMachine = { fs: FsDef; password: string };

export function makeRangeCommands(machines: Record<string, RangeMachine>): { commands: Record<string, Cmd>; help: Record<string, string> } {
  const vfsCache = new Map<string, VFS>();
  const authed = new Set<string>();
  const vfsOf = (name: string) => {
    let v = vfsCache.get(name);
    if (!v) {
      v = new VFS(machines[name].fs);
      vfsCache.set(name, v);
    }
    return v;
  };

  const commands: Record<string, Cmd> = {
    ssh: (c, a) => {
      const target = a.find((x) => !x.startsWith("-")) ?? "";
      const m = /^(?:([\w.-]+)@)?([\w.-]+)$/.exec(target);
      if (!m) throw new ShellError("usage: ssh student@HOST");
      const [, user = "student", host] = m;
      if (!machines[host]) throw new ShellError(`ssh: Could not resolve hostname ${host}: Name or service not known`);
      if (user !== "student") throw new ShellError(`${user}@${host}: Permission denied (publickey,password).`);
      if (c.shell.host === host) throw new ShellError("You are already on that machine.");
      c.shell.pendingPrompt = {
        label: `${user}@${host}'s password:`,
        onAnswer: (pw) => {
          if (pw !== machines[host].password) return "Permission denied, please try again.\n";
          authed.add(host);
          c.shell.pushContext(vfsOf(host), host);
          return `Welcome to ${host} (simulated Ubuntu 22.04). Type 'exit' to return.\n`;
        },
      };
      return "";
    },

    exit: (c) => {
      if (!c.shell.popContext()) return "You are on the starting machine. Use the other tabs to leave this lab.\n";
      return "logout\nConnection closed.\n";
    },

    scp: (c, a) => {
      const [src, dst] = a.filter((x) => !x.startsWith("-"));
      if (!src || !dst) throw new ShellError("usage: scp SRC DST   (one side may be host:/path)");
      const split = (s: string) => {
        const m = /^(?:[\w.-]+@)?([\w.-]+):(.*)$/.exec(s);
        return m ? { host: m[1], path: m[2] } : { host: null as string | null, path: s };
      };
      const s = split(src);
      const d = split(dst);
      for (const h of [s.host, d.host]) {
        if (h && !machines[h]) throw new ShellError(`ssh: Could not resolve hostname ${h}`);
        if (h && !authed.has(h)) throw new ShellError(`${h}: Permission denied. (Log in once with ssh first in this lab.)`);
      }
      const srcVfs = s.host ? vfsOf(s.host) : c.vfs;
      const dstVfs = d.host ? vfsOf(d.host) : c.vfs;
      const srcPath = normalize(s.path, s.host ? "/home/student" : c.shell.cwd);
      const text = srcVfs.readFile(srcPath, "scp");
      let dstPath = normalize(d.path, d.host ? "/home/student" : c.shell.cwd);
      if (dstVfs.get(dstPath)?.type === "dir") dstPath += "/" + baseName(srcPath);
      if (!dstVfs.get(parentOf(dstPath))) throw new ShellError(`scp: ${d.path}: No such file or directory`);
      dstVfs.write(dstPath, text, false);
      return `${baseName(srcPath)}   100%  ${text.length}B  0.0KB/s   00:00\n`;
    },
  };

  const help: Record<string, string> = {
    ssh: "ssh student@HOST - log in to another lab machine (password prompt)",
    exit: "exit - leave the current remote machine",
    scp: "scp SRC DST - copy a file (use host:/path for a remote side)",
  };
  return { commands, help };
}
