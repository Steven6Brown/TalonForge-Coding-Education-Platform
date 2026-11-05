import type { Metadata } from "next";
import { Playground } from "@/components/Playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "Free in-browser sandboxes for JavaScript, Python and a simulated Linux shell.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return (
    <>
      <h1>Playground</h1>
      <p className="muted lead">Experiment freely. Everything runs in your browser sandbox; nothing touches your computer.</p>
      <Playground />
    </>
  );
}
