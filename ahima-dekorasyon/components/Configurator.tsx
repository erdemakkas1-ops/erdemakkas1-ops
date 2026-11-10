'use client';

import { useEffect, useRef, useState } from 'react';
import { media } from '@/lib/media';
import { whatsappLink } from '@/lib/site';
import { goTo } from './SmoothScroll';

const TILES = [
  { id: 'marble', name: 'Beyaz mermer', note: 'Parlak porselen, ince gri damarlar. Işığı yansıtır, küçük banyoyu ferah gösterir.' },
  { id: 'anthra', name: 'Antrasit taş', note: 'Mat, ince taneli koyu yüzey. Ceviz ve pirinç detaylarla sıcak bir kontrast kurar.' },
  { id: 'beige', name: 'Bej doğal taş', note: 'Traverten dokulu, yumuşak katmanlı bej. Sıcak, sakin ve zamansız.' },
] as const;
const CABINETS = [
  { id: 'ceviz', name: 'Ceviz', note: 'Doğal ceviz kaplama, yatay damar.' },
  { id: 'beyaz', name: 'Mat beyaz', note: 'İpeksi mat lake, sade ve aydınlık.' },
  { id: 'antrasit', name: 'Antrasit', note: 'Mat koyu lake, güçlü ve modern.' },
] as const;
type TileId = (typeof TILES)[number]['id'];
type CabId = (typeof CABINETS)[number]['id'];

export type QuotePrefill = { services?: string[]; note?: string };
export const prefillQuote = (detail: QuotePrefill) => window.dispatchEvent(new CustomEvent<QuotePrefill>('ahima:quote', { detail }));

/**
 * Nine path-traced renders of the same bathroom (3 tiles x 3 cabinet finishes), same camera.
 * Choosing an option cross-fades to the matching render; every option is a real, different image.
 */
export default function Configurator() {
  const [tile, setTile] = useState<TileId>('marble');
  const [cab, setCab] = useState<CabId>('ceviz');
  const [shown, setShown] = useState<{ a: string; b: string; top: 'a' | 'b' }>({ a: media.config('marble', 'ceviz'), b: media.config('marble', 'ceviz'), top: 'a' });
  const root = useRef<HTMLElement>(null);

  // preload all nine when the section approaches, so switching is instant
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      io.disconnect();
      for (const t of TILES) for (const c of CABINETS) { const i = new Image(); i.decoding = 'async'; i.src = media.config(t.id, c.id); }
    }, { rootMargin: '120% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const src = media.config(tile, cab);
    setShown(s => {
      const cur = s.top === 'a' ? s.a : s.b;
      if (cur === src) return s;
      return s.top === 'a' ? { a: s.a, b: src, top: 'b' } : { a: src, b: s.b, top: 'a' };
    });
  }, [tile, cab]);

  const t = TILES.find(x => x.id === tile)!;
  const c = CABINETS.find(x => x.id === cab)!;
  const summary = `${t.name} seramik + ${c.name.toLocaleLowerCase('tr-TR')} banyo dolabı`;
  const waText = `Merhaba, Ahima Dekorasyon web sitenizdeki banyo tasarlayıcıda şu kombinasyonu seçtim: ${summary}. Banyom için keşif ve fiyat teklifi almak istiyorum.`;

  return (
    <section ref={root} id="tasarla" className="gutter bg-sand/60 py-[clamp(80px,11vw,170px)]" aria-labelledby="tasarla-title">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-wood md:col-span-3">§ 03 — Tasarla</p>
        <h2 id="tasarla-title" className="display col-span-12 text-[clamp(40px,5.4vw,88px)] md:col-span-9">Banyonuzu Kendi Tarzınıza Göre <em className="text-wood">Keşfedin.</em></h2>
      </div>

      <div className="mt-[clamp(36px,5vw,72px)] grid grid-cols-12 gap-x-[clamp(20px,3vw,48px)] gap-y-8">
        <figure className="col-span-12 lg:col-span-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone">
            <span className="label absolute inset-0 grid place-items-center text-ink/50">Render hazırlanıyor</span>
            {(['a', 'b'] as const).map(k => (
              <img key={k} src={shown[k]} alt={shown.top === k ? `Banyo önizlemesi: ${summary}` : ''} aria-hidden={shown.top !== k}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                style={{ opacity: shown.top === k ? 1 : 0 }} decoding="async" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
            ))}
            <span className="label absolute left-4 top-4 bg-paper px-3 py-2 text-[10px] text-ink" aria-live="polite">{summary}</span>
          </div>
          <figcaption className="label mt-3 text-[10px] text-ash">Konsept görselleştirme — 9 kombinasyonun her biri aynı 3D banyonun ayrı render’ıdır.</figcaption>
        </figure>

        <div className="col-span-12 flex flex-col gap-9 lg:col-span-4">
          <fieldset>
            <legend className="label mb-4 text-ink/60">Seramik — duvar, zemin ve tezgâh</legend>
            <div className="grid gap-2 max-lg:grid-cols-3 max-[560px]:grid-cols-1">
              {TILES.map(o => (
                <button key={o.id} type="button" className="swatch" aria-pressed={tile === o.id} onClick={() => setTile(o.id)}>
                  <span className="swatch-chip" style={{ backgroundImage: `url(${media.swatch(o.id)})` }} aria-hidden />
                  <span><span className="block text-[15px] font-semibold">{o.name}</span><span className="mt-1 block text-[12.5px] leading-snug text-ink/60 max-lg:hidden max-[560px]:block">{o.note}</span></span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label mb-4 text-ink/60">Banyo dolabı</legend>
            <div className="grid grid-cols-3 gap-2">
              {CABINETS.map(o => (
                <button key={o.id} type="button" className="swatch !grid-cols-1 !gap-2" aria-pressed={cab === o.id} onClick={() => setCab(o.id)}>
                  <span className="swatch-chip !h-12 !w-full" style={{ backgroundImage: `url(${media.swatch(o.id)})` }} aria-hidden />
                  <span className="text-[14px] font-semibold">{o.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-ink/60">{c.note}</p>
          </fieldset>
          <div className="border-t border-ink/15 pt-6">
            <p className="label text-ink/50">Seçiminiz</p>
            <p className="display mt-2 text-[28px]">{t.name} <span className="text-ink/40">+</span> {c.name}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row lg:flex-col">
              <a className="btn btn-ink" href={whatsappLink(waText)} target="_blank" rel="noreferrer">Bu kombinasyonla teklif al <span className="arrow" aria-hidden>→</span></a>
              <button type="button" className="btn btn-line" onClick={() => { prefillQuote({ services: ['Banyo Dekorasyonu'], note: `Tasarlayıcı seçimi: ${summary}.` }); goTo('teklif'); }}>
                Teklif formuna ekle <span className="arrow" aria-hidden>↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
