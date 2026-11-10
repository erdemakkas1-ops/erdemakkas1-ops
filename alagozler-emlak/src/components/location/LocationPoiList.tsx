import { locationPois } from "@/data/location";

export default function LocationPoiList({ hoveredPoi, onHover }: { hoveredPoi: string | null; onHover: (id: string | null) => void }) {
  return <ul aria-label="Proje çevresindeki noktalar" className="mt-8 grid grid-cols-2 gap-x-4 lg:grid-cols-1 lg:gap-0">
    {locationPois.map((poi, index) => <li key={poi.id} className="border-b border-white/[0.07]">
      <button type="button" data-poi-row={poi.id} data-highlighted={hoveredPoi === poi.id} onPointerEnter={() => onHover(poi.id)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(poi.id)} onBlur={() => onHover(null)} onClick={() => onHover(poi.id)} className={`flex w-full cursor-pointer min-h-11 items-center gap-1 lg:gap-3 rounded px-2 py-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#c9a86a] lg:py-4 ${hoveredPoi === poi.id ? "bg-[#c9a86a]/[0.07] text-[#e5c790]" : "text-[#b1bbc8] hover:text-[#eee9de]"}`}>
        <span aria-hidden="true" className="hidden font-mono text-[11px] text-slate-600 lg:inline">0{index + 1}</span>
        <span className="text-[11px] tracking-[0.12em] lg:text-xs">{poi.name.toLocaleUpperCase("tr-TR")}</span>
        <span className="ml-auto whitespace-nowrap text-sm tabular-nums">{poi.minutes} <span className="text-[11px] text-slate-400">dk</span></span>
      </button>
    </li>)}
  </ul>;
}


