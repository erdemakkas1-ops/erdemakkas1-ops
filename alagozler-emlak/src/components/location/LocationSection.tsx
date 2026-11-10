"use client";

import { useState } from "react";
import LocationMap from "./LocationMap";
import LocationPoiList from "./LocationPoiList";

export default function LocationSection() {
  const [hoveredPoi, setHoveredPoi] = useState<string | null>(null);
  return <section id="konum" aria-labelledby="location-title" data-location-active="true" className="mx-auto max-w-[1520px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16">
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
      <div className="motion-in-view flex min-w-0 flex-col justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9a86a]">Konum</p>
        <h2 id="location-title" className="mt-4 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#f4efe4]">Şehrin<br /><span className="text-[#e3c48a]">sakin yakası.</span></h2>
        <p className="mt-5 text-sm leading-relaxed text-[#aaa196]">Sahil, metro ve sağlık hizmetleri dakikalar içinde. Bir noktaya gelin ya da dokunun; rotası haritada belirsin. (Şematik demo harita.)</p>
        <LocationPoiList hoveredPoi={hoveredPoi} onHover={setHoveredPoi} />
      </div>
      <div className="h-[440px] min-w-0 sm:h-[560px] lg:h-[640px]"><LocationMap hoveredPoi={hoveredPoi} onHover={setHoveredPoi} /></div>
    </div>
  </section>;
}
