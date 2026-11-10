import type { ListingKind } from "@/types/listing";

/*
 * Photographic images produced with Higgsfield (see HIGGSFIELD-PROMPTS.md).
 * Paste each finished image URL (or a /public path such as "/media/hero.webp") next to its key.
 * Empty values keep the built-in illustration, so the site works at every stage.
 * These are AI-generated representative images: they are labelled as such on the site and
 * must be replaced with real photos of each property before the listings go live.
 */
export const media: {
  hero: string;
  categories: Record<ListingKind, string>;
  listings: Record<string, string[]>;
} = {
  hero: "",
  categories: { arsa: "", tarla: "", daire: "", mustakil: "", diger: "" },
  listings: {
    "AE-1001": [], "AE-1002": [], "AE-1003": [],
    "AE-2001": [], "AE-2002": [], "AE-2003": [],
    "AE-3001": [], "AE-3002": [], "AE-3003": [],
    "AE-4001": [], "AE-4002": [],
    "AE-5001": [], "AE-5002": [],
  },
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefixes local /public paths with the deploy base path; leaves absolute URLs alone. */
export const mediaSrc = (src: string) => (src.startsWith("/") ? `${basePath}${src}` : src);
