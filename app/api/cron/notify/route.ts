import { NextResponse } from "next/server";
import { db } from "@/lib/data";
import { pushConfigured, sendPush, type PushMessage, type Sub } from "@/lib/push";
import { liveNow, recentUploadIds, videosById } from "@/lib/youtube";

// Called every 10 minutes by .github/workflows/notify.yml (Vercel Hobby only allows one cron
// a day). Finds creators who just went live or uploaded and sends a push to their followers.
// Quota: one playlistItems call per followed creator plus two videos calls per run.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Uploads older than this are not announced, so the first run never floods people with old videos.
const FRESH_MS = 3 * 3600_000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET ontbreekt" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "geen toegang" }, { status: 401 });
  }
  const sb = db();
  if (!sb || !process.env.YOUTUBE_API_KEY || !pushConfigured()) {
    return NextResponse.json({ error: "Supabase, YouTube of VAPID-sleutels zijn niet ingesteld" }, { status: 503 });
  }

  // No followers, no need to spend YouTube quota.
  const { data: subs, error: subErr } = await sb.from("push_subscriptions").select("endpoint, p256dh, auth, creators");
  if (subErr) throw subErr;
  if (!subs?.length) return NextResponse.json({ subscribers: 0, sent: 0 });
  const followed = new Set(subs.flatMap((s) => s.creators));

  const { data: creators, error } = await sb
    .from("creators")
    .select("slug, name, handle, avatar_url, uploads_playlist")
    .eq("active", true)
    .not("uploads_playlist", "is", null);
  if (error) throw error;

  const owner = new Map<string, (typeof creators)[number]>();
  const failed: string[] = [];
  await Promise.all(
    creators
      .filter((c) => followed.has(c.slug))
      .map(async (c) => {
        try {
          for (const id of await recentUploadIds(c.uploads_playlist, 3)) owner.set(id, c);
        } catch (e) {
          failed.push(`${c.slug}: ${(e as Error).message}`);
        }
      }),
  );
  const ids = [...owner.keys()];
  if (!ids.length) return NextResponse.json({ subscribers: subs.length, sent: 0, failed });

  const [live, uploads] = await Promise.all([liveNow(ids), videosById(ids)]);
  const cutoff = Date.now() - FRESH_MS;
  const candidates = [
    ...live.map((l) => ({ kind: "live" as const, id: l.id, title: l.title, thumb: l.thumbnail_url, at: l.started_at })),
    ...uploads
      .filter((v) => new Date(v.published_at).getTime() > cutoff)
      .map((v) => ({ kind: "video" as const, id: v.id, title: v.title, thumb: v.thumbnail_url, at: v.published_at })),
  ];
  if (!candidates.length) return NextResponse.json({ subscribers: subs.length, announced: 0, sent: 0, failed });

  // Claim each id; only rows that were not announced before come back. A stream that later
  // becomes an upload keeps its id, so it is not announced a second time.
  const { data: fresh, error: claimErr } = await sb
    .from("push_sent")
    .upsert(
      candidates.map((c) => ({ video_id: c.id, kind: c.kind, creator_slug: owner.get(c.id)!.slug })),
      { onConflict: "video_id", ignoreDuplicates: true },
    )
    .select("video_id");
  if (claimErr) throw claimErr;
  const isNew = new Set((fresh ?? []).map((r) => r.video_id));

  // New uploads also go straight into the videos table, so they show on the site now.
  const newUploads = uploads.filter((v) => isNew.has(v.id) && v.embeddable);
  if (newUploads.length) {
    const now = new Date().toISOString();
    await sb.from("videos").upsert(
      newUploads.map(({ embeddable: _, ...v }) => ({ ...v, creator_slug: owner.get(v.id)!.slug, synced_at: now })),
    );
  }

  const gone = new Set<string>();
  let sent = 0;
  for (const c of candidates.filter((c) => isNew.has(c.id))) {
    const cr = owner.get(c.id)!;
    const name = cr.name ?? cr.handle;
    const base = { icon: cr.avatar_url, image: c.thumb, body: c.title, timestamp: c.at ? new Date(c.at).getTime() : Date.now() };
    const msg: PushMessage =
      c.kind === "live"
        ? { ...base, kind: "live", title: `🔴 ${name} is LIVE!`, url: `https://www.youtube.com/watch?v=${c.id}`, tag: `live-${cr.slug}` }
        : { ...base, kind: "video", title: `🎬 ${name} heeft een nieuwe video`, url: `/creators/${cr.slug}`, tag: `video-${c.id}` };
    const targets: Sub[] = subs.filter((s) => s.creators.includes(cr.slug));
    const results = await Promise.all(targets.map((t) => sendPush(t, msg)));
    results.forEach((r, i) => {
      if (r === "ok") sent++;
      if (r === "gone") gone.add(targets[i].endpoint);
    });
  }
  if (gone.size) await sb.from("push_subscriptions").delete().in("endpoint", [...gone]);

  return NextResponse.json({ subscribers: subs.length, announced: isNew.size, sent, removed: gone.size, failed });
}
