"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Apartment } from "@/types/apartment";
import { countAvailable, getApartmentsForFloor } from "@/data/apartments";
import { project, projectStats } from "@/data/project";
import { FLOOR_COUNT } from "@/lib/buildingConfig";
import { formatMillionsTRY } from "@/lib/paymentUtils";
import type { UnitHighlight } from "./three/Tower";
import dynamic from "next/dynamic";
import ViewerStatus from "./three/ViewerStatus";

const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), { ssr: false, loading: () => <ViewerStatus /> });

type Props = {
  selectedFloor: number | null;
  selectedApartment: Apartment | null;
  onSelectFloor: (floor: number | null) => void;
  onSelectApartment: (apartment: Apartment) => void;
  onViewPlan: () => void;
};

export default function HeroSection({ selectedFloor, selectedApartment, onSelectFloor, onSelectApartment, onViewPlan }: Props) {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [hoveredApartment, setHoveredApartment] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const highlight = useMemo<UnitHighlight>(() => {
    if (selectedFloor === null) return null;
    const id = hoveredApartment ?? (selectedApartment && getApartmentsForFloor(selectedFloor).some(item => item.id === selectedApartment.id) ? selectedApartment.id : null);
    return id ? { floor: selectedFloor, unit: id.slice(-1) as "A" | "B" | "C" } : null;
  }, [selectedFloor, selectedApartment, hoveredApartment]);

  // Choosing a floor from the intro stepper unmounts it; keep keyboard focus on the panel's stepper.
  const focusHandoff = useRef(false);
  useEffect(() => {
    if (selectedFloor === null || !focusHandoff.current) return;
    focusHandoff.current = false;
    const visible = [...document.querySelectorAll<HTMLSelectElement>("#proje [data-floor-select]")].find(select => select.offsetParent !== null);
    visible?.focus({ preventScroll: true });
  }, [selectedFloor]);

  // On small screens the floor panel sits under the canvas; bring it into view after a tap.
  useEffect(() => {
    if (selectedFloor === null || !window.matchMedia("(max-width: 1023px)").matches) return;
    const frame = requestAnimationFrame(() => panel.current?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    }));
    return () => cancelAnimationFrame(frame);
  }, [selectedFloor]);

  return <section id="proje" aria-labelledby="hero-title" className="relative flex flex-col bg-[#121110] pt-[108px] lg:block lg:h-svh lg:min-h-[680px] lg:pt-0">
    <div role="img" aria-label="Projenin 3D modeli. Döndürmek için sürükleyin, bir kata tıklayarak dairelerini görün; kat seçici klavyeyle de kullanılabilir." className="motion-canvas scrollable-canvas relative order-2 h-[58svh] min-h-[340px] lg:absolute lg:inset-0 lg:h-auto">
      <HeroCanvas hoveredFloor={hoveredFloor} selectedFloor={selectedFloor} highlight={highlight} onHoverChange={setHoveredFloor} onSelect={onSelectFloor} />
      <p className="pointer-events-none absolute bottom-6 right-8 hidden items-center gap-2 text-xs text-[#aaa196] lg:flex">
        <span aria-hidden="true" className="flex h-6 w-4 justify-center rounded-full border border-current pt-1"><span className="h-1.5 w-0.5 rounded bg-current" /></span>
        Katların üzerine gelin, birine tıklayın
      </p>
    </div>
    {/* Keeps the copy legible over the 3D scene on wide screens. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] bg-gradient-to-r from-[#0e0d0c]/92 via-[#0e0d0c]/55 to-transparent lg:block" />

    <div className="relative order-1 px-5 pb-6 pt-6 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[min(36rem,44vw)] lg:flex-col lg:justify-center lg:px-12 lg:pb-32 lg:pt-24 xl:px-16">
      <div className={`motion-hero-copy lg:pointer-events-auto ${selectedFloor !== null ? "lg:hidden" : ""}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9a86a]">{project.eyebrow}</p>
        <h1 id="hero-title" className="mt-5 font-display text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-[#f4efe4]">
          {project.headline[0]}<br /><span className="text-[#e3c48a]">{project.headline[1]}</span>
        </h1>
        <p className="mt-6 max-w-[26rem] text-base leading-relaxed text-[#b8afa2]">{project.intro}</p>
        {selectedFloor === null && <div className="mt-8"><FloorStepper selectedFloor={selectedFloor} onSelectFloor={floor => { focusHandoff.current = true; onSelectFloor(floor); }} /></div>}
      </div>
      {selectedFloor !== null && <div className="hidden lg:pointer-events-auto lg:block">
        <FloorPanel floor={selectedFloor} selectedApartment={selectedApartment} onHover={setHoveredApartment} onSelect={onSelectApartment} onSelectFloor={onSelectFloor} onViewPlan={onViewPlan} />
      </div>}
    </div>

    {selectedFloor !== null && <div ref={panel} className="order-3 scroll-mt-28 px-5 pt-6 sm:px-8 lg:hidden">
      <FloorPanel floor={selectedFloor} selectedApartment={selectedApartment} onHover={setHoveredApartment} onSelect={onSelectApartment} onSelectFloor={onSelectFloor} onViewPlan={onViewPlan} />
    </div>}

    <dl className="relative order-4 grid grid-cols-4 gap-4 px-5 py-8 sm:px-8 lg:absolute lg:bottom-10 lg:left-12 lg:flex lg:gap-12 lg:p-0 xl:left-16">
      {projectStats.map(stat => <div key={stat.label} className="flex flex-col-reverse">
        <dt className="mt-1 text-xs text-[#9b9387]">{stat.label}</dt>
        <dd className="font-display text-2xl font-semibold tabular-nums text-[#f1ebdf] sm:text-3xl">{stat.value}</dd>
      </div>)}
    </dl>
  </section>;
}

function FloorStepper({ selectedFloor, onSelectFloor }: { selectedFloor: number | null; onSelectFloor: (floor: number) => void }) {
  return <div role="group" aria-label="Kat seçimi" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#181715]/80 p-1 backdrop-blur-sm">
    <button type="button" aria-label="Önceki kat" disabled={selectedFloor === 1} onClick={() => onSelectFloor(Math.max(1, (selectedFloor ?? 2) - 1))} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#e3c48a] transition-colors hover:bg-white/5 disabled:cursor-default disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#c9a86a]">←</button>
    <label className="flex items-center gap-2 px-2 text-sm text-[#b8afa2]">
      Kat
      <select data-floor-select value={selectedFloor ?? ""} onChange={event => onSelectFloor(Number(event.target.value))} className="h-10 cursor-pointer rounded-full bg-transparent px-1 font-display text-base font-semibold text-[#f1ebdf] focus-visible:outline-2 focus-visible:outline-[#c9a86a]">
        <option value="" disabled>Seçin</option>
        {Array.from({ length: FLOOR_COUNT }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}. kat</option>)}
      </select>
    </label>
    <button type="button" aria-label="Sonraki kat" disabled={selectedFloor === FLOOR_COUNT} onClick={() => onSelectFloor(Math.min(FLOOR_COUNT, (selectedFloor ?? 0) + 1))} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#e3c48a] transition-colors hover:bg-white/5 disabled:cursor-default disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#c9a86a]">→</button>
  </div>;
}

function FloorPanel({ floor, selectedApartment, onHover, onSelect, onSelectFloor, onViewPlan }: {
  floor: number;
  selectedApartment: Apartment | null;
  onHover: (id: string | null) => void;
  onSelect: (apartment: Apartment) => void;
  onSelectFloor: (floor: number | null) => void;
  onViewPlan: () => void;
}) {
  const apartments = getApartmentsForFloor(floor);
  const available = countAvailable(floor);
  const chosen = selectedApartment && apartments.some(item => item.id === selectedApartment.id) ? selectedApartment : null;
  return <div>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9a86a]">Kat seçimi</p>
        <h2 className="mt-3 font-display text-5xl font-semibold tracking-[-0.02em] text-[#f4efe4]">{floor}. Kat</h2>
        <p className="mt-2 text-sm text-[#9b9387]" role="status">{apartments.length} daire · {available ? `${available} müsait` : "tümü satıldı"}</p>
      </div>
      <button type="button" onClick={() => onSelectFloor(null)} className="mt-1 flex h-10 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-[#b8afa2] transition-colors hover:border-white/25 hover:text-[#f1ebdf] focus-visible:outline-2 focus-visible:outline-[#c9a86a]">
        <span aria-hidden="true">×</span> Tüm katlar
      </button>
    </div>
    <div className="mt-5"><FloorStepper selectedFloor={floor} onSelectFloor={onSelectFloor} /></div>
    <ul key={floor} className="motion-panel mt-5 space-y-2.5" aria-label={`${floor}. kat daireleri`}>
      {apartments.map(apartment => {
        const sold = apartment.status === "sold";
        const active = chosen?.id === apartment.id;
        return <li key={apartment.id}>
          <button
            type="button"
            disabled={sold}
            aria-pressed={active}
            onClick={() => onSelect(apartment)}
            onPointerEnter={() => !sold && onHover(apartment.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => !sold && onHover(apartment.id)}
            onBlur={() => onHover(null)}
            className={`grid w-full cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] disabled:cursor-not-allowed ${
              active ? "border-[#c9a86a]/70 bg-[#2a2418]/80" : sold ? "border-white/[0.05] bg-[#181715]/50" : "border-white/[0.09] bg-[#1c1a17]/80 hover:border-[#c9a86a]/40"
            }`}
          >
            <span className={`font-display text-xl font-semibold ${sold ? "text-[#787166]" : "text-[#f1ebdf]"}`}>{apartment.id}</span>
            <span>
              <span className={`block text-sm font-semibold ${sold ? "text-[#8a8378] line-through decoration-white/20" : "text-[#e9e4da]"}`}>{apartment.type} · {apartment.area} m²</span>
              <span className="mt-0.5 block text-xs text-[#9b9387]">{sold ? "Satıldı" : formatMillionsTRY(apartment.price)}</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${sold ? "bg-white/[0.04] text-[#8a8378]" : "bg-[#5d9b74]/15 text-[#8fd0a6]"}`}>{sold ? "Satıldı" : "Müsait"}</span>
          </button>
        </li>;
      })}
    </ul>
    <button
      type="button"
      onClick={onViewPlan}
      disabled={!chosen}
      className="mt-6 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#c9a86a] px-6 text-sm font-semibold text-[#14110b] transition-colors hover:bg-[#d8bd86] disabled:cursor-default disabled:bg-white/10 disabled:text-[#9b9387] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a]"
    >
      {chosen ? `${chosen.id} Kat Planını Gör →` : "Bir daire seçin"}
    </button>
  </div>;
}
