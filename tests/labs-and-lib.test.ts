import { describe, expect, it } from "vitest";
import { LESSONS, TRACKS } from "@/lib/content/lessons";
import { checkOutput, normalizeAnswer } from "@/lib/runner";
import { parseBlocks } from "@/lib/markdown-parse";
import { passwordIssues } from "@/lib/auth/password-policy";
import { safeNext } from "@/lib/auth/redirect";
import { mergeProgress } from "@/lib/auth/sync";
import { rankLanguages } from "@/lib/content/atlas";
import fs from "node:fs";
import path from "node:path";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function runJs(code: string): Promise<string> {
  let out = "";
  const console = { log: (...a: unknown[]) => (out += a.join(" ") + "\n") };
  await new AsyncFunction("console", code)(console);
  return out;
}

describe("content integrity", () => {
  it("every track lesson exists and has a markdown file", () => {
    for (const t of TRACKS) {
      for (const id of t.lessons) {
        expect(LESSONS.find((l) => l.id === id), id).toBeTruthy();
        expect(fs.existsSync(path.join(process.cwd(), "content", "lessons", `${id}.md`)), id).toBe(true);
      }
    }
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
  });

  it("JavaScript lab solutions pass their own checks", async () => {
    for (const l of LESSONS) {
      if (l.lab.kind !== "code" || l.lab.language !== "javascript") continue;
      const stdout = await runJs(`${l.lab.starter}\n${l.lab.solution}\n${l.lab.harness ?? ""}`);
      expect(checkOutput(stdout, l.lab.expected), l.id).toBe(true);
    }
  });

  it("JavaScript lab starters do NOT already pass", async () => {
    for (const l of LESSONS) {
      if (l.lab.kind !== "code" || l.lab.language !== "javascript") continue;
      // A starter may throw (e.g. naive JSON.parse). Throwing also means "not passing".
      const stdout = await runJs(`${l.lab.starter}\n${l.lab.harness ?? ""}`).catch(() => "");
      expect(checkOutput(stdout, l.lab.expected), l.id).toBe(false);
    }
  });

  it("quiz answers are in range", () => {
    for (const l of LESSONS) {
      if (l.lab.kind !== "quiz") continue;
      for (const q of l.lab.questions) expect(q.answer).toBeLessThan(q.options.length);
    }
  });
});

describe("helpers", () => {
  it("normalizes answers", () => {
    expect(normalizeAnswer(" FLAG{Abc} ")).toBe("abc");
    expect(normalizeAnswer("10.10.10.4")).toBe("10.10.10.4");
  });
  it("markdown renders to blocks without HTML passthrough", () => {
    const b = parseBlocks("## Hi\n\n- a\n- b\n\n```\ncode <script>\n```");
    expect(b.map((x) => x.t)).toEqual(["h", "ul", "code"]);
    // raw HTML in text stays plain text; React escapes it when rendering
    expect(parseBlocks("<script>alert(1)</script>")[0]).toEqual({ t: "p", text: "<script>alert(1)</script>" });
  });
  it("password policy", () => {
    expect(passwordIssues("short")).not.toHaveLength(0);
    expect(passwordIssues("correct horse battery staple", "a@b.co")).toHaveLength(0);
    expect(passwordIssues("steven-is-great-123", "steven@x.co")).not.toHaveLength(0);
    expect(passwordIssues("password123")).not.toHaveLength(0);
  });
  it("blocks open redirects", () => {
    expect(safeNext("/account")).toBe("/account");
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "/ok\n", ""]) {
      expect(safeNext(bad), bad).toBe("/");
    }
  });
  it("merges progress without losing data", () => {
    const a = { version: 1 as const, completed: { x: { at: 5, xp: 10 } }, activeDays: ["2026-01-01"] };
    const b = { version: 1 as const, completed: { x: { at: 2, xp: 10 }, y: { at: 3, xp: 5 } }, activeDays: ["2026-01-02"] };
    const m = mergeProgress(a, b);
    expect(Object.keys(m.completed).sort()).toEqual(["x", "y"]);
    expect(m.completed.x.at).toBe(2);
    expect(m.activeDays).toHaveLength(2);
  });
  it("atlas ranks by goal", () => {
    expect(rankLanguages("windows-admin")[0].id).toBe("powershell");
  });
});
