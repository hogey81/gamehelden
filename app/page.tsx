import Link from "next/link";
import CreatorTile from "@/components/CreatorTile";
import VideoCard from "@/components/VideoCard";
import { getCreators, getLatestVideos } from "@/lib/data";
import { compact } from "@/lib/format";

export const revalidate = 3600;

export default async function Home() {
  const [creators, videos] = await Promise.all([getCreators(), getLatestVideos(12)]);
  const bySlug = new Map(creators.map((c) => [c.slug, c]));
  const now = Date.now();

  return (
    <>
      <section className="hero">
        <h1>De nieuwste video&apos;s van Nederlandse gaming-YouTubers</h1>
        <p className="lead">
          Fortnite en meer van {creators.length} Nederlandse en Vlaamse creators op één plek. Elke dag automatisch bijgewerkt.
        </p>
      </section>

      <section className="block">
        <h2>Nieuwste video&apos;s</h2>
        <div className="video-grid">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} creator={bySlug.get(v.creator_slug)} now={now} />
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Creators</h2>
          <Link href="/creators">Zoek een creator</Link>
        </div>
        <div className="creator-grid">
          {creators.map((c) => (
            <CreatorTile
              key={c.slug}
              creator={c}
              detail={c.subscribers_hidden ? "abonnees verborgen" : `${compact(c.subscriber_count)} abonnees`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
