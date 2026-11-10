"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listings } from "@/data/listings";
import { countActiveFilters, filterListings, filtersFromParams, filtersToParams, kindLabels, type ListingFilters as Filters } from "@/lib/listings";
import { IconClose, IconFilter } from "../site/icons";
import ListingCard from "./ListingCard";
import ListingFilters from "./ListingFilters";
import LazyMap from "./LazyMap";

export default function ListingCatalog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(params.toString())), [params]);
  const results = useMemo(() => filterListings(listings, filters), [filters]);
  const active = countActiveFilters(filters);
  const [view, setView] = useState<"liste" | "harita">("liste");
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheet = useRef<HTMLDialogElement>(null);

  const update = useCallback((next: Partial<Filters>) => {
    const query = filtersToParams({ ...filters, ...next }).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [filters, pathname, router]);
  const reset = () => router.replace(pathname, { scroll: false });

  useEffect(() => {
    const node = sheet.current;
    if (!node) return;
    if (sheetOpen && !node.open) node.showModal();
    if (!sheetOpen && node.open) node.close();
  }, [sheetOpen]);

  const heading = filters.kinds.length === 1 ? kindLabels[filters.kinds[0]].plural : "Tüm İlanlar";

  return <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 sm:px-8 lg:pt-36">
    <div data-reveal className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a88a55]">Gayrimenkul ilanları</p>
      <h1 className="mt-3 font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.95] text-[#1c1b19]">{heading}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#5d574e]">Şanlıurfa ve çevresindeki arsa, tarla, konut ve ticari gayrimenkulleri filtreleyin. <span className="text-[#8a6d38]">Gösterilen ilanlar demo içeriktir.</span></p>
    </div>

    <div className="mt-10 grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] xl:gap-14">
      <aside aria-label="Filtreler" className="hidden lg:block">
        <div className="sticky top-28 rounded-[1.4rem] bg-[#efebe4] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Filtreler</h2>
            {active > 0 && <button type="button" onClick={reset} className="cursor-pointer text-sm font-medium text-[#8a6d38] underline-offset-4 hover:underline">Temizle</button>}
          </div>
          <ListingFilters filters={filters} onChange={update} />
        </div>
      </aside>

      <section aria-labelledby="sonuc-baslik" className="min-w-0">
        <div className="sticky top-[4.5rem] z-20 -mx-5 flex flex-wrap items-center gap-3 border-b border-[#1c1b19]/[0.06] bg-[#f6f3ee]/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <button type="button" onClick={() => setSheetOpen(true)} className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#1c1b19] px-5 text-sm font-semibold text-[#f6f2ea] lg:hidden">
            <IconFilter className="h-4 w-4" />Filtrele{active > 0 && <span className="rounded-full bg-[#c9a86a] px-2 text-xs text-[#1c1b19]">{active}</span>}
          </button>
          <p id="sonuc-baslik" role="status" className="text-sm text-[#5d574e]"><strong className="text-[#1c1b19]">{results.length}</strong> ilan</p>
          <div className="ml-auto flex items-center gap-2">
            <label className="hidden sm:block"><span className="sr-only">Sırala</span>
              <select value={filters.sort} onChange={event => update({ sort: event.target.value as Filters["sort"] })} className="h-11 cursor-pointer rounded-full border border-[#1c1b19]/12 bg-white px-4 text-sm">
                <option value="yeni">En yeni</option><option value="fiyat-artan">Fiyat (artan)</option><option value="fiyat-azalan">Fiyat (azalan)</option><option value="alan">Alan (büyük)</option>
              </select>
            </label>
            <div role="group" aria-label="Görünüm" className="flex rounded-full bg-[#1c1b19]/[0.06] p-1">
              {(["liste", "harita"] as const).map(option => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={`h-9 cursor-pointer rounded-full px-4 text-sm font-medium capitalize transition-colors ${view === option ? "bg-white text-[#1c1b19] shadow-sm" : "text-[#6b655c]"}`}>{option === "liste" ? "Liste" : "Harita"}</button>)}
            </div>
          </div>
        </div>

        {active > 0 && <ul aria-label="Aktif filtreler" className="mt-5 flex flex-wrap gap-2">
          {filters.kinds.map(kind => <Chip key={kind} label={kindLabels[kind].single} onRemove={() => update({ kinds: filters.kinds.filter(item => item !== kind) })} />)}
          {filters.status && <Chip label={filters.status === "satilik" ? "Satılık" : "Kiralık"} onRemove={() => update({ status: "" })} />}
          {filters.city && <Chip label={filters.city} onRemove={() => update({ city: "", district: "" })} />}
          {filters.district && <Chip label={filters.district} onRemove={() => update({ district: "" })} />}
          {(filters.minPrice !== null || filters.maxPrice !== null) && <Chip label={`${filters.minPrice?.toLocaleString("tr-TR") ?? "0"} – ${filters.maxPrice?.toLocaleString("tr-TR") ?? "∞"} ₺`} onRemove={() => update({ minPrice: null, maxPrice: null })} />}
          {(filters.minArea !== null || filters.maxArea !== null) && <Chip label={`${filters.minArea?.toLocaleString("tr-TR") ?? "0"} – ${filters.maxArea?.toLocaleString("tr-TR") ?? "∞"} m²`} onRemove={() => update({ minArea: null, maxArea: null })} />}
          <li><button type="button" onClick={reset} className="h-9 cursor-pointer px-2 text-sm font-medium text-[#8a6d38] underline-offset-4 hover:underline">Tümünü temizle</button></li>
        </ul>}

        {view === "harita"
          ? <div className="mt-6"><LazyMap listings={results} className="h-[min(70svh,640px)]" /><p className="mt-3 text-xs text-[#857d71]">Konumlar yaklaşık / demo olarak işaretlenmiştir; gerçek parsel konumu değildir.</p></div>
          : results.length > 0
            ? <ul key={params.toString()} data-reveal-stagger className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map(listing => <li key={listing.id}><ListingCard listing={listing} headingLevel={2} /></li>)}
              </ul>
            : <div className="mt-10 rounded-[1.4rem] border border-dashed border-[#1c1b19]/15 px-6 py-16 text-center">
                <p className="font-serif text-2xl text-[#1c1b19]">Bu kriterlere uygun ilan bulunamadı.</p>
                <p className="mt-2 text-sm text-[#6b655c]">Filtreleri genişletin ya da bize yazın; uygun gayrimenkulü sizin için arayalım.</p>
                <button type="button" onClick={reset} className="mt-6 h-11 cursor-pointer rounded-full bg-[#1c1b19] px-6 text-sm font-semibold text-white">Filtreleri temizle</button>
              </div>}
      </section>
    </div>

    <dialog ref={sheet} aria-labelledby="filtre-baslik" onClose={() => setSheetOpen(false)} onClick={event => { if (event.target === sheet.current) setSheetOpen(false); }}
      className="m-0 mt-auto max-h-[88svh] w-full max-w-none overflow-hidden rounded-t-[1.6rem] bg-[#f6f3ee] p-0 text-[#1c1b19] lg:hidden">
      <div className="flex max-h-[88svh] flex-col">
        <div className="flex items-center justify-between border-b border-[#1c1b19]/[0.07] px-5 py-4">
          <h2 id="filtre-baslik" className="font-serif text-2xl font-semibold">Filtreler</h2>
          <button type="button" onClick={() => setSheetOpen(false)} aria-label="Filtreleri kapat" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-[#1c1b19]/[0.06]"><IconClose className="h-6 w-6" /></button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-6">
          <ListingFilters filters={filters} onChange={update} />
          <label className="mt-7 block"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857d71]">Sırala</span>
            <select value={filters.sort} onChange={event => update({ sort: event.target.value as Filters["sort"] })} className="mt-3 h-12 w-full rounded-xl border border-[#1c1b19]/12 bg-white px-3.5">
              <option value="yeni">En yeni</option><option value="fiyat-artan">Fiyat (artan)</option><option value="fiyat-azalan">Fiyat (azalan)</option><option value="alan">Alan (büyük)</option>
            </select>
          </label>
        </div>
        <div className="flex gap-3 border-t border-[#1c1b19]/[0.07] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <button type="button" onClick={reset} disabled={active === 0} className="h-12 cursor-pointer rounded-full border border-[#1c1b19]/15 px-5 text-sm font-semibold disabled:opacity-40">Temizle</button>
          <button type="button" onClick={() => setSheetOpen(false)} className="h-12 flex-1 cursor-pointer rounded-full bg-[#1c1b19] text-sm font-semibold text-[#f6f2ea]">{results.length} ilanı göster</button>
        </div>
      </div>
    </dialog>
  </div>;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <li><button type="button" onClick={onRemove} aria-label={`${label} filtresini kaldır`} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#1c1b19]/[0.06] pl-3.5 pr-2.5 text-sm text-[#3d3a35] hover:bg-[#1c1b19]/[0.1]">{label}<IconClose className="h-3.5 w-3.5" /></button></li>;
}
