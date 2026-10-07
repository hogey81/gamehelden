import type { Creator } from "@/lib/types";

// The channel picture, or the creator's initials on a colour derived from their slug.
export default function Avatar({ creator, size = 36 }: { creator: Creator; size?: number }) {
  const name = creator.name ?? creator.handle;
  if (creator.avatar_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="avatar" src={creator.avatar_url} alt="" width={size} height={size} loading="lazy" />;
  }
  const hue = [...creator.slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);
  const initials = name.replace(/^@/, "").replace(/[^A-Za-z0-9 ]/g, "").split(/\s+|(?=[A-Z])/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 55% 42%)` }} aria-hidden>
      {initials}
    </span>
  );
}
