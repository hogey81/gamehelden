import type { Metadata } from "next";
import Link from "next/link";
import { getCreators } from "@/lib/data";
import { GAMES, rankingPath } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ranglijsten per game",
  description: "De grootste Nederlandse YouTubers per game: Fortnite, Minecraft, Roblox, GTA, EA FC en meer.",
  alternates: { canonical: "/ranglijsten" },
};

export default async function Rankings() {
  const all = await getCreators();
  const games = Object.keys(GAMES)
    .map((g) => ({ g, count: all.filter((c) => c.games.includes(g)).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  return (
    <>
      <section className="hero">
        <h1>Ranglijsten per game</h1>
        <p className="lead">Kies een game en zie de grootste Nederlandse YouTubers, elke dag bijgewerkt.</p>
      </section>
      <section className="block game-grid">
        {games.map(({ g, count }) => (
          <Link key={g} href={rankingPath(g)} className="game-card">
            <strong>{GAMES[g]}</strong>
            <small>{count} {count === 1 ? "creator" : "creators"}</small>
          </Link>
        ))}
      </section>
    </>
  );
}
