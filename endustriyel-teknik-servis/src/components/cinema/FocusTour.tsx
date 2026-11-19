'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import type { Tour } from '@/data/tours';
import { gsap, MQ, useGSAP } from '@/components/animations/gsap';
import { Photo } from '@/components/ui/Photo';
import { CoverImage, Hotspot } from './CoverImage';

/** Odaklanan bölgenin ekranda duracağı nokta (sahnenin yüzdesi) */
const TARGET = { desktop: { x: 0.66, y: 0.5 }, mobile: { x: 0.5, y: 0.3 } };

/**
 * KAMERA TURU — tek fotoğraf, kaydırmaya bağlı kontrollü yakınlaşma.
 * Her adımda kamera ilgili bölgeye kayar, bölge çevresi hafifçe karartılır ve yalnızca görselde gerçekten
 * görünen parçalar etiketlenir. Kendi kendine oynayan animasyon yoktur; hareket azaltılmışsa statik liste.
 */
export function FocusTour({ tour }: { tour: Tour }) {
  const root = useRef<HTMLElement>(null);
  const m = media[tour.media];
  const n = tour.steps.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        const stage = q('[data-tour-stage]')[0] as HTMLElement;
        const target = desktop ? TARGET.desktop : TARGET.mobile;
        const [px, py] = m.position.split(' ').map((v) => parseFloat(v) / 100);

        // Kapak kutusunun (ölçeksiz) yerleşimi CSS ile aynı formülle hesaplanır → DOM ölçümü gerekmez
        const camera = (fx: number, fy: number, s: number) => {
          const W = stage.clientWidth;
          const H = stage.clientHeight;
          const ar = m.width / m.height;
          const bw = Math.max(W, H * ar);
          const bh = Math.max(H, W / ar);
          const bl = px * W - px * bw;
          const bt = py * H - py * bh;
          const x = bl + (fx / 100) * bw;
          const y = bt + (fy / 100) * bh;
          let dx = target.x * W - s * x;
          let dy = target.y * H - s * y;
          // görüntü her zaman sahneyi kaplasın (kenar boşluğu oluşmasın)
          dx = gsap.utils.clamp(W - s * (bl + bw), -s * bl, dx);
          dy = gsap.utils.clamp(H - s * (bt + bh), -s * bt, dy);
          return { x: dx, y: dy, scale: s };
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: desktop ? 0.8 : 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.set(q('[data-cam]'), { x: 0, y: 0, scale: 1 }, 0);
        tl.to(q('[data-tour-intro]'), { autoAlpha: 0, y: -24, duration: 0.25 }, 0.2);
        tl.to(q('[data-spot]'), { opacity: 1, duration: 0.4 }, 0.15);

        tour.steps.forEach((step, i) => {
          const t = 0.15 + i;
          const s = desktop ? step.focus.zoom : Math.min(step.focus.zoom, 1.7);
          tl.to(
            q('[data-cam]'),
            {
              x: () => camera(step.focus.x, step.focus.y, s).x,
              y: () => camera(step.focus.x, step.focus.y, s).y,
              scale: s,
              duration: 0.45,
              ease: 'power1.inOut',
            },
            t,
          )
            .to(q('[data-hs-scale]'), { scale: 1 / s, duration: 0.45, ease: 'power1.inOut' }, t)
            .fromTo(q(`[data-step="${i}"]`), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.18 }, t + 0.26)
            .to(q(`[data-step-title="${i}"]`), { opacity: 1, duration: 0.15 }, t + 0.24)
            .to(q('[data-progress]'), { scaleX: (i + 1) / n, duration: 0.3 }, t + 0.24)
            .fromTo(
              q(`[data-hs="${i}"] .hotspot__inner`),
              { autoAlpha: 0, scale: 0.6 },
              { autoAlpha: 1, scale: 1, duration: 0.12, stagger: 0.06, ease: 'back.out(2)' },
              t + 0.36,
            );
          if (i < n - 1) {
            tl.to(q(`[data-step="${i}"]`), { autoAlpha: 0, y: -20, duration: 0.16 }, t + 0.94)
              .to(q(`[data-step-title="${i}"]`), { opacity: 0.38, duration: 0.15 }, t + 0.95)
              .to(q(`[data-hs="${i}"] .hotspot__inner`), { autoAlpha: 0, duration: 0.12 }, t + 0.92);
          }
        });
        tl.to({}, { duration: 0.25 });

        // giriş: sahne, sabitlenmeden önce kadraja çerçeveyle girer
        gsap.fromTo(
          q('[data-tour-frame]'),
          { clipPath: desktop ? 'inset(9% 7% 9% 7% round 6px)' : 'inset(6% 4% 6% 4% round 6px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top top', scrub: 0.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={tour.id} className="scene scene--tour" aria-labelledby={`${tour.id}-baslik`}>
      <div data-tour-stage className="scene__stage tour-stage">
        <div data-tour-frame className="absolute inset-0 overflow-hidden bg-ink-2">
          <div data-cam className="absolute inset-0 will-change-transform" style={{ transformOrigin: '0 0' }}>
            <CoverImage m={m}>
              {tour.steps.map((step, i) => (
                <div key={step.title} data-hs={i} aria-hidden="true">
                  {step.hotspots.map((h) => (
                    <div key={h.title + h.x} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                      <div data-hs-scale style={{ transformOrigin: '0 0' }}>
                        <Hotspot x={0} y={0} title={h.title} note={h.note} left={h.left} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CoverImage>
          </div>
          {/* odak: bölge çevresi kararır (hedef nokta sabit olduğu için tek gradyan) */}
          <div data-spot className="tour-spot pointer-events-none absolute inset-0 opacity-0" aria-hidden="true" />
          <div className="tour-shade pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        </div>

        <div className="container-x pointer-events-none relative z-10 flex h-full flex-col justify-end pb-24 pt-24 md:justify-center md:pb-16">
          <div className="pointer-events-auto max-w-[27rem]">
            <p className="eyebrow">{tour.eyebrow}</p>
            <h2 id={`${tour.id}-baslik`} className="wide mt-4 text-[clamp(1.6rem,3.4vw,3.1rem)] leading-[0.95] text-paper">
              {tour.heading[0]}
              <br />
              <em>{tour.heading[1]}</em>
            </h2>

            <ol className="mt-7 hidden space-y-2.5 md:block" aria-label="Adımlar">
              {tour.steps.map((s, i) => (
                <li key={s.title} data-step-title={i} className="tour-title flex items-baseline gap-3">
                  <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[0.95rem] uppercase leading-tight text-paper">{s.title}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid border-t border-mist/15 pt-5">
              <p data-tour-intro className="tour-cell text-[0.98rem] leading-relaxed text-mist/85">
                {tour.intro}
              </p>
              {tour.steps.map((s, i) => (
                <div key={s.title} data-step={i} className="tour-cell tour-step">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent md:hidden">
                    {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 font-display text-[1.05rem] uppercase leading-tight text-paper md:hidden">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-mist/85 md:mt-0">{s.text}</p>
                  {s.link && (
                    <Link href={s.link.href} className="mt-3 inline-flex items-center gap-2 text-sm text-paper underline decoration-accent/60 underline-offset-4 hover:text-accent">
                      {s.link.label} <ArrowRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 h-px bg-mist/15">
              <div data-progress className="h-px origin-left scale-x-0 bg-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Hareket azaltılmışsa: sabit görsel + adım listesi */}
      <div className="tour-static container-x py-16">
        <p className="eyebrow">{tour.eyebrow}</p>
        <h2 className="wide mt-4 text-[clamp(1.6rem,3.4vw,3.1rem)] leading-[0.95] text-paper">
          {tour.heading[0]} <em>{tour.heading[1]}</em>
        </h2>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden">
          <Photo m={m} sizes="(min-width: 1280px) 1200px, 100vw" />
        </div>
        <ol className="mt-8 grid gap-6 md:grid-cols-2">
          {tour.steps.map((s, i) => (
            <li key={s.title} className="border-t border-mist/15 pt-4">
              <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-display text-[1rem] uppercase text-paper">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist/80">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
