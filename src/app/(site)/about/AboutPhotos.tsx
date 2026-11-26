"use client";

import { useState } from "react";

type Photo = { src: string; alt: string };

/**
 * The About portrait with a second photo behind it. The second photo sits at the back and shows in full
 * wherever the portrait does not cover it. Tap the photo at the back to bring it forward, and tap it
 * again to send it back.
 */
export function AboutPhotos({ portrait, second }: { portrait: Photo | null; second: Photo | null }) {
  const [secondFront, setSecondFront] = useState(false);
  const toggle = () => setSecondFront((v) => !v);

  return (
    <div className="relative h-[420px] w-full md:h-[720px]">
      <div className="absolute bottom-[-28px] left-[-28px] h-[82%] w-[70%] bg-gold" />

      {portrait ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={secondFront ? "Bring the portrait to the front" : "Portrait"}
          className={`absolute right-0 top-0 h-[94%] w-[88%] overflow-hidden ${secondFront ? "z-10" : "z-20"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portrait.src} alt={portrait.alt} className="h-full w-full object-cover object-[50%_18%]" />
        </button>
      ) : (
        <div className={`absolute right-0 top-0 flex h-[94%] w-[88%] items-end bg-[linear-gradient(170deg,#E8D9BE,#C9A774)] p-8 md:p-[30px] ${secondFront ? "z-10" : "z-20"}`}>
          <span className="font-display text-xl italic text-[#2B2116] md:text-[20px]">
            Portrait
            <span className="block font-sans text-xs not-italic">1600 × 2000 px minimum</span>
          </span>
        </div>
      )}

      {second ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={secondFront ? "Send this photo to the back" : "Bring this photo to the front"}
          className={`absolute bottom-[-14px] left-[-14px] h-[48%] w-[46%] overflow-hidden border-[8px] border-ivory shadow-[0_10px_30px_rgba(28,24,19,0.18)] ${secondFront ? "z-20" : "z-10"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={second.src} alt={second.alt} className="h-full w-full object-cover object-[50%_20%]" />
        </button>
      ) : null}
    </div>
  );
}
