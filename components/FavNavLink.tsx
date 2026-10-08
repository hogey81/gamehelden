"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export default function FavNavLink() {
  const count = useFavorites().length;
  return (
    <Link href="/favorieten">
      Mijn favorieten{count > 0 && <span className="count" aria-label={`${count} favorieten`}>{count}</span>}
    </Link>
  );
}
