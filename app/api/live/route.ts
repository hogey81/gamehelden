import { NextResponse } from "next/server";
import { getLive } from "@/lib/live";

// Who is streaming right now. Cached for 10 minutes (see lib/live.ts).
export async function GET() {
  const live = await getLive().catch(() => []);
  return NextResponse.json(live, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
