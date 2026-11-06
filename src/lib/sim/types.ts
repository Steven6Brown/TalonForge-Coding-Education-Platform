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

/** A hands-on task the learner performs instead of picking from choices. Worth 0-3 points like a choice. */
export type Hands = {
  tag: Tag;
  next: string;
  /** What you are trying to achieve, in plain words. */
  goal: string;
  /** Shown when the learner asks for help (using it costs 1 point). */
  hint: string;
  task:
    | {
        kind: "terminal";
        os: "windows" | "linux";
        prompt: string;
        /** Commands the learner can run. A command with an id counts toward completion. */
        /** `after`: only applies once the command with that id has been run (lets output change after a fix). */
        commands: { pattern: string; output: string; id?: string; after?: string; example: string; does: string }[];
        required: string[];
      }
    | {
        kind: "console";
        title: string;
        fields: { id: string; label: string; type: "check" | "select"; options?: string[]; correct: string | boolean; why: string }[];
      }
    | { kind: "ticket"; fields: string[]; must: { label: string; keywords: string[] }[] }
    | { kind: "siem"; question: string; answers: string[]; samples: string[] };
};

export type Step = {
  id: string;
  /** Who is speaking, e.g. "Maria (caller)" or "SIEM alert". */
  who?: string;
  text: string;
  /** Optional evidence block (log lines, ticket fields, etc.). */
  evidence?: string;
  choices?: Choice[];
  hands?: Hands;
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
  const best = step?.hands ? 3 + maxScore(s, step.hands.next, memo) : step?.choices?.length ? Math.max(...step.choices.map((c) => c.points + maxScore(s, c.next, memo))) : 0;
  memo[stepId] = best;
  return best;
}

export const c = (label: string, points: 0 | 1 | 2 | 3, tag: Tag, next: string, feedback: string): Choice => ({ label, points, tag, next, feedback });
