import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacybeleid" };

export default function Privacy() {
  return (
    <section className="prose">
      <h1>Privacybeleid</h1>
      <p>
        Gamehelden heeft geen accounts en slaat geen persoonsgegevens van bezoekers op. We gebruiken geen trackingcookies van
        onszelf.
      </p>
      <h2>YouTube</h2>
      <p>
        Video&apos;s en kanaalgegevens (zoals titels, thumbnails, abonnees en weergaven) halen we op via de YouTube API Services.
        Daarmee ga je ook akkoord met de <a href="https://www.youtube.com/t/terms">Servicevoorwaarden van YouTube</a>, en geldt
        het <a href="https://policies.google.com/privacy">privacybeleid van Google</a>. Een video wordt pas van YouTube geladen
        als je op afspelen klikt; we gebruiken daarvoor de privacyvriendelijke modus van YouTube.
      </p>
      <p>
        De gegevens die we van YouTube bewaren worden dagelijks ververst en uiterlijk na 30 dagen verwijderd als ze niet meer
        ververst worden.
      </p>
      <h2>Affiliate-links</h2>
      <p>
        Sommige links naar producten zijn affiliate-links. Koop je via zo&apos;n link iets, dan ontvangen wij een kleine
        commissie. Voor jou verandert de prijs niet.
      </p>
      <h2>Vragen of verwijderen</h2>
      <p>Ben je creator en wil je niet op Gamehelden staan, of klopt er iets niet? Neem contact met ons op, dan passen we het aan.</p>
    </section>
  );
}
