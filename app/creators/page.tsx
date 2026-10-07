import type { Metadata } from "next";
import CreatorSearch from "@/components/CreatorSearch";
import { getCreators } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nederlandse gaming YouTubers zoeken",
  description: "Zoek tussen alle Nederlandse en Vlaamse gaming-YouTubers op Gamehelden, op naam of op game.",
  alternates: { canonical: "/creators" },
};

export default async function Creators() {
  const creators = await getCreators();
  return (
    <>
      <section className="hero">
        <h1>Creators zoeken</h1>
        <p className="lead">Zoek op naam of kies een game. Met het hartje zet je een creator in je favorieten.</p>
      </section>
      <section className="block">
        <CreatorSearch creators={creators} />
      </section>
    </>
  );
}
