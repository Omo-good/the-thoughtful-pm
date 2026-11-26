import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig, absoluteUrl } from "@/data/site-config";
import { JsonLd } from "@/components/ui/JsonLd";

// Self-hosted, latin subsets (PRD §12: optimise font loading, avoid third-party requests).
const playfair = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    { path: "../fonts/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/playfair-display-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "The Thoughtful PM | Goodness Omojengbesi — Product Manager",
    template: "%s | The Thoughtful PM",
  },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    siteName: siteConfig.brandName,
    type: "website",
    locale: "en_US",
    title: "The Thoughtful PM | Goodness Omojengbesi — Product Manager",
    description: siteConfig.description,
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F8F4EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.professionalName,
    jobTitle: siteConfig.professionalTitle,
    url: absoluteUrl("/"),
    ...(siteConfig.linkedinUrl ? { sameAs: [siteConfig.linkedinUrl] } : {}),
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    description: siteConfig.description,
    url: absoluteUrl("/"),
  };

  return (
    <html lang={siteConfig.locale} className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <JsonLd data={personJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </body>
    </html>
  );
}
