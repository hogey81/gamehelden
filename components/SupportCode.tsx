"use client";

import { useState } from "react";

// A creator's Fortnite Support-a-Creator code, big and copyable.
export default function SupportCode({ code, name }: { code: string; name: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <section className="panel support">
      <h2>Steun {name}</h2>
      <p>Vul deze creator-code in bij de Fortnite Item Shop. Jij betaalt niets extra, {name} krijgt een deel van je aankoop.</p>
      <div className="support-row">
        <code>{code}</code>
        <button
          type="button"
          className="btn"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              // No clipboard access: the code is big enough to type over.
            }
          }}
        >
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <p><small>Item Shop › Support-a-Creator › code invullen</small></p>
    </section>
  );
}
