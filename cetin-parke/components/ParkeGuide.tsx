'use client';

import { useEffect, useRef } from 'react';
import { drawSwatch, patterns, tones, type PatternId } from '@/lib/floor';

const types = [
  { name: 'Laminant Parke', spec: '8 · 10 · 12 mm · AC4–AC5', text: 'HDF gövde üzerine ahşap desenli dekor ve aşınmaya dayanıklı üst katman. Fiyat/performansta en çok tercih edilen parke; çizilmeye ve darbeye dirençli, bakımı kolay.' },
  { name: 'Lamine Parke', spec: 'Gerçek ahşap üst katman', text: 'Üst yüzeyi gerçek ağaçtan (meşe, ceviz…) ince bir katman, altı çok katlı gövde. Masif görünümü daha dengeli bir bütçeyle sunar.' },
  { name: 'Masif Parke', spec: 'Tek parça doğal ahşap', text: 'Baştan sona tek parça ahşap. Yıllar içinde sistre ve cila ile yenilenebilir; en uzun ömürlü ve en doğal seçenektir.' },
  { name: 'SPC / Su Geçirmez', spec: 'Taş-polimer gövde', text: 'Suya ve neme dayanıklı gövde sayesinde mutfak, antre ve ıslak hacimlere yakın alanlarda gönül rahatlığıyla kullanılır.' },
];

const steps = [
  { no: '01', name: 'Keşif & ölçü', text: 'Mekânınızı yerinde ölçer, zeminin düzgünlüğünü ve nemini kontrol ederiz.' },
  { no: '02', name: 'Zemin hazırlığı', text: 'Gerekirse tesviye yapılır; nem bariyeri ve ses yalıtımlı şilte serilir.' },
  { no: '03', name: 'Döşeme', text: 'Seçtiğiniz dizilim, dilatasyon payları bırakılarak titizlikle uygulanır.' },
  { no: '04', name: 'Süpürgelik & teslim', text: 'Uyumlu süpürgelik, eşik ve profiller takılır; temiz teslim edilir.' },
];

const faq = [
  { q: 'Laminant parkenin ömrü ne kadar?', a: 'Doğru zemin hazırlığı ve normal kullanımda laminant parke genellikle 10–20 yıl sorunsuz kullanılır. Aşınma sınıfı (AC4, AC5) yükseldikçe yoğun kullanıma dayanımı artar.' },
  { q: 'Kaç mm parke seçmeliyim?', a: 'Konutlarda 8 mm yaygın ve yeterlidir. Daha sağlam bir his ve daha iyi ses yalıtımı için 10–12 mm tercih edilir. Yoğun trafikli alanlarda AC5 / 33. sınıf önerilir.' },
  { q: 'Yerden ısıtmalı zemine parke olur mu?', a: 'Olur. Yerden ısıtmaya uygun belgeli ürün ve uygun şilte ile döşenmesi yeterlidir; seçimi keşif sırasında birlikte yaparız.' },
  { q: 'Balıksırtı için ne kadar fazla malzeme gerekir?', a: 'Düz döşemede yaklaşık %5, çapraz ve balıksırtında %10, Macar kesimde %12 civarında kesim payı eklenir. Kesin miktar ölçüden sonra çıkarılır.' },
  { q: 'Parke ne kadar sürede döşenir?', a: 'Ortalama bir daire (80–120 m²) zemin uygunsa çoğu zaman 1–2 gün içinde tamamlanır. Balıksırtı gibi detaylı dizilimler biraz daha uzun sürer.' },
];

function Swatch({ id, hex }: { id: PatternId; hex: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) drawSwatch(ref.current, id, hex, id === 'duz' || id === 'capraz' ? 2.4 : 1.5); }, [id, hex]);
  return <canvas ref={ref} width={420} height={300} aria-hidden="true" />;
}

export default function ParkeGuide() {
  return <section id="rehber" className="guide-section section-pad" aria-labelledby="rehber-title">
    <div className="guide-head">
      <p className="section-tag reveal-in"><span className="tag-dot" /> PARKE REHBERİ</p>
      <h2 id="rehber-title" className="guide-title reveal-in">Doğru zemin,<br /><em>doğru seçimle başlar.</em></h2>
      <p className="guide-lead reveal-in">Tür, dizilim, renk ve kalınlık. Karar vermeden önce bilmeniz gerekenleri sade bir dille topladık.</p>
    </div>

    <h3 className="guide-sub">Parke türleri</h3>
    <div className="type-grid">{types.map(x => <article key={x.name} className="type-card reveal-in"><span>{x.spec}</span><h4>{x.name}</h4><p>{x.text}</p></article>)}</div>

    <h3 className="guide-sub">Dizilim (döşeme şekli)</h3>
    <div className="pattern-grid">{patterns.map(x => <figure key={x.id} className="pattern-card reveal-in"><Swatch id={x.id} hex="#c9a173" /><figcaption><strong>{x.name}</strong><span>{x.note}</span></figcaption></figure>)}</div>

    <h3 className="guide-sub">Renk tonları</h3>
    <div className="tone-grid">{tones.map(x => <div key={x.id} className="tone-card reveal-in"><span className="tone-chip" style={{ background: x.hex }} /><strong>{x.name}</strong><span>{x.note}</span></div>)}</div>
    <p className="guide-hint">İpucu: Açık tonlar küçük ve az ışık alan odaları ferah gösterir; koyu tonlar geniş, aydınlık salonlarda karakter katar. Kapı ve süpürgelik rengini zeminle birlikte düşünün.</p>

    <h3 className="guide-sub">Teknik bilgiler</h3>
    <div className="spec-table">
      <div><span>Kalınlık</span><p>8 mm (standart konut) · 10 mm · 12 mm (daha sağlam his, daha iyi ses yalıtımı)</p></div>
      <div><span>Aşınma sınıfı</span><p>AC3 hafif kullanım · AC4 / 32. sınıf konut ve ofis · AC5 / 33. sınıf yoğun trafik</p></div>
      <div><span>Tamamlayıcılar</span><p>Süpürgelik, eşik profilleri, nem bariyeri ve ses yalıtımlı şilte</p></div>
      <div><span>Diğer ürünler</span><p>Duvar paneli, iç kapı ve banyo çözümleri — aynı ekipten, uyumlu renklerle</p></div>
    </div>

    <h3 className="guide-sub">Uygulama süreci</h3>
    <ol className="step-grid">{steps.map(x => <li key={x.no} className="reveal-in"><span>{x.no}</span><strong>{x.name}</strong><p>{x.text}</p></li>)}</ol>

    <h3 className="guide-sub">Sık sorulan sorular</h3>
    <div className="faq">{faq.map(x => <details key={x.q}><summary>{x.q}</summary><p>{x.a}</p></details>)}</div>
  </section>;
}
