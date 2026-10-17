import { unstable_cache } from "next/cache";
import { db } from "./data";
import { liveNow, recentUploadIds, videosById, type LiveInfo, type VideoInfo } from "./youtube";

export type LiveStream = LiveInfo & { creator_slug: string; name: string };
export type Owner = { slug: string; name: string; handle: string; avatar_url: string | null };
export type Snapshot = { live: LiveStream[]; uploads: VideoInfo[]; owner: Map<string, Owner> };

// A stream that is live shows up at the top of the channel's uploads. Checking the newest
// 3 uploads costs one quota unit per creator. This is the only place that does it: the
// notify cron (every 10 minutes) runs it and stores the live streams in `site_cache`, and
// the live bar reads that copy. Without the cron the live bar falls back to running it
// itself, at most every 10 minutes: about 3,500 units a day with 24 creators, out of
// YouTube's free 10,000. With many more creators, raise the revalidate time.
export async function fetchSnapshot(): Promise<Snapshot> {
  const sb = db();
  const empty: Snapshot = { live: [], uploads: [], owner: new Map() };
  if (!sb || !process.env.YOUTUBE_API_KEY) return empty;
  const { data, error } = await sb
    .from("creators")
    .select("slug, name, handle, avatar_url, uploads_playlist")
    .eq("active", true)
    .not("uploads_playlist", "is", null);
  if (error) throw error;
  const owner = new Map<string, Owner>();
  await Promise.all(
    (data ?? []).map(async (c) => {
      try {
        const o = { slug: c.slug, name: c.name ?? c.handle, handle: c.handle, avatar_url: c.avatar_url };
        for (const id of await recentUploadIds(c.uploads_playlist, 3)) owner.set(id, o);
      } catch {
        // One broken channel shouldn't hide everyone else's stream.
      }
    }),
  );
  const ids = [...owner.keys()];
  if (!ids.length) return { ...empty, owner };
  const [live, uploads] = await Promise.all([liveNow(ids), videosById(ids)]);
  return {
    live: live.map((l) => ({ ...l, creator_slug: owner.get(l.id)!.slug, name: owner.get(l.id)!.name })),
    uploads,
    owner,
  };
}

const SHARED_MAX_AGE_MS = 15 * 60_000; // the cron runs every 10 minutes; older means it stopped

export async function storeLive(live: LiveStream[]) {
  await db()?.from("site_cache").upsert({ key: "live", value: live, updated_at: new Date().toISOString() });
}

async function readShared(): Promise<LiveStream[] | null> {
  const sb = db();
  if (!sb) return null;
  const { data } = await sb.from("site_cache").select("value, updated_at").eq("key", "live").maybeSingle();
  if (!data || Date.now() - new Date(data.updated_at).getTime() > SHARED_MAX_AGE_MS) return null;
  return data.value as LiveStream[];
}

const fetchOwn = unstable_cache(async () => (await fetchSnapshot()).live, ["live-v2"], { revalidate: 600 });

export const getLive = unstable_cache(async () => (await readShared()) ?? fetchOwn(), ["live-shared-v1"], { revalidate: 60 });
