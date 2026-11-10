import { listings } from "@/data/listings";
import type { Listing, ListingKind, ListingStatus } from "@/types/listing";

export const kindLabels: Record<ListingKind, { single: string; plural: string }> = {
  arsa: { single: "Arsa", plural: "Satılık Arsalar" },
  tarla: { single: "Tarla", plural: "Satılık Tarlalar" },
  daire: { single: "Daire", plural: "Daireler" },
  mustakil: { single: "Müstakil Ev", plural: "Müstakil Evler" },
  diger: { single: "Ticari / Diğer", plural: "Diğer Gayrimenkuller" },
};
export const kindOrder: ListingKind[] = ["arsa", "tarla", "daire", "mustakil", "diger"];
export const statusLabels: Record<ListingStatus, string> = { satilik: "Satılık", kiralik: "Kiralık" };

const tl = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
export const formatNumber = (value: number) => tl.format(value);

export function formatPrice(listing: Pick<Listing, "price" | "status">) {
  if (listing.price === null) return "Fiyat için arayın";
  return `${tl.format(listing.price)} ₺${listing.status === "kiralik" ? " / ay" : ""}`;
}

/** Land is easier to read in dönüm (1 dönüm = 1.000 m²) once it passes a few thousand m². */
export function formatArea(listing: Pick<Listing, "area" | "kind">) {
  const m2 = `${tl.format(listing.area)} m²`;
  if ((listing.kind === "arsa" || listing.kind === "tarla") && listing.area >= 1000) {
    const donum = listing.area / 1000;
    return `${m2} · ${donum.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} dönüm`;
  }
  return m2;
}

export const location = (listing: Listing) => [listing.neighborhood, listing.district, listing.city].filter(Boolean).join(", ");

/** Spec rows for the detail page; each kind only shows fields that make sense for it. */
export function listingSpecs(listing: Listing): { label: string; value: string }[] {
  const rows: { label: string; value: string | number | undefined }[] = [
    { label: "İlan no", value: listing.id },
    { label: "İlan türü", value: `${statusLabels[listing.status]} ${kindLabels[listing.kind].single}` },
    { label: "Fiyat", value: formatPrice(listing) },
    { label: listing.kind === "daire" || listing.kind === "mustakil" ? "Brüt alan" : "Alan", value: formatArea(listing) },
  ];
  switch (listing.kind) {
    case "arsa":
    case "tarla":
      rows.push(
        { label: "İmar durumu", value: listing.zoning },
        { label: "Tapu durumu", value: listing.deed },
        { label: "Yol", value: listing.roadAccess },
        { label: "Altyapı", value: listing.utilities?.join(", ") },
        { label: "Merkeze uzaklık", value: listing.distanceToCenter },
      );
      break;
    case "daire":
    case "mustakil":
      rows.push(
        { label: "Oda sayısı", value: listing.rooms },
        { label: "Net alan", value: listing.netArea ? `${tl.format(listing.netArea)} m²` : undefined },
        { label: "Arsa alanı", value: listing.landArea ? `${tl.format(listing.landArea)} m²` : undefined },
        { label: "Bulunduğu kat", value: listing.floor },
        { label: "Kat sayısı", value: listing.totalFloors },
        { label: "Bina yaşı", value: listing.buildingAge },
        { label: "Isıtma", value: listing.heating },
        { label: "Banyo", value: listing.bathrooms },
      );
      break;
    case "diger":
      rows.push({ label: "Tür", value: listing.subtype }, { label: "Cephe", value: listing.frontage });
      break;
  }
  return rows.filter((row): row is { label: string; value: string | number } => row.value !== undefined && row.value !== "").map(row => ({ label: row.label, value: String(row.value) }));
}

export const getListing = (slug: string) => listings.find(listing => listing.slug === slug);
export const byNewest = (a: Listing, b: Listing) => b.publishedAt.localeCompare(a.publishedAt);
export const newestListings = (count: number) => [...listings].sort(byNewest).slice(0, count);
const hasPhoto = (listing: Listing) => (listing.images[0]?.src ? 1 : 0);
/** Featured first by photo availability (keeps the home page visually consistent), then newest. */
export const featuredListings = () => listings.filter(listing => listing.featured).sort((a, b) => hasPhoto(b) - hasPhoto(a) || byNewest(a, b));

const group = (kind: ListingKind) => (kind === "arsa" || kind === "tarla" ? "arazi" : kind === "diger" ? "ticari" : "konut");

/** Same kind first, then same group (land / housing / commercial), then same district; newest first. */
export function similarListings(listing: Listing, count = 3) {
  const score = (other: Listing) => (other.kind === listing.kind ? 4 : 0) + (group(other.kind) === group(listing.kind) ? 2 : 0) + (other.district === listing.district ? 1 : 0);
  return listings
    .filter(other => other.id !== listing.id && score(other) > 0)
    .sort((a, b) => score(b) - score(a) || byNewest(a, b))
    .slice(0, count);
}

export function whatsappMessage(listing: Listing, url?: string) {
  return [
    `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
    `İlan no: ${listing.id}`,
    `Konum: ${listing.district} / ${listing.city}`,
    `Alan: ${formatArea(listing)} · Fiyat: ${formatPrice(listing)}`,
    url ? `Bağlantı: ${url}` : "",
  ].filter(Boolean).join("\n");
}

/* ---------- Filtering ---------- */

export type ListingFilters = {
  kinds: ListingKind[];
  city: string;
  district: string;
  status: ListingStatus | "";
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  sort: "yeni" | "fiyat-artan" | "fiyat-azalan" | "alan";
};

export const emptyFilters: ListingFilters = { kinds: [], city: "", district: "", status: "", minPrice: null, maxPrice: null, minArea: null, maxArea: null, sort: "yeni" };

export function filterListings(items: Listing[], filters: ListingFilters) {
  const priceSet = filters.minPrice !== null || filters.maxPrice !== null;
  const result = items.filter(listing =>
    (filters.kinds.length === 0 || filters.kinds.includes(listing.kind)) &&
    (!filters.city || listing.city === filters.city) &&
    (!filters.district || listing.district === filters.district) &&
    (!filters.status || listing.status === filters.status) &&
    // "Fiyat için arayın" listings can't satisfy a price range.
    (!priceSet || (listing.price !== null && (filters.minPrice === null || listing.price >= filters.minPrice) && (filters.maxPrice === null || listing.price <= filters.maxPrice))) &&
    (filters.minArea === null || listing.area >= filters.minArea) &&
    (filters.maxArea === null || listing.area <= filters.maxArea),
  );
  const price = (listing: Listing) => listing.price ?? Number.POSITIVE_INFINITY;
  switch (filters.sort) {
    case "fiyat-artan": return result.sort((a, b) => price(a) - price(b));
    case "fiyat-azalan": return result.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    case "alan": return result.sort((a, b) => b.area - a.area);
    default: return result.sort(byNewest);
  }
}

export function countActiveFilters(filters: ListingFilters) {
  return filters.kinds.length + [filters.city, filters.district, filters.status].filter(Boolean).length
    + [filters.minPrice, filters.maxPrice, filters.minArea, filters.maxArea].filter(value => value !== null).length;
}

const num = (value: string | null) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export function filtersFromParams(params: URLSearchParams): ListingFilters {
  const kinds = (params.get("tur") ?? "").split(",").filter((kind): kind is ListingKind => (kindOrder as string[]).includes(kind));
  const status = params.get("durum");
  const sort = params.get("sirala");
  return {
    kinds,
    city: params.get("sehir") ?? "",
    district: params.get("ilce") ?? "",
    status: status === "satilik" || status === "kiralik" ? status : "",
    minPrice: num(params.get("minFiyat")), maxPrice: num(params.get("maxFiyat")),
    minArea: num(params.get("minM2")), maxArea: num(params.get("maxM2")),
    sort: sort === "fiyat-artan" || sort === "fiyat-azalan" || sort === "alan" ? sort : "yeni",
  };
}

export function filtersToParams(filters: ListingFilters) {
  const params = new URLSearchParams();
  if (filters.kinds.length) params.set("tur", filters.kinds.join(","));
  if (filters.city) params.set("sehir", filters.city);
  if (filters.district) params.set("ilce", filters.district);
  if (filters.status) params.set("durum", filters.status);
  if (filters.minPrice !== null) params.set("minFiyat", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxFiyat", String(filters.maxPrice));
  if (filters.minArea !== null) params.set("minM2", String(filters.minArea));
  if (filters.maxArea !== null) params.set("maxM2", String(filters.maxArea));
  if (filters.sort !== "yeni") params.set("sirala", filters.sort);
  return params;
}

export const cities = [...new Set(listings.map(listing => listing.city))].sort((a, b) => a.localeCompare(b, "tr"));
export const districtsOf = (city: string) => [...new Set(listings.filter(listing => !city || listing.city === city).map(listing => listing.district))].sort((a, b) => a.localeCompare(b, "tr"));
