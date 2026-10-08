"use client";

import Link from "next/link";
import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import CreatorTile from "@/components/CreatorTile";
import VideoCard from "@/components/VideoCard";
import { useFavoriteVideos, useFavorites } from "@/lib/favorites";
import type { Creator } from "@/lib/types";

export default function FavoritesFeed({ creators }: { creators: Creator[] }) {
  const favs = useFavorites();
  const feed = useFavoriteVideos(20);
  const [now] = useState(() => Date.now());
  const mine = creators.filter((c) => favs.includes(c.slug));
  const bySlug = new Map(creators.map((c) => [c.slug, c]));

  if (mine.length === 0) {
    return (
      <div className="panel empty-state">
        <h2>Nog geen favorieten</h2>
        <p>
          Klik op het hartje bij een creator, dan zie je hier de laatste video&apos;s van jouw favorieten. Je favorieten worden
          alleen in deze browser bewaard; je hebt geen account nodig.
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
        <h2>De laatste video&apos;s van je favoriete creators</h2>
        {feed === null ? (
          <p className="empty">Video&apos;s laden…</p>
        ) : feed.length === 0 ? (
          <p className="empty">We hebben nog geen video&apos;s van je favorieten. Die komen na de volgende dagelijkse update.</p>
        ) : (
          <div className="with-ad">
            <AdBanner />
            <div className="video-grid">
              {feed.map((v) => <VideoCard key={v.id} video={v} creator={bySlug.get(v.creator_slug)} now={now} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
