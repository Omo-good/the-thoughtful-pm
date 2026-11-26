"use client";

import { useEffect, useState } from "react";

type Photo = { src: string; alt: string };

const AUTO_MS = 5000;

/**
 * The About portraits in one frame at the same size as the gold block behind it. The two photos alternate
 * as a slideshow. Tapping the frame moves to the next photo and stops the automatic change.
 */
export function AboutPhotos({ portrait, second }: { portrait: Photo | null; second: Photo | null }) {
  const photos = [portrait, second].filter((p): p is Photo => Boolean(p));
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const count = photos.length;

  useEffect(() => {
    if (!auto || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [auto, count]);

  const current = photos[Math.min(index, Math.max(count - 1, 0))];

  return (
    <div className="relative h-[420px] w-full md:h-[720px]">
      <div className="absolute bottom-[-28px] left-[-28px] h-[82%] w-[70%] bg-gold" />

      {current ? (
        <button
          type="button"
          onClick={() => {
            setAuto(false);
            setIndex((i) => (i + 1) % count);
          }}
          aria-label="Show the next photo"
          className="absolute right-0 top-0 z-10 h-[94%] w-[88%] overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={index} src={current.src} alt={current.alt} className="h-full w-full object-cover object-[50%_18%]" />
        </button>
      ) : (
        <div className="absolute right-0 top-0 z-10 flex h-[94%] w-[88%] items-end bg-[linear-gradient(170deg,#E8D9BE,#C9A774)] p-8 md:p-[30px]">
          <span className="font-display text-xl italic text-[#2B2116] md:text-[20px]">
            Portrait
            <span className="block font-sans text-xs not-italic">1600 × 2000 px minimum</span>
          </span>
        </div>
      )}
    </div>
  );
}
