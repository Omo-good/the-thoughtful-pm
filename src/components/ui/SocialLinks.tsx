import { siteConfig } from "@/data/site-config";

/** Renders only configured links. Returns null when nothing is configured (PRD §6.7). */
export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [siteConfig.linkedinUrl ? { label: "LinkedIn", href: siteConfig.linkedinUrl } : null].filter(
    (link): link is { label: string; href: string } => link !== null,
  );
  if (links.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-4 ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
