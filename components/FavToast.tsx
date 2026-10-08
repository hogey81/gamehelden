"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FAV_EVENT, type FavEvent } from "@/lib/favorites";

// A short message after tapping a heart, with a link to the favourites page.
export default function FavToast() {
  const [msg, setMsg] = useState<FavEvent | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<FavEvent>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 3500);
    };
    window.addEventListener(FAV_EVENT, on);
    return () => { window.removeEventListener(FAV_EVENT, on); clearTimeout(timer); };
  }, []);
  return (
    <div className="toast-slot" role="status" aria-live="polite">
      {msg && (
        <div className="toast">
          {msg.added ? (
            <>
              <span><strong>{msg.name}</strong> staat in je favorieten</span>
              <Link href="/favorieten">Bekijk</Link>
            </>
          ) : (
            <span><strong>{msg.name}</strong> uit je favorieten gehaald</span>
          )}
        </div>
      )}
    </div>
  );
}
