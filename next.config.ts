import type { NextConfig } from "next";

// Classic rendering: static pages are prerendered at build time, and dynamic routes
// (article detail, search results) return real HTTP status codes, including 404s.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos from phones are larger than the 1 MB default for server actions.
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  reactStrictMode: true,
  turbopack: {
    rules: {
      // Tailwind CSS v4 compiles globals.css through its Turbopack loader (scaffold default).
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
