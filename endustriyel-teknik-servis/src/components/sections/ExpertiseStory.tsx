import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { industrial, type SiteImage } from '@/data/visuals';
import { Visual, RepresentativeNote } from '@/components/visuals/Visual';
import { StoryScene } from '@/components/animations/StoryScene';

type Chapter = {
  id: '1' | '2';
  index: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  links: { href: string; label: string }[];
  image: SiteImage;
};

const chapters: Chapter[] = [
  {
    id: '1',
    index: '01',
    label: 'Elektrik ve otomasyon',
    title: 'Panonun içinden başlayan teşhis',
    text: 'Kumanda devreleri, koruma elemanları, PLC giriş/çıkışları ve sürücü bağlantıları şema ve ölçümle birlikte okunur. Arızanın elektriksel mi, yoksa başka bir yerden mi kaynaklandığı burada ayrışır.',
    points: ['Pano ve kumanda devreleri', 'PLC giriş/çıkış takibi', 'Sensör ve aktüatör sinyalleri'],
    links: [
      { href: '/hizmetler/elektrik-arizalari', label: 'Elektrik arızaları' },
      { href: '/hizmetler/plc-otomasyon', label: 'PLC ve otomasyon' },
    ],
    image: industrial.electricalPanel,
  },
  {
    id: '2',
    index: '02',
    label: 'Mekanik tahrik',
    title: 'Hareketin geçtiği her noktada kontrol',
    text: 'Motor-redüktör grupları, yataklama, kaplin ve lineer hareket elemanları; ses, titreşim, boşluk ve ısınma üzerinden değerlendirilir. Elektrik tarafındaki bir hata kodunun mekanik bir zorlanmadan doğup doğmadığı da burada netleşir.',
    points: ['Motor-redüktör ve aktarma organları', 'Rulman ve yataklama', 'Lineer hareket bileşenleri'],
    links: [
      { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
      { href: '/hizmetler/makine-revizyonu', label: 'Revizyon ve bakım' },
    ],
    image: industrial.motorGearbox,
  },
];

function ChapterText({ c, heading: H = 'h3' }: { c: Chapter; heading?: 'h3' }) {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        {c.index} · {c.label}
      </p>
      <H className="mt-4 font-display text-[2.1rem] font-semibold uppercase leading-[1.02] text-white sm:text-5xl">{c.title}</H>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-mist/80 sm:text-lg">{c.text}</p>
      <ul className="mt-6 space-y-2.5 text-[0.97rem] text-mist/90">
        {c.points.map((p) => (
          <li key={p} className="flex items-center gap-3">
            <span className="h-1 w-3 shrink-0 bg-accent" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {c.links.map((l) => (
          <Link key={l.href} href={l.href} className="group inline-flex items-center gap-2 py-1 text-sm font-semibold text-white hover:text-accent">
            {l.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </>
  );
}

export function ExpertiseStory() {
  return (
    <section id="uzmanlik-hikaye" className="relative bg-ink" aria-labelledby="hikaye-baslik">
      <h2 id="hikaye-baslik" className="sr-only">
        Uzmanlık: elektrik-otomasyon ve mekanik tahrik
      </h2>

      {/* Masaüstü: sabitlenen, scroll'a bağlı sahne */}
      <StoryScene className="relative hidden h-[100svh] min-h-[640px] overflow-hidden md:block motion-reduce:md:hidden">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-x relative grid h-full grid-cols-12 items-center gap-8 lg:gap-12">
          {/* ilerleme */}
          <div className="col-span-1 hidden h-[52%] justify-center lg:flex" aria-hidden="true">
            <div className="relative w-px bg-mist/15">
              <div data-story-progress className="absolute inset-0 origin-top scale-y-0 bg-accent" />
              <span data-story-step="1" className="absolute -left-[3px] top-0 h-[7px] w-[7px] bg-accent" />
              <span data-story-step="2" className="absolute -left-[3px] bottom-0 h-[7px] w-[7px] bg-accent opacity-35" />
            </div>
          </div>

          <div className="relative col-span-5 grid lg:col-span-4">
            <p className="eyebrow mb-8">Uzmanlık</p>
            <div className="grid">
              {chapters.map((c) => (
                <div key={c.id} data-story-text={c.id} className="[grid-area:1/1]" style={c.id === '2' ? { opacity: 0, visibility: 'hidden' } : undefined}>
                  <ChapterText c={c} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative col-span-7">
            <div className="relative aspect-[16/11] w-full overflow-hidden border border-mist/10 bg-steel">
              {chapters.map((c) => (
                <div key={c.id} data-story-img={c.id} className="absolute inset-0 will-change-[clip-path]" style={c.id === '2' ? { clipPath: 'inset(100% 0% 0% 0%)' } : undefined}>
                  <Visual kind="photo" image={c.image} note={false} className="h-full w-full" imgClassName="will-change-transform" sizes="(min-width:1024px) 58vw, 60vw" />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" aria-hidden="true" />
              <RepresentativeNote />
            </div>
          </div>
        </div>
      </StoryScene>

      {/* Mobil: normal akış + hafif reveal */}
      <div className="container-x space-y-16 py-20 md:hidden motion-reduce:md:block">
        <p className="eyebrow" data-reveal>
          Uzmanlık
        </p>
        {chapters.map((c) => (
          <article key={c.id} className="md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden border border-mist/10" data-clip>
              <Visual kind="photo" image={c.image} className="h-full w-full" sizes="(min-width:768px) 50vw, 100vw" />
            </div>
            <div className="mt-8 md:mt-0" data-reveal>
              <ChapterText c={c} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
