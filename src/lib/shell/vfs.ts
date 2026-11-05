/** Tiny in-memory virtual filesystem for the shell simulator. Nothing here touches the real machine. */

export type FileDef = string | { c: string; m?: number; o?: string };
export type FsDef = Record<string, FileDef>;

export type VNode =
  | { type: "dir"; mode: number; owner: string }
  | { type: "file"; mode: number; owner: string; content: string };

export class ShellError extends Error {}

export const USER = "student";
export const HOME = "/home/student";

export function normalize(path: string, cwd: string): string {
  let p = path;
  if (p === "~" || p.startsWith("~/")) p = HOME + p.slice(1);
  if (!p.startsWith("/")) p = cwd + "/" + p;
  const out: string[] = [];
  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return "/" + out.join("/");
}

export function parentOf(p: string): string {
  const i = p.lastIndexOf("/");
  return i <= 0 ? "/" : p.slice(0, i);
}
export function baseName(p: string): string {
  return p === "/" ? "/" : p.slice(p.lastIndexOf("/") + 1);
}

export class VFS {
  nodes = new Map<string, VNode>();

  constructor(def: FsDef) {
    this.nodes.set("/", { type: "dir", mode: 0o755, owner: "root" });
    for (const [rawPath, v] of Object.entries(def)) {
      const isDir = rawPath.endsWith("/");
      const path = normalize(rawPath, "/");
      this.ensureParents(path);
      const owner = typeof v === "object" && v.o ? v.o : path.startsWith(HOME) ? USER : "root";
      if (isDir) {
        this.nodes.set(path, { type: "dir", mode: typeof v === "object" && v.m ? v.m : 0o755, owner });
      } else {
        const content = typeof v === "string" ? v : v.c;
        const mode = typeof v === "object" && v.m !== undefined ? v.m : 0o644;
        this.nodes.set(path, { type: "file", mode, owner, content });
      }
    }
  }

  private ensureParents(path: string) {
    const parts = path.split("/").filter(Boolean);
    let cur = "";
    for (let i = 0; i < parts.length - 1; i++) {
      cur += "/" + parts[i];
      if (!this.nodes.has(cur)) {
        this.nodes.set(cur, { type: "dir", mode: 0o755, owner: cur.startsWith(HOME) ? USER : "root" });
      }
    }
  }

  get(path: string): VNode | undefined {
    return this.nodes.get(path);
  }

  exists(path: string): boolean {
    return this.nodes.has(path);
  }

  /** Permission check against the simulated "student" user. */
  can(node: VNode, bit: 4 | 2 | 1): boolean {
    const shift = node.owner === USER ? 6 : 0; // owner bits vs. "other" bits
    return ((node.mode >> shift) & bit) !== 0;
  }

  readFile(path: string, cmd: string): string {
    const n = this.nodes.get(path);
    if (!n) throw new ShellError(`${cmd}: ${path}: No such file or directory`);
    if (n.type === "dir") throw new ShellError(`${cmd}: ${path}: Is a directory`);
    if (!this.can(n, 4)) throw new ShellError(`${cmd}: ${path}: Permission denied`);
    return n.content;
  }

  list(path: string): string[] {
    const prefix = path === "/" ? "/" : path + "/";
    const names: string[] = [];
    for (const k of this.nodes.keys()) {
      if (k !== path && k.startsWith(prefix) && !k.slice(prefix.length).includes("/")) {
        names.push(k.slice(prefix.length));
      }
    }
    return names.sort();
  }

  write(path: string, content: string, append: boolean) {
    const parent = this.nodes.get(parentOf(path));
    if (!parent || parent.type !== "dir") throw new ShellError(`${path}: No such file or directory`);
    const existing = this.nodes.get(path);
    if (existing?.type === "dir") throw new ShellError(`${path}: Is a directory`);
    if (existing && !this.can(existing, 2)) throw new ShellError(`${path}: Permission denied`);
    if (!existing && !this.can(parent, 2)) throw new ShellError(`${path}: Permission denied`);
    const prev = existing && existing.type === "file" && append ? existing.content : "";
    this.nodes.set(path, {
      type: "file",
      mode: existing?.mode ?? 0o644,
      owner: existing?.owner ?? USER,
      content: prev + content,
    });
  }

  /** Descendants of a path (for find / recursive ops), sorted. */
  walk(path: string): string[] {
    const prefix = path === "/" ? "/" : path + "/";
    const res = [path];
    for (const k of [...this.nodes.keys()].sort()) if (k.startsWith(prefix)) res.push(k);
    return res;
  }
}
