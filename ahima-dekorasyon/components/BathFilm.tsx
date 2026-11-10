'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { media } from '@/lib/media';
import { useFrameSequence } from '@/lib/useFrameSequence';

gsap.registerPlugin(ScrollTrigger);

/* Stage windows are in film time s (0..1) and match the build order in scripts/bathroom.py. */
const STAGES = [
  { no: '01', name: 'Söküm', from: 0.09, to: 0.215, title: 'Önce eskiyi sökeriz.', text: 'Eski seramikler, küvet ve armatürler sökülür; tesisat yenilenir, duvar ve zemin yeni kaplamaya hazırlanır.' },
  { no: '02', name: 'Seramik', from: 0.215, to: 0.475, title: '60×120 porselen, sıra sıra.', text: 'Büyük ebatlı seramikler önce duvarlara alttan yukarı, ardından zemine içeriden kapıya doğru döşenir. Derzler ince, hizalar tek çizgide.' },
  { no: '03', name: 'Lavabo & dolap', from: 0.475, to: 0.595, title: 'Asma dolap, taş tezgâh.', text: 'Ceviz asma dolap duvara sabitlenir, tezgâh aynı seramikten kesilir; tezgâh üstü lavabo ve ankastre batarya yerine oturur.' },
  { no: '04', name: 'Duşakabin & armatür', from: 0.595, to: 0.715, title: 'Walk-in cam, tavandan yağmur.', text: 'Sabit cam panel, gömme ankastre batarya, tepe duşu, lineer gider ve pirinç havlupan.' },
  { no: '05', name: 'Ayna & detay', from: 0.715, to: 0.815, title: 'Son dokunuşlar.', text: 'Asma tavan, aydınlatmalı ayna, havlular, bitki ve banyo paspası: mekân yaşanır hâle gelir.' },
  { no: '06', name: 'Aydınlatma', from: 0.815, to: 0.95, title: 'Ve ışıklar yanar.', text: 'Asma tavandaki gizli LED duvarları yıkar, ayna arkadan parlar, spotlar tezgâhı vurgular.' },
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const FILM_START = 0.04;
const FILM_END = 0.88;

export default function BathFilm() {
  const section = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const finale = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const stepNo = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [reduce, setReduce] = useState(false);
  const { canvasRef, seek } = useFrameSequence(media.bath.desktop, media.bath.mobile, { eager: true, focusX: 0.42 });

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduce) { seek(1); return; }
    const update = (p: number) => {
      const s = clamp((p - FILM_START) / (FILM_END - FILM_START));
      seek(s);
      const heroOut = smooth(0.012, 0.05, p);
      if (hero.current) {
        hero.current.style.opacity = String(1 - heroOut);
        hero.current.style.transform = `translateY(${-40 * heroOut}px)`;
        hero.current.style.visibility = heroOut > 0.99 ? 'hidden' : 'visible';
      }
      const fin = smooth(0.9, 0.95, p);
      if (finale.current) {
        finale.current.style.opacity = String(fin);
        finale.current.style.transform = `translateY(${30 * (1 - fin)}px)`;
        finale.current.style.visibility = fin < 0.01 ? 'hidden' : 'visible';
      }
      if (scrim.current) scrim.current.style.opacity = String(Math.max(1 - heroOut, fin) * 0.9 + 0.1);
      if (hud.current) hud.current.style.opacity = String(smooth(0.04, 0.07, p) * (1 - smooth(0.88, 0.91, p)));
      let active = -1;
      STAGES.forEach((st, i) => {
        const o = smooth(st.from, st.from + 0.015, s) * (1 - smooth(st.to - 0.015, st.to, s));
        const el = caps.current[i];
        if (el) {
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 18}px)`;
          el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        }
        const f = fills.current[i];
        if (f) f.style.transform = `scaleX(${clamp((s - st.from) / (st.to - st.from))})`;
        if (s >= st.from) active = i;
      });
      if (stepNo.current) stepNo.current.textContent = active < 0 ? '00' : STAGES[active].no;
      if (pct.current) pct.current.textContent = String(Math.round(smooth(0.09, 0.95, s) * 100));
    };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: section.current, start: 'top top', end: 'bottom bottom', onUpdate: self => update(self.progress), onRefresh: self => update(self.progress) });
    }, section);
    update(0);
    return () => ctx.revert();
  }, [reduce, seek]);

  return (
    <section ref={section} id="donusum" aria-label="Eski banyodan lüks banyoya: kaydırarak yönettiğiniz dönüşüm" className={`stage bg-ink text-paper ${reduce ? 'h-svh' : 'h-[820vh] max-[700px]:h-[680vh]'}`}>
      <div className="stage-pin">
        <canvas ref={canvasRef} className="film-canvas" aria-hidden="true" />
        <div ref={scrim} className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,19,17,.78)_0%,rgba(20,19,17,.35)_48%,rgba(20,19,17,0)_75%),linear-gradient(0deg,rgba(20,19,17,.55)_0%,rgba(20,19,17,0)_30%)]" />

        {/* Scene 1 - hero */}
        <div ref={hero} id="ust" className="gutter absolute inset-x-0 top-[calc(var(--header-h)+6vh)] max-[700px]:top-[calc(var(--header-h)+3vh)]">
          <p className="label fade-in text-brass-soft">Ankara · Anahtar teslim tadilat & dekorasyon</p>
          <h1 className="display mt-6 max-w-[15ch] text-[clamp(44px,7.4vw,124px)]">
            <span className="mask"><span>Hayalinizdeki Mekânı</span></span>
            <span className="mask"><span><em className="text-brass-soft">Gerçeğe</em> Dönüştürüyoruz.</span></span>
          </h1>
          <p className="fade-in mt-7 max-w-[46ch] text-[clamp(15px,1.25vw,19px)] leading-relaxed text-paper/85">
            Anahtar teslim tadilat, modern dekorasyon ve kaliteli yapı malzemeleriyle yaşam alanlarınıza yeni bir başlangıç.
          </p>
          <div className="fade-in mt-9 flex flex-wrap gap-3">
            <a href="#projeler" className="btn btn-solid">Projelerimizi Keşfet <span className="arrow" aria-hidden>→</span></a>
            <a href="#teklif" className="btn btn-line">Ücretsiz Keşif Talep Et <span className="arrow" aria-hidden>→</span></a>
          </div>
          {!reduce && (
            <p className="label fade-in mt-[9vh] flex items-center gap-4 text-paper/70 max-[700px]:mt-8">
              <span className="inline-block h-px w-10 bg-brass" />Aşağı kaydırın — dönüşümü siz yönetin
            </p>
          )}
        </div>

        {/* Scene 2 - the renovation, one caption per stage */}
        {!reduce && STAGES.map((st, i) => (
          <div key={st.no} ref={el => { caps.current[i] = el; }} className="absolute bottom-[calc(96px+4vh)] left-[var(--gutter)] w-[min(440px,calc(100vw-40px))] bg-paper p-7 text-ink invisible opacity-0 max-[700px]:bottom-[112px] max-[700px]:p-5" aria-hidden="true">
            <p className="label text-wood">{st.no} / 06 — {st.name}</p>
            <h2 className="display mt-3 text-[clamp(28px,2.6vw,40px)]">{st.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75 max-[700px]:text-[14px]">{st.text}</p>
          </div>
        ))}

        {/* progress HUD */}
        {!reduce && (
          <div ref={hud} className="gutter pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(20,19,17,.72),rgba(20,19,17,0))] pb-7 pt-24 opacity-0 min-[701px]:pr-[150px] max-[700px]:pb-6 max-[700px]:pr-[84px]" aria-hidden="true">
            <div className="mb-4 flex items-end justify-between">
              <p className="label text-paper/80">Aşama <span ref={stepNo} className="text-paper">00</span> / 06</p>
              <p className="display text-[clamp(28px,3vw,46px)]"><span ref={pct}>0</span><span className="text-brass-soft">%</span></p>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {STAGES.map((st, i) => (
                <div key={st.no}>
                  <div className="relative h-px overflow-hidden bg-paper/25"><span ref={el => { fills.current[i] = el; }} className="absolute inset-0 origin-left scale-x-0 bg-brass" /></div>
                  <p className="label mt-3 truncate text-[10px] text-paper/60 max-[900px]:hidden">{st.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scene 3 - finale */}
        <div ref={finale} className={`gutter absolute inset-x-0 top-1/2 -translate-y-1/2 ${reduce ? 'hidden' : 'invisible opacity-0'}`}>
          <p className="label text-brass-soft">Sonuç</p>
          <h2 className="display mt-6 max-w-[16ch] text-[clamp(40px,6.2vw,104px)]">Sadece Yenilemiyoruz. <em className="text-brass-soft">Yaşam Alanınızı Yeniden Tasarlıyoruz.</em></h2>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#once-sonra" className="btn btn-solid">Önce / sonra karşılaştır <span className="arrow" aria-hidden>→</span></a>
            <a href="#tasarla" className="btn btn-line">Banyonu kendin tasarla <span className="arrow" aria-hidden>→</span></a>
          </div>
        </div>

        <p className="label absolute right-[var(--gutter)] top-[calc(var(--header-h)+12px)] text-[10px] text-paper/55 max-[700px]:hidden">Konsept görselleştirme · 3D render</p>
      </div>
    </section>
  );
}
