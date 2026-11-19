'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import { systemChapters } from '@/data/systems';
import { gsap, MQ, useGSAP } from '@/components/animations/gsap';
import { Photo } from '@/components/ui/Photo';
import { CoverImage, Hotspot } from './CoverImage';

/**
 * SAHNE 2 — Teknik sistemler. Bölüm sabitlenir; kaydırdıkça 4 sistem sırayla anlatılır:
 * yeni fotoğraf maskeyle (masaüstünde soldan, mobilde alttan) açılır ve hafifçe küçülerek oturur,
 * önceki fotoğraf yakınlaşıp kararır (parallax), ardından o sistemin etiketleri ve açıklaması belirir.
 */
export function SystemsScene() {
  const root = useRef<HTMLElement>(null);
  const n = systemChapters.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        const layers = q('[data-layer]');
        const chapters = q('[data-chapter]');
        const steps = q('[data-step]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: desktop ? 0.7 : 0.4 },
        });
        // ilerleme çizgisi
        tl.fromTo(q('[data-progress]'), { scaleY: 0 }, { scaleY: 1, duration: n }, 0);
        // ilk bölümün etiketleri
        tl.fromTo(q('[data-layer="0"] .hotspot__inner'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.08 }, 0.15);
        tl.fromTo(q('[data-layer="0"] [data-kenburns]'), { scale: 1.08 }, { scale: 1, duration: 1 }, 0);
        for (let i = 1; i < n; i++) {
          const at = i - 0.35; // geçiş başlangıcı
          const prev = layers[i - 1];
          const next = layers[i];
          tl.to(prev.querySelectorAll('.hotspot__inner'), { autoAlpha: 0, duration: 0.12 }, at)
            .to(prev.querySelector('[data-kenburns]'), { scale: desktop ? 1.12 : 1.06, duration: 0.5 }, at)
            .to(prev.querySelector('[data-dim]'), { opacity: 0.6, duration: 0.5 }, at)
            .fromTo(
              next,
              { clipPath: desktop ? 'inset(0% 0% 0% 100%)' : 'inset(100% 0% 0% 0%)', autoAlpha: 1 },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.inOut' },
              at,
            )
            .fromTo(next.querySelector('[data-kenburns]'), { scale: desktop ? 1.18 : 1.08 }, { scale: 1, duration: 1 }, at)
            .fromTo(next.querySelectorAll('.hotspot__inner'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.08 }, at + 0.5)
            .to(chapters[i - 1], { autoAlpha: 0, y: -30, duration: 0.2 }, at)
            .fromTo(chapters[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.25)
            .to(steps[i - 1], { opacity: 0.4, duration: 0.1 }, at + 0.25)
            .to(steps[i], { opacity: 1, duration: 0.1 }, at + 0.25);
        }
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sistemler" className="scene scene--systems" aria-labelledby="sistemler-baslik">
      <h2 id="sistemler-baslik" className="sr-only">
        Teknik sistemler: elektrik, PLC, sürücü ve mekanik
      </h2>
      <div className="scene__stage">
        {/* görsel katmanları */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
          {systemChapters.map((c, i) => (
            <div key={c.key} data-layer={i} className="absolute inset-0 max-md:bottom-[44%]">
              <div data-kenburns className="absolute inset-0 will-change-transform">
                <CoverImage m={media[c.media]}>
                  {c.hotspots.map((h) => (
                    <Hotspot key={h.title} {...h} />
                  ))}
                </CoverImage>
              </div>
              <div data-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
            </div>
          ))}
          {/* metin tarafına yumuşak geçiş */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-ink via-ink/60 to-transparent md:block" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-[40%] h-[16%] bg-gradient-to-b from-transparent to-ink md:hidden" aria-hidden="true" />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        </div>

        {/* metin */}
        <div className="container-x relative z-10 flex h-full items-end pb-24 md:items-center md:pb-0">
          <div className="grid w-full max-w-[30rem] grid-cols-[1.25rem_1fr] gap-5 md:max-w-[min(30rem,36vw)] md:gap-7">
            <div className="relative hidden md:block" aria-hidden="true">
              <div className="absolute inset-y-0 left-1/2 w-px bg-mist/15" />
              <div data-progress className="absolute inset-y-0 left-1/2 w-px origin-top scale-y-0 bg-accent" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <ol className="flex gap-4 font-mono text-[10.5px] uppercase tracking-[0.16em]">
                {systemChapters.map((c, i) => (
                  <li key={c.key} data-step className={i ? 'text-mist opacity-40' : 'text-accent'}>
                    {c.index}
                  </li>
                ))}
              </ol>
              <div className="mt-5 grid">
                {systemChapters.map((c, i) => (
                  <article key={c.key} data-chapter={i} className="[grid-area:1/1]">
                    <p className="eyebrow">{c.label}</p>
                    <h3 className="wide mt-4 text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[0.95] text-paper">
                      {c.title[0]}
                      <br />
                      <em>{c.title[1]}</em>
                    </h3>
                    <p className="mt-5 text-[0.98rem] leading-relaxed text-mist/80 max-md:line-clamp-3 md:text-lg">{c.text}</p>
                    <ul className="mt-5 hidden flex-wrap gap-2 md:flex">
                      {c.points.map((p) => (
                        <li key={p} className="border border-mist/20 px-2.5 py-1 text-xs text-mist/80">
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/hizmetler/${c.service}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-[#f0b456]">
                      Hizmet ayrıntıları <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hareket azaltılmış: aynı içerik, sabitlemesiz liste */}
      <div className="systems-static container-x space-y-16 py-20">
        {systemChapters.map((c) => (
          <article key={c.key} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Photo m={media[c.media]} />
            </div>
            <div>
              <p className="eyebrow">
                {c.index} · {c.label}
              </p>
              <h3 className="wide mt-4 text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.95] text-paper">
                {c.title[0]} <em>{c.title[1]}</em>
              </h3>
              <p className="mt-5 leading-relaxed text-mist/80">{c.text}</p>
              <Link href={`/hizmetler/${c.service}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Hizmet ayrıntıları <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
