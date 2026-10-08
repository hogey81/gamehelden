import { NextResponse } from "next/server";
import { getVideosFor } from "@/lib/data";

// /api/videos?creators=a,b&limit=20 -> newest videos of those creators. Favourites live in
// the visitor's browser, so their pages ask for their videos here.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slugs = (url.searchParams.get("creators") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9-]{1,60}$/.test(s))
    .slice(0, 100);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 50);
  const videos = await getVideosFor(slugs, limit);
  return NextResponse.json(videos, { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } });
}
