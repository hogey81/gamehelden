import { unstable_cache } from "next/cache";
import { db } from "./data";
import { liveNow, recentUploadIds, type LiveInfo } from "./youtube";

export type LiveStream = LiveInfo & { creator_slug: string; name: string };

// A stream that is live shows up at the top of the channel's uploads. Checking the newest
// 3 uploads costs one quota unit per creator, refreshed at most every 10 minutes: about
// 3,500 units a day with 24 creators, out of YouTube's free 10,000. With many more creators,
// raise the revalidate time.
async function fetchLive(): Promise<LiveStream[]> {
  const sb = db();
  if (!sb || !process.env.YOUTUBE_API_KEY) return [];
  const { data, error } = await sb
    .from("creators")
    .select("slug, name, handle, uploads_playlist")
    .eq("active", true)
    .not("uploads_playlist", "is", null);
  if (error) throw error;
  const owner = new Map<string, { slug: string; name: string }>();
  await Promise.all(
    (data ?? []).map(async (c) => {
      try {
        for (const id of await recentUploadIds(c.uploads_playlist, 3)) owner.set(id, { slug: c.slug, name: c.name ?? c.handle });
      } catch {
        // One broken channel shouldn't hide everyone else's stream.
      }
    }),
  );
  const live = await liveNow([...owner.keys()]);
  return live.map((l) => ({ ...l, creator_slug: owner.get(l.id)!.slug, name: owner.get(l.id)!.name }));
}

export const getLive = unstable_cache(fetchLive, ["live-v1"], { revalidate: 600 });
