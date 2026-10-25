import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend-only demo: emit static HTML/CSS/JS to /out, no Node server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    // Pin the root: a stray package-lock.json in the home directory would otherwise be picked up.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
