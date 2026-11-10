"use client";

import { useEffect, useState } from "react";
import type { ListingKind } from "@/types/listing";
import { cities, districtsOf, kindLabels, kindOrder, type ListingFilters as Filters } from "@/lib/listings";

const fieldClass = "h-12 w-full rounded-xl border border-[#1c1b19]/12 bg-white px-3.5 text-[15px] text-[#1c1b19] outline-none transition-colors focus:border-[#a88a55] focus:ring-2 focus:ring-[#c9a86a]/25";
const legendClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#857d71]";

/** Number input that only reports after the visitor pauses typing (keeps URL updates calm). */
function NumberField({ label, value, onCommit, placeholder }: { label: string; value: number | null; onCommit: (value: number | null) => void; placeholder: string }) {
  const [draft, setDraft] = useState(value === null ? "" : String(value));
  // Follow outside changes (e.g. "Temizle") without an effect.
  const [seen, setSeen] = useState(value);
  if (seen !== value) { setSeen(value); setDraft(value === null ? "" : String(value)); }
  useEffect(() => {
    const parsed = draft.trim() === "" ? null : Number(draft.replace(/\D/g, ""));
    if (parsed === value || (parsed !== null && !Number.isFinite(parsed))) return;
    const timer = window.setTimeout(() => onCommit(parsed), 450);
    return () => window.clearTimeout(timer);
  }, [draft, value, onCommit]);
  return <label className="block">
    <span className="sr-only">{label}</span>
    <input inputMode="numeric" pattern="[0-9]*" value={draft} placeholder={placeholder} onChange={event => setDraft(event.target.value.replace(/\D/g, ""))} className={fieldClass} aria-label={label} />
  </label>;
}

export default function ListingFilters({ filters, onChange }: { filters: Filters; onChange: (next: Partial<Filters>) => void }) {
  const toggleKind = (kind: ListingKind) => onChange({ kinds: filters.kinds.includes(kind) ? filters.kinds.filter(item => item !== kind) : [...filters.kinds, kind] });
  const districts = districtsOf(filters.city);
  return <div className="space-y-7">
    <fieldset>
      <legend className={legendClass}>Gayrimenkul türü</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {kindOrder.map(kind => {
          const active = filters.kinds.includes(kind);
          return <button key={kind} type="button" aria-pressed={active} onClick={() => toggleKind(kind)} className={`h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] ${active ? "border-[#1c1b19] bg-[#1c1b19] text-[#f6f2ea]" : "border-[#1c1b19]/15 bg-white text-[#3d3a35] hover:border-[#1c1b19]/40"}`}>{kindLabels[kind].single}</button>;
        })}
      </div>
    </fieldset>
    <fieldset>
      <legend className={legendClass}>Durum</legend>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-[#1c1b19]/[0.05] p-1">
        {([["", "Tümü"], ["satilik", "Satılık"], ["kiralik", "Kiralık"]] as const).map(([value, label]) =>
          <button key={value} type="button" aria-pressed={filters.status === value} onClick={() => onChange({ status: value })} className={`h-10 cursor-pointer rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a86a] ${filters.status === value ? "bg-white text-[#1c1b19] shadow-sm" : "text-[#6b655c] hover:text-[#1c1b19]"}`}>{label}</button>)}
      </div>
    </fieldset>
    <fieldset className="grid grid-cols-2 gap-3">
      <legend className={`${legendClass} mb-3`}>Konum</legend>
      <label className="block"><span className="mb-1.5 block text-xs text-[#6b655c]">Şehir</span>
        <select value={filters.city} onChange={event => onChange({ city: event.target.value, district: "" })} className={fieldClass}>
          <option value="">Tümü</option>{cities.map(city => <option key={city}>{city}</option>)}
        </select>
      </label>
      <label className="block"><span className="mb-1.5 block text-xs text-[#6b655c]">İlçe</span>
        <select value={filters.district} onChange={event => onChange({ district: event.target.value })} className={fieldClass}>
          <option value="">Tümü</option>{districts.map(district => <option key={district}>{district}</option>)}
        </select>
      </label>
    </fieldset>
    <fieldset>
      <legend className={legendClass}>Fiyat (₺)</legend>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberField label="Minimum fiyat" placeholder="En az" value={filters.minPrice} onCommit={value => onChange({ minPrice: value })} />
        <NumberField label="Maksimum fiyat" placeholder="En çok" value={filters.maxPrice} onCommit={value => onChange({ maxPrice: value })} />
      </div>
    </fieldset>
    <fieldset>
      <legend className={legendClass}>Alan (m²)</legend>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberField label="Minimum metrekare" placeholder="En az" value={filters.minArea} onCommit={value => onChange({ minArea: value })} />
        <NumberField label="Maksimum metrekare" placeholder="En çok" value={filters.maxArea} onCommit={value => onChange({ maxArea: value })} />
      </div>
      <p className="mt-2 text-xs text-[#857d71]">1 dönüm = 1.000 m²</p>
    </fieldset>
  </div>;
}
