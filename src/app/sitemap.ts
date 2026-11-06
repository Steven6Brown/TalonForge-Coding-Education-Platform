import type { MetadataRoute } from "next";
import { LESSONS, TRACKS } from "@/lib/content/lessons";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/atlas", "/playground", "/progress", "/resources", "/tools"].map((p) => ({ url: `${SITE}${p}` }));
  const tracks = TRACKS.map((t) => ({ url: `${SITE}/tracks/${t.id}` }));
  const lessons = LESSONS.map((l) => ({ url: `${SITE}/learn/${l.track}/${l.id}` }));
  return [...pages, ...tracks, ...lessons];
}
