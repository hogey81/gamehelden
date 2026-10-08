-- Lets creators sign up their own channel via /aanmelden. Run once in Supabase (SQL Editor > Run).
--
-- A sign-up lands in `creators` with active = false, so it stays hidden. To approve it, open
-- Table Editor > creators, tick `active` on that row and save; the next sync fills in the rest.
-- To reject it, delete the row.
alter table creators add column if not exists submitted_at timestamptz;
alter table creators add column if not exists submit_note text;

-- Pending sign-ups, newest first. Handy as a saved query in the SQL Editor.
create or replace view aanmeldingen as
  select slug, name, handle, games, submit_note, submitted_at, subscriber_count
  from creators
  where not active and submitted_at is not null
  order by submitted_at desc;
