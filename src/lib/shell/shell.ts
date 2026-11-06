import { VFS, ShellError, normalize, baseName, parentOf, HOME, USER, type FsDef, type VNode } from "./vfs";

/* A small bash-like shell simulator. It supports quoting, $VAR expansion, globs, pipes (|),
   sequencing (; &&) and redirects (> >> 2>), plus a curated set of common commands. It never
   runs real commands: everything operates on the in-memory VFS. */

type Tok = { t: "w"; v: string; q: boolean } | { t: "op"; v: "|" | "&&" | ";" | ">" | ">>" | "2>" };

export const COMMAND_HELP: Record<string, string> = {
  pwd: "print working directory",
  cd: "cd [dir] - change directory",
  ls: "ls [-a] [-l] [path...] - list files",
  cat: "cat [-n] file... - print files",
  echo: "echo [-n] text - print text",
  head: "head [-n N] [file] - first lines",
  tail: "tail [-n N] [file] - last lines",
  wc: "wc [-l -w -c] [file] - count lines/words/bytes",
  grep: "grep [-i -v -n -c -r -l -o] pattern [file...] - search text (regex)",
  sort: "sort [-r -n -u] [file] - sort lines",
  uniq: "uniq [-c] [file] - collapse adjacent duplicates",
  cut: "cut -d DELIM -f FIELDS [file] - extract fields",
  tr: "tr [-d] SET1 [SET2] - translate characters (ranges like a-z work)",
  rev: "rev [file] - reverse each line",
  base64: "base64 [-d] [file] - encode/decode base64",
  find: "find [path] [-name PAT] [-type f|d] [-perm MODE] - search for files",
  mkdir: "mkdir [-p] dir... - make directories",
  touch: "touch file... - create empty files",
  rm: "rm [-r -f] path... - remove files",
  cp: "cp src dst - copy a file",
  mv: "mv src dst - move/rename",
  chmod: "chmod MODE file... - change permissions (755, u+x, a-w ...)",
  whoami: "print current user",
  id: "print user identity",
  uname: "uname [-a] - system info",
  date: "print the date",
  hostname: "print host name",
  env: "print environment",
  history: "show command history",
  clear: "clear the screen",
  help: "help [command] - list commands",
};

export type Ctx = { vfs: VFS; shell: Shell; stdin: string | null; err: (m: string) => void };
export type Cmd = (c: Ctx, a: string[]) => string;

export const EXTRA_HELP: Record<string, string> = {
  nano: "nano FILE - open the text editor (also vi, vim). Save with Ctrl+S, close with Esc",
  tee: "tee [-a] FILE - write stdin to a file and to the screen",
  printf: "printf FORMAT [args] - formatted output (%s and \\n)",
  sed: "sed 's/old/new/[g]' [file] - find and replace in text",
  awk: "awk [-F DELIM] '{print $1, $3}' [file] - print selected fields",
  sudo: "sudo COMMAND - run a command as root (simulated)",
  which: "which COMMAND - show whether a command exists",
};

const asLines = (s: string): string[] => {
  if (s === "") return [];
  const l = s.split("\n");
  if (l[l.length - 1] === "") l.pop();
  return l;
};
const toOut = (l: string[]): string => (l.length ? l.join("\n") + "\n" : "");

function parseOpts(args: string[], withVal: string[] = []) {
  const flags = new Set<string>();
  const vals: Record<string, string> = {};
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      rest.push(...args.slice(i + 1));
      break;
    }
    if (/^-\d+$/.test(a)) {
      vals["n"] = a.slice(1);
      continue;
    }
    if (a.startsWith("-") && a.length > 1) {
      for (let j = 1; j < a.length; j++) {
        const f = a[j];
        if (withVal.includes(f)) {
          vals[f] = a.slice(j + 1) || args[++i] || "";
          break;
        }
        flags.add(f);
      }
    } else rest.push(a);
  }
  return { flags, vals, rest };
}

function globToRegex(glob: string, ci = false): RegExp {
  const re = glob.replace(/[.+^${}()|\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp("^" + re + "$", ci ? "i" : "");
}

function expandRange(set: string): string {
  let out = "";
  for (let i = 0; i < set.length; i++) {
    if (set[i + 1] === "-" && i + 2 < set.length) {
      for (let c = set.charCodeAt(i); c <= set.charCodeAt(i + 2); c++) out += String.fromCharCode(c);
      i += 2;
    } else out += set[i];
  }
  return out;
}

function modeString(type: "dir" | "file", mode: number): string {
  const r = "rwxrwxrwx";
  let s = type === "dir" ? "d" : "-";
  for (let i = 0; i < 9; i++) s += mode & (1 << (8 - i)) ? r[i] : "-";
  // setuid bit shows as 's' in the owner-execute position
  if (mode & 0o4000) s = s.slice(0, 3) + (mode & 0o100 ? "s" : "S") + s.slice(4);
  return s;
}

/** Read named files or stdin for text-filter commands. */
function inputs(c: Ctx, files: string[], cmd: string): { name: string; text: string }[] {
  if (files.length === 0) return [{ name: "-", text: c.stdin ?? "" }];
  const res: { name: string; text: string }[] = [];
  for (const f of files) {
    try {
      res.push({ name: f, text: c.vfs.readFile(normalize(f, c.shell.cwd), cmd) });
    } catch (e) {
      if (e instanceof ShellError) c.err(e.message);
      else throw e;
    }
  }
  return res;
}

const commands: Record<string, Cmd> = {
  pwd: (c) => c.shell.cwd + "\n",
  whoami: () => USER + "\n",
  id: () => `uid=1000(${USER}) gid=1000(${USER}) groups=1000(${USER}),27(sudo)\n`,
  hostname: () => "forge\n",
  date: () => "Thu Jan  1 12:00:00 UTC 2026\n",
  uname: (_c, a) =>
    a.includes("-a") ? "Linux forge 6.8.0-training #1 SMP x86_64 GNU/Linux\n" : "Linux\n",
  clear: () => "",
  env: (c) => toOut(Object.entries(c.shell.env).map(([k, v]) => `${k}=${v}`)),
  history: (c) => toOut(c.shell.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`)),
  help: (c, a) => {
    const all = { ...COMMAND_HELP, ...EXTRA_HELP, ...c.shell.extraHelp };
    if (a[0]) return all[a[0]] ? `${a[0]}: ${all[a[0]]}\n` : `help: no help for '${a[0]}'\n`;
    return (
      "Available commands:\n" +
      Object.keys(all)
        .map((k) => `  ${k.padEnd(9)} ${all[k]}`)
        .join("\n") +
      "\nTips: pipes (|), redirects (>), globs (*) and Tab completion work. Use ↑/↓ for history.\n"
    );
  },
  echo: (_c, a) => {
    const nl = a[0] === "-n" ? "" : "\n";
    return (a[0] === "-n" ? a.slice(1) : a).join(" ") + nl;
  },
  cd: (c, a) => {
    const target = normalize(a[0] ?? "~", c.shell.cwd);
    const n = c.vfs.get(target);
    if (!n) throw new ShellError(`cd: ${a[0]}: No such file or directory`);
    if (n.type !== "dir") throw new ShellError(`cd: ${a[0]}: Not a directory`);
    if (!c.vfs.can(n, 1)) throw new ShellError(`cd: ${a[0]}: Permission denied`);
    c.shell.cwd = target;
    return "";
  },
  ls: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const targets = rest.length ? rest : ["."];
    let out = "";
    targets.forEach((t, idx) => {
      const abs = normalize(t, c.shell.cwd);
      const n = c.vfs.get(abs);
      if (!n) {
        c.err(`ls: cannot access '${t}': No such file or directory`);
        return;
      }
      const row = (name: string, node: NonNullable<typeof n>) =>
        flags.has("l")
          ? `${modeString(node.type, node.mode)} 1 ${node.owner} ${node.owner} ${String(
              node.type === "file" ? node.content.length : 4096,
            ).padStart(5)} Jan  1 12:00 ${name}${node.type === "dir" && !flags.has("l") ? "/" : ""}`
          : name;
      if (n.type === "file") {
        out += row(t, n) + "\n";
        return;
      }
      if (!c.vfs.can(n, 4)) {
        c.err(`ls: cannot open directory '${t}': Permission denied`);
        return;
      }
      if (targets.length > 1) out += (idx ? "\n" : "") + t + ":\n";
      let names = c.vfs.list(abs);
      if (!flags.has("a")) names = names.filter((x) => !x.startsWith("."));
      const entries: [string, VNode][] = names.map((nm) => [
        nm,
        c.vfs.get((abs === "/" ? "" : abs) + "/" + nm)!,
      ]);
      if (flags.has("a")) entries.unshift(["..", n], [".", n]);
      if (flags.has("l")) out += toOut(entries.map(([nm, nd]) => row(nm, nd)));
      else out += entries.length ? entries.map(([nm]) => nm).join("  ") + "\n" : "";
    });
    return out;
  },
  cat: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const text = inputs(c, rest, "cat")
      .map((i) => i.text)
      .join("");
    if (!flags.has("n")) return text;
    return toOut(asLines(text).map((l, i) => `${String(i + 1).padStart(6)}\t${l}`));
  },
  head: (c, a) => {
    const { vals, rest } = parseOpts(a, ["n"]);
    const n = Number(vals.n ?? 10);
    return toOut(inputs(c, rest, "head").flatMap((i) => asLines(i.text).slice(0, n)));
  },
  tail: (c, a) => {
    const { vals, rest } = parseOpts(a, ["n"]);
    const n = Number(vals.n ?? 10);
    return toOut(inputs(c, rest, "tail").flatMap((i) => asLines(i.text).slice(-n)));
  },
  wc: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const all = !flags.has("l") && !flags.has("w") && !flags.has("c");
    return inputs(c, rest, "wc")
      .map((i) => {
        const parts: number[] = [];
        if (all || flags.has("l")) parts.push(i.text.split("\n").length - 1);
        if (all || flags.has("w")) parts.push(i.text.split(/\s+/).filter(Boolean).length);
        if (all || flags.has("c")) parts.push(i.text.length);
        return parts.join(" ") + (i.name !== "-" ? " " + i.name : "") + "\n";
      })
      .join("");
  },
  grep: (c, a) => {
    const { flags, vals, rest } = parseOpts(a, ["e"]);
    let pattern: string | undefined = vals.e;
    const files = [...rest];
    if (pattern === undefined) pattern = files.shift();
    if (pattern === undefined) throw new ShellError("grep: usage: grep [options] pattern [file...]");
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.has("i") ? "i" : "");
    } catch {
      throw new ShellError(`grep: invalid regular expression: ${pattern}`);
    }
    let srcs: { name: string; text: string }[];
    if (flags.has("r") || flags.has("R")) {
      const roots = files.length ? files : ["."];
      srcs = [];
      for (const r of roots) {
        const abs = normalize(r, c.shell.cwd);
        for (const p of c.vfs.walk(abs)) {
          const n = c.vfs.get(p);
          if (n?.type === "file" && c.vfs.can(n, 4)) {
            const disp = (r === "/" ? "" : r.replace(/\/$/, "")) + p.slice(abs === "/" ? 0 : abs.length);
            srcs.push({ name: disp, text: n.content });
          }
        }
      }
    } else srcs = inputs(c, files, "grep");
    const multi = srcs.length > 1 || flags.has("r") || flags.has("R");
    const out: string[] = [];
    for (const s of srcs) {
      let count = 0;
      asLines(s.text).forEach((line, idx) => {
        const hit = re.test(line) !== flags.has("v");
        if (!hit) return;
        count++;
        if (flags.has("c") || flags.has("l")) return;
        const prefix = (multi ? s.name + ":" : "") + (flags.has("n") ? idx + 1 + ":" : "");
        if (flags.has("o") && !flags.has("v")) {
          const g = new RegExp(re.source, re.flags.includes("i") ? "gi" : "g");
          for (const m of line.matchAll(g)) if (m[0]) out.push(prefix + m[0]);
        } else out.push(prefix + line);
      });
      if (flags.has("c")) out.push((multi ? s.name + ":" : "") + count);
      else if (flags.has("l") && count) out.push(s.name);
    }
    return toOut(out);
  },
  sort: (c, a) => {
    const { flags, rest } = parseOpts(a);
    let l = inputs(c, rest, "sort").flatMap((i) => asLines(i.text));
    l = flags.has("n")
      ? l.sort((x, y) => (parseFloat(x) || 0) - (parseFloat(y) || 0))
      : l.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    if (flags.has("u")) l = l.filter((x, i) => l.indexOf(x) === i);
    if (flags.has("r")) l.reverse();
    return toOut(l);
  },
  uniq: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const res: [string, number][] = [];
    for (const line of inputs(c, rest, "uniq").flatMap((i) => asLines(i.text))) {
      const last = res[res.length - 1];
      if (last && last[0] === line) last[1]++;
      else res.push([line, 1]);
    }
    return toOut(res.map(([l, n]) => (flags.has("c") ? `${String(n).padStart(7)} ${l}` : l)));
  },
  cut: (c, a) => {
    const { vals, rest } = parseOpts(a, ["d", "f"]);
    const d = vals.d ?? "\t";
    if (!vals.f) throw new ShellError("cut: you must specify a list of fields (-f)");
    const idxs = vals.f.split(",").flatMap((p) => {
      const [s, e] = p.split("-").map(Number);
      return e ? Array.from({ length: e - s + 1 }, (_, i) => s + i) : [s];
    });
    return toOut(
      inputs(c, rest, "cut")
        .flatMap((i) => asLines(i.text))
        .map((line) => {
          const parts = line.split(d);
          return idxs.map((i) => parts[i - 1]).filter((x) => x !== undefined).join(d);
        }),
    );
  },
  tr: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const text = c.stdin ?? "";
    if (flags.has("d")) {
      const del = expandRange(rest[0] ?? "");
      return [...text].filter((ch) => !del.includes(ch)).join("");
    }
    if (rest.length < 2) throw new ShellError("tr: missing operand");
    const s1 = expandRange(rest[0]);
    const s2 = expandRange(rest[1]);
    return [...text]
      .map((ch) => {
        const i = s1.indexOf(ch);
        return i < 0 ? ch : (s2[Math.min(i, s2.length - 1)] ?? ch);
      })
      .join("");
  },
  rev: (c, a) =>
    toOut(
      inputs(c, parseOpts(a).rest, "rev")
        .flatMap((i) => asLines(i.text))
        .map((l) => [...l].reverse().join("")),
    ),
  nano: (c, a) => {
    const f = a.find((x) => !x.startsWith("-"));
    if (!f) throw new ShellError("nano: usage: nano FILE");
    const abs = normalize(f, c.shell.cwd);
    const n = c.vfs.get(abs);
    if (n?.type === "dir") throw new ShellError(`nano: ${f}: Is a directory`);
    if (n && !c.vfs.can(n, 4)) throw new ShellError(`nano: ${f}: Permission denied`);
    if (!n && !c.vfs.get(parentOf(abs))) throw new ShellError(`nano: ${f}: No such file or directory`);
    c.shell.pendingEdit = { path: abs, display: f, content: n?.type === "file" ? n.content : "" };
    return "";
  },
  tee: (c, a) => {
    const { flags, rest } = parseOpts(a);
    const text = c.stdin ?? "";
    for (const f of rest) c.vfs.write(normalize(f, c.shell.cwd), text, flags.has("a"));
    return text;
  },
  printf: (_c, a) => {
    const [fmt = "", ...args] = a;
    let i = 0;
    const filled = fmt.replace(/%[sd]/g, () => args[i++] ?? "");
    return filled.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\");
  },
  sed: (c, a) => {
    const { rest } = parseOpts(a);
    const expr = rest.shift() ?? "";
    const m = /^s(.)(.*?)\1(.*?)\1([gi]*)$/.exec(expr);
    if (!m) throw new ShellError("sed: only s/old/new/[gi] is supported in this simulator");
    let re: RegExp;
    try {
      re = new RegExp(m[2], (m[4].includes("g") ? "g" : "") + (m[4].includes("i") ? "i" : ""));
    } catch {
      throw new ShellError("sed: invalid regular expression");
    }
    return toOut(
      inputs(c, rest, "sed")
        .flatMap((i) => asLines(i.text))
        .map((l) => l.replace(re, m[3])),
    );
  },
  awk: (c, a) => {
    const { vals, rest } = parseOpts(a, ["F"]);
    const prog = rest.shift() ?? "";
    const m = /^\{\s*print\s*(.*?)\s*;?\s*\}$/.exec(prog);
    if (!m) throw new ShellError("awk: only '{print $1, $2 ...}' is supported in this simulator");
    const parts = m[1] ? m[1].split(/\s*,\s*/) : ["$0"];
    const d = vals.F;
    return toOut(
      inputs(c, rest, "awk")
        .flatMap((i) => asLines(i.text))
        .map((line) => {
          const f = d ? line.split(d) : line.trim().split(/\s+/);
          return parts
            .map((p) => {
              if (p === "$0") return line;
              if (p === "$NF") return f[f.length - 1] ?? "";
              const idx = /^\$(\d+)$/.exec(p);
              if (idx) return f[Number(idx[1]) - 1] ?? "";
              const lit = /^"(.*)"$/.exec(p);
              return lit ? lit[1] : p;
            })
            .join(" ");
        }),
    );
  },
  which: (c, a) => a.map((n) => (commands[n] || c.shell.extra[n] ? `/usr/bin/${n}\n` : "")).join(""),
  base64: (c, a) => {
    const { flags, rest } = parseOpts(a, []);
    const text = inputs(c, rest, "base64").map((i) => i.text).join("");
    try {
      if (flags.has("d") || flags.has("D")) return atob(text.replace(/\s+/g, "")) + "\n";
      return btoa(text) + "\n";
    } catch {
      throw new ShellError("base64: invalid input");
    }
  },
  mkdir: (c, a) => {
    const { flags, rest } = parseOpts(a);
    for (const d of rest) {
      const abs = normalize(d, c.shell.cwd);
      if (c.vfs.exists(abs)) {
        if (!flags.has("p")) c.err(`mkdir: cannot create directory '${d}': File exists`);
        continue;
      }
      const par = c.vfs.get(parentOf(abs));
      if (!par && flags.has("p")) {
        let cur = "";
        for (const seg of abs.split("/").filter(Boolean)) {
          cur += "/" + seg;
          if (!c.vfs.exists(cur)) c.vfs.nodes.set(cur, { type: "dir", mode: 0o755, owner: USER });
        }
      } else if (!par) c.err(`mkdir: cannot create directory '${d}': No such file or directory`);
      else if (!c.vfs.can(par, 2)) c.err(`mkdir: cannot create directory '${d}': Permission denied`);
      else c.vfs.nodes.set(abs, { type: "dir", mode: 0o755, owner: USER });
    }
    return "";
  },
  touch: (c, a) => {
    for (const f of a) {
      const abs = normalize(f, c.shell.cwd);
      if (!c.vfs.exists(abs)) c.vfs.write(abs, "", false);
    }
    return "";
  },
  rm: (c, a) => {
    const { flags, rest } = parseOpts(a);
    for (const f of rest) {
      const abs = normalize(f, c.shell.cwd);
      const n = c.vfs.get(abs);
      if (!n) {
        if (!flags.has("f")) c.err(`rm: cannot remove '${f}': No such file or directory`);
        continue;
      }
      const par = c.vfs.get(parentOf(abs));
      if (par && !c.vfs.can(par, 2)) {
        c.err(`rm: cannot remove '${f}': Permission denied`);
        continue;
      }
      if (n.type === "dir" && !flags.has("r")) {
        c.err(`rm: cannot remove '${f}': Is a directory`);
        continue;
      }
      if (abs === "/" || abs === HOME) {
        c.err(`rm: refusing to remove '${f}'`);
        continue;
      }
      for (const p of c.vfs.walk(abs)) c.vfs.nodes.delete(p);
    }
    return "";
  },
  cp: (c, a) => {
    const [s, d] = parseOpts(a).rest;
    if (!s || !d) throw new ShellError("cp: missing file operand");
    const text = c.vfs.readFile(normalize(s, c.shell.cwd), "cp");
    let dest = normalize(d, c.shell.cwd);
    if (c.vfs.get(dest)?.type === "dir") dest += "/" + baseName(s);
    c.vfs.write(dest, text, false);
    return "";
  },
  mv: (c, a) => {
    const [s, d] = parseOpts(a).rest;
    if (!s || !d) throw new ShellError("mv: missing file operand");
    const src = normalize(s, c.shell.cwd);
    const node = c.vfs.get(src);
    if (!node) throw new ShellError(`mv: cannot stat '${s}': No such file or directory`);
    let dest = normalize(d, c.shell.cwd);
    if (c.vfs.get(dest)?.type === "dir") dest += "/" + baseName(s);
    c.vfs.nodes.set(dest, node);
    c.vfs.nodes.delete(src);
    return "";
  },
  chmod: (c, a) => {
    const [mode, ...files] = a;
    if (!mode || !files.length) throw new ShellError("chmod: missing operand");
    for (const f of files) {
      const abs = normalize(f, c.shell.cwd);
      const n = c.vfs.get(abs);
      if (!n) {
        c.err(`chmod: cannot access '${f}': No such file or directory`);
        continue;
      }
      if (n.owner !== USER) {
        c.err(`chmod: changing permissions of '${f}': Operation not permitted`);
        continue;
      }
      if (/^[0-7]{3,4}$/.test(mode)) n.mode = parseInt(mode.slice(-3), 8);
      else {
        const m = /^([ugoa]*)([+-])([rwx]+)$/.exec(mode);
        if (!m) throw new ShellError(`chmod: invalid mode: '${mode}'`);
        const who = m[1] || "a";
        let bits = 0;
        for (const p of m[3]) {
          const b = p === "r" ? 4 : p === "w" ? 2 : 1;
          if (who.includes("u") || who.includes("a")) bits |= b << 6;
          if (who.includes("g") || who.includes("a")) bits |= b << 3;
          if (who.includes("o") || who.includes("a")) bits |= b;
        }
        n.mode = m[2] === "+" ? n.mode | bits : n.mode & ~bits;
      }
    }
    return "";
  },
  find: (c, a) => {
    const starts: string[] = [];
    let i = 0;
    while (i < a.length && !a[i].startsWith("-")) starts.push(a[i++]);
    const conds: ((p: string, n: NonNullable<ReturnType<VFS["get"]>>) => boolean)[] = [];
    for (; i < a.length; i += 2) {
      const flag = a[i];
      const val = a[i + 1];
      if (val === undefined) throw new ShellError(`find: missing argument to '${flag}'`);
      if (flag === "-name" || flag === "-iname") {
        const re = globToRegex(val, flag === "-iname");
        conds.push((p) => re.test(baseName(p)));
      } else if (flag === "-type") {
        conds.push((_p, n) => (val === "d" ? n.type === "dir" : val === "f" ? n.type === "file" : false));
      } else if (flag === "-perm") {
        const atLeast = val.startsWith("-");
        const want = parseInt(val.replace(/^[-/]/, ""), 8);
        conds.push((_p, n) => (atLeast ? (n.mode & want) === want : (n.mode & 0o777) === want));
      } else if (flag === "-size") {
        // N (512-byte blocks), Nc (bytes), Nk (KiB), like GNU find
        const m = /^(\d+)([ck]?)$/.exec(val);
        if (!m) throw new ShellError(`find: invalid argument '${val}' to '-size'`);
        const want = Number(m[1]);
        conds.push((_p, n) => {
          if (n.type !== "file") return false;
          const len = n.content.length;
          return m[2] === "c" ? len === want : Math.ceil(len / (m[2] === "k" ? 1024 : 512)) === want;
        });
      } else if (flag === "-user") {
        conds.push((_p, n) => n.owner === val);
      } else throw new ShellError(`find: unknown predicate '${flag}'`);
    }
    const out: string[] = [];
    for (const s of starts.length ? starts : ["."]) {
      const abs = normalize(s, c.shell.cwd);
      if (!c.vfs.exists(abs)) {
        c.err(`find: '${s}': No such file or directory`);
        continue;
      }
      for (const p of c.vfs.walk(abs)) {
        const n = c.vfs.get(p)!;
        if (conds.every((f) => f(p, n))) {
          const rel = p.slice(abs.length);
          out.push(abs === "/" ? p : s.replace(/\/$/, "") + rel);
        }
      }
    }
    return toOut(out);
  },
};

// Aliases for familiar names
commands.vi = commands.nano;
commands.vim = commands.nano;
commands.less = commands.cat;
commands.more = commands.cat;
commands.man = (c, a) => commands.help(c, a);

export class Shell {
  vfs: VFS;
  cwd = HOME;
  history: string[] = [];
  env: Record<string, string> = { HOME, USER, SHELL: "/bin/bash", PWD: HOME, PATH: "/usr/local/bin:/usr/bin:/bin" };

  /** Extra commands for themed labs (e.g. the simulated Kali toolset). */
  extra: Record<string, Cmd>;
  extraHelp: Record<string, string> = {};
  host: string;
  /** Set by `nano`/`vi`; the Terminal UI opens its editor panel when this is present after a run. */
  pendingEdit: { path: string; display: string; content: string } | null = null;

  constructor(def: FsDef, opts: { extra?: Record<string, Cmd>; extraHelp?: Record<string, string>; host?: string } = {}) {
    this.vfs = new VFS(def);
    this.extra = opts.extra ?? {};
    this.extraHelp = opts.extraHelp ?? {};
    this.host = opts.host ?? "forge";
  }

  /** Saves text from the editor panel into the virtual filesystem. Returns an error message or null. */
  saveFile(path: string, content: string): string | null {
    try {
      this.vfs.write(path, content, false);
      return null;
    } catch (e) {
      return e instanceof ShellError ? e.message : "Could not save file";
    }
  }

  prompt(): string {
    const d = this.cwd === HOME ? "~" : this.cwd.startsWith(HOME + "/") ? "~" + this.cwd.slice(HOME.length) : this.cwd;
    return `${USER}@${this.host}:${d}$`;
  }

  private tokenize(line: string): Tok[] {
    const toks: Tok[] = [];
    let i = 0;
    const n = line.length;
    const expandVar = (s: string, at: number): [string, number] => {
      // s[at] === '$'
      const m = /^\$(?:\{(\w+)\}|(\w+))/.exec(s.slice(at));
      if (!m) return ["$", at + 1];
      return [this.env[m[1] ?? m[2]] ?? "", at + m[0].length];
    };
    while (i < n) {
      const ch = line[i];
      if (ch === " " || ch === "\t") {
        i++;
        continue;
      }
      if (ch === "|") {
        toks.push({ t: "op", v: "|" });
        i++;
        continue;
      }
      if (ch === ";") {
        toks.push({ t: "op", v: ";" });
        i++;
        continue;
      }
      if (ch === "&" && line[i + 1] === "&") {
        toks.push({ t: "op", v: "&&" });
        i += 2;
        continue;
      }
      if (ch === ">") {
        if (line[i + 1] === ">") {
          toks.push({ t: "op", v: ">>" });
          i += 2;
        } else {
          toks.push({ t: "op", v: ">" });
          i++;
        }
        continue;
      }
      if (ch === "2" && line[i + 1] === ">" && (i === 0 || /\s/.test(line[i - 1]))) {
        toks.push({ t: "op", v: "2>" });
        i += 2;
        continue;
      }
      let word = "";
      let quoted = false;
      let first = true;
      while (i < n && !/[\s|;><]/.test(line[i]) && !(line[i] === "&" && line[i + 1] === "&")) {
        const c = line[i];
        if (c === "'") {
          const end = line.indexOf("'", i + 1);
          if (end < 0) throw new ShellError("bash: unexpected EOF while looking for matching `''");
          word += line.slice(i + 1, end);
          quoted = true;
          i = end + 1;
        } else if (c === '"') {
          i++;
          quoted = true;
          let closed = false;
          while (i < n) {
            if (line[i] === '"') {
              closed = true;
              i++;
              break;
            }
            if (line[i] === "\\" && i + 1 < n && /["\\$]/.test(line[i + 1])) {
              word += line[i + 1];
              i += 2;
            } else if (line[i] === "$") {
              const [v, ni] = expandVar(line, i);
              word += v;
              i = ni;
            } else word += line[i++];
          }
          if (!closed) throw new ShellError('bash: unexpected EOF while looking for matching `"\'');
        } else if (c === "\\" && i + 1 < n) {
          word += line[i + 1];
          quoted = true;
          i += 2;
        } else if (c === "$") {
          const [v, ni] = expandVar(line, i);
          word += v;
          i = ni;
        } else if (c === "~" && first && (i + 1 >= n || /[\s/|;]/.test(line[i + 1]))) {
          word += HOME;
          i++;
        } else {
          word += c;
          i++;
        }
        first = false;
      }
      toks.push({ t: "w", v: word, q: quoted });
    }
    return toks;
  }

  private glob(word: string): string[] {
    if (!/[*?]/.test(word)) return [word];
    const slash = word.lastIndexOf("/");
    const dirPart = slash >= 0 ? word.slice(0, slash + 1) : "";
    const pat = globToRegex(word.slice(slash + 1));
    const dirAbs = normalize(dirPart || ".", this.cwd);
    const dn = this.vfs.get(dirAbs);
    if (!dn || dn.type !== "dir") return [word];
    const showHidden = word.slice(slash + 1).startsWith(".");
    const m = this.vfs
      .list(dirAbs)
      .filter((x) => pat.test(x) && (showHidden || !x.startsWith(".")))
      .map((x) => dirPart + x);
    return m.length ? m : [word];
  }

  run(line: string): { output: string; clear: boolean; edit: { path: string; display: string; content: string } | null } {
    this.pendingEdit = null;
    const res = this.runInner(line);
    return { ...res, edit: this.pendingEdit };
  }

  private runInner(line: string): { output: string; clear: boolean } {
    const trimmed = line.trim();
    if (!trimmed) return { output: "", clear: false };
    this.history.push(trimmed);
    if (this.history.length > 200) this.history.shift();
    this.env.PWD = this.cwd;
    let output = "";
    let clear = false;
    const errs: string[] = [];
    const err = (m: string) => errs.push(m);
    try {
      const toks = this.tokenize(trimmed);
      // split into sequences by ; and &&
      const seqs: { toks: Tok[]; sep: ";" | "&&" | null }[] = [];
      let cur: Tok[] = [];
      for (const t of toks) {
        if (t.t === "op" && (t.v === ";" || t.v === "&&")) {
          seqs.push({ toks: cur, sep: t.v });
          cur = [];
        } else cur.push(t);
      }
      seqs.push({ toks: cur, sep: null });

      let prevOk = true;
      let prevSep: ";" | "&&" | null = null;
      for (const s of seqs) {
        if (prevSep === "&&" && !prevOk) {
          prevSep = s.sep;
          continue;
        }
        const before = errs.length;
        const res = this.runPipeline(s.toks, err);
        output += res.out;
        if (res.clear) clear = true;
        prevOk = errs.length === before;
        prevSep = s.sep;
      }
    } catch (e) {
      if (e instanceof ShellError) err(e.message);
      else err("bash: internal error");
    }
    return { output: errs.map((e) => e + "\n").join("") + output, clear };
  }

  private runPipeline(toks: Tok[], err: (m: string) => void): { out: string; clear: boolean } {
    const stages: Tok[][] = [[]];
    for (const t of toks) {
      if (t.t === "op" && t.v === "|") stages.push([]);
      else stages[stages.length - 1].push(t);
    }
    let data: string | null = null;
    let clear = false;
    for (let si = 0; si < stages.length; si++) {
      const st = stages[si];
      const words: string[] = [];
      let redirect: { op: ">" | ">>"; target: string } | null = null;
      let discardErr = false;
      for (let k = 0; k < st.length; k++) {
        const t = st[k];
        if (t.t === "w") {
          words.push(...(t.q ? [t.v] : this.glob(t.v)));
        } else {
          const next = st[k + 1];
          if (!next || next.t !== "w") throw new ShellError("bash: syntax error near unexpected token `newline'");
          if (t.v === "2>") discardErr = true;
          else redirect = { op: t.v as ">" | ">>", target: next.v };
          k++;
        }
      }
      if (words.length === 0) {
        if (st.length === 0) throw new ShellError("bash: syntax error near unexpected token `|'");
        continue;
      }
      let [name, ...args] = words;
      const stageErr = discardErr ? () => {} : err;
      let out = "";
      // `sudo cmd ...` runs cmd with permission checks bypassed (simulated root)
      let asRoot = false;
      if (name === "sudo") {
        if (args.length === 0) {
          stageErr("usage: sudo COMMAND");
          continue;
        }
        asRoot = true;
        [name, ...args] = args;
      }
      if (name === "clear") clear = true;
      const fn = commands[name] ?? this.extra[name];
      if (fn) {
        this.vfs.root = asRoot;
        try {
          out = fn({ vfs: this.vfs, shell: this, stdin: data, err: stageErr }, args);
        } catch (e) {
          if (e instanceof ShellError) stageErr(e.message);
          else throw e;
        } finally {
          this.vfs.root = false;
        }
      } else if (name.startsWith("./") || name.startsWith("/")) {
        const abs = normalize(name, this.cwd);
        const n = this.vfs.get(abs);
        if (!n) stageErr(`bash: ${name}: No such file or directory`);
        else if (n.type === "dir") stageErr(`bash: ${name}: Is a directory`);
        else if (!(n.mode & 0o100)) stageErr(`bash: ${name}: Permission denied`);
        else stageErr(`bash: ${name}: scripts are not executed in this simulator`);
      } else {
        stageErr(`bash: ${name}: command not found`);
      }
      if (redirect) {
        const abs = normalize(redirect.target, this.cwd);
        try {
          this.vfs.write(abs, out, redirect.op === ">>");
        } catch (e) {
          if (e instanceof ShellError) stageErr(`bash: ${redirect.target}: ${e.message.replace(/^.*?: /, "")}`);
          else throw e;
        }
        out = "";
      }
      data = out;
    }
    return { out: data ?? "", clear };
  }

  /** Very small Tab completion: completes the last word against the cwd (or a path prefix). */
  complete(line: string): string {
    const m = /(\S*)$/.exec(line);
    const word = m ? m[1] : "";
    const slash = word.lastIndexOf("/");
    const dirPart = slash >= 0 ? word.slice(0, slash + 1) : "";
    const frag = word.slice(slash + 1);
    const dirAbs = normalize(dirPart || ".", this.cwd);
    const dn = this.vfs.get(dirAbs);
    if (!dn || dn.type !== "dir") return line;
    const matches = this.vfs.list(dirAbs).filter((x) => x.startsWith(frag));
    if (matches.length !== 1) return line;
    const full = (dirAbs === "/" ? "" : dirAbs) + "/" + matches[0];
    const isDir = this.vfs.get(full)?.type === "dir";
    return line.slice(0, line.length - frag.length) + matches[0] + (isDir ? "/" : " ");
  }
}
