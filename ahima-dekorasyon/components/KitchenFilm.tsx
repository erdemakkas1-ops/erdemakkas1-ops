'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { media } from '@/lib/media';
import { useFrameSequence } from '@/lib/useFrameSequence';

gsap.registerPlugin(ScrollTrigger);

/* Windows in film time, matching scripts/kitchen.py */
const PARTS = [
  { name: 'Mutfak dolapları', text: 'Antrasit mat alt modüller, ceviz boy dolaplar; kulpsuz kapaklar ve pirinç profil.', from: 0.1, to: 0.3 },
  { name: 'Tezgâh ve tezgâh arası', text: 'Mermer görünümlü porselen tezgâh, tezgâh arasında üst dolaba kadar tek parça plaka.', from: 0.3, to: 0.47 },
  { name: 'Ankastre cihazlar', text: 'Boy dolaba gömülü fırın ve mikrodalga, ceviz üst dolaplar.', from: 0.47, to: 0.63 },
  { name: 'Mutfak adası', text: 'Şelale uçlu ada, ocak ve geniş çalışma yüzeyi.', from: 0.63, to: 0.77 },
  { name: 'Gizli LED aydınlatma', text: 'Üst dolap altı LED tezgâhı yıkar; ada üstü sarkıtlar ve spotlar akşam atmosferini kurar.', from: 0.77, to: 1.01 },
];
const clamp = (x: number) => Math.min(1, Math.max(0, x));

export default function KitchenFilm() {
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [reduce, setReduce] = useState(false);
  const { canvasRef, seek } = useFrameSequence(media.kitchen.desktop, media.kitchen.mobile, { focusX: 0.5 });

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (reduce) { seek(1); return; }
    const update = (p: number) => {
      const s = clamp((p - 0.08) / 0.8);
      seek(s);
      PARTS.forEach((pt, i) => {
        const el = rows.current[i];
        if (!el) return;
        const state = s >= pt.to ? 'done' : s >= pt.from ? 'on' : 'off';
        if (el.dataset.state !== state) el.dataset.state = state;
      });
    };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: section.current, start: 'top top', end: 'bottom bottom', onUpdate: self => update(self.progress), onRefresh: self => update(self.progress) });
    }, section);
    update(0);
    return () => ctx.revert();
  }, [reduce, seek]);

  return (
    <section ref={section} id="mutfak" className={`stage bg-ink text-paper ${reduce ? '' : 'h-[420vh] max-[700px]:h-[360vh]'}`} aria-labelledby="mutfak-title">
      <div className={reduce ? 'relative h-svh overflow-hidden' : 'stage-pin'}>
        <canvas ref={canvasRef} className="film-canvas" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,19,17,.82)_0%,rgba(20,19,17,.45)_34%,rgba(20,19,17,0)_60%)] max-[700px]:bg-[linear-gradient(0deg,rgba(20,19,17,.9)_0%,rgba(20,19,17,.5)_45%,rgba(20,19,17,0)_70%)]" />
        <div className="gutter absolute inset-y-0 left-0 flex w-[min(560px,100%)] flex-col justify-center max-[700px]:justify-end max-[700px]:pb-[96px]">
          <p className="label text-brass-soft">§ 02 — Mutfak</p>
          <h2 id="mutfak-title" className="display mt-5 text-[clamp(38px,4.6vw,76px)]">Mutfakta da <em className="text-brass-soft">aynı titizlik.</em></h2>
          <ol className="mt-8 space-y-0 border-t border-paper/20 max-[700px]:mt-5">
            {PARTS.map((pt, i) => (
              <li key={pt.name} ref={el => { rows.current[i] = el; }} data-state={reduce ? 'done' : 'off'}
                className="group border-b border-paper/20 py-4 transition-colors duration-500 data-[state=off]:text-paper/35 max-[700px]:py-2.5">
                <div className="flex items-baseline gap-4">
                  <span className="label text-[10px] text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[17px] font-medium max-[700px]:text-[15px]">{pt.name}</span>
                </div>
                <p className="grid grid-rows-[0fr] pl-9 text-[14px] leading-relaxed text-paper/70 transition-[grid-template-rows] duration-500 group-data-[state=on]:grid-rows-[1fr]">
                  <span className="overflow-hidden">{pt.text}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
        <p className="label absolute bottom-6 right-[var(--gutter)] text-[10px] text-paper/55 max-[700px]:hidden">Konsept görselleştirme · 3D render</p>
      </div>
    </section>
  );
}
