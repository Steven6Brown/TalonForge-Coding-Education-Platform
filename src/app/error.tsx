"use client";

/** Generic error boundary: never shows internal error details to the user. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="card auth-card" role="alert">
      <h1>Something went wrong</h1>
      <p className="muted">An unexpected error occurred. Your saved progress is safe.</p>
      <button className="btn primary" onClick={reset}>Try again</button>
    </section>
  );
}
