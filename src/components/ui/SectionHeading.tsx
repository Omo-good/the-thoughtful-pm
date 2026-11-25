import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({ eyebrow, title, intro, as: Heading = "h2", align = "left", id }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "items-start";
  return (
    <header className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading id={id}>{title}</Heading>
      {intro ? <div className="max-w-2xl text-muted text-lg">{intro}</div> : null}
    </header>
  );
}
