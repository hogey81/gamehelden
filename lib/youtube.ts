// YouTube Data API v3. Quota: a channels/videos/playlistItems call costs 1 unit and the
// free daily quota is 10,000, so a daily sync of a few hundred creators is far below it.
const API = "https://www.googleapis.com/youtube/v3";

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY ontbreekt");
  const res = await fetch(`${API}/${path}?${new URLSearchParams({ ...params, key })}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`YouTube ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

type Thumbs = Record<string, { url: string } | undefined>;
const bestThumb = (t: Thumbs) => (t.maxres ?? t.high ?? t.medium ?? t.default)?.url ?? null;

export type Channel = {
  id: string;
  name: string;
  avatar_url: string | null;
  subscriber_count: number | null;
  subscribers_hidden: boolean;
  view_count: number | null;
  video_count: number | null;
  channel_started_at: string | null;
  uploads_playlist: string | null;
};

type ChannelItem = {
  id: string;
  snippet: { title: string; publishedAt: string; thumbnails: Thumbs };
  statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean; viewCount?: string; videoCount?: string };
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
};

const num = (s?: string) => (s == null ? null : Number(s));

function toChannel(c: ChannelItem): Channel {
  return {
    id: c.id,
    name: c.snippet.title,
    avatar_url: bestThumb(c.snippet.thumbnails),
    subscriber_count: c.statistics?.hiddenSubscriberCount ? null : num(c.statistics?.subscriberCount),
    subscribers_hidden: !!c.statistics?.hiddenSubscriberCount,
    view_count: num(c.statistics?.viewCount),
    video_count: num(c.statistics?.videoCount),
    channel_started_at: c.snippet.publishedAt,
    uploads_playlist: c.contentDetails?.relatedPlaylists?.uploads ?? null,
  };
}

const PARTS = "snippet,statistics,contentDetails";

export async function channelByHandle(handle: string): Promise<Channel | null> {
  const r = await get<{ items?: ChannelItem[] }>("channels", { part: PARTS, forHandle: handle });
  return r.items?.[0] ? toChannel(r.items[0]) : null;
}

export async function channelsById(ids: string[]): Promise<Channel[]> {
  const out: Channel[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await get<{ items?: ChannelItem[] }>("channels", { part: PARTS, id: ids.slice(i, i + 50).join(",") });
    out.push(...(r.items ?? []).map(toChannel));
  }
  return out;
}

export async function recentUploadIds(playlistId: string, max = 25): Promise<string[]> {
  const r = await get<{ items?: { contentDetails: { videoId: string } }[] }>("playlistItems", {
    part: "contentDetails",
    playlistId,
    maxResults: String(max),
  });
  return (r.items ?? []).map((i) => i.contentDetails.videoId);
}

export type VideoInfo = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string;
  duration_seconds: number | null;
  view_count: number | null;
  embeddable: boolean;
};

// "PT1H2M3S" -> 3723
function seconds(iso?: string) {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+(m[1] ?? 0)) * 3600 + (+(m[2] ?? 0)) * 60 + +(m[3] ?? 0) : null;
}

export async function videosById(ids: string[]): Promise<VideoInfo[]> {
  const out: VideoInfo[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await get<{
      items?: {
        id: string;
        snippet: { title: string; publishedAt: string; thumbnails: Thumbs; liveBroadcastContent?: string };
        contentDetails?: { duration?: string };
        statistics?: { viewCount?: string };
        status?: { embeddable?: boolean; privacyStatus?: string };
      }[];
    }>("videos", { part: "snippet,contentDetails,statistics,status", id: ids.slice(i, i + 50).join(",") });
    for (const v of r.items ?? []) {
      // Skip upcoming/live streams and anything that isn't public.
      if (v.snippet.liveBroadcastContent && v.snippet.liveBroadcastContent !== "none") continue;
      if (v.status?.privacyStatus && v.status.privacyStatus !== "public") continue;
      out.push({
        id: v.id,
        title: v.snippet.title,
        thumbnail_url: bestThumb(v.snippet.thumbnails),
        published_at: v.snippet.publishedAt,
        duration_seconds: seconds(v.contentDetails?.duration),
        view_count: num(v.statistics?.viewCount),
        embeddable: v.status?.embeddable !== false,
      });
    }
  }
  return out;
}
