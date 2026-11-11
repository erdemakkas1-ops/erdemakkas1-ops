import Link from "next/link";
import type { Listing } from "@/types/listing";
import { formatArea, formatPrice, kindLabels, statusLabels } from "@/lib/listings";
import { IconArea, IconPin } from "../site/icons";
import FavoriteButton from "./FavoriteButton";
import ListingVisual, { isIllustration } from "./ListingVisual";
import AmbientVideo from "../motion/AmbientVideo";

export default function ListingCard({ listing, headingLevel = 3 }: { listing: Listing; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const isHome = listing.kind === "daire" || listing.kind === "mustakil";
  return <article className="listing-card group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_1px_0_rgba(28,27,25,0.06),0_18px_40px_-28px_rgba(28,27,25,0.35)] ring-1 ring-[#1c1b19]/[0.06] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(28,27,25,0.06),0_30px_60px_-30px_rgba(28,27,25,0.45)]">
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e4dc]">
      <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]">
        {/* Every listing with media plays its clip on hover (mouse only); otherwise the still. */}
        {listing.video && listing.images[0]?.src
          ? <AmbientVideo src={listing.video} poster={listing.images[0].src} mode="hover" />
          : <ListingVisual listing={listing} />}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start gap-2 p-3.5">
        <span className="rounded-full bg-[#1c1b19]/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f6f2ea] backdrop-blur">{statusLabels[listing.status]}</span>
        <span className="rounded-full bg-[#f6f3ee]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1c1b19] backdrop-blur">{kindLabels[listing.kind].single}</span>
      </div>
      <div className="absolute right-3 top-3 z-10"><FavoriteButton id={listing.id} title={listing.title} /></div>
      {isIllustration(listing) && <span className="pointer-events-none absolute bottom-3 left-3.5 rounded bg-black/35 px-2 py-0.5 text-[10px] text-white/85">Temsili görsel</span>}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-[#857d71]"><IconPin className="h-3.5 w-3.5" />{listing.district} / {listing.city}</p>
      <Heading className="mt-2 font-serif text-[1.4rem] font-semibold leading-tight text-[#1c1b19]">
        <Link href={`/ilanlar/${listing.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{listing.title}</Link>
      </Heading>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5d574e]">
        <span className="flex items-center gap-1.5"><IconArea className="h-4 w-4 text-[#a88a55]" />{formatArea(listing)}</span>
        {isHome && <span>{listing.rooms}</span>}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <p className="font-serif text-2xl font-semibold text-[#1c1b19]">{formatPrice(listing)}</p>
        <span aria-hidden="true" className="shrink-0 text-sm font-semibold text-[#8a6d38] transition-transform duration-300 group-hover:translate-x-1">Detayları incele →</span>
      </div>
    </div>
    {/* Keyboard focus ring for the stretched link. */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-[#c9a86a] group-has-[a:focus-visible]:ring-2" />
  </article>;
}
