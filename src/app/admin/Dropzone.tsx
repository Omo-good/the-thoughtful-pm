"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

const MAX_EDGE = 2400;
const SHRINK_ABOVE_BYTES = 300 * 1024;

/**
 * Shrinks large photos in the browser before they are sent. Server uploads are capped by the host,
 * so a full-size phone photo would otherwise fail. Small images and non-images are left alone.
 */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SHRINK_ABOVE_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

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
