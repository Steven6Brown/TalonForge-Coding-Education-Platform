import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { parseBlocks } from "@/lib/markdown-parse";

describe("markdown tables", () => {
  it("parses a header, separator and rows", () => {
    const b = parseBlocks("| A | B |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |\n\nafter");
    expect(b[0]).toEqual({ t: "table", head: ["A", "B"], rows: [["1", "2"], ["3", "4"]] });
    expect(b[1]).toEqual({ t: "p", text: "after" });
  });

  it("keeps pipes that are inside inline code", () => {
    const b = parseBlocks("| Cmd | Meaning |\n| --- | --- |\n| `a | b` | pipe |");
    expect(b[0]).toEqual({ t: "table", head: ["Cmd", "Meaning"], rows: [["`a | b`", "pipe"]] });
  });

  it("does not treat a lone pipe line as a table", () => {
    const b = parseBlocks("| not a table\nnext line");
    expect(b[0].t).toBe("p");
  });

  it("every table in the lessons has matching column counts and no pipe text left over", () => {
    for (const f of fs.readdirSync("content/lessons")) {
      const blocks = parseBlocks(fs.readFileSync(`content/lessons/${f}`, "utf8"));
      for (const b of blocks) {
        if (b.t === "table") for (const r of b.rows) expect(r.length, `${f}: ${r.join(" / ")}`).toBe(b.head.length);
        if (b.t === "p") expect(/^\|.*\|$/.test(b.text.trim()), `${f}: unrendered table text`).toBe(false);
      }
    }
  });
});
