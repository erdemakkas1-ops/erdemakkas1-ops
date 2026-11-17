import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { machineBrands } from '@/data/machines';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Visual } from '@/components/visuals/Visual';

export function Machines() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32" aria-labelledby="makine-baslik">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Çalışılan Makine Grupları"
          title={<span id="makine-baslik">Endüstriyel Makine Sistemleri</span>}
          lead="Karton ambalaj ve ofset baskı hatlarında karşılaşılan elektrik, mekanik ve otomasyon arızaları için teknik servis."
        />
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
          {machineBrands.map((b, i) => (
            <Link
              key={b.id}
              href={`/makineler#${b.id}`}
              className="group relative block overflow-hidden border border-mist/10 bg-ink-2 transition-colors duration-500 hover:border-accent/50"
              data-reveal
              data-reveal-delay={i * 0.12}
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]" data-clip>
                <div className="absolute inset-0" data-zoom>
                  <Visual kind={b.visual} image={b.image} className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]" sizes="(min-width:1024px) 50vw, 100vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{b.category}</p>
                  <h3 className="mt-2 font-display text-5xl font-bold text-white sm:text-6xl">{b.name}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                <ul className="flex flex-wrap gap-2">
                  {b.machineTypes.map((t) => (
                    <li key={t} className="border border-mist/15 px-3 py-1.5 text-xs text-mist/80">
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-white group-hover:text-accent">
                  Ayrıntılar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-mist/50">
          Marka isimleri yalnızca makine türünü tanımlamak için kullanılmıştır. Bağımsız teknik servis hizmetidir; üreticilerin
          yetkili servisi, temsilcisi veya iş ortağı değildir. Belirli bir modelde müdahalenin uygunluğu ön değerlendirmede
          belirtilir.
        </p>
      </div>
    </section>
  );
}
