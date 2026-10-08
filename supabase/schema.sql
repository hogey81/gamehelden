-- Gamehelden database. Run once in Supabase (SQL Editor > New query > Run).
--
-- You only ever touch `creators` yourself: add a row with a slug, the YouTube handle and
-- the games. The daily sync (app/api/cron/sync) fills in everything else and the videos.

create table if not exists creators (
  slug text primary key,                 -- used in the URL: /creators/<slug>
  handle text not null unique,           -- YouTube handle, e.g. @EHVgaming1
  games text[] not null default '{fortnite}',
  region text,                           -- shown on the page, e.g. 'Eindhoven'
  bio text,                              -- your own text; the page shows it as written
  setup jsonb not null default '[]',     -- [{"label":"Headset","name":"…","url":"https://…"}]
  active boolean not null default true,  -- false hides the creator without deleting

  -- Filled by the sync. YouTube's terms: refresh or delete within 30 days.
  channel_id text unique,
  name text,
  avatar_url text,
  subscriber_count bigint,
  subscribers_hidden boolean not null default false,
  view_count bigint,
  video_count integer,
  channel_started_at timestamptz,
  uploads_playlist text,
  synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id text primary key,                   -- YouTube video id
  creator_slug text not null references creators(slug) on delete cascade,
  title text not null,
  thumbnail_url text,
  published_at timestamptz not null,
  duration_seconds integer,
  view_count bigint,
  synced_at timestamptz not null default now()
);

create index if not exists videos_published on videos (published_at desc);
create index if not exists videos_creator on videos (creator_slug, published_at desc);

-- Everyone may read; only the server (service role key) may write.
alter table creators enable row level security;
alter table videos enable row level security;
drop policy if exists "public read" on creators;
create policy "public read" on creators for select using (active);
drop policy if exists "public read" on videos;
create policy "public read" on videos for select using (true);

-- Start with your own channel. Add more creators the same way.
insert into creators (slug, handle, games, region)
values ('ehvgaming', '@EHVgaming1', '{fortnite,ea-fc}', 'Eindhoven')
on conflict (slug) do nothing;
