import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card auth-card">
      <h1>404 - Target not found</h1>
      <p className="muted">That page doesn&apos;t exist. Even good recon comes up empty sometimes.</p>
      <Link className="btn primary" href="/">Back to base</Link>
    </section>
  );
}
