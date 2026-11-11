import type { ListingKind } from "@/types/listing";

/*
 * Representative media generated with Higgsfield (see HIGGSFIELD-PROMPTS.md).
 * Gemini stills (4:3) are used for listings 11–19; each also gets a slow push-in clip made from the
 * still with ffmpeg (zoompan), so every tile and card animates the same way on hover. Higgsfield source clips are 5 s vertical videos; stills (WebP, 3:4) and re-encoded MP4s live in public/media/.
 * Empty values fall back to the built-in illustrations, so the site works at every stage.
 * These are AI-generated stand-ins: the site labels them "Temsili görsel", and each listing's
 * media must be replaced with real photos of the property before it goes live.
 */
export const media: {
  hero: { video: string; poster: string; backdrop: string };
  categories: Record<ListingKind, { image: string; video?: string }>;
  listings: Record<string, { images: string[]; video?: string }>;
} = {
  hero: { video: "/media/hero.mp4", poster: "/media/hero-poster.webp", backdrop: "/media/hero-backdrop.webp" },
  categories: {
    arsa: { image: "/media/kategori-arsa.webp", video: "/media/kategori-arsa.mp4" },
    tarla: { image: "/media/kategori-tarla.webp", video: "/media/kategori-tarla.mp4" },
    daire: { image: "/media/kategori-daire.webp", video: "/media/kategori-daire.mp4" },
    mustakil: { image: "/media/kategori-mustakil.webp", video: "/media/kategori-mustakil.mp4" },
    diger: { image: "/media/kategori-diger.webp", video: "/media/kategori-diger.mp4" },
  },
  listings: {
    "AE-1001": { images: ["/media/ae-1001-arsa-1.webp", "/media/ae-1001-arsa-2.webp", "/media/ae-1001-arsa-3.webp"], video: "/media/ae-1001-arsa.mp4" },
    "AE-1002": { images: ["/media/ae-1002-kose-parsel-1.webp", "/media/ae-1002-kose-parsel-2.webp"], video: "/media/ae-1002-kose-parsel.mp4" },
    "AE-1003": { images: ["/media/ae-1003-yatirim-arsa-1.webp", "/media/ae-1003-yatirim-arsa-2.webp", "/media/ae-1003-yatirim-arsa-3.webp"], video: "/media/ae-1003-yatirim-arsa.mp4" },
    "AE-2001": { images: ["/media/ae-2001-harran-tarla-1.webp", "/media/ae-2001-harran-tarla-2.webp"], video: "/media/ae-2001-harran-tarla.mp4" },
    "AE-2002": { images: ["/media/ae-2002-fistik-1.webp"], video: "/media/ae-2002-fistik.mp4" },
    "AE-2003": { images: ["/media/ae-2003-siverek-1.webp"], video: "/media/ae-2003-siverek.mp4" },
    "AE-3001": { images: ["/media/ae-3001-daire-1.webp"], video: "/media/ae-3001-daire.mp4" },
    "AE-3002": { images: ["/media/ae-3002-kiralik-1.webp"], video: "/media/ae-3002-kiralik.mp4" },
    "AE-3003": { images: ["/media/ae-3003-lux-1.webp"], video: "/media/ae-3003-lux.mp4" },
    "AE-4002": { images: ["/media/ae-4002-avlu-1.webp"], video: "/media/ae-4002-avlu.mp4" },
    "AE-5001": { images: ["/media/ae-5001-dukkan-1.webp"], video: "/media/ae-5001-dukkan.mp4" },
    "AE-5002": { images: ["/media/ae-5002-depo-1.webp"], video: "/media/ae-5002-depo.mp4" },
    "AE-4001": { images: ["/media/ae-4001-mustakil-0.webp", "/media/ae-4001-mustakil-1.webp", "/media/ae-4001-mustakil-2.webp", "/media/ae-4001-mustakil-3.webp"], video: "/media/ae-4001-mustakil.mp4" },
  },
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefixes local /public paths with the deploy base path; leaves absolute URLs alone. */
export const mediaSrc = (src: string) => (src.startsWith("/") ? `${basePath}${src}` : src);
