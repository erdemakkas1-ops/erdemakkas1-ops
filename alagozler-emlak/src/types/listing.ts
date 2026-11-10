export type ListingKind = "arsa" | "tarla" | "daire" | "mustakil" | "diger";
export type ListingStatus = "satilik" | "kiralik";

/** A real photo (src) or, until photos are supplied, a generated representative illustration. */
export type ListingImage = {
  src?: string;
  alt: string;
  /** AI-generated stand-in: shown with a "temsili görsel" label, never as the real property. */
  generated?: boolean;
};

type ListingBase = {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  /** TRY. null = "Fiyat için arayın". */
  price: number | null;
  /** Gross area in m². */
  area: number;
  city: string;
  district: string;
  neighborhood?: string;
  /** approximate: true when the pin is a demo / district-level position, not the parcel itself. */
  coords?: { lat: number; lng: number; approximate: boolean };
  summary: string;
  description: string[];
  highlights: string[];
  images: ListingImage[];
  /** Optional short video tour shown first in the gallery. */
  video?: string;
  /** ISO date. */
  publishedAt: string;
  featured?: boolean;
  /** Marks illustrative content that must not be presented as a real listing. */
  demo: boolean;
};

export type LandListing = ListingBase & {
  kind: "arsa" | "tarla";
  zoning?: string;
  deed?: string;
  roadAccess?: string;
  utilities?: string[];
  distanceToCenter?: string;
};

export type HomeListing = ListingBase & {
  kind: "daire" | "mustakil";
  rooms: string;
  netArea?: number;
  floor?: string;
  totalFloors?: number;
  buildingAge?: string;
  heating?: string;
  bathrooms?: number;
  landArea?: number;
};

export type OtherListing = ListingBase & {
  kind: "diger";
  subtype: string;
  frontage?: string;
};

export type Listing = LandListing | HomeListing | OtherListing;
