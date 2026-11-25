"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function share() {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch (error) {
      // The user dismissing the native share sheet is not a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-teal px-4 text-sm font-medium text-teal hover:bg-teal hover:text-paper"
    >
      {status === "copied" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Share2 aria-hidden="true" className="h-4 w-4" />}
      <span aria-live="polite">
        {status === "copied" ? "Link copied" : status === "failed" ? "Could not share" : "Share this article"}
      </span>
    </button>
  );
}
