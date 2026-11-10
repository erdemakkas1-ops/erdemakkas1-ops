import type { NextConfig } from 'next';

// Vercel: plain `next build`. GitHub Pages: PAGES_BASE_PATH=/erdemakkas1-ops/ahima-dekorasyon npm run build -> out/
const basePath = process.env.PAGES_BASE_PATH || '';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  ...(basePath ? { output: 'export' as const, basePath, trailingSlash: true } : {}),
};
export default nextConfig;
