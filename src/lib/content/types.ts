export type Level = "beginner" | "intermediate" | "advanced";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Lab =
  | {
      kind: "code";
      language: "javascript" | "python" | "sql";
      prompt: string;
      starter: string;
      /**
       * Beginner scaffolding shown above the editor. Every lab should teach what it needs:
       * `concepts` explain each language feature used (markdown), `plan` is a numbered step-by-step approach,
       * `example` is a small runnable snippet the learner can load, and `prerequisites` links foundation lessons.
       */
      concepts?: { title: string; body: string }[];
      plan?: string[];
      example?: string;
      prerequisites?: { id: string; track: string; title: string }[];
      /** Hidden setup run before the learner's code (SQL schema/data). */
      setup?: string;
      /** Appended after learner code (hidden tests). */
      harness?: string;
      /** The LAST non-empty line of stdout must equal this to pass. */
      expected: string;
      hints: string[];
      solution: string;
    }
  | {
      kind: "shell";
      fs: string;
      prompt: string;
      /** Accepted answers; every one must be submitted. Compared case-insensitively, FLAG{...} wrapper optional. */
      answers: string[];
      hints: string[];
    }
  | {
      kind: "siem";
      prompt: string;
      /** Accepted answers (all must be found). Compared case-insensitively. */
      answers: string[];
      hints: string[];
      samples?: string[];
      concepts?: { title: string; body: string }[];
      plan?: string[];
    }
  | { kind: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  id: string;
  track: string;
  title: string;
  summary: string;
  minutes: number;
  xp: number;
  level: Level;
  /** Lesson text lives in content/lessons/<id>.md and is loaded server-side. */
  lab: Lab;
};

export type Track = {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  description: string;
  lessons: string[];
};
