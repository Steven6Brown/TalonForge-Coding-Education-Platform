"use client";
import { useState } from "react";
import { CodeRunner } from "./CodeRunner";
import { Terminal } from "./Terminal";

type Mode = "bash" | "python" | "javascript";

const STARTERS: Record<"python" | "javascript", string> = {
  python: `# Python playground\nimport hashlib\n\nfor word in ["hello", "world"]:\n    print(word, hashlib.sha256(word.encode()).hexdigest()[:16])\n`,
  javascript: `// JavaScript playground (no network access)\nconst ports = [22, 80, 443];\nconsole.log(ports.map(p => p * 2));\n`,
};

export function Playground() {
  const [mode, setMode] = useState<Mode>("bash");
  return (
    <>
      <div className="chips" role="tablist" aria-label="Sandbox type">
        {(["bash", "python", "javascript"] as Mode[]).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} className="chip" onClick={() => setMode(m)}>
            {m === "bash" ? "Linux shell (simulated)" : m === "python" ? "Python" : "JavaScript"}
          </button>
        ))}
      </div>
      {mode === "bash" ? <Terminal key="bash" fs="sandbox" /> : <CodeRunner key={mode} language={mode} starter={STARTERS[mode]} label={`pg-${mode}`} />}
    </>
  );
}
