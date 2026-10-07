import { getCreator } from "@/lib/data";

export const revalidate = 86400;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// An image creators can put on their own site, Twitch panel or stream overlay,
// linking back to their Gamehelden page: /badge/<slug>
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const creator = await getCreator((await params).slug);
  if (!creator) return new Response("Niet gevonden", { status: 404 });
  const name = esc(creator.name ?? creator.handle);
  const width = Math.max(260, 150 + name.length * 9);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="56" viewBox="0 0 ${width} 56" role="img" aria-label="${name} staat op Gamehelden">
  <rect width="${width}" height="56" rx="12" fill="#1D2350"/>
  <g transform="translate(16 18)"><rect width="26" height="20" rx="3" fill="#21468B"/><rect width="26" height="13.3" rx="3" fill="#FFFFFF"/><rect width="26" height="6.7" rx="3" fill="#AE1C28"/></g>
  <text x="56" y="24" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="12" fill="#B9BEE0">Ik sta op Gamehelden</text>
  <text x="56" y="42" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">${name}</text>
  <rect x="${width - 8}" y="0" width="8" height="56" rx="4" fill="#E85A0C"/>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  });
}
