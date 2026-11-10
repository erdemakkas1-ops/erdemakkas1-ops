import type { ApartmentDetailMode } from "@/types/floorPlan";

export default function PlanToggle({ mode, onChange }: { mode: ApartmentDetailMode; onChange: (mode: ApartmentDetailMode) => void }) {
  return (
    <div role="group" className="inline-flex max-w-full rounded-lg border border-white/10 p-1 text-[11px] tracking-[0.08em] sm:tracking-[0.16em]" aria-label="Daire detay görünümü">
      {(["2d", "3d"] as const).map(value => <button key={value} type="button" aria-pressed={mode===value} onClick={()=>onChange(value)} className={`min-h-11 lg:min-h-0 cursor-pointer whitespace-nowrap rounded-md border px-2.5 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a86a] sm:px-4 ${mode===value ? "border-[#c9a86a]/35 bg-[#c9a86a]/10 text-[#c9a86a]" : "border-transparent text-slate-400 hover:text-[#ecd7af]"}`}>{`${value.toUpperCase()} PLAN`}</button>)}
    </div>
  );
}

