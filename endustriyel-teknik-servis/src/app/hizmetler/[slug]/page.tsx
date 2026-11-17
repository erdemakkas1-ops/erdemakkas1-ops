import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Info } from 'lucide-react';
import { getService, services } from '@/data/services';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { PhoneButton } from '@/components/ui/ContactActions';
import { ServiceIconView } from '@/components/ui/Icon';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: `/hizmetler/${s.slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const related = s.related.map(getService).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const formHref = `/iletisim?ariza=${s.faultType}#servis-formu`;

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: s.shortTitle, path: `/hizmetler/${s.slug}` },
        ]}
        eyebrow={`Hizmet ${s.index}`}
        title={s.title}
        lead={s.lead}
        visual={s.visual}
        image={s.image}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={formHref} className="btn btn-primary">
            Bu konuda arıza bildir <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <PhoneButton />
        </div>
      </PageHero>

      {/* Genel bakış + kapsam */}
      <section className="bg-surface py-20 text-ink sm:py-28" aria-labelledby="genel-bakis">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Genel bakış
            </p>
            <h2 id="genel-bakis" className="display-md mt-5 text-ink" data-reveal>
              Bu hizmet neyi kapsar?
            </h2>
            <div className="prose-tech mt-8 text-base leading-relaxed text-ink-text/80 sm:text-lg" data-reveal>
              {s.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5" aria-labelledby="kapsam-baslik">
            <div className="border border-ink/10 bg-white p-7 sm:p-9 lg:sticky lg:top-28" data-reveal>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center bg-ink text-accent">
                  <ServiceIconView name={s.icon} className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 id="kapsam-baslik" className="font-display text-2xl font-semibold uppercase text-ink">
                  Kapsam başlıkları
                </h2>
              </div>
              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {s.scope.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3.5 text-[0.98rem] text-ink-text">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex gap-2.5 text-sm leading-relaxed text-ink-text/65">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {s.note}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Belirtiler */}
      <section className="bg-ink py-20 sm:py-28" aria-labelledby="belirtiler">
        <div className="container-x">
          <p className="eyebrow" data-reveal>
            Belirtiler
          </p>
          <h2 id="belirtiler" className="display-md mt-5 max-w-3xl text-white" data-reveal>
            Hangi durumlarda bildirim yapabilirsiniz?
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {s.symptoms.map((sym, i) => (
              <li key={sym} className="flex gap-4 bg-ink p-6 sm:p-7">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <span className="font-mono text-[11px] text-mist/40">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-1 leading-relaxed text-mist/90">{sym}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Yaklaşım */}
      <section className="relative overflow-hidden bg-ink-2 py-20 sm:py-28" aria-labelledby="yaklasim">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative">
          <p className="eyebrow" data-reveal>
            Çalışma yaklaşımı
          </p>
          <h2 id="yaklasim" className="display-md mt-5 max-w-3xl text-white" data-reveal>
            Teşhisten teste
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4" data-stagger>
            {s.approach.map((a, i) => (
              <li key={a.title} className="border-t border-accent/50 pt-6">
                <span className="font-mono text-xs text-accent">ADIM {String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold uppercase leading-tight text-white">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-mist/75">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Hazırlık */}
      <section className="bg-surface py-20 text-ink sm:py-28" aria-labelledby="hazirlik">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              Ön değerlendirme
            </p>
            <h2 id="hazirlik" className="display-md mt-5 text-ink" data-reveal>
              Bildirim yaparken paylaşabileceğiniz bilgiler
            </h2>
            <p className="mt-6 leading-relaxed text-ink-text/75" data-reveal>
              Bu bilgilerin hepsi zorunlu değildir; ancak ne kadar net olursa ön değerlendirme o kadar isabetli yapılır.
              Fotoğraf ve videoları WhatsApp görüşmesi üzerinden iletebilirsiniz.
            </p>
            <Link href={formHref} className="btn btn-dark mt-8" data-reveal>
              Arıza bildirim formu <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7" data-stagger>
            {s.prepare.map((p) => (
              <li key={p} className="flex gap-4 border border-ink/10 bg-white p-6">
                <ClipboardList className="h-5 w-5 shrink-0 text-accent-strong" strokeWidth={1.6} aria-hidden="true" />
                <span className="leading-relaxed text-ink-text">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* İlgili hizmetler */}
      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-surface pb-20 text-ink sm:pb-28" aria-labelledby="ilgili">
          <div className="container-x">
            <div className="hairline hairline-dark mb-14" data-line />
            <h2 id="ilgili" className="display-md text-ink" data-reveal>
              İlgili hizmetler
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2" data-stagger>
              {related.map((r) => (
                <ServiceCard key={r.slug} service={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceCta index="" />
    </>
  );
}
