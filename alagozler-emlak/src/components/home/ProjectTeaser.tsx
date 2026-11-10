"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { countAvailable } from "@/data/apartments";
import { FLOOR_COUNT } from "@/lib/buildingConfig";
import ViewerStatus from "../three/ViewerStatus";
import { IconCube } from "../site/icons";

// The existing 3D tower, loaded only when this section is reached (or on tap on phones).
const HeroCanvas = dynamic(() => import("../three/HeroCanvas"), { ssr: false, loading: () => <ViewerStatus /> });

const features = ["Binayı 360° döndürün", "Kat ve daire seçin", "2D / 3D kat planları", "Ödeme planı hesaplayın"];

export default function ProjectTeaser() {
  const holder = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  useEffect(() => {
    // Phones and reduced-data visitors start the scene with a tap instead of automatically.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches || !holder.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setLoad(true); observer.disconnect(); } }, { rootMargin: "200px" });
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);

  const available = selectedFloor ? countAvailable(selectedFloor) : 0;

  return <section aria-labelledby="proje-3d" className="relative overflow-hidden bg-[#121110] text-[#e9e4da]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,rgba(201,140,90,0.22),transparent_60%)]" />
    <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:py-32">
      <div data-reveal>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#d9bd86]"><IconCube className="h-4 w-4" />3D proje deneyimi</p>
        <h2 id="proje-3d" className="mt-4 font-serif text-[clamp(2.3rem,5vw,3.9rem)] font-semibold leading-[0.98] text-[#f6f2ea]">Projeleri katı katı, daire daire gezin.</h2>
        <p className="mt-5 text-[16px] leading-relaxed text-[#b8afa2]">Yeni konut projelerinin alıcıya nasıl sunulabileceğini gösteren etkileşimli tanıtım. Kat seçin, dairenin planını ve ödeme seçeneklerini inceleyin.</p>
        <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-[#d8d0c3]">
          {features.map(item => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-[#c9a86a]">◆</span>{item}</li>)}
        </ul>
        <Link href="/proje-3d" className="mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-[#c9a86a] px-7 text-[15px] font-semibold text-[#1c1b19] transition-colors hover:bg-[#d8bd86] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a86a]">3D deneyimi aç →</Link>
        <p className="mt-5 text-xs leading-relaxed text-[#8a8378]">Temsili örnek proje: Alagözler tarafından inşa edilmiş gerçek bir bina değildir.</p>
      </div>

      <div ref={holder} className="relative h-[60svh] min-h-[360px] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#1e1c24_0%,#4b3a3d_55%,#b07a58_100%)] ring-1 ring-white/[0.06] lg:h-[620px]">
        {load
          ? <div className="scrollable-canvas absolute inset-0" role="img" aria-label="Örnek rezidansın 3D modeli. Sürükleyerek döndürün, bir kata tıklayın.">
              <HeroCanvas hoveredFloor={hoveredFloor} selectedFloor={selectedFloor} highlight={null} onHoverChange={setHoveredFloor} onSelect={setSelectedFloor} />
            </div>
          : <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
              <svg viewBox="0 0 120 160" aria-hidden="true" className="h-40 w-auto opacity-80">
                <path d="M30 150V30l30-14 30 14v120" fill="none" stroke="#c9a86a" strokeWidth="1.5" />
                {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M30 ${44 + i * 12}h60`} stroke="#c9a86a" strokeOpacity={0.35 + (i % 3) * 0.15} />)}
                <path d="M10 150h100" stroke="#e9e4da" strokeOpacity="0.4" />
              </svg>
              <button type="button" onClick={() => setLoad(true)} className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#c9a86a]">
                <IconCube className="h-5 w-5" />3D önizlemeyi başlat
              </button>
              <p className="text-xs text-white/50">{FLOOR_COUNT} katlı temsili rezidans</p>
            </div>}
        {selectedFloor !== null && <div role="status" className="motion-panel absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121110]/85 p-4 backdrop-blur sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80">
          <p><span className="font-serif text-2xl font-semibold text-white">{selectedFloor}. Kat</span><span className="ml-2 text-sm text-[#b8afa2]">{available ? `${available} daire müsait` : "Tümü satıldı"}</span></p>
          <Link href="/proje-3d" className="text-sm font-semibold text-[#d9bd86] underline-offset-4 hover:underline">Daireleri incele →</Link>
        </div>}
      </div>
    </div>
  </section>;
}
