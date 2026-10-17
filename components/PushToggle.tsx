"use client";

import { useCallback, useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites";

const KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type State = "loading" | "unsupported" | "denied" | "off" | "on";

function keyBytes(b64: string) {
  const raw = atob((b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const post = (url: string, body: unknown, method = "POST") =>
  fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

// Opt in to push notifications for the creators you follow: a message when one goes live
// or uploads. The favourites stay in this browser; only the subscription and the list of
// followed creators are sent to the server so it knows whom to notify.
export default function PushToggle() {
  const favs = useFavorites();
  const [state, setState] = useState<State>("loading");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!KEY) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("unsupported"));
  }, []);

  // Keep the server's list of followed creators in step with the hearts.
  useEffect(() => {
    if (state !== "on") return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => sub && post("/api/push/subscribe", { subscription: sub.toJSON(), creators: favs }))
      .catch(() => {});
  }, [state, favs]);

  const enable = useCallback(async () => {
    setBusy(true);
    setNote(null);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      if ((await Notification.requestPermission()) !== "granted") {
        setState(Notification.permission === "denied" ? "denied" : "off");
        return;
      }
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(KEY!) });
      const res = await post("/api/push/subscribe", { subscription: sub.toJSON(), creators: favs });
      if (!res.ok) {
        await sub.unsubscribe();
        setNote("Meldingen aanzetten is niet gelukt. Probeer het later nog eens.");
        return;
      }
      setState("on");
    } catch {
      setNote("Meldingen aanzetten is niet gelukt.");
    } finally {
      setBusy(false);
    }
  }, [favs]);

  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
      if (sub) {
        await post("/api/push/subscribe", { endpoint: sub.endpoint }, "DELETE").catch(() => {});
        await sub.unsubscribe();
      }
      setState("off");
      setNote(null);
    } finally {
      setBusy(false);
    }
  }, []);

  const test = useCallback(async () => {
    setBusy(true);
    setNote(null);
    try {
      const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
      const res = sub && (await post("/api/push/test", { endpoint: sub.endpoint }));
      setNote(res?.ok ? "Testmelding onderweg, kijk even naar je scherm." : "Testmelding versturen is niet gelukt.");
    } catch {
      setNote("Testmelding versturen is niet gelukt.");
    } finally {
      setBusy(false);
    }
  }, []);

  if (!KEY || state === "loading") return null;

  return (
    <div className="panel push-panel">
      <div>
        <h2>Meldingen</h2>
        {state === "unsupported" && (
          <p>
            Deze browser kan geen meldingen tonen. Op een iPhone werkt het alleen als je Gamehelden eerst aan je beginscherm
            toevoegt (Deel &gt; Zet op beginscherm) en de app van daaruit opent.
          </p>
        )}
        {state === "denied" && <p>Meldingen zijn voor deze site geblokkeerd. Sta ze toe in de instellingen van je browser.</p>}
        {state === "off" && <p>Krijg een melding zodra een creator uit je favorieten live gaat of een nieuwe video plaatst.</p>}
        {state === "on" && (
          <p>
            Aan voor {favs.length === 1 ? "1 creator" : `${favs.length} creators`}.
            {favs.length === 0 && " Zet een hartje bij een creator om er meldingen van te krijgen."}
          </p>
        )}
        {note && <p className="push-note" role="status">{note}</p>}
      </div>
      <div className="push-actions">
        {state === "off" && (
          <button type="button" className="btn big" disabled={busy} onClick={enable}>Meldingen aanzetten</button>
        )}
        {state === "on" && (
          <>
            <button type="button" className="btn big" disabled={busy} onClick={test}>Stuur testmelding</button>
            <button type="button" className="btn big ghost" disabled={busy} onClick={disable}>Uitzetten</button>
          </>
        )}
      </div>
    </div>
  );
}
