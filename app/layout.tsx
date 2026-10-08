import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import FavNavLink from "@/components/FavNavLink";
import FavToast from "@/components/FavToast";
import { isDemo } from "@/lib/data";
import { SITE_URL } from "@/lib/format";
import "./globals.css";

// Self-hosted by Next at build time, so visitors' browsers never contact Google Fonts.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Gamehelden: Nederlandse gaming YouTubers", template: "%s | Gamehelden" },
  description: "De nieuwste video's en ranglijsten van Nederlandse gaming-YouTubers, elke dag bijgewerkt.",
  openGraph: { siteName: "Gamehelden", locale: "nl_NL", type: "website" },
};

export const viewport: Viewport = { themeColor: "#F5F6FA", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body>
        {isDemo() && (
          <div className="demo-note">
            Voorbeeldversie met <b>verzonnen creators en cijfers</b>, behalve EHVgaming. Zodra Supabase en de YouTube API zijn
            gekoppeld, komt hier echte data.
          </div>
        )}
        <header className="site-header">
          <div className="wrap bar">
            <Link href="/" className="logo">
              <span className="flag" aria-hidden><i /><i /><i /></span>
              Gamehelden
            </Link>
            <nav>
              <Link href="/">Nieuwste video&apos;s</Link>
              <Link href="/creators">Creators zoeken</Link>
              <Link href="/ranglijsten">Ranglijsten</Link>
              <FavNavLink />
              <Link href="/aanmelden" className="nav-cta">Kanaal aanmelden</Link>
            </nav>
          </div>
        </header>
        <main className="wrap page">{children}</main>
        <FavToast />
        <footer className="site-footer">
          <div className="wrap">
            <p>
              Video&apos;s en kanaalgegevens komen via de YouTube API. Gamehelden is niet verbonden aan YouTube of Epic Games. Zie
              de <a href="https://www.youtube.com/t/terms">Servicevoorwaarden van YouTube</a> en ons{" "}
              <Link href="/privacy">privacybeleid</Link>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
