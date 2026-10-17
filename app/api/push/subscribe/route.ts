import { NextResponse } from "next/server";
import { db } from "@/lib/data";

const SLUG = /^[a-z0-9-]{1,60}$/;
const slugs = (v: unknown) =>
  Array.isArray(v) ? [...new Set(v.filter((s): s is string => typeof s === "string" && SLUG.test(s)))].slice(0, 100) : [];

// Saves (or updates) a visitor's push subscription and the creators they follow.
// No account: the subscription itself is the only identifier.
export async function POST(request: Request) {
  const sb = db();
  if (!sb) return NextResponse.json({ error: "Meldingen zijn nog niet ingesteld" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const sub = body?.subscription;
  const endpoint = sub?.endpoint;
  const p256dh = sub?.keys?.p256dh;
  const auth = sub?.keys?.auth;
  if (typeof endpoint !== "string" || !endpoint.startsWith("https://") || endpoint.length > 1000 || typeof p256dh !== "string" || typeof auth !== "string") {
    return NextResponse.json({ error: "Ongeldig abonnement" }, { status: 400 });
  }
  const { error } = await sb
    .from("push_subscriptions")
    .upsert({ endpoint, p256dh, auth, creators: slugs(body.creators), updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: "Opslaan mislukt" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const sb = db();
  if (!sb) return NextResponse.json({ ok: true });
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint === "string") await sb.from("push_subscriptions").delete().eq("endpoint", body.endpoint);
  return NextResponse.json({ ok: true });
}
