"use client";

import { useActionState } from "react";
import { GAMES } from "@/lib/types";
import { signup, type SignupState } from "./actions";

export default function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(signup, {});
  if (state.ok) return <div className="panel notice ok">{state.message}</div>;
  return (
    <form action={action} className="panel signup">
      <div className="field">
        <label htmlFor="kanaal">Je YouTube-kanaal</label>
        <input id="kanaal" name="kanaal" placeholder="@jouwkanaal of de link naar je kanaal" required autoComplete="off" />
      </div>
      <fieldset className="field">
        <legend>Welke games speel je?</legend>
        <div className="chips">
          {Object.entries(GAMES).map(([key, label]) => (
            <label key={key} className="check-chip">
              <input type="checkbox" name="games" value={key} /> {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="note">Iets over je kanaal (optioneel)</label>
        <textarea id="note" name="note" rows={3} maxLength={500} placeholder="Bijvoorbeeld wat voor video's je maakt" />
      </div>
      {/* Hidden from people; bots fill it in. */}
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
      <label className="owner">
        <input type="checkbox" name="owner" required /> Dit is mijn kanaal, of ik mag het namens de eigenaar aanmelden.
      </label>
      {state.message && <p className="notice error" role="alert">{state.message}</p>}
      <button className="btn big" disabled={pending}>{pending ? "Bezig…" : "Meld mijn kanaal aan"}</button>
    </form>
  );
}
