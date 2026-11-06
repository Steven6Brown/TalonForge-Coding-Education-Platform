/** Decision-based job simulations (IT help desk, SOC analyst). Every scenario is fictional. */

export type Tag = "security" | "service" | "technical" | "documentation";
export const TAG_LABEL: Record<Tag, string> = {
  security: "Security procedure",
  service: "Customer service",
  technical: "Technical accuracy",
  documentation: "Documentation",
};

export type Choice = {
  label: string;
  /** Shown after choosing: explains why this was good or risky. */
  feedback: string;
  /** 0 (harmful) to 3 (ideal). */
  points: 0 | 1 | 2 | 3;
  tag: Tag;
  next: string;
};

export type Step = {
  id: string;
  /** Who is speaking, e.g. "Maria (caller)" or "SIEM alert". */
  who?: string;
  text: string;
  /** Optional evidence block (log lines, ticket fields, etc.). */
  evidence?: string;
  choices?: Choice[];
  end?: { title: string; summary: string };
};

export type Scenario = {
  id: string;
  kind: "helpdesk" | "soc";
  title: string;
  priority: "P1" | "P2" | "P3" | "P4";
  difficulty: "beginner" | "intermediate" | "advanced";
  ticket: { id: string; requester: string; channel: string };
  summary: string;
  /** What a strong performer does (shown at the end). */
  takeaways: string[];
  skills: string[];
  start: string;
  steps: Record<string, Step>;
};

/** Best achievable score along the highest-scoring path (scenarios are acyclic). */
export function maxScore(s: Scenario, stepId = s.start, memo: Record<string, number> = {}): number {
  if (memo[stepId] !== undefined) return memo[stepId];
  const step = s.steps[stepId];
  const best = step?.choices?.length ? Math.max(...step.choices.map((c) => c.points + maxScore(s, c.next, memo))) : 0;
  memo[stepId] = best;
  return best;
}

export const c = (label: string, points: 0 | 1 | 2 | 3, tag: Tag, next: string, feedback: string): Choice => ({ label, points, tag, next, feedback });
