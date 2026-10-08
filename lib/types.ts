export type SetupItem = { label: string; name: string; url?: string };

export type Creator = {
  slug: string;
  handle: string;
  games: string[];
  region: string | null;
  bio: string | null;
  setup: SetupItem[];
  channel_id: string | null;
  name: string | null;
  avatar_url: string | null;
  subscriber_count: number | null;
  subscribers_hidden: boolean;
  view_count: number | null;
  video_count: number | null;
  channel_started_at: string | null;
  synced_at: string | null;
};

export type Video = {
  id: string;
  creator_slug: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string;
  duration_seconds: number | null;
  view_count: number | null;
};

export const GAMES: Record<string, string> = {
  fortnite: "Fortnite",
  "ea-fc": "EA FC",
  minecraft: "Minecraft",
  gta: "GTA",
  cod: "Call of Duty",
  roblox: "Roblox",
};
