import type { MetadataRoute } from "next";
import { getCreators } from "@/lib/data";
import { SITE_URL } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const creators = await getCreators();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/fortnite-youtubers-nederland`, changeFrequency: "daily", priority: 0.9 },
    ...creators.map((c) => ({ url: `${SITE_URL}/creators/${c.slug}`, changeFrequency: "daily" as const, priority: 0.7 })),
  ];
}
