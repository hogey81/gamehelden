import { NextResponse } from "next/server";
import { db, getCreators, getLatestVideos } from "@/lib/data";
import { sendPush } from "@/lib/push";

// Sends a sample live notification to the visitor's own device, so they can see what it
// will look like. Only works for an endpoint that is already subscribed.
export async function POST(request: Request) {
  const sb = db();
  if (!sb) return NextResponse.json({ error: "Meldingen zijn nog niet ingesteld" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== "string") return NextResponse.json({ error: "Geen abonnement" }, { status: 400 });
  const { data } = await sb.from("push_subscriptions").select("endpoint, p256dh, auth, creators").eq("endpoint", body.endpoint).maybeSingle();
  if (!data) return NextResponse.json({ error: "Onbekend abonnement" }, { status: 404 });

  const creators = await getCreators();
  const c = creators.find((x) => data.creators.includes(x.slug)) ?? creators[0];
  const name = c?.name ?? c?.handle ?? "Gamehelden";
  const [video] = c ? await getLatestVideos(1, c.slug) : [];
  const res = await sendPush(data, {
    kind: "live",
    title: `🔴 ${name} is LIVE!`,
    body: "Dit is een testmelding. Zo ziet het eruit als een creator die jij volgt live gaat.",
    icon: c?.avatar_url,
    image: video?.thumbnail_url,
    url: c ? `/creators/${c.slug}` : "/",
    tag: "test",
  });
  if (res === "gone") await sb.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
  return NextResponse.json({ ok: res === "ok" }, { status: res === "ok" ? 200 : 502 });
}
