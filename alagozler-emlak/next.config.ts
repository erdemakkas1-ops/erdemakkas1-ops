import type { NextConfig } from "next";

// GitHub Pages: PAGES_BASE_PATH=/erdemakkas1-ops/alagozler-emlak npm run build -> static site in out/
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["three"],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(basePath ? { output: "export" as const, basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default nextConfig;
