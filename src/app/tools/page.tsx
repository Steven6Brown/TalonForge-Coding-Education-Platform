import type { Metadata } from "next";
import { ToolsHub } from "@/components/tools/ToolsHub";

export const metadata: Metadata = {
  title: "Tools: Converter, Crypto Workbench & Ports",
  description: "Convert binary, decimal and hex, encrypt and decrypt messages, hash text, and study common network ports. All in your browser.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <h1>Tools</h1>
      <p className="muted lead">
        Hands-on helpers for the skills security people use every day: number bases and binary, hashing and encryption, and the ports every service listens on. Everything runs in your browser.
      </p>
      <ToolsHub />
    </>
  );
}
