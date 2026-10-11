"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { SetupItem } from "@/lib/types";
import { saveProfile, type EditState } from "./actions";

const KINDS = ["Headset", "Toetsenbord", "Muis", "Controller", "Monitor", "Console", "Pc", "Laptop", "Microfoon", "Webcam", "Stoel", "Muismat", "Anders"];

type Props = { slug: string; bio: string; supportCode: string; setup: SetupItem[] };

export default function EditForm({ slug, bio, supportCode, setup }: Props) {
  const [state, action, pending] = useActionState<EditState, FormData>(saveProfile, {});
  if (state.ok) {
    return (
      <div className="panel notice ok">
        <p>{state.message}</p>
        <p><Link href={`/creators/${slug}`}>Bekijk je pagina</Link></p>
      </div>
    );
  }
  const rows = Array.from({ length: 6 }, (_, i) => setup[i] ?? { label: "", name: "" });
  return (
    <form action={action} className="panel signup">
      <input type="hidden" name="slug" value={slug} />
      <div className="field">
        <label htmlFor="bio">Over jou en je kanaal</label>
        <textarea id="bio" name="bio" rows={6} maxLength={1500} defaultValue={bio} placeholder="Wat voor video's maak je, waar ben je om bekend, wanneer stream je?" />
      </div>
      <div className="field">
        <label htmlFor="support_code">Fortnite creator-code (Support-a-Creator)</label>
        <input id="support_code" name="support_code" defaultValue={supportCode} maxLength={30} placeholder="Laat leeg als je er geen hebt" autoComplete="off" />
      </div>
      <fieldset className="field">
        <legend>Je gaming setup</legend>
        <p className="hint">Bijvoorbeeld Headset: SteelSeries Arctis Nova 7. Heb je het product op coolblue.nl gevonden? Plak dan de link van die productpagina erbij. Zonder link zoeken we het product op Coolblue.</p>
        <div className="setup-rows">
          {rows.map((r, i) => (
            <div key={i} className="setup-row">
              <select name={`label${i}`} defaultValue={r.label} aria-label={`Onderdeel ${i + 1}: soort`}>
                <option value="">Kies soort…</option>
                {(KINDS.includes(r.label) || !r.label ? KINDS : [r.label, ...KINDS]).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <input name={`name${i}`} defaultValue={r.name} maxLength={80} placeholder="Merk en model" aria-label={`Onderdeel ${i + 1}: merk en model`} />
              <input name={`url${i}`} defaultValue={r.url ?? ""} placeholder="coolblue.nl-link (optioneel)" aria-label={`Onderdeel ${i + 1}: Coolblue-link`} inputMode="url" />
            </div>
          ))}
        </div>
      </fieldset>
      {state.message && <p className="notice error" role="alert">{state.message}</p>}
      <button className="btn big" disabled={pending}>{pending ? "Controleren…" : "Controleer en sla op"}</button>
    </form>
  );
}
