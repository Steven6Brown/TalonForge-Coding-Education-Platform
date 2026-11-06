"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Lesson } from "@/lib/content/types";
import { completeLesson, useProgress } from "@/lib/progress";
import { LabPanel } from "./LabPanel";

type Props = {
  lesson: Lesson;
  trackTitle: string;
  prevId: string | null;
  nextId: string | null;
  children: ReactNode; // server-rendered lesson Markdown
};

/** Client wrapper: shows the lesson text (children), the lab, and completion state. */
export function LessonShell({ lesson, trackTitle, prevId, nextId, children }: Props) {
  const progress = useProgress();
  const done = !!progress.completed[lesson.id];

  return (
    <article>
      <Link href={`/tracks/${lesson.track}`} className="back-link" aria-label={`Back to ${trackTitle}`}>
        <span aria-hidden="true">←</span> {trackTitle}
      </Link>
      <header className="lesson-head">
        <h1>{lesson.title}</h1>
        <div className="chips" aria-label="Lesson details">
          <span className={`chip lvl-${lesson.level}`}>{lesson.level}</span>
          <span className="chip time">⏱ ~{lesson.minutes} min</span>
          <span className="chip xp">+{lesson.xp} XP</span>
          {done && <span className="chip done">✓ Completed</span>}
        </div>
      </header>
      {children}
      <LabPanel lab={lesson.lab} lessonId={lesson.id} done={done} onPass={() => completeLesson(lesson.id, lesson.xp)} />
      <nav className="lesson-nav" aria-label="Lesson navigation">
        {prevId ? <Link className="btn" href={`/learn/${lesson.track}/${prevId}`}>← Previous</Link> : <span />}
        {nextId ? (
          <Link className={`btn ${done ? "primary" : ""}`} href={`/learn/${lesson.track}/${nextId}`}>Next →</Link>
        ) : (
          <Link className="btn" href={`/tracks/${lesson.track}`}>Back to track</Link>
        )}
      </nav>
    </article>
  );
}
