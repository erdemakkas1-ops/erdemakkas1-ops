import { UserRound } from 'lucide-react';
import { about } from '@/data/about';
import { profile, site } from '@/data/site';
import { Ph } from '@/components/ui/Ph';
import { ContactButtons } from '@/components/ui/CallButtons';
import { serviceRequestHref } from '@/data/navigation';
import { Visual } from '@/components/visuals/Visual';

/** Bağımsız usta sitelerindeki gibi: kişi önce. Ad, deneyim, geçmiş, bölge, saatler, telefon. */
export function ProfileIntro() {
  const facts = [
    { k: 'Saha deneyimi', f: profile.experience },
    { k: 'Geçmiş', f: profile.background },
    { k: 'Merkez', f: profile.base },
    { k: 'Gittiğim bölgeler', f: profile.region },
    { k: 'Çalışma saatleri', f: profile.hours },
  ];
  return (
    <section id="usta" className="relative bg-surface py-24 text-ink sm:py-32" aria-labelledby="usta-baslik">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
            {about.portrait ? (
              <Visual kind="photo" image={about.portrait} className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
            ) : (
              <div className="tech-grid flex h-full flex-col items-center justify-center gap-4 text-mist/60">
                <UserRound className="h-24 w-24" strokeWidth={0.8} aria-hidden="true" />
                {site.showContentPlaceholders && (
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em]">Usta fotoğrafı · onay bekliyor</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow !text-accent-strong" data-reveal>
            Bağımsız teknik servis
          </p>
          <h2 id="usta-baslik" className="wide mt-5 text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.95] text-ink" data-reveal>
            Ben <Ph f={profile.name} />.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/75" data-reveal>
            Baskı ve ambalaj makinelerinde elektrik, mekanik ve otomasyon arızalarına bakıyorum. Arayan kişiyle makinenin
            başına gelen kişi aynı: arızayı telefonda dinler, ne gerektiğini açıkça söylerim.
          </p>
          <dl className="mt-10 border-t border-ink/15" data-reveal>
            {facts.map((x) => (
              <div key={x.k} className="grid grid-cols-[9.5rem_1fr] items-baseline gap-4 border-b border-ink/15 py-3.5 sm:grid-cols-[12rem_1fr]">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/50">{x.k}</dt>
                <dd className="font-semibold text-ink">
                  <Ph f={x.f} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row" data-reveal>
            <ContactButtons fallbackHref={serviceRequestHref} callVariant="dark" whatsappVariant="outline-dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
