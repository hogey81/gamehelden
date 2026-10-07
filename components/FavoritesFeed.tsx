"use client";

import Link from "next/link";
import { useState } from "react";
import CreatorTile from "@/components/CreatorTile";
import VideoCard from "@/components/VideoCard";
import { useFavorites } from "@/lib/favorites";
import type { Creator, Video } from "@/lib/types";

export default function FavoritesFeed({ creators, videos }: { creators: Creator[]; videos: Video[] }) {
  const favs = useFavorites();
  const [now] = useState(() => Date.now());
  const mine = creators.filter((c) => favs.includes(c.slug));
  const bySlug = new Map(creators.map((c) => [c.slug, c]));
  const feed = videos.filter((v) => favs.includes(v.creator_slug));

  if (mine.length === 0) {
    return (
      <div className="panel empty-state">
        <h2>Nog geen favorieten</h2>
        <p>
          Klik op het hartje bij een creator, dan zie je hier alleen de nieuwste video&apos;s van jouw favorieten. Je favorieten
          worden alleen in deze browser bewaard; je hebt geen account nodig.
        </p>
        <p><Link href="/creators">Zoek een creator</Link></p>
      </div>
    );
  }

  return (
    <>
      <section className="block">
        <h2>Jouw creators</h2>
        <div className="creator-grid">
          {mine.map((c) => (
            <CreatorTile key={c.slug} creator={c} />
          ))}
        </div>
      </section>
      <section className="block">
        <h2>Nieuwste video&apos;s van je favorieten</h2>
        {feed.length === 0 ? (
          <p className="empty">Je favorieten hebben de laatste tijd geen nieuwe video&apos;s geplaatst.</p>
        ) : (
          <div className="video-grid">
            {feed.map((v) => <VideoCard key={v.id} video={v} creator={bySlug.get(v.creator_slug)} now={now} />)}
          </div>
        )}
      </section>
    </>
  );
}
