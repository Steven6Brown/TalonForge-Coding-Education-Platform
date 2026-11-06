import type { Metadata } from "next";
import { CareersLanding } from "@/components/sim/CareersLanding";

export const metadata: Metadata = {
  title: "Careers: Job Simulators",
  description: "Practice real job scenarios for IT help desk and SOC analyst roles, from beginner to advanced. Fictional, in-browser and free.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <h1>Careers</h1>
      <p className="muted lead">
        Build experience for the roles you want. Pick a job, work realistic tickets and alerts, and get graded on what employers care about: security procedure, customer service, technical accuracy and documentation. Every scenario has a difficulty level, and beginner ones explain everything you need.
      </p>
      <CareersLanding />
      <p className="muted small">All scenarios are fictional training exercises. Completing them is practice, not a credential or work experience.</p>
    </>
  );
}
