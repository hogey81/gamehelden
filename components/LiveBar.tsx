"use client";

import Link from "next/link";
import { useLive } from "@/lib/useLive";

export default function LiveBar() {
  const live = useLive();
  if (live.length === 0) return null;
  return (
    <section className="live-bar" aria-label="Nu live">
      <div className="live-head">
        <span className="live-tag">Nu live</span>
        <strong>{live.length === 1 ? "1 Nederlandse creator streamt nu" : `${live.length} Nederlandse creators streamen nu`}</strong>
      </div>
      <div className="live-list">
        {live.map((l) => (
          <Link key={l.id} href={`/creators/${l.creator_slug}#live`} className="live-item">
            <span className="live-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {l.thumbnail_url && <img src={l.thumbnail_url} alt="" />}
              <span>Live</span>
            </span>
            <span className="live-text">
              <strong>{l.name}</strong>
              <small>{l.title}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
