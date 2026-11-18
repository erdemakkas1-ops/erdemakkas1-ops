import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { getMachineBrand, machineBrands, otherMachinesNote } from '@/data/machines';
import { getService } from '@/data/services';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { SectionHead } from '@/components/ui/SectionHead';
import { PhoneButton } from '@/components/ui/ContactActions';

type Params = { brand: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return machineBrands.map((b) => ({ brand: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand } = await params;
  const b = getMachineBrand(brand);
  if (!b) return {};
  return pageMetadata({ title: b.seo.title, description: b.seo.description, path: `/makineler/${b.id}` });
}

const formHref = (brand: string, model?: string) =>
  `/iletisim?marka=${brand}${model ? `&model=${encodeURIComponent(model)}` : ''}#servis-formu`;

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { brand } = await params;
  const b = getMachineBrand(brand);
  if (!b) notFound();
  const related = b.relatedServices.map(getService).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Makine Grupları', path: '/makineler' },
          { name: b.name, path: `/makineler/${b.id}` },
        ]}
        eyebrow={`${b.category} · Bağımsız teknik servis`}
        title={
          <>
            {b.name}
            <br />
            <em>{b.machineTypes[0].toLocaleLowerCase('tr-TR')}.</em>
          </>
        }
        lead={b.lead}
        visual={b.visual}
        image={b.image}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={formHref(b.id)} className="btn btn-primary">
            {b.name} için arıza bildir <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <PhoneButton />
        </div>
      </PageHero>

      {/* Modeller */}
      <section className="bg-surface py-20 text-ink sm:py-28" aria-labelledby="modeller">
        <div className="container-x">
          <SectionHead
            id="modeller"
            tone="light"
            eyebrow="Çalışılan modeller"
            title={
              <>
                Modeller
                <br />
                <em>ve bildirim.</em>
              </>
            }
            note="Modelinizi seçerek arıza bildirim formunu marka ve model bilgisi doldurulmuş olarak açabilirsiniz."
          />
          <ul className="grid gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-2 lg:grid-cols-3" data-stagger>
            {b.models.map((m) => (
              <li key={m.name} className="flex flex-col bg-surface p-7 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
                  {b.name} · {m.type}
                </p>
                <h3 className="mt-3 font-display text-[1.7rem] uppercase leading-none text-ink">{m.name}</h3>
                {m.summary && <p className="mt-4 leading-relaxed text-ink/70">{m.summary}</p>}
                <Link
                  href={formHref(b.id, m.name)}
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-accent-strong hover:text-ink"
                >
                  {m.name} için arıza bildir <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink/60">{otherMachinesNote}</p>
        </div>
      </section>

      {/* Ana gruplar */}
      <section className="bg-ink py-20 sm:py-28" aria-labelledby="gruplar">
        <div className="container-x">
          <SectionHead
            id="gruplar"
            eyebrow="Makinenin ana grupları"
            title={
              <>
                Arıza hangi
                <br />
                <em>bölümde?</em>
              </>
            }
            note="Bildiriminizde arızanın görüldüğü bölümü belirtmeniz ön değerlendirmeyi hızlandırır. Hangi bölüm olduğundan emin değilseniz belirtiyi anlatmanız yeterlidir."
          />
          <ol className="border-t border-mist/15" data-stagger>
            {b.sections.map((sec, i) => (
              <li key={sec.name} className="grid gap-3 border-b border-mist/15 py-6 md:grid-cols-[3rem_14rem_minmax(0,1fr)] md:items-baseline md:gap-8 xl:grid-cols-[3rem_17rem_minmax(0,1fr)_16rem]">
                <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-[1.15rem] uppercase leading-tight text-paper">{sec.name}</h3>
                <p className="leading-relaxed text-mist/75">{sec.parts}</p>
                <ul className="flex flex-wrap gap-1.5 md:col-start-3 xl:col-start-auto xl:justify-end">
                  {sec.disciplines.map((d) => (
                    <li key={d} className="border border-mist/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/70">
                      {d}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* İlgili hizmetler */}
      <section className="bg-ink-2 py-20 sm:py-28" aria-labelledby="ilgili-hizmetler">
        <div className="container-x">
          <SectionHead
            id="ilgili-hizmetler"
            eyebrow="İlgili hizmetler"
            title={
              <>
                {b.name}
                <br />
                <em>için.</em>
              </>
            }
          />
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-3" data-stagger>
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
          <div className="mt-16 flex max-w-3xl gap-4 border border-mist/15 p-6">
            <ShieldAlert className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
            <p className="text-sm leading-relaxed text-mist/70">
              {b.name}, hak sahibinin markasıdır. Bu sayfadaki hizmet bağımsız teknik servistir; üreticinin yetkili servisi,
              resmî temsilcisi, distribütörü veya iş ortağı olunduğu anlamına gelmez. Garanti kapsamındaki işlemler, orijinal
              yedek parça ve üreticiye özel yazılımlar için üreticinin kendi servis kanallarına başvurulmalıdır.
            </p>
          </div>
        </div>
      </section>

      <ServiceCta />
    </>
  );
}
