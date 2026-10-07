import type { Metadata } from "next";
import FavoritesFeed from "@/components/FavoritesFeed";
import { getCreators, getLatestVideos } from "@/lib/data";

export const revalidate = 3600;

// Personal per visitor, so there's nothing here for Google.
export const metadata: Metadata = { title: "Mijn favorieten", robots: { index: false } };

export default async function Favorites() {
  const [creators, videos] = await Promise.all([getCreators(), getLatestVideos(200)]);
  return (
    <>
      <section className="hero">
        <h1>Mijn favorieten</h1>
        <p className="lead">De nieuwste video&apos;s van de creators die jij volgt.</p>
      </section>
      <FavoritesFeed creators={creators} videos={videos} />
    </>
  );
}
