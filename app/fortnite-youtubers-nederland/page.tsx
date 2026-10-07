import type { Metadata } from "next";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getCreators } from "@/lib/data";
import { compact } from "@/lib/format";

export const revalidate = 3600;

const month = () => new Date().toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Beste Nederlandse Fortnite YouTubers (${month()})`,
    description: "De grootste Nederlandse en Vlaamse Fortnite YouTubers op een rij, gesorteerd op abonnees en elke dag bijgewerkt.",
    alternates: { canonical: "/fortnite-youtubers-nederland" },
  };
}

export default async function FortniteRanking() {
  const creators = await getCreators("fortnite");
  return (
    <>
      <section className="hero">
        <h1>Beste Nederlandse Fortnite YouTubers ({month()})</h1>
        <p className="lead">
          De Nederlandse en Vlaamse Fortnite-kanalen die we volgen, gesorteerd op het aantal abonnees dat YouTube toont. De lijst
          wordt elke dag bijgewerkt. Mis je iemand? Laat het ons weten.
        </p>
      </section>

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

      <section className="block prose">
        <h2>Hoe komt deze lijst tot stand?</h2>
        <p>
          We volgen een vaste lijst Nederlandstalige Fortnite-creators. Hun kanaalgegevens halen we dagelijks op bij YouTube. De
          volgorde is simpelweg het aantal abonnees; kanalen die hun abonneeaantal verbergen staan onderaan.
        </p>
      </section>
    </>
  );
}
