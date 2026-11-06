"use client";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/lib/shell/shell";
import { makeKaliCommands } from "@/lib/shell/kali";
import { FILESYSTEMS } from "@/lib/content/filesystems";
import { PROFILES } from "@/lib/content/filesystems-kali";

type Line = { kind: "cmd" | "out"; text: string };
type Editing = { path: string; display: string; text: string };

function createShell(fs: string): Shell {
  const def = FILESYSTEMS[fs] ?? FILESYSTEMS.sandbox;
  const profile = PROFILES[fs];
  if (profile?.net) {
    const k = makeKaliCommands(profile.net);
    return new Shell(def, { extra: k.commands, extraHelp: k.help, host: profile.host });
  }
  return new Shell(def, { host: profile?.host });
}

/** Accessible in-browser terminal backed by the Shell simulator (no real command execution). */
export function Terminal({ fs }: { fs: string }) {
  // Lazy init keeps one Shell per mounted terminal; remounting (key change) resets the lab.
  const [shell] = useState(() => createShell(fs));
  const isKali = !!PROFILES[fs]?.net;
  const [lines, setLines] = useState<Line[]>([
    {
      kind: "out",
      text: isKali
        ? "TalonForge Kali-style lab (SIMULATED tools, fictional network 10.10.10.0/29). Type 'help' to see tools.\nNot real Kali: install Kali in an isolated VM for real practice.\n"
        : "TalonForge training shell (simulated). Type 'help' to see commands.\nTip: 'touch f' makes an EMPTY file. Use 'nano f' to edit it, or: echo hello > f\n",
    },
  ]);
  const [value, setValue] = useState("");
  const [prompt, setPrompt] = useState(shell.prompt());
  const [editing, setEditing] = useState<Editing | null>(null);
  const histIdx = useRef<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function print(text: string) {
    setLines((prev) => [...prev, { kind: "out" as const, text }].slice(-300));
  }

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
    if (res.edit) setEditing({ path: res.edit.path, display: res.edit.display, text: res.edit.content });
  }

  function closeEditor(message: string) {
    setEditing(null);
    print(message + "\n");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function saveEditor() {
    if (!editing) return;
    const err = shell.saveFile(editing.path, editing.text);
    if (err) {
      print(`nano: ${err}\n`);
      return;
    }
    const n = editing.text === "" ? 0 : editing.text.split("\n").length - (editing.text.endsWith("\n") ? 1 : 0);
    closeEditor(`[ Wrote ${n} line${n === 1 ? "" : "s"} to ${editing.display} ]`);
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
    <div className="terminal" onClick={() => !editing && inputRef.current?.focus()}>
      <div ref={logRef} className="term-log" role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}>
        {lines.map((l, i) => (
          <pre key={i} className={l.kind === "cmd" ? "term-cmd" : "term-out"}>
            {l.text}
          </pre>
        ))}
      </div>
      {editing && (
        <div className="term-editor" role="group" aria-label={`Editing ${editing.display}`}>
          <div className="term-editor-bar">
            <strong>nano · {editing.display}</strong>
            <span className="muted small">Ctrl+S save &amp; close · Esc close without saving</span>
          </div>
          <textarea
            autoFocus
            value={editing.text}
            onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                saveEditor();
              } else if (e.key === "Escape") {
                e.preventDefault();
                closeEditor("[ Cancelled ]");
              }
            }}
            spellCheck={false}
            rows={10}
            maxLength={20000}
            aria-label={`Contents of ${editing.display}`}
          />
          <div className="row">
            <button className="btn small primary" onClick={saveEditor}>Save &amp; close</button>
            <button className="btn small" onClick={() => closeEditor("[ Cancelled ]")}>Close without saving</button>
          </div>
        </div>
      )}
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
          disabled={!!editing}
        />
      </label>
    </div>
  );
}
