"use client";

/** Runs learner code in a Web Worker with a hard timeout. The worker is terminated on timeout/finish. */

export type RunResult = { ok: boolean; stdout: string; error?: string; timedOut?: boolean };
export type RunStatus = "loading" | "running";

const TIMEOUT_MS = { javascript: 5000, python: 30000 } as const;
const WORKER_URL = { javascript: "/workers/js-runner.js", python: "/workers/py-runner.js" } as const;

export function runCode(
  language: "javascript" | "python",
  code: string,
  onStatus?: (s: RunStatus) => void,
): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(WORKER_URL[language]);
    } catch {
      resolve({ ok: false, stdout: "", error: "Your browser could not start the sandbox." });
      return;
    }
    // Python gets a longer budget on first run because the engine must download once.
    let timer = setTimeout(finishTimeout, TIMEOUT_MS[language]);
    function finishTimeout() {
      worker.terminate();
      resolve({ ok: false, stdout: "", timedOut: true, error: "Timed out - is there an infinite loop?" });
    }
    worker.onmessage = (e: MessageEvent) => {
      const d = e.data as { status?: RunStatus; ok?: boolean; stdout?: string; error?: string };
      if (d.status) {
        onStatus?.(d.status);
        // Once Python is loaded, restart the clock for the actual user code (10s).
        if (d.status === "running") {
          clearTimeout(timer);
          timer = setTimeout(finishTimeout, language === "python" ? 10000 : TIMEOUT_MS.javascript);
        }
        return;
      }
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: !!d.ok, stdout: d.stdout ?? "", error: d.error });
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      resolve({
        ok: false,
        stdout: "",
        error:
          language === "python"
            ? "The Python engine failed to load. Check your internet connection and try again."
            : "The sandbox crashed.",
      });
    };
    worker.postMessage({ code });
  });
}

/** A lab passes when the LAST non-empty stdout line equals `expected`. */
export function checkOutput(stdout: string, expected: string): boolean {
  const lines = stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 && lines[lines.length - 1] === expected.trim();
}

/** Normalizes an answer: trims, drops FLAG{...} wrapper, case-insensitive. */
export function normalizeAnswer(s: string): string {
  const t = s.trim();
  const m = /^FLAG\{(.*)\}$/i.exec(t);
  return (m ? m[1] : t).toLowerCase();
}
