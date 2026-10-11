import { createHmac } from "node:crypto";

// A fixed code per creator page. Whoever can put it in the channel description owns the
// channel, so no accounts are needed. Derived from CRON_SECRET, so nobody can compute it.
export function editCode(slug: string): string | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  return `gamehelden-${createHmac("sha256", secret).update(`edit:${slug}`).digest("hex").slice(0, 8)}`;
}
