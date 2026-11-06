import type { Metadata } from "next";
import { SimulatorHub } from "@/components/sim/SimulatorHub";

export const metadata: Metadata = {
  title: "Simulators: IT Help Desk, SOC Analyst & SIEM",
  description: "Practice real job scenarios: help desk tickets, SOC alert triage and log searching. Fictional, in-browser and free.",
  alternates: { canonical: "/simulators" },
};

export default function SimulatorsPage() {
  return (
    <>
      <h1>Job simulators</h1>
      <p className="muted lead">Build experience for the roles you want. Work tickets and alerts, make decisions, and get graded on what employers care about.</p>
      <SimulatorHub />
    </>
  );
}
