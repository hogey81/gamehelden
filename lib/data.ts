import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Creator, Video } from "./types";
import { DEMO_CREATORS, DEMO_VIDEOS } from "./demo";

// Server-only. Until Supabase is configured the site shows clearly marked example data,
// so it can be deployed and looked at before any keys exist.
let client: SupabaseClient | null | undefined;
export function db(): SupabaseClient | null {
  if (client === undefined) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  }
  return client;
}

export const isDemo = () => db() === null;

export async function getCreators(game?: string): Promise<Creator[]> {
  const sb = db();
  let list: Creator[];
  if (!sb) list = DEMO_CREATORS;
  else {
    const { data, error } = await sb.from("creators").select("*").eq("active", true);
    if (error) throw error;
    list = data as Creator[];
  }
  if (game) list = list.filter((c) => c.games.includes(game));
  // Ordered by YouTube's own subscriber count. YouTube's terms forbid our own derived
  // metrics (growth, scores), so the ranking uses that number and nothing else.
  return [...list].sort((a, b) => (b.subscriber_count ?? -1) - (a.subscriber_count ?? -1));
}

export async function getCreator(slug: string): Promise<Creator | null> {
  const sb = db();
  if (!sb) return DEMO_CREATORS.find((c) => c.slug === slug) ?? null;
  const { data } = await sb.from("creators").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return (data as Creator) ?? null;
}

export async function getLatestVideos(limit: number, creatorSlug?: string): Promise<Video[]> {
  const sb = db();
  if (!sb) {
    return DEMO_VIDEOS.filter((v) => !creatorSlug || v.creator_slug === creatorSlug)
      .sort((a, b) => b.published_at.localeCompare(a.published_at))
      .slice(0, limit);
  }
  let q = sb.from("videos").select("*").order("published_at", { ascending: false }).limit(limit);
  if (creatorSlug) q = q.eq("creator_slug", creatorSlug);
  const { data, error } = await q;
  if (error) throw error;
  return data as Video[];
}

export async function getPopularVideos(creatorSlug: string, limit: number): Promise<Video[]> {
  const sb = db();
  if (!sb) {
    return DEMO_VIDEOS.filter((v) => v.creator_slug === creatorSlug)
      .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
      .slice(0, limit);
  }
  const { data, error } = await sb
    .from("videos")
    .select("*")
    .eq("creator_slug", creatorSlug)
    .order("view_count", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data as Video[];
}
