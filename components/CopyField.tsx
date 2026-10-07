"use client";

import { useState } from "react";

// A read-only text with a copy button; falls back to selecting the text if the
// browser refuses clipboard access.
export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const id = `copy-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="copy">
      <label htmlFor={id}>{label}</label>
      <div className="copy-row">
        <textarea id={id} readOnly rows={value.includes("\n") || value.length > 60 ? 4 : 1} value={value} onFocus={(e) => e.target.select()} />
        <button
          type="button"
          className="btn"
          onClick={async (e) => {
            const field = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              field.select();
            }
          }}
        >
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
    </div>
  );
}
