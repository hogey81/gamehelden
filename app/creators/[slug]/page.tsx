import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import CopyField from "@/components/CopyField";
import FavButton from "@/components/FavButton";
import Player from "@/components/Player";
import VideoCard from "@/components/VideoCard";
import { getCreator, getCreators, getLatestVideos, getPopularVideos } from "@/lib/data";
import { SITE_URL, compact } from "@/lib/format";
import { GAMES } from "@/lib/types";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ v?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCreator((await params).slug);
  if (!c) return {};
  const name = c.name ?? c.handle;
  const games = c.games.map((g) => GAMES[g] ?? g).join(" en ") || "gaming";
  return {
    title: `${name}: Nederlandse ${games} YouTuber`,
    description: `Alles over ${name}: nieuwste video's, populairste video's, statistieken en gaming setup.`,
    alternates: { canonical: `/creators/${c.slug}` },
  };
}

export default async function CreatorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { v } = await searchParams;
  const creator = await getCreator(slug);
  if (!creator) notFound();

  const [latest, popular, all] = await Promise.all([getLatestVideos(8, slug), getPopularVideos(slug, 4), getCreators()]);
  const name = creator.name ?? creator.handle;
  const featured = latest.find((x) => x.id === v) ?? latest[0];
  const rank = all.findIndex((c) => c.slug === slug) + 1;
  const similar = all.filter((c) => c.slug !== slug && c.games.some((g) => creator.games.includes(g))).slice(0, 4);
  const now = Date.now();
  // ?sub_confirmation=1 opens YouTube's own "subscribe?" dialog straight away.
  const subscribeUrl = creator.channel_id
    ? `https://www.youtube.com/channel/${creator.channel_id}?sub_confirmation=1`
    : `https://www.youtube.com/${creator.handle}?sub_confirmation=1`;
  const pageUrl = `${SITE_URL}/creators/${creator.slug}`;

  return (
    <>
      <section className="profile">
        <Avatar creator={creator} size={88} />
        <div>
          <h1>{name}</h1>
          <div className="chips">
            {creator.games.map((g) => <span key={g} className="chip">{GAMES[g] ?? g}</span>)}
            {creator.region && <span className="chip">{creator.region}</span>}
            <a className="chip" href={`https://www.youtube.com/${creator.handle}`}>Bekijk op YouTube</a>
          </div>
          <div className="actions">
          <a className="subscribe" href={subscribeUrl}>
            <span aria-hidden>▶</span> Abonneer op {name}
          </a>
          <FavButton slug={creator.slug} name={name} withLabel />
          </div>
        </div>
      </section>

      <section className="stats">
        <div><span>Abonnees</span><strong>{creator.subscribers_hidden ? "verborgen" : compact(creator.subscriber_count)}</strong></div>
        <div><span>Totale weergaven</span><strong>{compact(creator.view_count)}</strong></div>
        <div><span>Video&apos;s</span><strong>{creator.video_count ?? "–"}</strong></div>
        <div><span>Op YouTube sinds</span><strong>{creator.channel_started_at ? new Date(creator.channel_started_at).getFullYear() : "–"}</strong></div>
      </section>

      <div className="two-col">
        <div className="col">
          {featured && (
            <section id="speler" className="block">
              <Player id={featured.id} title={featured.title} thumbnail={featured.thumbnail_url} />
              <h2 className="featured-title">{featured.title}</h2>
            </section>
          )}

          {creator.bio && (
            <section className="block panel prose">
              <h2>Over {name}</h2>
              {creator.bio.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
            </section>
          )}

          <section className="block">
            <h2>Laatste video&apos;s</h2>
            <div className="video-grid small">
              {latest.map((x) => <VideoCard key={x.id} video={x} now={now} />)}
            </div>
          </section>

          {popular.length > 0 && (
            <section className="block">
              <h2>Populairste recente video&apos;s</h2>
              <div className="video-grid small">
                {popular.map((x) => <VideoCard key={x.id} video={x} now={now} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="col">
          {rank > 0 && (
            <section className="panel">
              <h2>Ranglijst</h2>
              <p>
                Nummer <strong>{rank}</strong> van {all.length} op Gamehelden, gemeten in abonnees.{" "}
                <Link href="/fortnite-youtubers-nederland">Bekijk de lijst</Link>
              </p>
            </section>
          )}

          {creator.setup.length > 0 && (
            <section className="panel">
              <h2>Gaming setup</h2>
              <ul className="setup">
                {creator.setup.map((s) => (
                  <li key={s.label}>
                    <span><small>{s.label}</small>{s.name}</span>
                    {s.url && <a className="btn" href={s.url} rel="sponsored nofollow">Bekijk prijs</a>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {similar.length > 0 && (
            <section className="panel">
              <h2>Vergelijkbare creators</h2>
              <ul className="similar">
                {similar.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/creators/${c.slug}`} className="who">
                      <Avatar creator={c} />
                      <span>{c.name ?? c.handle}<small>{compact(c.subscriber_count)} abonnees</small></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="panel badge-panel">
            <h2>Ben jij {name}?</h2>
            <p>Laat je kijkers weten dat je op Gamehelden staat. Zet deze regel in je YouTube-beschrijving of kanaalinfo:</p>
            <CopyField label="Tekst voor YouTube" value={`🎮 Ik sta op Gamehelden, de site met Nederlandse gaming-YouTubers: ${pageUrl}`} />
            <p>Of gebruik de badge op je eigen site, Twitch-panel of stream:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/badge/${creator.slug}`} alt={`${name} staat op Gamehelden`} height={56} />
            <CopyField label="Code voor je website" value={`<a href="${pageUrl}"><img src="${SITE_URL}/badge/${creator.slug}" alt="${name} staat op Gamehelden" height="56"></a>`} />
          </section>
        </aside>
      </div>
    </>
  );
}
