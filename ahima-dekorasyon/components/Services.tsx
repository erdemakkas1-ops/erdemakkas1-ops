'use client';

import { useEffect, useRef, useState } from 'react';
import { projectPhoto } from '@/lib/projects';
import { whatsappLink, type Service } from '@/lib/site';
import { goTo } from './SmoothScroll';
import { prefillQuote } from './Configurator';

const ITEMS: { name: Service; text: string; img: string; alt: string; detail: string }[] = [
  { name: 'Anahtar Teslim Tadilat', img: 'batikent-koridor', alt: 'Ahima uygulaması: gizli LED’li asma tavan ve mermer görünümlü zeminli koridor (Batıkent)',
    text: 'Söküm, tesisat, alçı ve boya, asma tavan, seramik, dolap ve aydınlatma. Tek muhatap, tek takvim; işi anahtarıyla teslim ederiz.',
    detail: 'Komple daire veya tek oda: önce yerinde keşif ve ölçü, ardından iş kalemleri ve malzeme listesiyle net bir teklif.' },
  { name: 'Banyo Dekorasyonu', img: 'incek-lavabo', alt: 'Ahima uygulaması: pudra pembe dolap ve altın detaylı lavabo (İncek)',
    text: 'Seramik seçiminden bataryaya, aydınlatmalı aynadan duşakabine kadar banyonuzu baştan tasarlayıp uyguluyoruz.',
    detail: 'Küçük banyolarda büyük ebatlı seramik, asma klozet ve asma dolapla ferahlık; ıslak hacimde doğru eğim ve sızdırmazlık.' },
  { name: 'Mutfak Dekorasyonu', img: 'batikent-mutfak', alt: 'Ahima uygulaması: LED’li asma tavan altında mermer tezgâhlı mutfak (Batıkent)',
    text: 'Ölçüye özel dolaplar, tezgâh ve tezgâh arası kaplamalar, ankastre yerleşim ve gizli LED aydınlatma.',
    detail: 'Cam kapaklı vitrin dolaplar, boy dolaplara gömülü cihazlar, üst dolap altı aydınlatma.' },
  { name: 'Seramik ve Zemin Kaplama', img: 'dus-siyah-mermer', alt: 'Ahima uygulaması: siyah mermer görünümlü duş duvarı',
    text: 'Büyük ebatlı porselen, mermer görünümlü ve doğal taş dokulu seramiklerde düzgün derz, doğru eğim, temiz kesim.',
    detail: 'Duvar, zemin, tezgâh ve merdiven kaplamaları; seçim için numune ve uygulama önerisi.' },
  { name: 'Duşakabin ve Banyo Ürünleri', img: 'batikent-dus', alt: 'Ahima uygulaması: cam duşakabin ve gri seramik (Batıkent)',
    text: 'Duşakabin, lavabo, klozet, batarya ve banyo dolapları: ürün seçimi ve montaj bir arada.',
    detail: 'Walk-in cam paneller, sürgülü kabinler, tezgâh üstü ve gömme lavabolar, ankastre bataryalar.' },
  { name: 'Yapı ve Dekorasyon Malzemeleri', img: 'lavabo-mermer', alt: 'Ahima uygulaması: mermer görünümlü çift gözlü lavabo ve kırmızı seramik duvar',
    text: 'Seramik, vitrifiye, armatür ve dekorasyon malzemelerinde doğru ürün, doğru miktar ve tedarik.',
    detail: 'Rüzgarlı’daki iş yerimizde ürünleri birlikte seçebilir, uygulamayla birlikte planlayabiliriz.' },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // the sticky picture follows the row nearest the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-45% 0px -45% 0px' });
    rows.current.forEach(r => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="hizmetler" className="gutter bg-paper py-[clamp(80px,11vw,170px)]" aria-labelledby="hizmet-title">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-wood md:col-span-3">§ 04 — Hizmetler</p>
        <h2 id="hizmet-title" className="display col-span-12 text-[clamp(40px,5.4vw,88px)] md:col-span-9">Söküm’den son <em className="text-wood">ışığa kadar.</em></h2>
      </div>
      <div className="mt-[clamp(40px,6vw,90px)] grid grid-cols-12 gap-x-[clamp(20px,4vw,72px)]">
        <ol className="col-span-12 border-t border-ink/15 lg:col-span-7">
          {ITEMS.map((it, i) => {
            const ph = projectPhoto(it.img);
            return (
              <li key={it.name} ref={el => { rows.current[i] = el; }} data-i={i} className="grid grid-cols-[48px_1fr] gap-x-4 border-b border-ink/15 py-[clamp(26px,3.4vw,46px)]">
                <span className="label pt-3 text-wood">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={`display text-[clamp(30px,3.3vw,52px)] transition-colors duration-500 ${active === i ? 'text-ink' : 'lg:text-ink/35'}`}>{it.name}</h3>
                  <p className="mt-4 max-w-[52ch] text-[16.5px] leading-relaxed text-ink/75">{it.text}</p>
                  <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-ink/55">{it.detail}</p>
                  <div className="photo mt-6 aspect-[4/5] w-full max-w-[420px] lg:hidden">
                    <img src={ph.src} alt={it.alt} loading="lazy" decoding="async" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[14px] font-semibold">
                    <a className="border-b border-ink pb-1 hover:text-wood" href={whatsappLink(`Merhaba, Ahima Dekorasyon web sitenizden ulaşıyorum. "${it.name}" hizmetiniz hakkında detaylı bilgi almak istiyorum.`)} target="_blank" rel="noreferrer">Detaylı bilgi al ↗</a>
                    <button type="button" className="border-b border-ink pb-1 hover:text-wood" onClick={() => { prefillQuote({ services: [it.name] }); goTo('teklif'); }}>Teklif iste ↓</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="col-span-5 max-lg:hidden">
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <div className="photo aspect-[4/5] w-full">
              {ITEMS.map((it, i) => (
                <img key={it.img} src={projectPhoto(it.img).src} alt={active === i ? it.alt : ''} aria-hidden={active !== i} loading="lazy" decoding="async"
                  className="!absolute inset-0 transition-opacity duration-700" style={{ opacity: active === i ? 1 : 0 }} />
              ))}
            </div>
            <p className="label mt-3 flex justify-between text-[10px] text-ash"><span>Ahima uygulaması · Instagram video karesi</span><span>{String(active + 1).padStart(2, '0')} / 06</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
