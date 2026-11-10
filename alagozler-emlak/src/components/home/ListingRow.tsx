import Link from "next/link";
import type { Listing } from "@/types/listing";
import ListingCard from "../listings/ListingCard";
import SectionHeading from "./SectionHeading";

/** Card grid on desktop, swipeable snap row on phones. */
export default function ListingRow({ id, eyebrow, title, intro, items, href, tinted = false }: { id: string; eyebrow: string; title: React.ReactNode; intro?: string; items: Listing[]; href: string; tinted?: boolean }) {
  return <section aria-labelledby={id} className={tinted ? "bg-[#efebe4]" : ""}>
    <div className="mx-auto max-w-[1400px] py-24 lg:py-32">
      <div className="flex flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} intro={intro} />
        <Link href={href} className="inline-flex h-12 shrink-0 items-center self-start rounded-full border border-[#1c1b19]/20 px-6 text-sm font-semibold text-[#1c1b19] transition-colors hover:bg-[#1c1b19] hover:text-white sm:self-auto">Tümünü gör →</Link>
      </div>
      <ul data-reveal-stagger className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {items.map(listing => <li key={listing.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto"><ListingCard listing={listing} /></li>)}
      </ul>
    </div>
  </section>;
}
