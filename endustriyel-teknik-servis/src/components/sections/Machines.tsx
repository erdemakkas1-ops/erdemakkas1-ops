import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { machineBrands } from '@/data/machines';
import { SectionHead } from '@/components/ui/SectionHead';
import { Visual } from '@/components/visuals/Visual';

/** Makine grupları: her marka bir teknik resim paftası (çizim + bölüm listesi + antet). */
export function Machines() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-24 sm:py-32" aria-labelledby="makine-baslik">
      <div className="container-x">
        <SectionHead
          id="makine-baslik"
          eyebrow="Çalışılan makine grupları"
          title={
            <>
              Endüstriyel makine
              <br />
              <em>sistemleri.</em>
            </>
          }
          note="Karton ambalaj ve ofset baskı hatlarında karşılaşılan elektrik, mekanik ve otomasyon arızaları için teknik servis."
        />
        <div className="space-y-16 lg:space-y-24">
          {machineBrands.map((b, n) => (
            <article key={b.id} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Pafta */}
              <div className="relative border border-mist/25 p-2 lg:col-span-8">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Visual kind={b.visual} image={b.image} draw="scroll" className="h-full w-full" sizes="(min-width:1024px) 60vw, 100vw" />
                </div>
                {/* antet */}
                <dl className="grid grid-cols-2 border-t border-mist/25 font-mono text-[10px] uppercase tracking-[0.14em] sm:grid-cols-4 lg:absolute lg:bottom-2 lg:right-2 lg:w-[30rem] lg:grid-cols-2 lg:border lg:bg-ink-2/95">
                  {[
                    ['Çizim', b.name],
                    ['Makine tipi', b.machineTypes[0]],
                    ['Modeller', b.models.map((m) => m.name).join(' · ')],
                    ['Pafta', `${String(n + 1).padStart(2, '0')} / ${String(machineBrands.length).padStart(2, '0')}`],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-r border-mist/20 px-3 py-2.5 last:border-r-0">
                      <dt className="text-mist/45">{k}</dt>
                      <dd className="mt-1 normal-case tracking-[0.04em] text-paper">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {/* Bölümler */}
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{b.category}</p>
                <h3 className="wide mt-3 text-[clamp(2.2rem,5vw,3.6rem)] normal-case leading-none text-paper">{b.name}</h3>
                <ol className="mt-8 border-t border-mist/15" data-stagger>
                  {b.sections.map((sec, i) => (
                    <li key={sec.name} className="grid grid-cols-[2.2rem_1fr] items-baseline gap-2 border-b border-mist/15 py-3">
                      <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[0.95rem] text-mist/85">{sec.name}</span>
                    </li>
                  ))}
                </ol>
                <Link href={`/makineler/${b.id}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-accent hover:text-[#d99b5c]">
                  {b.name}: modeller ve ayrıntılar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-14 max-w-3xl text-xs leading-relaxed text-mist/50">
          Marka isimleri yalnızca makine türünü tanımlamak için kullanılmıştır. Bağımsız teknik servis hizmetidir; üreticilerin
          yetkili servisi, temsilcisi veya iş ortağı değildir. Çizimler temsilîdir.
        </p>
      </div>
    </section>
  );
}
