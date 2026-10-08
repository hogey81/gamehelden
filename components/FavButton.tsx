"use client";

import { toggleFavorite, useFavorites } from "@/lib/favorites";

export default function FavButton({ slug, name, withLabel = false }: { slug: string; name: string; withLabel?: boolean }) {
  const on = useFavorites().includes(slug);
  return (
    <button
      type="button"
      className={`fav${on ? " on" : ""}${withLabel ? " labeled" : ""}`}
      aria-pressed={on}
      aria-label={on ? `${name} uit je favorieten halen` : `${name} aan je favorieten toevoegen`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug, name);
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.5.8-1.3 2.3-2.5 4.4-2.5 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
      {withLabel && <span>{on ? "In je favorieten" : "Favoriet"}</span>}
    </button>
  );
}
