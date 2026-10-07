import Link from "next/link";
import type { Creator, Video } from "@/lib/types";
import { ago, compact, duration } from "@/lib/format";

// A video in a grid. Opens the creator's page on Gamehelden, where it can be played.
export default function VideoCard({ video, creator, now }: { video: Video; creator?: Creator; now: number }) {
  const fresh = now - new Date(video.published_at).getTime() < 86400000;
  return (
    <Link className="video" href={`/creators/${video.creator_slug}?v=${video.id}#speler`}>
      <span className="thumb">
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnail_url} alt="" loading="lazy" />
        ) : (
          <span className="thumb-blank" aria-hidden />
        )}
        {video.duration_seconds != null && <span className="len">{duration(video.duration_seconds)}</span>}
        {fresh && <span className="new">Nieuw</span>}
      </span>
      <span className="video-meta">
        <strong>{video.title}</strong>
        <small>
          {creator ? `${creator.name ?? creator.handle} · ` : ""}
          {ago(video.published_at, now)}
          {video.view_count != null ? ` · ${compact(video.view_count)} weergaven` : ""}
        </small>
      </span>
    </Link>
  );
}
