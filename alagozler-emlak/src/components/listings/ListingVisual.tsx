import type { Listing } from "@/types/listing";
import PropertyArt from "./PropertyArt";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Real photo when the listing has one, otherwise a representative illustration. */
export default function ListingVisual({ listing, index = 0, className = "", sizes, priority }: { listing: Listing; index?: number; className?: string; sizes?: string; priority?: boolean }) {
  const image = listing.images[index] ?? listing.images[0];
  if (image?.src) {
    const src = image.src.startsWith("/") ? `${basePath}${image.src}` : image.src;
    // eslint-disable-next-line @next/next/no-img-element -- static export friendly; photos are pre-sized by the editor.
    return <img src={src} alt={image.alt} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  return <PropertyArt kind={listing.kind} seed={listing.id} variant={index} title={image?.alt ?? listing.title} className={`h-full w-full ${className}`} />;
}

export const isIllustration = (listing: Listing, index = 0) => !listing.images[index]?.src;
