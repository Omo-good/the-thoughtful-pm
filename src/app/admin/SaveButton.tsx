"use client";

import { useFormStatus } from "react-dom";

/** Submit button that shows "Saving…" and locks itself while the form is being saved. */
export function SaveButton({ label, className }: { label: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-70`}>
      {pending ? "Saving…" : label}
    </button>
  );
}
