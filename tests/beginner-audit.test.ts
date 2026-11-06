import { describe, expect, it } from "vitest";
import { LESSONS, TRACKS } from "@/lib/content/lessons";

/** Beginner-friendliness checks: no code lab may expect knowledge it never teaches. */
describe("beginner audit", () => {
  const codeLessons = LESSONS.filter((l) => l.lab.kind === "code");
  it("every code lab has concepts and a step-by-step plan", () => {
    const bad = codeLessons.filter((l) => l.lab.kind === "code" && (!l.lab.concepts?.length || !l.lab.plan?.length)).map((l) => l.id);
    expect(bad).toEqual([]);
  });
  it("every code lab has at least two hints", () => {
    const bad = codeLessons.filter((l) => l.lab.kind === "code" && l.lab.hints.length < 2).map((l) => l.id);
    expect(bad).toEqual([]);
  });
  it("prerequisite links point at real lessons", () => {
    for (const l of codeLessons) if (l.lab.kind === "code") for (const p of l.lab.prerequisites ?? []) {
      const t = LESSONS.find((x) => x.id === p.id);
      expect(t, `${l.id} -> ${p.id}`).toBeDefined();
      expect(t!.track).toBe(p.track);
    }
  });
  it("foundation prerequisites come earlier in the curriculum than the lessons that need them", () => {
    const order = TRACKS.flatMap((t) => t.lessons);
    for (const l of codeLessons) if (l.lab.kind === "code") for (const p of l.lab.prerequisites ?? []) {
      if (!p.track.endsWith("-foundations")) continue;
      expect(order.indexOf(p.id), `${p.id} before ${l.id}`).toBeLessThan(order.indexOf(l.id));
    }
  });
});

import { TRACK_PREREQS } from "@/lib/content/track-paths";
describe("track ordering", () => {
  it("every track has a defined path and prerequisites exist and are not circular", () => {
    for (const t of TRACKS) expect(TRACK_PREREQS[t.id], "no path for " + t.id).toBeDefined();
    for (const [id, pre] of Object.entries(TRACK_PREREQS)) for (const p of pre) {
      expect(TRACKS.find((x) => x.id === p), `${id} -> ${p}`).toBeDefined();
      expect(TRACK_PREREQS[p] ?? [], `circular ${id}<->${p}`).not.toContain(id);
    }
  });
});

import fs from "node:fs";
const STOP = new Set("the a an of to in and or is are for with that this it be as by on at from your you not can what which when how why does do an its if so than then into only any all each more most".split(" "));
describe("quiz coverage", () => {
  it("each quiz answer's key words appear in its lesson text (rough heuristic; a few misses are tolerated)", () => {
    const weak: string[] = [];
    for (const l of LESSONS) {
      if (l.lab.kind !== "quiz") continue;
      const md = fs.readFileSync(`content/lessons/${l.id}.md`, "utf8").toLowerCase();
      for (const q of l.lab.questions) {
        const uniq = [...new Set((q.options[q.answer] + " " + q.why).toLowerCase().match(/[a-z0-9]{4,}/g)?.filter((w) => !STOP.has(w)) ?? [])];
        const hit = uniq.filter((w) => md.includes(w.slice(0, Math.max(4, w.length - 2)))).length;
        if (uniq.length && hit / uniq.length < 0.5) weak.push(`${l.id}: ${q.q.slice(0, 60)}`);
      }
    }
    expect(weak.length, weak.join("\n")).toBeLessThanOrEqual(3);
  });
});
