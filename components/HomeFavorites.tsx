"use client";

import Link from "next/link";
import { useState } from "react";
import VideoCard from "@/components/VideoCard";
import { useFavorites } from "@/lib/favorites";
import type { Creator, Video } from "@/lib/types";

// On the homepage, the newest videos of the visitor's own favourites come first.
export default function HomeFavorites({ creators, videos }: { creators: Creator[]; videos: Video[] }) {
  const favs = useFavorites();
  const [now] = useState(() => Date.now());
  const feed = videos.filter((v) => favs.includes(v.creator_slug)).slice(0, 4);
  if (feed.length === 0) return null;
  const bySlug = new Map(creators.map((c) => [c.slug, c]));
  return (
    <section className="block">
      <div className="block-head">
        <h2>Nieuw van jouw favorieten</h2>
        <Link href="/favorieten">Alles van je favorieten</Link>
      </div>
      <div className="video-grid">
        {feed.map((v) => <VideoCard key={v.id} video={v} creator={bySlug.get(v.creator_slug)} now={now} />)}
      </div>
    </section>
  );
}
