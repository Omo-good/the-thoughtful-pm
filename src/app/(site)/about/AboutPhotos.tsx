"use client";

import { useState } from "react";

type Photo = { src: string; alt: string };

/**
 * Two full photos layered like the approved board: the portrait in front on the right, the second photo
 * at the back on the left. Both show their whole picture. Tap either one to bring it to the front.
 */
export function AboutPhotos({ portrait, second }: { portrait: Photo | null; second: Photo | null }) {
  const [swapped, setSwapped] = useState(false);
  const toggle = () => setSwapped((v) => !v);

  const front = swapped ? second : portrait;
  const back = swapped ? portrait : second;

  return (
    <div className="relative h-[420px] w-full md:h-[720px]">
      <div className="absolute bottom-[-28px] left-[-28px] h-[82%] w-[70%] bg-gold" />

      {back ? (
        <button
          type="button"
          onClick={toggle}
          aria-label="Bring this photo to the front"
          className="absolute bottom-[-28px] left-[-28px] z-10 h-[82%] w-[70%] overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={back.src} alt={back.alt} className="h-full w-full object-cover object-[50%_20%]" />
        </button>
      ) : null}

      {front ? (
        <button
          type="button"
          onClick={toggle}
          aria-label="Send this photo to the back"
          className="absolute right-0 top-0 z-20 h-[94%] w-[78%] overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={front.src} alt={front.alt} className="h-full w-full object-cover object-[50%_18%]" />
        </button>
      ) : (
        <div className="absolute right-0 top-0 z-20 flex h-[94%] w-[78%] items-end bg-[linear-gradient(170deg,#E8D9BE,#C9A774)] p-8 md:p-[30px]">
          <span className="font-display text-xl italic text-[#2B2116] md:text-[20px]">
            Portrait
            <span className="block font-sans text-xs not-italic">1600 × 2000 px minimum</span>
          </span>
        </div>
      )}
    </div>
  );
}
