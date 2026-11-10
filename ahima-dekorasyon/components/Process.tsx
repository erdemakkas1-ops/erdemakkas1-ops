const STEPS = [
  { t: 'Ücretsiz keşif', d: 'Mekânı yerinde görür, ölçü alır, beklentinizi dinleriz.' },
  { t: 'Proje ve malzeme', d: 'Seramik, dolap ve armatür seçeneklerini birlikte belirler; iş kalemlerini netleştiririz.' },
  { t: 'Uygulama', d: 'Söküm, tesisat, kaplama ve montaj; ilerlemeyi düzenli olarak paylaşırız.' },
  { t: 'Teslim', d: 'Temizlik ve son kontrollerin ardından mekânı anahtarıyla teslim ederiz.' },
];

export default function Process() {
  return (
    <section id="surec" className="gutter bg-sand/60 py-[clamp(70px,9vw,140px)]" aria-labelledby="surec-title">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-wood md:col-span-3">§ 06 — Süreç</p>
        <h2 id="surec-title" className="display col-span-12 text-[clamp(34px,4vw,64px)] md:col-span-9">Dört adımda, <em className="text-wood">tek muhatapla.</em></h2>
      </div>
      <ol className="mt-[clamp(36px,5vw,72px)] grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.t} className="border-b border-ink/15 py-7 sm:pr-8 lg:border-b-0 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
            <span className="label text-wood">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display mt-4 text-[28px]">{s.t}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
