import { describe, expect, it } from "vitest";
import { ALL_SCENARIOS, ROLES } from "@/lib/sim/roles";
import { GUIDES } from "@/lib/sim/guides";
import { maxScore } from "@/lib/sim/types";

describe("scenario catalogue", () => {
  it("has unique ids and every scenario has a first-timer guide", () => {
    const ids = ALL_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of ALL_SCENARIOS) {
      const g = GUIDES[s.id];
      expect(g, "missing guide for " + s.id).toBeDefined();
      expect(g.primer.length).toBeGreaterThanOrEqual(2);
      for (const stepId of Object.keys(g.coach ?? {})) expect(s.steps[stepId], `${s.id} coach step ${stepId}`).toBeDefined();
    }
  });
  it("every guide belongs to a scenario", () => {
    for (const id of Object.keys(GUIDES)) expect(ALL_SCENARIOS.find((s) => s.id === id), id).toBeDefined();
  });
  it("help desk has all three levels covered or beginner-heavy, and planned roles have no scenarios", () => {
    const hd = ROLES.find((r) => r.id === "help-desk")!;
    expect(hd.scenarios.filter((s) => s.difficulty === "beginner").length).toBeGreaterThanOrEqual(5);
    for (const r of ROLES.filter((x) => x.planned)) expect(r.scenarios).toHaveLength(0);
  });
});

describe.each(ALL_SCENARIOS)("scenario $id", (s) => {
  it("has valid links", () => {
    expect(s.steps[s.start]).toBeDefined();
    for (const st of Object.values(s.steps)) {
      expect(st.end || st.choices?.length).toBeTruthy();
      for (const ch of st.choices ?? []) expect(s.steps[ch.next], `${st.id} -> ${ch.next}`).toBeDefined();
    }
  });
  it("is acyclic with a best path that earns points", () => {
    const visiting = new Set<string>();
    const walk = (id: string) => {
      expect(visiting.has(id), "cycle at " + id).toBe(false);
      visiting.add(id);
      for (const ch of s.steps[id].choices ?? []) walk(ch.next);
      visiting.delete(id);
    };
    walk(s.start);
    expect(maxScore(s)).toBeGreaterThan(5);
  });
});
