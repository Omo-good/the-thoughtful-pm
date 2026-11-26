import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-paper hover:bg-charcoal",
  secondary: "border border-teal text-teal hover:bg-teal hover:text-paper",
  ghost: "text-teal underline-offset-4 hover:underline px-0 py-0",
  inverse: "bg-paper text-teal hover:bg-gold hover:text-charcoal",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const base =
    variant === "ghost"
      ? "inline-flex items-center gap-2 font-medium"
      : "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-medium transition-colors duration-200 min-h-11";
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
