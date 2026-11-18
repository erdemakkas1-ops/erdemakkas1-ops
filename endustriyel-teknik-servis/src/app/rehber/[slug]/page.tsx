import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { getGuide, guides, guideSafetyNote, type GuideBlock } from '@/data/guides';
import { getService } from '@/data/services';
import { displayName, site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { JsonLd } from '@/components/ui/JsonLd';
import { serviceRequestHref } from '@/data/navigation';

type Params = { slug: string };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, description: g.description, path: `/rehber/${g.slug}` });
}

function Block({ b }: { b: GuideBlock }) {
  if (b.type === 'p') return <p>{b.text}</p>;
  if (b.type === 'note')
    return (
      <p className="flex gap-3 border-l-2 border-accent bg-white/60 p-4 text-[0.95rem] text-ink/75">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
        <span>{b.text}</span>
      </p>
    );
  const L = b.ordered ? 'ol' : 'ul';
  return (
    <L className={`space-y-2.5 pl-5 ${b.ordered ? 'list-decimal' : 'list-[square]'} marker:text-accent-strong`}>
      {b.items.map((it) => (
        <li key={it} className="pl-1">
          {it}
        </li>
      ))}
    </L>
  );
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const related = g.relatedServices.map(getService).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const date = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(g.date));

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Teknik Rehber', path: '/rehber' },
          { name: g.category, path: `/rehber/${g.slug}` },
        ]}
        eyebrow={`${g.category} · ${date} · ${g.readingMinutes} dk`}
        title={g.title}
        lead={g.intro}
      />
      <article className="bg-surface py-16 text-ink sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="space-y-12 text-[1.04rem] leading-[1.75] text-ink/85 lg:col-span-8">
            <p className="flex gap-3 border border-ink/15 bg-white/60 p-5 text-sm leading-relaxed text-ink/70">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
              <span>{guideSafetyNote}</span>
            </p>
            {g.sections.map((s) => (
              <section key={s.heading} className="space-y-5">
                <h2 className="font-display text-[1.35rem] uppercase leading-tight text-ink">{s.heading}</h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} b={b} />
                ))}
              </section>
            ))}
          </div>
          <aside className="lg:col-span-4" aria-label="İlgili bağlantılar">
            <div className="space-y-8 lg:sticky lg:top-28">
              <div className="border border-ink/15 bg-white p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Makinenizde arıza mı var?</p>
                <p className="mt-3 leading-relaxed text-ink/75">Bilgileri form üzerinden paylaşın; ön teknik değerlendirme bu bilgilerle başlar.</p>
                <Link href={serviceRequestHref} className="btn btn-dark mt-6 w-full">
                  Arıza Bildir <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {related.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">İlgili hizmetler</p>
                  <ul className="mt-4 border-t border-ink/15">
                    {related.map((r) => (
                      <li key={r.slug} className="border-b border-ink/15">
                        <Link href={`/hizmetler/${r.slug}`} className="flex items-center justify-between gap-3 py-3 font-semibold text-ink hover:text-accent-strong">
                          {r.shortTitle} <ArrowRight className="h-4 w-4 text-accent-strong" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
      <ServiceCta />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: g.title,
          description: g.description,
          datePublished: g.date,
          inLanguage: 'tr-TR',
          mainEntityOfPage: `${site.url}/rehber/${g.slug}`,
          publisher: { '@type': 'Organization', name: displayName },
        }}
      />
    </>
  );
}
