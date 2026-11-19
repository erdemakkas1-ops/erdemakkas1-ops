'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import type { Tour } from '@/data/tours';
import { gsap, idleMatchMedia, MQ, ScrollTrigger, useGSAP } from '@/components/animations/gsap';
import { Photo } from '@/components/ui/Photo';
import { CoverImage, Hotspot } from './CoverImage';

const MOBILE_MAX_ZOOM = 1.7;

type Cam = { x: number; y: number; scale: number };
type Rect = { l: number; t: number; r: number; b: number };
const hit = (a: Rect, b: Rect) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/**
 * KAMERA TURU — tek fotoğraf, kaydırmaya bağlı kontrollü yakınlaşma.
 *
 * Koordinat sistemi: görsel ve etiketler aynı kapak kutusunun ([data-cover-box]) içindedir; etiketler görselin
 * yüzde koordinatına yerleşir. Kamera ([data-cam], köken 0 0) yalnızca x/y/scale ile hareket eder ve ikisini birlikte
 * taşır → nokta parçadan ayrılamaz. Kamera değerleri kutunun DOM'daki gerçek ölçülerinden (offset*) hesaplanır;
 * kutuda transform olmadığı için ölçüm kameradan etkilenmez. Her yenilemede (yeniden boyutlandırma dahil)
 * yeniden hesaplanır; görsel boyutu CSS'ten geldiği için görselin yüklenmesini beklemek gerekmez.
 *
 * Etiket yerleşimi: her adım için noktanın ekrandaki konumu önceden hesaplanır; etiket ekrana sığmıyor, metin
 * paneline ya da başka etikete çarpıyorsa diğer yöne çevrilir, yine olmuyorsa o çözünürlükte gizlenir.
 * Geliştirme ortamında `?debug` ile görsel sınırı, koordinatlar, odak noktaları ve kamera değerleri görünür.
 */
export function FocusTour({ tour }: { tour: Tour }) {
  const root = useRef<HTMLElement>(null);
  const m = media[tour.media];
  const n = tour.steps.length;
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).has('debug')) setDebug(true);
  }, []);

  useGSAP(
    () => {
      return idleMatchMedia((mm) => {
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        const stage = q('[data-tour-stage]')[0] as HTMLElement;
        const box = q('[data-cover-box]')[0] as HTMLElement;
        const copy = q('[data-tour-copy]')[0] as HTMLElement;
        const readout = q('[data-debug-readout]')[0] as HTMLElement | undefined;
        const zoomOf = (z: number) => (desktop ? z : Math.min(z, MOBILE_MAX_ZOOM));

        const headerH = () => (document.querySelector('header')?.getBoundingClientRect().height ?? 72) + 8;
        /** Metin panelinin kapatmadığı serbest alan (sahneye göre px). Masaüstü: panelin sağı; mobil: panelin üstü. */
        const freeArea = (): Rect => {
          const W = stage.clientWidth;
          const H = stage.clientHeight;
          const sr = stage.getBoundingClientRect();
          const cr = copy.getBoundingClientRect();
          return desktop
            ? { l: Math.min(cr.right - sr.left + 24, W * 0.6), t: headerH(), r: W, b: H }
            : { l: 0, t: headerH(), r: W, b: Math.max(cr.top - sr.top - 12, H * 0.35) };
        };
        /** Kamera: (fx, fy) görsel noktasını serbest alanın merkezine getirir; görüntü sahneyi her zaman kaplar. */
        const camera = (fx: number, fy: number, s: number): Cam => {
          const W = stage.clientWidth;
          const H = stage.clientHeight;
          const f = freeArea();
          const target = { x: (f.l + f.r) / 2 / W, y: (f.t + f.b) / 2 / H };
          const bl = box.offsetLeft;
          const bt = box.offsetTop;
          const bw = box.offsetWidth;
          const bh = box.offsetHeight;
          const x = target.x * W - s * (bl + (fx / 100) * bw);
          const y = target.y * H - s * (bt + (fy / 100) * bh);
          return {
            x: gsap.utils.clamp(W - s * (bl + bw), -s * bl, x),
            y: gsap.utils.clamp(H - s * (bt + bh), -s * bt, y),
            scale: s,
          };
        };
        /** Görsel noktasının verilen kamerada ekrandaki konumu (sahneye göre px) */
        const project = (fx: number, fy: number, c: Cam) => ({
          x: c.x + c.scale * (box.offsetLeft + (fx / 100) * box.offsetWidth),
          y: c.y + c.scale * (box.offsetTop + (fy / 100) * box.offsetHeight),
        });
        const cams = () => tour.steps.map((st) => camera(st.focus.x, st.focus.y, zoomOf(st.focus.zoom)));

        /** Etiket yönü / görünürlüğü: ekran sınırı, metin paneli ve diğer etiketlerle çakışmaya göre */
        const placeHotspots = () => {
          const W = stage.clientWidth;
          const H = stage.clientHeight;
          const sr = stage.getBoundingClientRect();
          const cr = copy.getBoundingClientRect();
          const pad = 14;
          const panel: Rect = desktop
            ? { l: 0, t: cr.top - sr.top - pad, r: cr.right - sr.left + pad, b: cr.bottom - sr.top + pad }
            : { l: 0, t: cr.top - sr.top - pad, r: W, b: H };
          const header = headerH();
          const gap = desktop ? 70 : 40; // nokta → etiket (yatay)
          const vgap = desktop ? 46 : 32; // nokta → etiket (dikey: çizgi + boşluk)
          type Side = 'right' | 'left' | 'top' | 'bottom';
          cams().forEach((c, i) => {
            const placed: Rect[] = [];
            q(`[data-hs="${i}"] [data-hotspot]`).forEach((el) => {
              el.classList.remove('hotspot--off', 'hotspot--left', 'hotspot--top', 'hotspot--bottom');
              const p = project(+el.dataset.x!, +el.dataset.y!, c);
              const tag = el.querySelector('.hotspot__tag') as HTMLElement;
              const tw = tag.offsetWidth;
              const th = tag.offsetHeight;
              const dot: Rect = { l: p.x - 10, t: p.y - 10, r: p.x + 10, b: p.y + 10 };
              const inView = p.x > 12 && p.x < W - 12 && p.y > header && p.y < H - 12;
              const label = (side: Side): Rect => {
                switch (side) {
                  case 'left':
                    return { l: p.x - gap - tw, t: p.y - th / 2, r: p.x - 6, b: p.y + th / 2 };
                  case 'right':
                    return { l: p.x + 6, t: p.y - th / 2, r: p.x + gap + tw, b: p.y + th / 2 };
                  case 'top':
                    return { l: p.x - tw / 2, t: p.y - vgap - th, r: p.x + tw / 2, b: p.y - 6 };
                  case 'bottom':
                    return { l: p.x - tw / 2, t: p.y + 6, r: p.x + tw / 2, b: p.y + vgap + th };
                }
              };
              const ok = (r: Rect) =>
                r.l > 8 && r.r < W - 8 && r.t > header && r.b < H - 8 && !hit(r, panel) && !placed.some((o) => hit(o, r));
              const first = (el.dataset.prefer as Side) || 'right';
              const order = [...new Set<Side>([first, first === 'left' ? 'right' : 'left', 'top', 'bottom', 'right'])];
              const side = !inView || hit(dot, panel) ? undefined : order.find((sd) => ok(label(sd)));
              if (!side) {
                el.classList.add('hotspot--off');
                return;
              }
              if (side !== 'right') el.classList.add(`hotspot--${side}`);
              placed.push(label(side), dot);
            });
          });
        };
        placeHotspots();
        ScrollTrigger.addEventListener('refresh', placeHotspots);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: desktop ? 0.8 : 0.5,
            invalidateOnRefresh: true,
          },
          onUpdate: readout
            ? () => {
                const cam = q('[data-cam]')[0];
                const g = (k: string) => Number(gsap.getProperty(cam, k)).toFixed(2);
                readout.textContent = `t=${tl.time().toFixed(2)}/${tl.duration().toFixed(2)}  scale=${g('scale')}  x=${g('x')}  y=${g('y')}`;
              }
            : undefined,
        });

        const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;
        tl.set(q('[data-cam]'), { x: 0, y: 0, scale: 1 }, 0);
        tl.to(q('[data-tour-intro]'), { autoAlpha: 0, y: -24, duration: 0.25 }, 0.2);
        tl.to(q('[data-spot]'), { opacity: 1, duration: 0.4 }, 0.15);

        tour.steps.forEach((step, i) => {
          const t = 0.15 + i;
          const s = zoomOf(step.focus.zoom);
          const cam = () => camera(step.focus.x, step.focus.y, s);
          tl.to(q('[data-cam]'), { x: () => cam().x, y: () => cam().y, scale: s, duration: 0.45, ease: 'power1.inOut' }, t)
            .to(q('[data-hs-scale]'), { scale: 1 / s, duration: 0.45, ease: 'power1.inOut' }, t)
            // karartma, kameranın sınırlandığı durumlarda da gerçek odak noktasını izler
            .to(
              q('[data-spot]'),
              {
                '--sx': () => pct(project(step.focus.x, step.focus.y, cam()).x, stage.clientWidth),
                '--sy': () => pct(project(step.focus.x, step.focus.y, cam()).y, stage.clientHeight),
                duration: 0.45,
                ease: 'power1.inOut',
              },
              t,
            )
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
        // testler ve hata ayıklama için: adımın sabit durduğu aralık = (0.15 + i + 0.6) / süre
        root.current!.dataset.tourDuration = String(tl.duration());

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

        return () => ScrollTrigger.removeEventListener('refresh', placeHotspots);
      });
      });
    },
    { scope: root, dependencies: [debug] },
  );

  return (
    <section
      ref={root}
      id={tour.id}
      className={`scene scene--tour ${debug ? 'tour-debug' : ''}`}
      aria-labelledby={`${tour.id}-baslik`}
    >
      <div data-tour-stage className="scene__stage tour-stage">
        <div data-tour-frame className="absolute inset-0 overflow-hidden bg-ink-2">
          <div data-cam className="absolute inset-0 will-change-transform" style={{ transformOrigin: '0 0' }}>
            <CoverImage m={m} clip={false}>
              {tour.steps.map((step, i) => (
                <div key={step.title} data-hs={i} aria-hidden="true">
                  {step.hotspots.map((h) => (
                    <Hotspot key={h.title + h.x} x={h.x} y={h.y} title={h.title} note={h.note} side={h.side} />
                  ))}
                </div>
              ))}
              {debug &&
                tour.steps.map((step, i) => (
                  <span
                    key={`f${i}`}
                    className="tour-debug__focus"
                    style={{ left: `${step.focus.x}%`, top: `${step.focus.y}%` }}
                  >
                    F{i + 1} ({step.focus.x},{step.focus.y}) ×{step.focus.zoom}
                  </span>
                ))}
            </CoverImage>
          </div>
          {/* odak: bölge çevresi kararır; merkez kameranın gerçek odak noktasını izler */}
          <div data-spot className="tour-spot pointer-events-none absolute inset-0 opacity-0" aria-hidden="true" />
          <div className="tour-shade pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        </div>
        {debug && <p data-debug-readout className="tour-debug__readout" />}

        <div className="container-x pointer-events-none relative z-10 flex h-full flex-col justify-end pb-24 pt-24 md:justify-center md:pb-16">
          <div data-tour-copy className="pointer-events-auto max-w-[27rem]">
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
