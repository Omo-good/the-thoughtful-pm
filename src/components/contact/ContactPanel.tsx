"use client";

import { useSearchParams } from "next/navigation";
import { findServiceByEnquiryValue } from "@/data/services";
import { ContactForm } from "./ContactForm";

interface ContactPanelProps {
  initialService: string;
  fallbackEmail: string | null;
}

/** Renders the form with a preselected service. Used directly as the static fallback too (no service). */
export function ContactPanel({ initialService, fallbackEmail }: ContactPanelProps) {
  const selected = findServiceByEnquiryValue(initialService);
  return (
    <div>
      <p className="mb-4 min-h-6 rounded-md text-sm" aria-live="polite">
        {selected ? (
          <span className="block rounded-md border border-teal/40 bg-paper p-4">
            You&apos;re enquiring about <span className="font-medium">{selected.name}</span>.
          </span>
        ) : null}
      </p>
      <ContactForm initialService={selected?.enquiryValue ?? ""} fallbackEmail={fallbackEmail} />
    </div>
  );
}

/** Reads ?service= on the client so the page itself can stay statically prerendered. */
export function ContactPanelFromUrl({ fallbackEmail }: { fallbackEmail: string | null }) {
  const params = useSearchParams();
  return <ContactPanel initialService={params.get("service") ?? ""} fallbackEmail={fallbackEmail} />;
}
