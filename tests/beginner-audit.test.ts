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
