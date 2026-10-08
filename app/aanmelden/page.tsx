import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Meld je kanaal aan",
  description: "Maak je Nederlandse gaming-YouTube kanaal? Meld je aan en krijg een gratis eigen pagina op Gamehelden.",
  alternates: { canonical: "/aanmelden" },
};

export default function Signup() {
  return (
    <>
      <section className="hero">
        <h1>Meld je kanaal aan</h1>
        <p className="lead">
          Maak je gaming-video&apos;s in het Nederlands? Dan krijg je een gratis eigen pagina op Gamehelden, met je nieuwste
          video&apos;s, je plek in de ranglijsten en een badge voor je kanaal. We bekijken elke aanmelding voordat hij online
          komt.
        </p>
      </section>
      <section className="block signup-wrap">
        <SignupForm />
      </section>
    </>
  );
}
