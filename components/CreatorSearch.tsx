"use client";

import { useMemo, useState } from "react";
import CreatorTile from "@/components/CreatorTile";
import { compact } from "@/lib/format";
import { GAMES, type Creator } from "@/lib/types";

// Searches the creators that are on Gamehelden, by name or handle, with a game filter.
export default function CreatorSearch({ creators }: { creators: Creator[] }) {
  const [q, setQ] = useState("");
  const [game, setGame] = useState<string | null>(null);
  const games = useMemo(() => [...new Set(creators.flatMap((c) => c.games))], [creators]);
  const needle = q.trim().toLowerCase().replace(/^@/, "");
  const hits = creators.filter(
    (c) =>
      (!game || c.games.includes(game)) &&
      (!needle || `${c.name ?? ""} ${c.handle}`.toLowerCase().includes(needle)),
  );

  return (
    <div className="search">
      <input
        id="creator-search"
        type="search"
        placeholder="Zoek een creator, bijv. EHVgaming"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <div className="chips" role="group" aria-label="Filter op game">
        <button type="button" className="chip" aria-pressed={!game} onClick={() => setGame(null)}>Alle games</button>
        {games.map((g) => (
          <button key={g} type="button" className="chip" aria-pressed={game === g} onClick={() => setGame(game === g ? null : g)}>
            {GAMES[g] ?? g}
          </button>
        ))}
      </div>

      {hits.length === 0 ? (
        <p className="empty">Geen creator gevonden voor &quot;{q}&quot;. Staat je favoriet er nog niet op? Een creator kan zich <a href="/aanmelden">hier aanmelden</a>.</p>
      ) : (
        <div className="creator-grid">
          {hits.map((c) => (
            <CreatorTile
              key={c.slug}
              creator={c}
              detail={`${c.games.map((g) => GAMES[g] ?? g).join(", ")} · ${c.subscribers_hidden ? "abonnees verborgen" : `${compact(c.subscriber_count)} abonnees`}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
