import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/LessonShell";
import { loadLessonBody } from "@/lib/content/loader";
import { lessonById, trackById, LESSONS } from "@/lib/content/lessons";
import { Markdown } from "@/lib/markdown";

type Params = { params: Promise<{ track: string; lesson: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LESSONS.map((l) => ({ track: l.track, lesson: l.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = lessonById((await params).lesson);
  return l ? { title: l.title, description: l.summary, alternates: { canonical: `/learn/${l.track}/${l.id}` } } : {};
}

export default async function LessonPage({ params }: Params) {
  const { track: trackId, lesson: lessonId } = await params;
  const lesson = lessonById(lessonId);
  const track = trackById(trackId);
  if (!lesson || !track || lesson.track !== track.id) notFound();
  const body = await loadLessonBody(lesson.id);
  const idx = track.lessons.indexOf(lesson.id);
  return (
    <LessonShell
      lesson={lesson}
      trackTitle={track.title}
      prevId={track.lessons[idx - 1] ?? null}
      nextId={track.lessons[idx + 1] ?? null}
    >
      <Markdown source={body} />
    </LessonShell>
  );
}
