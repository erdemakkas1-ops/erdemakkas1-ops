import type { Listing } from "@/types/listing";
import { mediaSrc } from "@/data/media";
import PropertyArt from "./PropertyArt";

/** Photo when the listing has one, otherwise a drawn illustration. */
export default function ListingVisual({ listing, index = 0, className = "", sizes, priority, fit = "cover" }: { listing: Listing; index?: number; className?: string; sizes?: string; priority?: boolean; fit?: "cover" | "contain" }) {
  const image = listing.images[index] ?? listing.images[0];
  if (image?.src) {
    if (fit === "contain") {
      // Whole (portrait) frame stays visible; a blurred copy fills the sides.
      return <span className={`relative block h-full w-full overflow-hidden bg-[#1c1b19] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src={mediaSrc(image.src)} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl" />
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src={mediaSrc(image.src)} alt={image.alt} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" className="relative h-full w-full object-contain" />
      </span>;
    }
    // eslint-disable-next-line @next/next/no-img-element -- static export friendly; images are pre-sized.
    return <img src={mediaSrc(image.src)} alt={image.alt} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  return <PropertyArt kind={listing.kind} seed={listing.id} variant={index} title={image?.alt ?? listing.title} className={`h-full w-full ${className}`} />;
}

/** True for illustrations and AI-generated stand-ins (both labelled "Temsili görsel"). */
export const isIllustration = (listing: Listing, index = 0) => {
  const image = listing.images[index];
  return !image?.src || !!image.generated;
};
