import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyField from "@/components/CopyField";
import { getCreator } from "@/lib/data";
import { editCode } from "@/lib/verify";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pagina bewerken", robots: { index: false } };

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const creator = await getCreator(slug);
  if (!creator) notFound();
  const name = creator.name ?? creator.handle;
  const code = editCode(slug);

  return (
    <div className="signup-wrap prose">
      <h1>Pagina van {name} bewerken</h1>
      {!code ? (
        <p>Bewerken kan nog niet op deze site.</p>
      ) : (
        <>
          <p>Zo weten we dat jij het echt bent, zonder account:</p>
          <ol className="steps">
            <li>Kopieer de code hieronder.</li>
            <li>
              Zet hem ergens in je kanaalbeschrijving op YouTube: <a href="https://studio.youtube.com">YouTube Studio</a> › Aanpassen ›
              Basisinformatie › Beschrijving. Klik op Publiceren.
            </li>
            <li>Vul hieronder je gegevens in en klik op opslaan. Daarna mag de code weer weg uit je beschrijving.</li>
          </ol>
          <CopyField label="Jouw code" value={code} />
          <EditForm slug={slug} bio={creator.bio ?? ""} supportCode={creator.support_code ?? ""} setup={creator.setup} />
        </>
      )}
    </div>
  );
}
