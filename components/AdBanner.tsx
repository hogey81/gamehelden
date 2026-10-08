// Coolblue banner via Awin. Shown left of the video lists; labelled so visitors can tell it is an ad.
const LINK = "https://www.awin1.com/cread.php?s=3909535&v=85161&q=516163&r=2828020";
const IMAGE = "https://www.awin1.com/cshow.php?s=3909535&v=85161&q=516163&r=2828020";

export default function AdBanner() {
  return (
    <aside className="ad" aria-label="Advertentie">
      <span className="ad-label">Advertentie</span>
      {/* eslint-disable-next-line @next/next/no-img-element -- Awin counts views through this exact image URL */}
      <a rel="sponsored noopener" target="_blank" href={LINK}>
        <img src={IMAGE} alt="Coolblue" />
      </a>
    </aside>
  );
}
