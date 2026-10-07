import { NextResponse } from "next/server";
import { db } from "@/lib/data";
import { channelByHandle, channelsById, recentUploadIds, videosById } from "@/lib/youtube";

// Runs once a day (vercel.json): refreshes every creator's channel stats and their latest
// uploads. A new creator only needs a handle; the first run looks up the channel.
// Only Vercel's scheduler knows CRON_SECRET.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const KEEP_DAYS = 30; // YouTube's terms: stored API data must be refreshed or deleted within 30 days.

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET ontbreekt" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "geen toegang" }, { status: 401 });
  }
  const sb = db();
  if (!sb) return NextResponse.json({ error: "Supabase is niet ingesteld" }, { status: 503 });

  const { data: creators, error } = await sb.from("creators").select("slug, handle, channel_id").eq("active", true);
  if (error) throw error;

  const failed: string[] = [];
  const now = new Date().toISOString();

  // New creators: resolve the handle to a channel id first.
  for (const c of creators.filter((c) => !c.channel_id)) {
    try {
      const ch = await channelByHandle(c.handle);
      if (ch) c.channel_id = ch.id;
      else failed.push(`${c.slug}: kanaal ${c.handle} niet gevonden`);
    } catch (e) {
      failed.push(`${c.slug}: ${(e as Error).message}`);
    }
  }

  const known = creators.filter((c) => c.channel_id);
  const channels = await channelsById(known.map((c) => c.channel_id!));
  let videos = 0;

  for (const ch of channels) {
    const slug = known.find((c) => c.channel_id === ch.id)!.slug;
    const { uploads_playlist, id, ...stats } = ch;
    const { error: upErr } = await sb
      .from("creators")
      .update({ ...stats, channel_id: id, uploads_playlist, synced_at: now })
      .eq("slug", slug);
    if (upErr) { failed.push(`${slug}: ${upErr.message}`); continue; }
    if (!uploads_playlist) continue;

    try {
      const ids = await recentUploadIds(uploads_playlist);
      const rows = (await videosById(ids))
        .filter((v) => v.embeddable)
        .map(({ embeddable: _, ...v }) => ({ ...v, creator_slug: slug, synced_at: now }));
      const { error: vErr } = await sb.from("videos").upsert(rows);
      if (vErr) throw vErr;
      videos += rows.length;
    } catch (e) {
      failed.push(`${slug}: ${(e as Error).message}`);
    }
  }

  // Videos that dropped out of a creator's latest uploads stop being refreshed; remove them
  // once they're older than YouTube allows.
  const cutoff = new Date(Date.now() - KEEP_DAYS * 86400000).toISOString();
  await sb.from("videos").delete().lt("synced_at", cutoff);

  return NextResponse.json({ creators: channels.length, videos, failed });
}
