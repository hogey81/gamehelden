"use client";

import Player from "@/components/Player";
import { useLive } from "@/lib/useLive";

// On a creator page: their stream, when they're live.
export default function LiveNow({ slug }: { slug: string }) {
  const stream = useLive().find((l) => l.creator_slug === slug);
  if (!stream) return null;
  return (
    <section id="live" className="block">
      <span className="live-tag">Nu live</span>
      <Player id={stream.id} title={stream.title} thumbnail={stream.thumbnail_url} />
      <h2 className="featured-title">{stream.title}</h2>
    </section>
  );
}
