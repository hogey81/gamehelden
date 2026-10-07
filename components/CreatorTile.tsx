import Link from "next/link";
import Avatar from "@/components/Avatar";
import FavButton from "@/components/FavButton";
import type { Creator } from "@/lib/types";

// A creator card; the whole card opens their page, the heart sits on top of the link.
export default function CreatorTile({ creator, detail }: { creator: Creator; detail?: string }) {
  const name = creator.name ?? creator.handle;
  return (
    <div className="creator-chip">
      <Avatar creator={creator} size={44} />
      <span>
        <Link href={`/creators/${creator.slug}`} className="stretched"><strong>{name}</strong></Link>
        {detail && <small>{detail}</small>}
      </span>
      <FavButton slug={creator.slug} name={name} />
    </div>
  );
}
