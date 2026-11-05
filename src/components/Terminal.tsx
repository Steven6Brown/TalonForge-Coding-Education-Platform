"use client";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/lib/shell/shell";
import { FILESYSTEMS } from "@/lib/content/filesystems";

type Line = { kind: "cmd" | "out"; text: string };

/** Accessible in-browser terminal backed by the Shell simulator (no real command execution). */
export function Terminal({ fs }: { fs: string }) {
  // Lazy init keeps one Shell per mounted terminal; remounting (key change) resets the lab.
  const [shell] = useState(() => new Shell(FILESYSTEMS[fs] ?? FILESYSTEMS.sandbox));
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "TalonForge training shell (simulated). Type 'help' to see commands.\n" },
  ]);
  const [value, setValue] = useState("");
  const [prompt, setPrompt] = useState(shell.prompt());
  const histIdx = useRef<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit() {
    const cmd = value;
    const res = shell.run(cmd);
    setLines((prev) => {
      const next = res.clear ? [] : [...prev, { kind: "cmd" as const, text: `${prompt} ${cmd}` }];
      if (res.output) next.push({ kind: "out", text: res.output });
      return next.slice(-300); // bound memory
    });
    setValue("");
    setPrompt(shell.prompt());
    histIdx.current = null;
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = shell.history;
      if (!h.length) return;
      histIdx.current = histIdx.current === null ? h.length - 1 : Math.max(0, histIdx.current - 1);
      setValue(h[histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = shell.history;
      if (histIdx.current === null) return;
      histIdx.current += 1;
      if (histIdx.current >= h.length) {
        histIdx.current = null;
        setValue("");
      } else setValue(h[histIdx.current]);
    } else if (e.key === "Tab" && value.trim()) {
      e.preventDefault(); // only trap Tab when there is something to complete
      setValue(shell.complete(value));
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div ref={logRef} className="term-log" role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}>
        {lines.map((l, i) => (
          <pre key={i} className={l.kind === "cmd" ? "term-cmd" : "term-out"}>
            {l.text}
          </pre>
        ))}
      </div>
      <label className="term-input">
        <span className="term-prompt" aria-hidden="true">
          {prompt}
        </span>
        <span className="sr-only">Terminal command input</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          maxLength={500}
        />
      </label>
    </div>
  );
}
