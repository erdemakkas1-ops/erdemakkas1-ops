'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { assetPath } from '@/data/visuals';

const ORBIT_MQ = '(prefers-reduced-motion: no-preference)';
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const orbitImage = (slug: string) => assetPath(`/images/orbit/${slug}.webp`);

/**
 * HALO tarzı yörünge: masaüstünde bölüm sabitlenir (sticky), sayfa kaydırması hizmetler arasında döner.
 * Parçalar açılış filmindeki 3D modelden alınmış şeffaf görsellerdir; havada süzülür (CSS).
 * Mobil / reduced-motion: aynı içerik, sabitlemesiz liste.
 */
export function OrbitServices() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const mq = window.matchMedia(ORBIT_MQ);
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-orbit-item]'));
    const texts = Array.from(section.querySelectorAll<HTMLElement>('[data-orbit-text]'));
    const ticks = section.querySelector<HTMLElement>('[data-orbit-fill]');
    const counter = section.querySelector<HTMLElement>('[data-orbit-count]');
    const n = items.length;
    let target = 0;
    let pos = 0;
    let raf = 0;
    let last = performance.now();

    const read = () => {
      const r = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      // HALO gibi: her kaydırma aralığı bir hizmete oturur, ara konumda kalınmaz
      target = Math.round((span > 0 ? clamp01(-r.top / span) : 0) * (n - 1));
    };

    const paint = () => {
      items.forEach((el, i) => {
        const d = i - pos;
        const a = Math.abs(d);
        const hidden = a > 2.4;
        el.style.visibility = hidden ? 'hidden' : 'visible';
        if (hidden) return;
        const narrow = window.innerWidth < 768;
        const x = d * (narrow ? 52 : 25); // vw
        const y = -d * (narrow ? 9 : 19); // vh
        const s = 1 - Math.min(a, 2) * 0.34;
        el.style.transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh) scale(${s})`;
        el.style.opacity = String(Math.max(0, 1 - Math.min(a, 2.4) * 0.45));
        el.style.filter = a > 0.05 ? `blur(${Math.min(a, 2) * 1.6}px)` : 'none';
        el.style.zIndex = String(10 - Math.round(a * 2));
      });
      texts.forEach((el, i) => {
        const w = clamp01(1 - Math.abs(i - pos) * 1.6);
        el.style.opacity = String(w);
        el.style.visibility = w < 0.02 ? 'hidden' : 'visible';
        el.style.transform = `translateY(${(i - pos) * -28}px)`;
      });
      const active = Math.round(pos);
      if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      if (ticks) ticks.style.transform = `scaleX(${n > 1 ? pos / (n - 1) : 1})`;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const diff = target - pos;
      if (Math.abs(diff) < 0.0008) {
        if (pos !== target) {
          pos = target;
          paint();
        }
        return;
      }
      pos += diff * (1 - Math.exp(-dt * 6));
      paint();
    };

    const start = () => {
      read();
      pos = target;
      paint();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onMq = () => (mq.matches ? start() : stop());
    if (mq.matches) start();
    mq.addEventListener('change', onMq);
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);

    // Pasif parçaya tıklayınca o hizmete kaydır
    const onClick = (e: Event) => {
      const el = (e.currentTarget as HTMLElement) ?? null;
      const i = items.indexOf(el);
      if (i < 0) return;
      const span = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: section.offsetTop + (span * i) / (n - 1), behavior: 'smooth' });
    };
    items.forEach((el) => el.addEventListener('click', onClick));

    return () => {
      stop();
      mq.removeEventListener('change', onMq);
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      items.forEach((el) => el.removeEventListener('click', onClick));
    };
  }, []);

  return (
    <section ref={root} id="neye-bakiyorum" className="orbit relative bg-ink" aria-labelledby="orbit-baslik">
      {/* Masaüstü: sabitlenen yörünge sahnesi */}
      <div className="orbit__stage">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="orbit__glow" aria-hidden="true" />
        <div className="container-x relative h-full">
          <div className="orbit__copy">
            <p className="eyebrow">
              <span data-orbit-count>01 / {String(services.length).padStart(2, '0')}</span> — Neye bakıyorum?
            </p>
            <h2 id="orbit-baslik" className="sr-only">
              Neye bakıyorum? Hizmetler
            </h2>
            <div className="relative mt-6 grid">
              {services.map((s, i) => (
                <div key={s.slug} data-orbit-text className="[grid-area:1/1]" style={i ? { opacity: 0, visibility: 'hidden' } : undefined}>
                  <h3 className="wide text-[clamp(2rem,4.2vw,4.2rem)] leading-[0.95] text-paper">{s.shortTitle}</h3>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-mist/80">{s.summary}</p>
                  <ul className="mt-6 flex max-w-md flex-wrap gap-2">
                    {s.scope.map((x) => (
                      <li key={x} className="border border-mist/20 px-2.5 py-1 text-xs text-mist/80">
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link href={`/hizmetler/${s.slug}`} className="inline-flex items-center gap-2 border-b border-paper pb-1 text-sm font-semibold text-paper hover:border-accent hover:text-accent">
                      Detayları gör <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link href={`/iletisim?ariza=${s.faultType}#servis-formu`} className="text-sm font-semibold text-accent hover:text-[#d99b5c]">
                      Bu konuda arıza bildir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {services.map((s) => (
          <div key={s.slug} data-orbit-item aria-hidden="true" className="orbit__item">
            <span className="orbit__bob">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={orbitImage(s.slug)} alt="" loading="lazy" decoding="async" draggable={false} />
            </span>
            <span className="orbit__shadow" />
          </div>
        ))}
        <div className="orbit__wheel" aria-hidden="true">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-mist/50">01</span>
            <span className="orbit__track">
              <span className="orbit__fill" data-orbit-fill />
            </span>
            <span className="font-mono text-[10px] text-mist/50">{String(services.length).padStart(2, '0')}</span>
          </div>
          <small>Kaydırarak çevirin</small>
        </div>
      </div>

      {/* Mobil / reduced-motion: sade liste */}
      <div className="orbit__list container-x py-20">
        <p className="eyebrow">Neye bakıyorum?</p>
        <ol className="mt-10 space-y-14">
          {services.map((s) => (
            <li key={s.slug} data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={orbitImage(s.slug)} alt="" loading="lazy" className="mx-auto h-56 w-auto object-contain" />
              <p className="mt-6 font-mono text-[11px] text-accent">{s.index}</p>
              <h3 className="wide mt-2 text-[1.7rem] leading-none text-paper">{s.shortTitle}</h3>
              <p className="mt-4 leading-relaxed text-mist/80">{s.summary}</p>
              <Link href={`/hizmetler/${s.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-accent">
                Detayları gör <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
