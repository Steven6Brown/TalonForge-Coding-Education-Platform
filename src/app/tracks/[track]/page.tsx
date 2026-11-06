import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonList } from "@/components/Dashboard";
import { lessonsOfTrack, trackById, TRACKS } from "@/lib/content/lessons";

type Params = { params: Promise<{ track: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => TRACKS.map((t) => ({ track: t.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const t = trackById((await params).track);
  return t ? { title: t.title, description: t.description, alternates: { canonical: `/tracks/${t.id}` } } : {};
}

export default async function TrackPage({ params }: Params) {
  const track = trackById((await params).track);
  if (!track) notFound();
  const lessons = lessonsOfTrack(track.id).map(({ id, title, summary, minutes, xp, level }) => ({ id, title, summary, minutes, xp, level }));
  return (
    <>
      <Link href="/" className="back-link"><span aria-hidden="true">←</span> All tracks</Link>
      <h1>{track.title}</h1>
      <p className="muted lead">{track.description}</p>
      <LessonList trackId={track.id} lessons={lessons} />
    </>
  );
}
