"use server";

import { db } from "@/lib/data";
import { GAMES } from "@/lib/types";
import { channelByHandle, channelsById, type Channel } from "@/lib/youtube";

export type SignupState = { ok?: boolean; message?: string };

const MAX_PENDING = 200; // stop accepting once this many wait for approval (spam brake)

// "@naam", "naam", "youtube.com/@naam" or "youtube.com/channel/UC…" -> channel
async function findChannel(input: string): Promise<Channel | null> {
  const s = input.trim();
  const id = s.match(/(UC[\w-]{22})/)?.[1];
  if (id) return (await channelsById([id]))[0] ?? null;
  const handle = s.match(/@([\w.-]{3,30})/)?.[1] ?? s.match(/^([\w.-]{3,30})$/)?.[1];
  return handle ? channelByHandle(`@${handle}`) : null;
}

export async function signup(_prev: SignupState, form: FormData): Promise<SignupState> {
  if (form.get("website")) return { ok: true, message: "Bedankt!" }; // honeypot: bots fill every field
  const sb = db();
  if (!sb) return { message: "Aanmelden kan nog niet: de site draait in de voorbeeldversie." };

  const input = String(form.get("kanaal") ?? "");
  const games = form.getAll("games").map(String).filter((g) => g in GAMES);
  const note = String(form.get("note") ?? "").trim().slice(0, 500) || null;
  if (!input.trim()) return { message: "Vul je kanaal in, bijvoorbeeld @jouwkanaal." };
  if (games.length === 0) return { message: "Kies minstens één game die je speelt." };
  if (!form.get("owner")) return { message: "Bevestig dat dit jouw kanaal is of dat je het mag aanmelden." };

  let ch: Channel | null;
  try {
    ch = await findChannel(input);
  } catch {
    return { message: "We konden YouTube even niet bereiken. Probeer het straks opnieuw." };
  }
  if (!ch) return { message: "Dat kanaal vinden we niet op YouTube. Kopieer je @naam onder je kanaalnaam." };

  const { data: existing } = await sb.from("creators").select("active").eq("channel_id", ch.id).maybeSingle();
  if (existing) {
    return {
      ok: true,
      message: existing.active ? `${ch.name} staat al op Gamehelden.` : `${ch.name} is al aangemeld en wacht op goedkeuring.`,
    };
  }

  const { count } = await sb
    .from("creators")
    .select("slug", { count: "exact", head: true })
    .eq("active", false)
    .not("submitted_at", "is", null);
  if ((count ?? 0) >= MAX_PENDING) return { message: "Er liggen veel aanmeldingen te wachten. Probeer het later nog eens." };

  const base = ch.name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "creator";
  const { data: taken } = await sb.from("creators").select("slug").like("slug", `${base}%`);
  const used = new Set((taken ?? []).map((r) => r.slug));
  let slug = base;
  for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`;

  const { uploads_playlist: _, id, ...stats } = ch;
  const handle = input.match(/@[\w.-]{3,30}/)?.[0] ?? `@${slug}`;
  const { error } = await sb.from("creators").insert({
    slug,
    handle,
    channel_id: id,
    games,
    active: false,
    submitted_at: new Date().toISOString(),
    submit_note: note,
    ...stats,
  });
  if (error) return { message: "Opslaan lukte niet. Probeer het later opnieuw." };
  return { ok: true, message: `Gelukt! ${ch.name} is aangemeld. Na goedkeuring krijg je je eigen pagina op Gamehelden.` };
}
