import Link from 'next/link';
import { ArrowRight, Info, ShieldAlert } from 'lucide-react';
import { machineBrands, otherMachinesNote } from '@/data/machines';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { Visual } from '@/components/visuals/Visual';

export const metadata = pageMetadata({
  title: 'Makine Grupları – BOBST ve manroland Makinelerinde Teknik Servis',
  description:
    'BOBST baskı ve ambalaj makineleri ile manroland ofset baskı makinelerinde elektrik, mekanik ve otomasyon arızaları için bağımsız teknik servis.',
  path: '/makineler',
});

export default function MachinesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Makine Grupları', path: '/makineler' }]}
        eyebrow="Makine Grupları"
        title="Endüstriyel Makine Sistemleri"
        lead="Karton ambalaj üretim hatları ve ofset baskı makinelerinde; elektrik, mekanik ve otomasyon kaynaklı arızalar için bağımsız teknik servis."
      />

      {machineBrands.map((b, i) => (
        <section
          key={b.id}
          id={b.id}
          className={`scroll-mt-24 py-20 sm:py-28 ${i % 2 === 0 ? 'bg-ink' : 'bg-ink-2'}`}
          aria-labelledby={`${b.id}-baslik`}
        >
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative aspect-[4/3] overflow-hidden border border-mist/10" data-clip>
                <div className="absolute inset-0" data-zoom>
                  <Visual kind={b.visual} image={b.image} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <p className="eyebrow" data-reveal>
                {b.category}
              </p>
              <h2 id={`${b.id}-baslik`} className="mt-4 font-display text-[clamp(2.2rem,10vw,4.5rem)] text-paper" data-reveal>
                {b.name}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-mist/80" data-reveal>
                {b.description}
              </p>

              <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Makine türleri</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.machineTypes.map((t) => (
                  <li key={t} className="border border-mist/15 px-3.5 py-2 text-sm text-mist/85">
                    {t}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Çalışılan modeller</h3>
              {b.models.length > 0 ? (
                <ul className="mt-4 divide-y divide-mist/10 border-y border-mist/10">
                  {b.models.map((m) => (
                    <li key={m.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                      <span className="font-display text-xl font-semibold text-white">{m.name}</span>
                      <span className="text-sm text-mist/65">
                        {m.type}
                        {m.notes ? ` · ${m.notes}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                site.showContentPlaceholders && (
                  <p className="mt-4 flex gap-3 border border-dashed border-mist/25 p-4 text-sm leading-relaxed text-mist/65">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    Model bazlı liste, işletme sahibi tarafından doğrulanan modellerle eklenecektir. Makinenizin modelini arıza
                    bildiriminde belirtmeniz yeterlidir.
                  </p>
                )
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-surface py-20 text-ink sm:py-24" aria-labelledby="diger-baslik">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal>
              Diğer makineler
            </p>
            <h2 id="diger-baslik" className="display-md mt-5 text-ink" data-reveal>
              Makineniz listede yok mu?
            </h2>
            <p className="mt-6 leading-relaxed text-ink-text/75" data-reveal>
              {otherMachinesNote}
            </p>
            <Link href="/iletisim#servis-formu" className="btn btn-dark mt-8" data-reveal>
              Arıza bildir <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="border border-ink/10 bg-white p-7 sm:p-9" data-reveal>
            <ShieldAlert className="h-6 w-6 text-accent-strong" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Marka bağımsızlığı</h3>
            <p className="mt-4 text-[0.97rem] leading-relaxed text-ink-text/75">
              BOBST ve manroland, ilgili hak sahiplerinin markalarıdır. Bu sayfada marka isimleri yalnızca hizmet verilen
              makine türlerini tanımlamak için kullanılır; üretici logoları kullanılmaz. Sunulan hizmet bağımsız teknik
              servistir: üreticilerin yetkili servisi, resmî temsilcisi, distribütörü veya iş ortağı olunduğu anlamına
              gelmez. Orijinal yedek parça, garanti kapsamındaki işlemler ve üreticiye özel yazılımlar için üreticinin kendi
              servis kanallarına başvurulmalıdır.
            </p>
          </div>
        </div>
      </section>

      <ServiceCta index="" />
    </>
  );
}
