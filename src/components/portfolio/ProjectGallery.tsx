import Image from "next/image";
import type { ProjectScreenshot } from "@/data/projects";

/**
 * Responsive screenshot gallery. Renders nothing when no screenshots are configured,
 * so no placeholder image or "coming soon" text is shown publicly (PRD §8.6, Rule 3).
 */
export function ProjectGallery({ screenshots, name }: { screenshots: ProjectScreenshot[]; name: string }) {
  if (screenshots.length === 0) return null;
  return (
    <ul className="grid gap-6 sm:grid-cols-2" aria-label={`${name} screenshots`}>
      {screenshots.map((shot) => (
        <li key={shot.src} className="card overflow-hidden p-3">
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 640px) 50vw, 100vw" className="h-auto w-full rounded" />
        </li>
      ))}
    </ul>
  );
}
