const nl = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 1 });

// 184000 -> "184K", 21400000 -> "21,4 mln"
export function compact(n: number | null | undefined) {
  if (n == null) return "–";
  if (n >= 1_000_000) return `${nl.format(n / 1_000_000)} mln`;
  if (n >= 1_000) return `${nl.format(n / 1_000)}K`;
  return String(n);
}

export function duration(s: number | null) {
  if (s == null) return "";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const pad = (x: number) => String(x).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

const rtf = new Intl.RelativeTimeFormat("nl-NL", { numeric: "auto" });
export function ago(iso: string, now = Date.now()) {
  const mins = (new Date(iso).getTime() - now) / 60000;
  if (mins > -60) return rtf.format(Math.round(mins), "minute");
  if (mins > -1440) return rtf.format(Math.round(mins / 60), "hour");
  if (mins > -43200) return rtf.format(Math.round(mins / 1440), "day");
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gamehelden.vercel.app";
