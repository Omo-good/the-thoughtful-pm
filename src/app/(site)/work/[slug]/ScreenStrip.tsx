type Shot = { src: string; alt: string };

// Shows the uploaded product screens side by side at a fixed height. When they do not all fit, the row scrolls sideways.
export function ScreenStrip({ shots }: { shots: Shot[] }) {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" role="region" aria-label="Product screens" tabIndex={0}>
      {shots.map((shot, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${shot.src}-${i}`}
          src={shot.src}
          alt={shot.alt || `Product screen ${i + 1} of ${shots.length}`}
          className="h-[340px] w-auto shrink-0 snap-start object-contain shadow-[0_10px_30px_rgba(28,24,19,0.12)] md:h-[380px]"
        />
      ))}
    </div>
  );
}
