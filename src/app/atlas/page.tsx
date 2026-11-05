import type { Metadata } from "next";
import { AtlasExplorer } from "@/components/AtlasExplorer";

export const metadata: Metadata = {
  title: "Language Atlas",
  description: "Which programming language should you learn, and why? Compare Python, Bash, C, Rust, Go and more by goal.",
  alternates: { canonical: "/atlas" },
};

export default function AtlasPage() {
  return (
    <>
      <h1>Language Atlas</h1>
      <p className="muted lead">
        There is no “best” language, only the best one for the job. Choose your goal to see what fits, what to avoid,
        and how each language shows up in security work. (These are practical guidelines, not benchmarks.)
      </p>
      <AtlasExplorer />
    </>
  );
}
