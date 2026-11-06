"use client";
import { useState } from "react";
import { CodeRunner } from "./CodeRunner";
import { SQL_PLAYGROUND_SETUP } from "@/lib/content/lessons-batch6a";
import { Terminal } from "./Terminal";

type Mode = "bash" | "kali" | "python" | "javascript" | "sql";

const STARTERS: Record<"python" | "javascript" | "sql", string> = {
  sql: "-- Tables: departments(id, name), employees(id, name, title, salary, dept_id, hired)\nSELECT d.name, COUNT(*) AS people FROM employees e JOIN departments d ON e.dept_id = d.id GROUP BY d.name;\n",
  python: `# Python playground\nimport hashlib\n\nfor word in ["hello", "world"]:\n    print(word, hashlib.sha256(word.encode()).hexdigest()[:16])\n`,
  javascript: `// JavaScript playground (no network access)\nconst ports = [22, 80, 443];\nconsole.log(ports.map(p => p * 2));\n`,
};

export function Playground() {
  const [mode, setMode] = useState<Mode>("bash");
  return (
    <>
      <div className="chips" role="tablist" aria-label="Sandbox type">
        {(["bash", "kali", "python", "javascript", "sql"] as Mode[]).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} className="chip" onClick={() => setMode(m)}>
            {m === "bash" ? "Linux shell (simulated)" : m === "kali" ? "Kali lab (simulated)" : m === "python" ? "Python" : m === "sql" ? "SQL (SQLite)" : "JavaScript"}
          </button>
        ))}
      </div>
      {mode === "bash" ? <Terminal key="bash" fs="sandbox" /> : mode === "kali" ? <Terminal key="kali" fs="kali" /> : <CodeRunner key={mode} language={mode} starter={STARTERS[mode]} setup={mode === "sql" ? SQL_PLAYGROUND_SETUP : undefined} label={`pg-${mode}`} />}
    </>
  );
}
