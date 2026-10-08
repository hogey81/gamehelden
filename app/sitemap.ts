import type { MetadataRoute } from "next";
import { getCreators } from "@/lib/data";
import { SITE_URL } from "@/lib/format";
import { GAMES, rankingPath } from "@/lib/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const creators = await getCreators();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/creators`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/aanmelden`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ranglijsten`, changeFrequency: "weekly", priority: 0.8 },
    ...Object.keys(GAMES)
      .filter((g) => creators.some((c) => c.games.includes(g)))
      .map((g) => ({ url: `${SITE_URL}${rankingPath(g)}`, changeFrequency: "daily" as const, priority: 0.9 })),
    ...creators.map((c) => ({ url: `${SITE_URL}/creators/${c.slug}`, changeFrequency: "daily" as const, priority: 0.7 })),
  ];
}
