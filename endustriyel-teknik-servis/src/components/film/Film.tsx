'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { FILM_DURATION, filmFinale, filmLabels, filmScenes } from '@/data/film';
import { serviceRequestHref } from '@/data/navigation';
import { assetPath } from '@/data/visuals';
import { CallButton, WhatsappCta } from '@/components/ui/CallButtons';
import { Ph } from '@/components/ui/Ph';
import { profile } from '@/data/site';
import type { FilmHandle } from './scene';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Sahne/etiket görünürlüğü: from'dan sonra 0.35 s içinde gelir, to'dan önce 0.35 s içinde gider */
const weight = (from: number, to: number, t: number, fade = 0.35) =>
  clamp01((t - from) / fade) * clamp01((to - t) / fade);

const FILM_MQ = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

/**
 * Maviron tarzı açılış filmi.
 * Masaüstü: bölüm 520vh; sahne `position: sticky` ile ekrana sabitlenir ve sayfa kaydırması
 * film saniyesine (0–10) eşlenir. Oynatma kafası yumuşatılarak takip eder; geri kaydırma geri sarar.
 * Mobil, reduced-motion, WebGL2 yok veya ?still: durağan poster + hero metni (pin yok).
 * Düzen CSS medya sorgusuyla belirlendiği için hidrasyonda kayma (CLS) olmaz.
 */
export function Film() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = root.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const params = new URLSearchParams(window.location.search);
    const capture = params.has('capture');
    const mq = window.matchMedia(FILM_MQ);
    const gl2 = (() => {
      try {
        return Boolean(document.createElement('canvas').getContext('webgl2'));
      } catch {
        return false;
      }
    })();
    if (!gl2 || params.has('still')) {
      section.classList.add('film--static');
      // Bölüm yüksekliği değişti: ScrollTrigger resize'ı dinler ve tetikleyici konumlarını yeniden hesaplar
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
      return;
    }

    let film: FilmHandle | null = null;
    let raf = 0;
    let disposed = false;
    let t = 0;
    let target = 0;
    let last = performance.now();
    let introStart = 0;
    let dirty = true;

    const scenes = Array.from(section.querySelectorAll<HTMLElement>('[data-from]'));
    const labels = Array.from(section.querySelectorAll<HTMLElement>('[data-at]')).map((el) => ({
      el,
      at: el.dataset.at!.split(',').map(Number) as [number, number, number],
      from: Number(el.dataset.lfrom),
      to: Number(el.dataset.lto),
    }));
    const hero = section.querySelector<HTMLElement>('[data-hero-scene]');
    const hint = section.querySelector<HTMLElement>('[data-film-hint]');

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp01(-rect.top / span) : 0;
      target = p * FILM_DURATION;
      dirty = true;
    };

    const paintOverlays = () => {
      if (hero) {
        const w = 1 - clamp01((t - 0.7) / 0.5);
        hero.style.opacity = String(w);
        hero.style.visibility = w < 0.01 ? 'hidden' : 'visible';
        hero.style.transform = `translateY(calc(-50% + ${(1 - w) * -30}px))`;
      }
      if (hint) hint.style.opacity = String(1 - clamp01(t / 0.4));
      for (const el of scenes) {
        const w = weight(Number(el.dataset.from), Number(el.dataset.to), t);
        el.style.opacity = String(w);
        el.style.visibility = w < 0.01 ? 'hidden' : 'visible';
        el.style.transform = `translateY(calc(-50% + ${(1 - w) * 24}px))`;
      }
      if (!film) return;
      for (const l of labels) {
        const w = weight(l.from, l.to, t, 0.3);
        const pt = film.project(l.at);
        l.el.style.opacity = pt.behind ? '0' : String(w);
        l.el.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
        l.el.style.setProperty('--o', String(w));
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (introStart && film) {
        const k = clamp01((now - introStart) / 2200);
        film.intro(k * k * (3 - 2 * k));
        if (k >= 1) introStart = 0;
      }
      const diff = target - t;
      if (Math.abs(diff) > 0.0005 || dirty) {
        t = Math.abs(diff) < 0.0005 ? target : t + diff * (1 - Math.exp(-dt * 7));
        film?.setTime(t);
        paintOverlays();
        dirty = false;
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      film?.resize(r.width, r.height);
      readScroll();
    };

    const start = async () => {
      const mod = await import('./scene');
      if (disposed) return;
      film = mod.createFilm(canvas);
      resize();
      film.setTime(t);
      section.classList.add('is-ready');
      introStart = capture ? 0 : performance.now();
      if (capture) film.intro(1);
      paintOverlays();
      raf = requestAnimationFrame(loop);
      if (capture) {
        (window as unknown as { __film: unknown }).__film = {
          part(tags: string[], dir: [number, number, number], highlight: string[] = []) {
            film!.capturePart(tags, dir, highlight);
          },
          seek(s: number, centered = false) {
            t = target = s;
            film!.setCentered(centered ? 1 : 0);
            film!.setTime(s);
            paintOverlays();
          },
        };
        document.documentElement.classList.add('film-capture');
      }
    };

    const onMq = () => {
      if (mq.matches && !film) start();
    };
    if (mq.matches) start();
    mq.addEventListener('change', onMq);
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', resize);
    readScroll();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      mq.removeEventListener('change', onMq);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', resize);
      film?.dispose();
    };
  }, []);

  return (
    <section ref={root} id="film" className="film" aria-labelledby="hero-baslik">
      <div className="film__stage">
        <picture>
          <source media="(orientation: portrait)" srcSet={assetPath('/images/film/poster-m.webp')} width={430} height={900} />
          <img className="film__poster" src={assetPath('/images/film/poster.webp')} width={1600} height={900} alt="" fetchPriority="high" />
        </picture>
        <canvas ref={canvasRef} className="film__canvas" aria-hidden="true" />

        {/* Hero metni */}
        <div className="film__scene film__scene--hero" data-hero-scene>
          <p className="eyebrow">Bağımsız teknik servis · Baskı &amp; ambalaj</p>
          <h1 id="hero-baslik" className="film__h1 wide">
            Üretiminiz
            <br />
            <em>durmasın.</em>
          </h1>
          <p className="film__lede">
            Ben <Ph f={profile.name} />. BOBST platin kesim ve manroland ofset makinelerinde elektrik, mekanik ve otomasyon
            arızalarına bakıyorum.
          </p>
          <div className="film__actions">
            <CallButton fallbackHref="#servis-talebi" />
            <WhatsappCta fallbackHref="#servis-talebi" />
          </div>
          <p className="film__bio">
            <Ph f={profile.experience} /> saha deneyimi · <Ph f={profile.base} /> · Elektrik · Mekanik · Otomasyon
          </p>
        </div>

        {filmScenes.map((s) => (
          <div key={s.eyebrow} className="film__scene" data-from={s.from} data-to={s.to}>
            <p className="eyebrow">{s.eyebrow}</p>
            <p className="film__title wide">
              {s.title[0]}
              <br />
              {s.title[1]}
              <br />
              <em>{s.title[2]}</em>
            </p>
            <p className="film__lede">{s.lede}</p>
            {'link' in s && s.link && (
              <Link href={s.link.href} className="film__link">
                {s.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        ))}

        <div className="film__scene" data-from={filmFinale.from} data-to={filmFinale.to}>
          <p className="eyebrow">04 · Kontrol ve teslim</p>
          <p className="film__title wide">
            Üretim
            <br />
            <em>devam etsin.</em>
          </p>
          <p className="film__lede">Makinenizi ve arızayı anlatın; telefonda ön değerlendirmeyle başlayalım.</p>
          <div className="film__actions">
            <CallButton fallbackHref="#servis-talebi" />
            <Link href={serviceRequestHref} className="btn btn-ghost">
              Arıza bildir <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="film__notes" aria-hidden="true">
          {filmLabels.map((l) => (
            <div
              key={l.title}
              className={`film__label ${l.left ? 'film__label--left' : ''}`}
              data-at={l.at.join(',')}
              data-lfrom={l.from}
              data-lto={l.to}
            >
              <span className="film__tag">
                <b>{l.title}</b>
                <small>{l.note}</small>
              </span>
            </div>
          ))}
        </div>

        <p className="film__hint" data-film-hint aria-hidden="true">
          Kaydırın
        </p>
      </div>
    </section>
  );
}
