"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { shrink } from "./shrink";

/** Picks several product screens at once, shrinking each one before it is sent. */
export function ScreenPicker({ name = "screenshot_files" }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0 || !inputRef.current) return;
    setStatus(`Preparing ${files.length} screen${files.length > 1 ? "s" : ""}…`);
    const prepared = await Promise.all(files.map((file) => shrink(file, 1800, 200 * 1024, 0.82)));
    const transfer = new DataTransfer();
    prepared.forEach((file) => transfer.items.add(file));
    inputRef.current.files = transfer.files;
    setStatus(`${prepared.length} screen${prepared.length > 1 ? "s" : ""} ready. Save to publish.`);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 border border-gold bg-white px-5 py-3 text-sm font-medium text-charcoal hover:bg-sand">
        + Add product screens
        <span className="text-xs font-normal text-[#5C5244]">(up to 8)</span>
        <input ref={inputRef} type="file" name={name} accept="image/*" multiple onChange={onChange} className="sr-only" />
      </label>
      {status ? <span className="text-xs text-[#5C5244]">{status}</span> : null}
    </div>
  );
}
