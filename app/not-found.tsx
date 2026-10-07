import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <h1>Deze pagina bestaat niet</h1>
      <p className="lead">Misschien is de creator verwijderd of is de link veranderd. <Link href="/">Terug naar de homepage</Link></p>
    </section>
  );
}
