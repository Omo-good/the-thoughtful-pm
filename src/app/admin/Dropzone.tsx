"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { shrink } from "./shrink";

/** Image drop zone for the back office. Shows the current or chosen image, and takes a file on click or drop. */
export function Dropzone({ src, name, empty, wide = false }: { src: string | null; name: string; empty: string; wide?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Preparing image…");
    const prepared = await shrink(file);
    if (prepared !== file && inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(prepared);
      inputRef.current.files = transfer.files;
    }
    setPreview(URL.createObjectURL(prepared));
    setStatus(`${prepared.name} ready. Save to publish it.`);
  }

  const shown = preview ?? src;

  return (
    <label className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-[1.5px] border-dashed border-[rgba(154,107,47,0.5)] bg-[#FAF7F0] text-[13px] ${wide ? "h-[150px]" : "h-[170px]"}`}>
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt="" className="h-full w-full bg-white object-contain" />
      ) : (
        <span className="text-[#5C5244]">{empty}</span>
      )}
      <input ref={inputRef} type="file" name={name} accept="image/*" onChange={onChange} className="sr-only" />
      {status ? <span className="absolute bottom-2 bg-white px-2 py-1 text-[11px] text-[#5C5244]">{status}</span> : null}
    </label>
  );
}
