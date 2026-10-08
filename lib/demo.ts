import type { Creator, Video } from "./types";

// Shown only while Supabase isn't configured (see lib/data.ts). Everything except
// EHVgaming is made up, and the site says so in a banner.
const base = {
  region: null,
  bio: null,
  setup: [],
  channel_id: null,
  avatar_url: null,
  subscribers_hidden: false,
  channel_started_at: null,
  synced_at: null,
};

export const DEMO_CREATORS: Creator[] = [
  { ...base, slug: "noahbuilds", handle: "@noahbuilds", name: "NoahBuilds", games: ["fortnite"], subscriber_count: 184000, view_count: 21400000, video_count: 640 },
  { ...base, slug: "zerobuildzara", handle: "@zerobuildzara", name: "ZeroBuildZara", games: ["fortnite"], subscriber_count: 126000, view_count: 14800000, video_count: 512 },
  { ...base, slug: "daanplays", handle: "@daanplays", name: "Daan Plays", games: ["fortnite", "ea-fc"], subscriber_count: 92000, view_count: 9100000, video_count: 388 },
  { ...base, slug: "fortfenna", handle: "@fortfenna", name: "FortFenna", games: ["fortnite"], subscriber_count: 61000, view_count: 6300000, video_count: 301 },
  { ...base, slug: "boxfightbram", handle: "@boxfightbram", name: "BoxfightBram", games: ["fortnite"], subscriber_count: 38500, view_count: 3900000, video_count: 274 },
  {
    ...base,
    slug: "ehvgaming",
    handle: "@EHVgaming1",
    name: "EHVgaming",
    games: ["fortnite", "ea-fc"],
    region: "Eindhoven",
    subscriber_count: 800,
    view_count: 300000,
    video_count: 212,
    channel_started_at: "2021-03-01T00:00:00Z",
    bio: "Hier komt jouw eigen tekst over het kanaal: wat voor video's je maakt, waar je om bekend staat en voor wie het is. Deze tekst maakt de pagina waardevol naast YouTube.",
    setup: [
      { label: "Headset", name: "Voorbeeld-headset" },
      { label: "Controller", name: "Voorbeeld-controller" },
      { label: "Monitor", name: "Voorbeeld 144 Hz-monitor" },
    ],
  },
];

const day = 86400000;
const ago = (d: number) => new Date(Date.UTC(2026, 9, 7) - d * day).toISOString();
const v = (id: string, creator_slug: string, title: string, d: number, min: number, views: number): Video => ({
  id, creator_slug, title, thumbnail_url: null, published_at: ago(d), duration_seconds: min * 60, view_count: views,
});

export const DEMO_VIDEOS: Video[] = [
  v("demo1", "zerobuildzara", "Ik won 10 Zero Build potjes op rij", 0.1, 18, 12000),
  v("demo2", "noahbuilds", "Nieuw seizoen: alle wapens getest", 0.3, 24, 31000),
  v("demo3", "ehvgaming", "Ranked tot Unreal met kijkers", 1, 31, 420),
  v("demo4", "daanplays", "Beste landing spots dit seizoen", 1.2, 12, 8800),
  v("demo5", "fortfenna", "Creative map van een kijker gespeeld", 2, 15, 5100),
  v("demo6", "boxfightbram", "Boxfight tips voor beginners", 2.5, 10, 3900),
  v("demo7", "ehvgaming", "EA FC 26: mijn eerste Ultimate Team", 4, 22, 610),
  v("demo8", "ehvgaming", "Zero Build duo's met abonnees", 7, 28, 1300),
  v("demo9", "ehvgaming", "Victory Royale met alleen grijze wapens", 14, 14, 2400),
];
