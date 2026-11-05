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
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/">Home</Link> / <Link href={`/tracks/${lesson.track}`}>{trackTitle}</Link>
      </nav>
      <header className="lesson-head">
        <h1>{lesson.title}</h1>
        <p className="muted">
          {lesson.level} · ~{lesson.minutes} min · +{lesson.xp} XP {done && <span className="badge ok">Completed</span>}
        </p>
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
