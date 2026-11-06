"use client";
import { useState } from "react";
import { CryptoWorkbench } from "./CryptoWorkbench";
import { NumberConverter } from "./NumberConverter";
import { PortsReference } from "./PortsReference";

const TABS = [
  { id: "converter", label: "Binary & number converter" },
  { id: "crypto", label: "Crypto workbench" },
  { id: "ports", label: "Ports reference" },
] as const;

export function ToolsHub({ initial = "converter" }: { initial?: (typeof TABS)[number]["id"] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(initial);
  return (
    <>
      <div className="chips" role="tablist" aria-label="Tools">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} className="chip" onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === "converter" && <NumberConverter />}
      {tab === "crypto" && <CryptoWorkbench />}
      {tab === "ports" && <PortsReference />}
    </>
  );
}
