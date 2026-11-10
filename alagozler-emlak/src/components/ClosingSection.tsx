import { project } from "@/data/project";

export default function ClosingSection({ onAppointment }: { onAppointment: () => void }) {
  return <footer className="relative overflow-hidden border-t border-white/[0.05] bg-[#121110]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(216,150,90,0.16),transparent_70%)]" />
    <div className="relative mx-auto max-w-[1520px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16">
      <div className="motion-in-view max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9a86a]">Randevu</p>
        <h2 className="mt-4 font-display text-[clamp(2.3rem,5.4vw,4.6rem)] font-semibold leading-[1] tracking-[-0.02em] text-[#f4efe4]">Daireyi yerinde<br /><span className="text-[#e3c48a]">birlikte gezelim.</span></h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#b8afa2]">Seçtiğiniz daire ve ödeme planıyla satış ofisimizde sizi ağırlayalım; numune daireyi ve manzarayı yerinde görün.</p>
        <button type="button" onClick={onAppointment} className="mt-9 inline-flex h-13 cursor-pointer items-center gap-2 rounded-full bg-[#c9a86a] px-8 text-sm font-semibold text-[#14110b] transition-colors hover:bg-[#d8bd86] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a86a]">Randevu Talep Et →</button>
      </div>
      <div className="mt-24 flex flex-col gap-3 border-t border-white/[0.06] pt-8 text-xs text-[#8a8378] sm:flex-row sm:items-center sm:justify-between">
        <p><span className="font-display font-bold tracking-[0.24em] text-[#e9e4da]">{project.name}</span> <span className="ml-1">{project.descriptor}</span></p>
        <p>Temsili rezidans demosudur; Alagözler tarafından inşa edilmiş bir proje değildir. Fiyatlar, planlar ve konum örnektir.</p>
      </div>
    </div>
  </footer>;
}
