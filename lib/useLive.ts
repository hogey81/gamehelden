"use client";

import { useEffect, useState } from "react";
import type { LiveStream } from "./live";

// Live streams, fetched in the browser so cached pages still show who is live now.
export function useLive(): LiveStream[] {
  const [live, setLive] = useState<LiveStream[]>([]);
  useEffect(() => {
    let on = true;
    fetch("/api/live")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((l: LiveStream[]) => on && setLive(l));
    return () => { on = false; };
  }, []);
  return live;
}
