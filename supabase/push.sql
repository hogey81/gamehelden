-- Push notifications. Run once in Supabase (SQL Editor > New query > Run).
-- Only the server (service role key) can read or write these tables.

create table if not exists push_subscriptions (
  endpoint text primary key,             -- the browser's push address
  p256dh text not null,
  auth text not null,
  creators text[] not null default '{}', -- slugs of the creators this visitor follows
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists push_subscriptions_creators on push_subscriptions using gin (creators);

-- Which live streams and uploads were already announced, so nobody is notified twice.
create table if not exists push_sent (
  video_id text primary key,
  kind text not null check (kind in ('live', 'video')),
  creator_slug text not null,
  sent_at timestamptz not null default now()
);

-- Small shared cache: the notify cron stores who is live, the live bar reads it.
create table if not exists site_cache (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_cache enable row level security;
alter table push_subscriptions enable row level security;
alter table push_sent enable row level security;
