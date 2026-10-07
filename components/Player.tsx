"use client";

import { useState } from "react";

// Shows the thumbnail first and only loads YouTube's player after a click: faster pages,
// and no YouTube cookies for visitors who don't press play (privacy-enhanced mode).
export default function Player({ id, title, thumbnail }: { id: string; title: string; thumbnail: string | null }) {
  const [playing, setPlaying] = useState(false);
  if (id.startsWith("demo")) {
    return <div className="player player-demo">Voorbeeldvideo: hier speelt straks de echte YouTube-video af.</div>;
  }
  if (playing) {
    return (
      <div className="player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button className="player" onClick={() => setPlaying(true)} aria-label={`Speel af: ${title}`}>
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnail} alt="" />
      )}
      <span className="play" aria-hidden />
    </button>
  );
}
