import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import { getCreators } from "@/lib/data";
import { compact } from "@/lib/format";
import { GAMES, gameFromRankingSlug, rankingPath } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ ranking: string }> };

export function generateStaticParams() {
  return Object.keys(GAMES).map((g) => ({ ranking: rankingPath(g).slice(1) }));
}

const month = () => new Date().toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = gameFromRankingSlug((await params).ranking);
  if (!game) return {};
  const name = GAMES[game];
  return {
    title: `Beste Nederlandse ${name} YouTubers (${month()})`,
    description: `De grootste Nederlandse en Vlaamse ${name} YouTubers op een rij, gesorteerd op abonnees en elke dag bijgewerkt.`,
    alternates: { canonical: rankingPath(game) },
  };
}

export default async function Ranking({ params }: Props) {
  const game = gameFromRankingSlug((await params).ranking);
  if (!game) notFound();
  const name = GAMES[game];
  const [creators, all] = await Promise.all([getCreators(game), getCreators()]);
  const otherGames = Object.keys(GAMES).filter((g) => g !== game && all.some((c) => c.games.includes(g)));

  return (
    <>
      <section className="hero">
        <h1>Beste Nederlandse {name} YouTubers ({month()})</h1>
        <p className="lead">
          De Nederlandse en Vlaamse {name}-kanalen die we volgen, gesorteerd op het aantal abonnees dat YouTube toont. De lijst
          wordt elke dag bijgewerkt. Mis je iemand? <Link href="/aanmelden">Meld een kanaal aan</Link>.
        </p>
      </section>

      {creators.length === 0 ? (
        <p className="empty block">Er staan nog geen {name}-creators op Gamehelden.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Creator</th>
                <th className="num">Abonnees</th>
                <th className="num">Totale weergaven</th>
                <th className="num">Video&apos;s</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((c, i) => (
                <tr key={c.slug}>
                  <td className="rank">{i + 1}</td>
                  <td>
                    <Link href={`/creators/${c.slug}`} className="who">
                      <Avatar creator={c} />
                      {c.name ?? c.handle}
                    </Link>
                  </td>
                  <td className="num">{c.subscribers_hidden ? "verborgen" : compact(c.subscriber_count)}</td>
                  <td className="num">{compact(c.view_count)}</td>
                  <td className="num">{c.video_count ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="block prose">
        <h2>Hoe komt deze lijst tot stand?</h2>
        <p>
          We volgen een vaste lijst Nederlandstalige creators die {name} spelen. Hun kanaalgegevens halen we dagelijks op bij
          YouTube. De volgorde is simpelweg het aantal abonnees; kanalen die hun abonneeaantal verbergen staan onderaan.
        </p>
      </section>

      {otherGames.length > 0 && (
        <section className="block">
          <h2>Andere ranglijsten</h2>
          <div className="chips">
            {otherGames.map((g) => (
              <Link key={g} className="chip" href={rankingPath(g)}>Nederlandse {GAMES[g]} YouTubers</Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
