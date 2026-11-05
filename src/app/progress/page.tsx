import type { Metadata } from "next";
import { ProgressManager } from "@/components/ProgressManager";

export const metadata: Metadata = { title: "Your Progress", alternates: { canonical: "/progress" } };

export default function ProgressPage() {
  return (
    <>
      <h1>Your progress</h1>
      <ProgressManager />
    </>
  );
}
