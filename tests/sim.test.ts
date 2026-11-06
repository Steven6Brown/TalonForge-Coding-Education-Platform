import { describe, expect, it } from "vitest";
import { HELPDESK } from "@/lib/sim/helpdesk";
import { SOC } from "@/lib/sim/soc";
import { maxScore } from "@/lib/sim/types";

describe.each([...HELPDESK, ...SOC])("scenario $id", (s) => {
  it("has a valid start and every choice leads to an existing step", () => {
    expect(s.steps[s.start]).toBeDefined();
    for (const st of Object.values(s.steps)) {
      expect(st.end || st.choices?.length).toBeTruthy();
      for (const ch of st.choices ?? []) expect(s.steps[ch.next], `${st.id} -> ${ch.next}`).toBeDefined();
    }
  });
  it("is acyclic and has a reachable best score", () => {
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
