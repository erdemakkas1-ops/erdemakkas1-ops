'use client';

import { useEffect, useRef } from 'react';
import { story, STAGES, stageIndex, smoothstep } from '@/lib/story';

/**
 * DOM layer over the canvas. It never re-renders while scrolling: a rAF loop reads story.p and writes
 * opacity/transform straight to the elements, so the overlay rewinds exactly like the 3D scene.
 */
const CAPTION_WINDOWS: [number, number][] = [
  [-1, -1], // stage 0 uses the hero
  [0.13, 0.33],
  [0.38, 0.69],
  [0.75, 0.925],
];

export default function Overlay({ onStage }: { onStage: (p: number) => void }) {
  const hero = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const railItems = useRef<(HTMLButtonElement | null)[]>([]);
  const final = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastStage = -1;
    const loop = () => {
      const p = story.p;
      if (hero.current) {
        const o = 1 - smoothstep(0.015, 0.075, p);
        hero.current.style.opacity = String(o);
        hero.current.style.transform = `translate3d(0, ${(-30 * (1 - o)).toFixed(1)}px, 0)`;
        hero.current.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      }
      if (hint.current) hint.current.style.opacity = String(1 - smoothstep(0.005, 0.03, p));
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      captions.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = CAPTION_WINDOWS[i];
        const o = a < 0 ? 0 : smoothstep(a, a + 0.03, p) * (1 - smoothstep(b - 0.03, b, p));
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(18 * (1 - o)).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      });
      if (final.current) {
        const o = smoothstep(0.945, 0.985, p);
        final.current.style.opacity = String(o);
        final.current.style.transform = `translate3d(0, ${(20 * (1 - o)).toFixed(1)}px, 0)`;
        final.current.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      }
      const s = stageIndex(p);
      if (s !== lastStage) {
        lastStage = s;
        railItems.current.forEach((el, i) => {
          if (!el) return;
          el.classList.toggle('is-active', i === s);
          el.classList.toggle('is-done', i < s);
          if (i === s) el.setAttribute('aria-current', 'step');
          else el.removeAttribute('aria-current');
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="overlay">
      <div className="hero" ref={hero}>
        <p className="eyebrow">
          <span className="eyebrow__rule" /> Ahima Dekorasyon
        </p>
        <h1>
          Mekân, sizinle
          <br />
          anlam kazanır.
        </h1>
        <p className="hero__sub">Boş bir alandan kendinize ait bir dünyaya.</p>
        <a className="btn btn--gold" href="#donusum" onClick={(e) => (e.preventDefault(), onStage(0.2))}>
          Dönüşümü keşfet <span aria-hidden>↓</span>
        </a>
      </div>

      {STAGES.map((s, i) => (
        <div
          key={s.id}
          className="caption"
          ref={(el) => {
            captions.current[i] = el;
          }}
          aria-hidden={i === 0}
        >
          <p className="caption__no">{s.no}</p>
          <div>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </div>
        </div>
      ))}

      <div className="final" ref={final}>
        <p className="eyebrow">
          <span className="eyebrow__rule" /> Tamamlanmış yaşam alanı
        </p>
        <h2>Hayal ettiğiniz yaşam alanı, gözlerinizin önünde şekillendi.</h2>
        <div className="final__actions">
          <a className="btn btn--gold" href="#iletisim">
            Projenizi birlikte konuşalım <span aria-hidden>→</span>
          </a>
          <button type="button" className="btn btn--ghost" onClick={() => onStage(0)}>
            Başa sar ↺
          </button>
        </div>
      </div>

      <nav className="rail" aria-label="Dönüşüm aşamaları">
        <div className="rail__track">
          <span className="rail__fill" ref={fill} />
        </div>
        <ol>
          {STAGES.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                ref={(el) => {
                  railItems.current[i] = el;
                }}
                onClick={() => onStage(s.at)}
              >
                <span className="rail__dot" />
                <span className="rail__label">{s.rail}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="rail__pct">
          <span ref={pct}>00</span>%
        </p>
      </nav>

      <div className="scroll-hint" ref={hint} aria-hidden>
        <span className="scroll-hint__mouse">
          <i />
        </span>
        Aşağı kaydırın
        <small>Mekânın dönüşümünü izleyin</small>
      </div>

      <p className="demo-badge">Demo görselleştirme · örnek yaşam alanı</p>
    </div>
  );
}
