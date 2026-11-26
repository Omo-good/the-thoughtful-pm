"use client";

import { useState } from "react";

type Photo = { src: string; alt: string };

/**
 * The About portraits. The large frame and the small frame each fill their box with a whole photo.
 * Tap either frame to swap the two photos, so the photo at the back always shows in full.
 */
export function AboutPhotos({ portrait, second }: { portrait: Photo | null; second: Photo | null }) {
  const [swapped, setSwapped] = useState(false);

  const big = swapped ? second : portrait;
  const small = swapped ? portrait : second;
  const toggle = () => setSwapped((v) => !v);

  return (
    <div className="relative h-[420px] w-full md:h-[720px]">
      <div className="absolute bottom-[-28px] left-[-28px] h-[82%] w-[70%] bg-gold" />

      {big ? (
        <button
          type="button"
          onClick={toggle}
          aria-label="Swap the two photos"
          className="absolute right-0 top-0 z-10 h-[94%] w-[88%] overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={big.src} alt={big.alt} className="h-full w-full object-cover object-[50%_18%]" />
        </button>
      ) : (
        <div className="absolute right-0 top-0 z-10 flex h-[94%] w-[88%] items-end bg-[linear-gradient(170deg,#E8D9BE,#C9A774)] p-8 md:p-[30px]">
          <span className="font-display text-xl italic text-[#2B2116] md:text-[20px]">
            Portrait
            <span className="block font-sans text-xs not-italic">1600 × 2000 px minimum</span>
          </span>
        </div>
      )}

      {small ? (
        <button
          type="button"
          onClick={toggle}
          aria-label="Swap the two photos"
          className="absolute bottom-[-14px] left-[-14px] z-20 h-[48%] w-[46%] overflow-hidden border-[8px] border-ivory shadow-[0_10px_30px_rgba(28,24,19,0.18)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={small.src} alt={small.alt} className="h-full w-full object-cover object-[50%_20%]" />
        </button>
      ) : null}
    </div>
  );
}
