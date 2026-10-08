"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Video } from "@/lib/types";

// Favourite creators live only in this visitor's browser: no account, nothing sent to us.
const KEY = "gamehelden-favorieten";
const EMPTY: string[] = [];
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: keep it for this visit only.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { cache = null; l(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export type FavEvent = { slug: string; name: string; added: boolean };
export const FAV_EVENT = "gamehelden:favoriet";

// Returns true when the creator was added. Announces the change so the toast can show it.
export function toggleFavorite(slug: string, name = slug): boolean {
  const now = read();
  const added = !now.includes(slug);
  write(added ? [...now, slug] : now.filter((s) => s !== slug));
  window.dispatchEvent(new CustomEvent<FavEvent>(FAV_EVENT, { detail: { slug, name, added } }));
  return added;
}

// Newest videos of the visitor's favourites, fetched whenever the favourites change.
// null while loading.
export function useFavoriteVideos(limit: number): Video[] | null {
  const favs = useFavorites();
  const key = [...favs].sort().join(",");
  const [state, setState] = useState<{ key: string; videos: Video[] } | null>(null);
  useEffect(() => {
    if (!key) return;
    let live = true;
    fetch(`/api/videos?creators=${encodeURIComponent(key)}&limit=${limit}`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((videos: Video[]) => live && setState({ key, videos }));
    return () => { live = false; };
  }, [key, limit]);
  if (!key) return [];
  return state?.key === key ? state.videos : null;
}
