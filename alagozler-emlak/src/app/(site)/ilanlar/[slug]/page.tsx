import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/data/listings";
import { formatArea, formatPrice, getListing, kindLabels, listingSpecs, location, similarListings, statusLabels } from "@/lib/listings";
import ListingGallery from "@/components/listings/ListingGallery";
import ContactActions from "@/components/listings/ContactActions";
import FavoriteButton from "@/components/listings/FavoriteButton";
import ListingCard from "@/components/listings/ListingCard";
import LazyMap from "@/components/listings/LazyMap";
import { IconArea, IconPin } from "@/components/site/icons";

export const dynamicParams = false;
export function generateStaticParams() {
  return listings.map(listing => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const listing = getListing((await params).slug);
  return listing ? { title: listing.title, description: listing.summary } : {};
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const listing = getListing((await params).slug);
  if (!listing) notFound();
  const specs = listingSpecs(listing);
  const similar = similarListings(listing);

  return <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-24 sm:px-8 lg:pb-24 lg:pt-32">
    <nav aria-label="Konum" className="text-sm text-[#857d71]">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-[#1c1b19]">Ana sayfa</Link></li><li aria-hidden="true">/</li>
        <li><Link href="/ilanlar" className="hover:text-[#1c1b19]">İlanlar</Link></li><li aria-hidden="true">/</li>
        <li><Link href={`/ilanlar?tur=${listing.kind}`} className="hover:text-[#1c1b19]">{kindLabels[listing.kind].single}</Link></li>
      </ol>
    </nav>

    {listing.demo && <p className="mt-4 rounded-xl bg-[#c9a86a]/12 px-4 py-2.5 text-sm text-[#6e5626]">Demo ilan: fiyat, alan, görseller ve konum örnek amaçlıdır.</p>}

    <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] xl:gap-14">
      <div className="min-w-0">
        <ListingGallery listing={listing} />

        <header data-reveal className="mt-8">
          <p className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <span className="rounded-full bg-[#1c1b19] px-3 py-1 text-[#f6f2ea]">{statusLabels[listing.status]}</span>
            <span className="rounded-full bg-[#1c1b19]/[0.07] px-3 py-1 text-[#3d3a35]">{kindLabels[listing.kind].single}</span>
            <span className="rounded-full bg-[#1c1b19]/[0.07] px-3 py-1 text-[#3d3a35]">No {listing.id}</span>
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1] text-[#1c1b19]">{listing.title}</h1>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-[#5d574e]">
            <span className="flex items-center gap-1.5"><IconPin className="h-4 w-4 text-[#a88a55]" />{location(listing)}</span>
            <span className="flex items-center gap-1.5"><IconArea className="h-4 w-4 text-[#a88a55]" />{formatArea(listing)}</span>
          </p>
          <p className="mt-5 font-serif text-4xl font-semibold text-[#1c1b19] lg:hidden">{formatPrice(listing)}</p>
        </header>

        <section aria-labelledby="ozellikler" className="mt-12">
          <h2 id="ozellikler" data-reveal className="font-serif text-3xl font-semibold">Özellikler</h2>
          <dl className="mt-5 grid overflow-hidden rounded-[1.2rem] bg-white ring-1 ring-[#1c1b19]/[0.06] sm:grid-cols-2">
            {specs.map(spec => <div key={spec.label} className="flex justify-between gap-4 border-b border-[#1c1b19]/[0.06] px-5 py-3.5 text-[15px] sm:odd:border-r">
              <dt className="text-[#857d71]">{spec.label}</dt><dd className="text-right font-semibold text-[#1c1b19]">{spec.value}</dd>
            </div>)}
          </dl>
          {listing.highlights.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">
            {listing.highlights.map(item => <li key={item} className="rounded-full border border-[#c9a86a]/45 bg-[#c9a86a]/[0.07] px-3.5 py-1.5 text-sm text-[#5e4a22]">✓ {item}</li>)}
          </ul>}
        </section>

        <section aria-labelledby="aciklama" className="mt-12">
          <h2 id="aciklama" data-reveal className="font-serif text-3xl font-semibold">Açıklama</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-[16px] leading-relaxed text-[#3d3a35]">{listing.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section aria-labelledby="konum" className="mt-12">
          <h2 id="konum" data-reveal className="font-serif text-3xl font-semibold">Konum</h2>
          <p className="mt-3 text-[15px] text-[#5d574e]">{location(listing)}</p>
          {listing.coords
            ? <><LazyMap listings={[listing]} zoom={13} className="mt-5 h-[360px] sm:h-[420px]" />
                {listing.coords.approximate && <p className="mt-3 text-xs text-[#857d71]">Harita konumu yaklaşık / demo amaçlıdır. Kesin parsel konumu için danışmanımızla görüşün.</p>}</>
            : <p className="mt-4 rounded-xl bg-[#efebe4] px-5 py-4 text-sm text-[#5d574e]">Kesin konum bilgisi talep üzerine paylaşılır.</p>}
        </section>
      </div>

      <aside aria-label="Fiyat ve iletişim" className="hidden lg:block">
        <div className="sticky top-28 rounded-[1.6rem] bg-white p-7 shadow-[0_30px_60px_-40px_rgba(28,27,25,0.5)] ring-1 ring-[#1c1b19]/[0.06]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#857d71]">{statusLabels[listing.status]} fiyatı</p>
          <p className="mt-2 font-serif text-[2.6rem] font-semibold leading-none text-[#1c1b19]">{formatPrice(listing)}</p>
          <p className="mt-3 text-sm text-[#5d574e]">{listing.summary}</p>
          <div className="mt-7"><ContactActions listing={listing} /></div>
          <div className="mt-3 grid"><FavoriteButton id={listing.id} title={listing.title} variant="inline" /></div>
          <p className="mt-5 text-xs leading-relaxed text-[#857d71]">WhatsApp mesajına ilan numarası, konum, alan ve fiyat otomatik eklenir.</p>
        </div>
      </aside>
    </div>

    {similar.length > 0 && <section aria-labelledby="benzer" className="mt-20 border-t border-[#1c1b19]/[0.08] pt-14">
      <div data-reveal className="flex items-end justify-between gap-4">
        <h2 id="benzer" className="font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-none">Benzer gayrimenkuller</h2>
        <Link href={`/ilanlar?tur=${listing.kind}`} className="shrink-0 text-sm font-semibold text-[#8a6d38] underline-offset-4 hover:underline">Tümünü gör →</Link>
      </div>
      <ul data-reveal-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map(item => <li key={item.id}><ListingCard listing={item} /></li>)}</ul>
    </section>}

    {/* Mobile: contact always within thumb reach. */}
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1c1b19]/[0.08] bg-[#f6f3ee]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <FavoriteButton id={listing.id} title={listing.title} variant="icon" />
        <div className="flex-1"><ContactActions listing={listing} compact /></div>
      </div>
    </div>
  </div>;
}
