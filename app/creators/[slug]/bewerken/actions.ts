"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/data";
import type { SetupItem } from "@/lib/types";
import { editCode } from "@/lib/verify";
import { channelDescription } from "@/lib/youtube";

export type EditState = { ok?: boolean; message?: string };

const ROWS = 6;

export async function saveProfile(_prev: EditState, form: FormData): Promise<EditState> {
  const sb = db();
  const slug = String(form.get("slug") ?? "");
  const code = editCode(slug);
  if (!sb || !code) return { message: "Bewerken kan nog niet op deze site." };

  const { data: creator } = await sb.from("creators").select("channel_id").eq("slug", slug).eq("active", true).maybeSingle();
  if (!creator?.channel_id) return { message: "Deze creator bestaat niet (meer)." };

  let description: string | null;
  try {
    description = await channelDescription(creator.channel_id);
  } catch {
    return { message: "We konden YouTube even niet bereiken. Probeer het straks opnieuw." };
  }
  if (!description?.toLowerCase().includes(code)) {
    return {
      message: `We vinden ${code} niet in je kanaalbeschrijving. Heb je hem opgeslagen op YouTube? Soms duurt het een paar minuten voordat YouTube de nieuwe tekst laat zien.`,
    };
  }

  const bio = String(form.get("bio") ?? "").trim().slice(0, 1500) || null;
  const supportCode = String(form.get("support_code") ?? "").trim();
  if (supportCode && !/^[A-Za-z0-9._-]{2,30}$/.test(supportCode)) {
    return { message: "Je creator-code mag alleen letters, cijfers, punt, streepje en liggend streepje bevatten." };
  }
  const setup: SetupItem[] = [];
  for (let i = 0; i < ROWS; i++) {
    const label = String(form.get(`label${i}`) ?? "").trim().slice(0, 40);
    const name = String(form.get(`name${i}`) ?? "").trim().slice(0, 80);
    // People paste "coolblue.nl/product/..." or "http://..." too.
    const url = String(form.get(`url${i}`) ?? "").trim().replace(/^(https?:\/\/)?/, "https://").replace(/^https:\/\/$/, "");
    if (!label && !name) continue;
    if (!label || !name) return { message: "Vul bij elk setup-onderdeel zowel het soort (bijv. Headset) als de naam in." };
    if (url && !/^https:\/\/(www\.)?coolblue\.nl\/\S{1,300}$/.test(url)) {
      return { message: "Een productlink moet een link naar coolblue.nl zijn, of laat hem leeg." };
    }
    setup.push(url ? { label, name, url } : { label, name });
  }

  const { error } = await sb.from("creators").update({ bio, support_code: supportCode || null, setup }).eq("slug", slug);
  if (error) return { message: "Opslaan lukte niet. Probeer het later opnieuw." };
  revalidatePath(`/creators/${slug}`);
  return { ok: true, message: "Opgeslagen! Je pagina is bijgewerkt. Je mag de code nu weer uit je kanaalbeschrijving halen." };
}
