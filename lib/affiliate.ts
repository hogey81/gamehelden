import type { SetupItem } from "./types";

// Coolblue via Awin. Every setup item earns: a Coolblue product link is used as is, anything
// else becomes a Coolblue search for the product name. clickref shows in Awin's reports which
// creator page the sale came from.
const AWIN_ADVERTISER = "85161";
const AWIN_PUBLISHER = "2828020";

export function setupLink(item: SetupItem, creatorSlug: string): { href: string; shop: string } {
  if (item.url && !/^https:\/\/(www\.)?coolblue\.nl\//.test(item.url)) return { href: item.url, shop: "Bekijk prijs" };
  const target = item.url ?? `https://www.coolblue.nl/zoeken?query=${encodeURIComponent(item.name)}`;
  const href =
    `https://www.awin1.com/cread.php?awinmid=${AWIN_ADVERTISER}&awinaffid=${AWIN_PUBLISHER}` +
    `&clickref=${encodeURIComponent(creatorSlug)}&ued=${encodeURIComponent(target)}`;
  return { href, shop: "Bij Coolblue" };
}
