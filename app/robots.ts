import type { MetadataRoute } from "next";
import { isDemo } from "@/lib/data";
import { SITE_URL } from "@/lib/format";

// The example version must not end up in Google with made-up creators.
export default function robots(): MetadataRoute.Robots {
  if (isDemo()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
