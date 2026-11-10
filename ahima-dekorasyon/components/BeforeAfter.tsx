'use client';

import { useRef, useState } from 'react';
import { media } from '@/lib/media';

/** Same room, same camera: the old bathroom and the finished one, compared with a slider. */
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <section id="once-sonra" className="gutter bg-paper py-[clamp(80px,12vw,180px)]" aria-labelledby="ba-title">
      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 text-wood md:col-span-3">§ 01 — Önce / Sonra</p>
        <h2 id="ba-title" className="display col-span-12 text-[clamp(40px,5.6vw,92px)] md:col-span-9">Aynı banyo. Aynı açı. <em className="text-wood">Bambaşka bir his.</em></h2>
        <p className="col-span-12 max-w-[52ch] text-[17px] leading-relaxed text-ink/70 md:col-span-6 md:col-start-4">
          Sürgüyü kaydırın: solda yıllanmış küçük fayanslı banyo, sağda aynı ölçülerde 60×120 porselen, ceviz asma dolap ve gizli LED ile yeniden kurgulanmış hâli.
        </p>
      </div>
      <div
        ref={box}
        className="ba mt-[clamp(40px,6vw,80px)] aspect-[16/9] w-full bg-sand max-[700px]:aspect-[4/5]"
        onPointerDown={e => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); drag(e.clientX); }}
        onPointerMove={e => { if (e.buttons) drag(e.clientX); }}
      >
        <img src={media.config('marble', 'ceviz')} alt="Yenilenmiş banyo: beyaz mermer seramik, ceviz asma dolap, aydınlatmalı ayna ve walk-in duşakabin" loading="lazy" decoding="async" />
        <img src={media.before} alt="Yenileme öncesi banyo: küçük beyaz fayans, ayaklı lavabo, küvet ve perde" loading="lazy" decoding="async" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <div className="ba-handle" style={{ left: `${pos}%` }}>
          <span className="ba-knob label" aria-hidden>⟷</span>
        </div>
        <span className="label pointer-events-none absolute left-4 top-4 bg-ink/80 px-3 py-2 text-paper">Önce</span>
        <span className="label pointer-events-none absolute right-4 top-4 bg-paper px-3 py-2 text-ink">Sonra</span>
        <input type="range" min={0} max={100} step={0.5} value={pos} onChange={e => setPos(+e.target.value)} aria-label="Önce ve sonra görüntüsünü karşılaştırma sürgüsü" />
      </div>
      <p className="label mt-4 text-[10px] text-ash">Konsept görselleştirme — iki görüntü de aynı 3D modelden, aynı kamera ile üretilmiştir.</p>
    </section>
  );
}
