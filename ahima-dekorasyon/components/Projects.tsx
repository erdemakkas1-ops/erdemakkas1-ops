import { moreWork, projects } from '@/lib/projects';
import { business } from '@/lib/site';

/** Real, completed work only - every picture is a still from Ahima Dekorasyon's own Instagram reels. */
export default function Projects() {
  const [batikent, incek] = projects;
  return (
    <section id="projeler" className="bg-ink py-[clamp(80px,11vw,170px)] text-paper" aria-labelledby="projeler-title">
      <div className="gutter grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-brass-soft md:col-span-3">§ 05 — Gerçek projeler</p>
        <div className="col-span-12 md:col-span-9">
          <h2 id="projeler-title" className="display text-[clamp(40px,5.4vw,88px)]">Sahadan. <em className="text-brass-soft">Teslim edilmiş işler.</em></h2>
          <p className="mt-6 max-w-[60ch] text-[16px] leading-relaxed text-paper/65">
            Bu bölümdeki görsellerin tamamı Ahima Dekorasyon’un kendi Instagram videolarından alınmış karelerdir; her biri ilgili paylaşıma bağlanır.
            Sayfanın üst kısmındaki banyo ve mutfak sahneleri ise 3D konsept görselleştirmedir.
          </p>
        </div>
      </div>

      {/* Batıkent: one feature + a strip */}
      <article className="gutter mt-[clamp(48px,7vw,110px)]" aria-labelledby="p-batikent">
        <header className="flex flex-wrap items-end justify-between gap-4 border-t border-paper/15 pt-6">
          <div>
            <p className="label text-brass-soft">{batikent.place} · Ankara</p>
            <h3 id="p-batikent" className="display mt-3 text-[clamp(30px,3.4vw,54px)]">{batikent.title}</h3>
          </div>
          <a href={batikent.post} target="_blank" rel="noreferrer" className="label border-b border-paper/50 pb-1 text-paper/80 hover:text-brass-soft">Instagram’da izle ↗</a>
        </header>
        <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-paper/70">{batikent.summary}</p>
        <div className="mt-8 grid grid-cols-12 gap-3">
          <a href={batikent.post} target="_blank" rel="noreferrer" className="photo col-span-12 aspect-[4/5] md:col-span-5">
            <img src={batikent.photos[0].src} alt={batikent.photos[0].alt} loading="lazy" decoding="async" />
          </a>
          <div className="col-span-12 grid grid-cols-3 content-start gap-3 md:col-span-7">
            {batikent.photos.slice(1).map(ph => (
              <a key={ph.src} href={batikent.post} target="_blank" rel="noreferrer" className="photo aspect-[4/5]">
                <img src={ph.small} srcSet={`${ph.small} 360w, ${ph.src} 720w`} sizes="(max-width: 768px) 33vw, 20vw" alt={ph.alt} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* İncek */}
      <article className="gutter mt-[clamp(64px,8vw,130px)]" aria-labelledby="p-incek">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 border-t border-paper/15 pt-6 md:col-span-4">
            <p className="label text-brass-soft">{incek.place} · Ankara</p>
            <h3 id="p-incek" className="display mt-3 text-[clamp(30px,3.4vw,54px)]">{incek.title}</h3>
            <p className="mt-5 text-[16px] leading-relaxed text-paper/70">{incek.summary}</p>
            <a href={incek.post} target="_blank" rel="noreferrer" className="label mt-6 inline-block border-b border-paper/50 pb-1 text-paper/80 hover:text-brass-soft">Instagram’da izle ↗</a>
          </div>
          <div className="col-span-12 grid grid-cols-3 gap-3 md:col-span-8">
            {incek.photos.map((ph, i) => (
              <a key={ph.src} href={incek.post} target="_blank" rel="noreferrer" className={`photo aspect-[4/5] ${i === 1 ? 'md:translate-y-12' : ''}`}>
                <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* more work, side-scrolling */}
      <div className="mt-[clamp(80px,10vw,160px)]">
        <div className="gutter flex items-end justify-between gap-4 border-t border-paper/15 pt-6">
          <h3 className="display text-[clamp(26px,2.6vw,40px)]">Diğer uygulamalardan</h3>
          <a href={business.instagram} target="_blank" rel="noreferrer" className="label border-b border-paper/50 pb-1 text-paper/80 hover:text-brass-soft">{business.instagramHandle} ↗</a>
        </div>
        <div className="strip gutter mt-8 grid-cols-[repeat(6,minmax(240px,1fr))] max-lg:grid-cols-none max-lg:auto-cols-[min(68vw,300px)]" role="list">
          {moreWork.map(w => (
            <a key={w.src} href={w.post} target="_blank" rel="noreferrer" role="listitem" className="group block">
              <div className="photo aspect-[4/5]"><img src={w.small} srcSet={`${w.small} 360w, ${w.src} 720w`} sizes="(max-width: 1024px) 68vw, 16vw" alt={w.alt} loading="lazy" decoding="async" /></div>
              <p className="mt-3 text-[14px] text-paper/80 group-hover:text-brass-soft">{w.title} ↗</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
