import Link from 'next/link';
import { ArrowRight, Award, BadgeCheck, Clock3, Info } from 'lucide-react';
import { about, principles } from '@/data/about';
import { business, site } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Visual } from '@/components/visuals/Visual';

export function AboutFacts() {
  const hasAny = about.experienceYears !== null || about.certifications.length > 0 || about.background.length > 0;
  if (!hasAny) {
    if (!site.showContentPlaceholders) return null;
    return (
      <div className="border border-dashed border-mist/25 p-5 text-sm leading-relaxed text-mist/70">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <Info className="h-3.5 w-3.5" aria-hidden="true" /> Örnek içerik alanı
        </p>
        <p className="mt-3">
          Deneyim süresi, mesleki belgeler ve uzmanlık geçmişi; işletme sahibi tarafından doğrulandıktan sonra bu alanda
          yayınlanacaktır.
        </p>
      </div>
    );
  }
  return (
    <dl className="grid gap-px overflow-hidden border border-mist/10 bg-mist/10 sm:grid-cols-2">
      {about.experienceYears !== null && (
        <div className="bg-ink p-6">
          <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/55">
            <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Saha deneyimi
          </dt>
          <dd className="mt-2 font-display text-4xl font-bold text-white">{about.experienceYears} yıl</dd>
        </div>
      )}
      {about.certifications.length > 0 && (
        <div className="bg-ink p-6">
          <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/55">
            <Award className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Belgeler
          </dt>
          <dd className="mt-3 space-y-1.5 text-sm text-mist/85">
            {about.certifications.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </dd>
        </div>
      )}
      {about.background.length > 0 && (
        <div className="bg-ink p-6 sm:col-span-2">
          <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/55">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Geçmiş
          </dt>
          <dd className="mt-3 space-y-1.5 text-sm text-mist/85">
            {about.background.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </dd>
        </div>
      )}
    </dl>
  );
}

export function About({ full = false }: { full?: boolean }) {
  const who = business.ownerName ? `${business.ownerName}` : 'Bağımsız teknik servis uzmanı';
  return (
    <section className="relative overflow-hidden bg-ink-2 py-24 sm:py-32" aria-labelledby="hakkimizda-baslik">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden" data-clip>
            <div className="absolute inset-0" data-zoom>
              <Visual kind="photo" image={about.portrait} tone="steel" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/50">
            {who}
            {!about.portrait && site.showContentPlaceholders && <span className="text-accent"> · Fotoğraf alanı (eklenecek)</span>}
          </p>
        </div>

        <div className="lg:col-span-7">
          <SectionHeading
            index={full ? undefined : '06'}
            eyebrow="Hakkımızda"
            title={<span id="hakkimizda-baslik">Fabrikanın diliyle konuşan teknik servis</span>}
          />
          <div className="prose-tech mt-8 max-w-2xl text-base leading-relaxed text-mist/80 sm:text-lg" data-reveal>
            <p>
              Bu hizmet, büyük bir servis organizasyonunun değil; makinenin başına doğrudan gelen bağımsız bir teknik
              uzmanın çalışmasıdır. Talebinizi ileten kişi ile arızayı inceleyen kişi aynıdır.
            </p>
            <p>
              Baskı ve ambalaj makinelerinde arızalar çoğu zaman tek bir disiplinle sınırlı kalmaz. Elektrik, mekanik ve
              otomasyon bilgisinin bir arada kullanılması, sorunun kaynağına daha kısa yoldan ulaşmayı sağlar.
            </p>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden border border-mist/10 bg-mist/10 sm:grid-cols-2" data-stagger>
            {principles.map((p, i) => (
              <li key={p.title} className="bg-ink-2 p-6">
                <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-xl font-semibold uppercase text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist/70">{p.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8" data-reveal>
            <AboutFacts />
          </div>

          {!full && (
            <Link href="/hakkimizda" className="btn btn-ghost mt-10" data-reveal>
              Hakkımızda daha fazlası <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
