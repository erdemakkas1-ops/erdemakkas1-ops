import type { NextConfig } from 'next';

// Vercel: plain `next build` (no extra settings needed).
// GitHub Pages: PAGES_BASE_PATH=/erdemakkas1-ops/endustriyel-teknik-servis npm run build -> static out/
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    formats: ['image/avif', 'image/webp'],
    // static export has no image optimiser
    unoptimized: Boolean(basePath),
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
  ...(basePath ? { output: 'export' as const, basePath, trailingSlash: true } : {}),
};

export default nextConfig;
