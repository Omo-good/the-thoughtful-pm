"use client";

import { useEffect, useState } from "react";

type Shot = { src: string; alt: string };

const AUTO_MS = 5000;

// Shows every uploaded product screen as a slideshow: arrows, dots, and auto-advance until the reader takes over.
export function ScreenSlideshow({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const count = shots.length;

  useEffect(() => {
    if (!auto || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [auto, count]);

  const go = (n: number) => {
    setAuto(false);
    setIndex(((n % count) + count) % count);
  };

  const current = shots[Math.min(index, count - 1)];

  return (
    <div className="flex flex-col gap-5" role="region" aria-roledescription="carousel" aria-label="Product screens">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={index} src={current.src} alt={current.alt || `Product screen ${index + 1} of ${count}`} className="block h-auto max-h-[320px] w-auto max-w-full object-contain shadow-[0_10px_30px_rgba(28,24,19,0.12)] md:max-h-[380px]" />
      </div>
      {count > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" aria-label="Choose a screen">
            {shots.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show screen ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full border border-gold transition-colors ${i === index ? "bg-gold" : "bg-transparent hover:bg-[#E8D9BE]"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="tabular-nums text-[#5C5244]">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous screen" className="h-10 w-10 border border-gold text-gold hover:bg-gold hover:text-ivory">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next screen" className="h-10 w-10 border border-gold text-gold hover:bg-gold hover:text-ivory">
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
