'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Instagram, Menu, MoveUpRight, Phone, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { business, whatsappLink } from '@/lib/site';
import { media } from '@/lib/media';
import { ScrollFrameSequence } from './ScrollFrameSequence';
import FloorDesigner from './FloorDesigner';
import ParkeGuide from './ParkeGuide';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { no: '01', name: 'Parke', subtitle: 'Mekânın temelinde karakter.', image: media.productImages[0], slug: 'parke' },
  { no: '02', name: 'Duvar Paneli', subtitle: 'Duvarlarda doku ve sıcaklık.', image: media.productImages[3], slug: 'panel' },
  { no: '03', name: 'İç Kapılar', subtitle: 'Geçişlerde zarafet.', image: media.productImages[1], slug: 'kapi' },
  { no: '04', name: 'Banyo', subtitle: 'Dolap ve duşakabinde uyum.', image: media.productImages[2], slug: 'banyo' },
];

const filmStages = [
  { no: '01', name: 'Beton zemin', title: 'Her şey sağlam bir zeminle başlar.', text: 'Önce zemini ölçer, nemini ve düzgünlüğünü kontrol ederiz. Gerekirse tesviye, ardından nem bariyeri ve şilte.', from: 0.06, to: 0.2 },
  { no: '02', name: 'Parke döşeme', title: 'Tahta tahta, yerine oturuyor.', text: 'Balıksırtı dizilim; dilatasyon payları bırakılarak arka duvardan size doğru titizlikle döşenir.', from: 0.2, to: 0.58 },
  { no: '03', name: 'Salon', title: 'Mobilya geldiğinde zemin, mekânın karakteri olur.', text: 'Halı, koltuk, sehpa… Doğru ton ve dizilim, salonun tamamını taşır.', from: 0.58, to: 0.86 },
];
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const band = (p: number, a: number, b: number, f = 0.03) => smooth(a - f, a + f, p) * (1 - smooth(b - f, b + f, p));

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

export default function SiteExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [finalProgress, setFinalProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    const update = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion || !root.current) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.1 });
    const sync = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(sync);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom bottom', onUpdate: self => setHeroProgress(self.progress) });
      ScrollTrigger.create({ trigger: '#finale', start: 'top top', end: 'bottom bottom', onUpdate: self => setFinalProgress(self.progress) });
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => setScrollPercent(Math.round(self.progress * 100)) });

      gsap.fromTo('.hero-visual', { scale: 1 }, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.fromTo('.detail-heading', { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.details-section', start: 'top 80%', end: 'top 35%', scrub: true } });
      gsap.utils.toArray<HTMLElement>('.reveal-in').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 45 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 60%', scrub: true } });
      });
    }, root);

    const resize = () => ScrollTrigger.refresh();
    window.addEventListener('load', resize);
    return () => { window.removeEventListener('load', resize); ctx.revert(); gsap.ticker.remove(sync); lenis.destroy(); };
  }, [reduceMotion]);

  const nav = [ { label: 'Hikâyemiz', id: 'hikaye' }, { label: 'Koleksiyon', id: 'koleksiyon' }, { label: 'Zeminini Tasarla', id: 'tasarla' }, { label: 'Parke Rehberi', id: 'rehber' }, { label: 'İletişim', id: 'iletisim' } ];
  const p = reduceMotion ? 1 : heroProgress;
  const introOpacity = 1 - smooth(0.03, 0.1, p);
  const outroOpacity = smooth(0.88, 0.95, p);
  const activeStage = filmStages.findIndex(st => p >= st.from && p < st.to);
  return <div ref={root} className="site-shell">
    <div className="progress-track" aria-hidden="true"><span style={{ width: `${scrollPercent}%` }} /></div>
    <header className="site-header">
      <a href="#ust" className="brand-mark" aria-label="Çetin Parke ana sayfa" onClick={() => setMenuOpen(false)}><span className="brand-symbol">Ç<span className="brand-dot">.</span></span><span className="brand-label">ÇETİN <b>PARKE</b></span></a>
      <nav aria-label="Ana menü" className="desktop-nav">{nav.map(n => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}</nav>
      <a className="header-contact" href={whatsappLink()} target="_blank" rel="noreferrer">Teklif Al <ArrowUpRight size={16} strokeWidth={1.7}/></a>
      <button type="button" className="mobile-toggle" aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={isMenuOpen} onClick={() => setMenuOpen(s => !s)}>{isMenuOpen ? <X size={23}/> : <Menu size={23}/>}</button>
    </header>
    <div className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`} aria-hidden={!isMenuOpen}>{nav.map(n => <button type="button" key={n.id} onClick={() => { setMenuOpen(false); scrollTo(n.id); }}>{n.label} <ArrowUpRight size={20}/></button>)}<a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp&apos;tan Teklif Al <ArrowUpRight size={19}/></a></div>

    <main id="ust">
      <section id="hero" className="hero-section scroll-stage film-stage" aria-label="Beton zeminden parkeye, parkeden salona: Çetin Parke sinematik açılış">
        <div className="stage-pin hero-pin">
          <div className="hero-visual"><ScrollFrameSequence folder={media.film.sequence} count={media.film.frames} poster={media.film.poster} progress={heroProgress} reducedMotion={reduceMotion} label="Beton zemine balıksırtı parke döşenmesi ve salonun tamamlanması" /></div>
          <div className="hero-overlay" style={{ opacity: .35 + .65 * Math.max(introOpacity, outroOpacity) }} />
          <div className="hero-content" style={{ opacity: introOpacity, transform: `translateY(calc(-33% - ${(1 - introOpacity) * 60}px))`, pointerEvents: introOpacity < .1 ? 'none' : undefined }}><p className="eyebrow hero-kicker"><span className="eyebrow-line"/> PAMUKOVA · SAKARYA</p><div className="hero-headline"><div className="title-mask"><span className="hero-title-line">MEKÂNLARA</span></div><div className="title-mask"><span className="hero-title-line serif-line">değer katıyoruz.</span></div></div><p className="hero-description hero-kicker">Beton zeminden yaşayan bir salona. Kaydırın, birlikte döşeyelim.</p></div>
          {filmStages.map((st, i) => { const o = reduceMotion ? 0 : band(p, st.from, st.to); return <div key={st.no} className="film-caption" style={{ opacity: o, transform: `translateY(${(1 - o) * 24}px)` }} aria-hidden={o < .5}><span className="film-caption-no">{st.no} / 03 · {st.name.toLocaleUpperCase('tr-TR')}</span><h2>{st.title}</h2><p>{st.text}</p>{i === 1 && <div className="film-meter"><span style={{ width: `${Math.round(smooth(0.2, 0.56, p) * 100)}%` }} /><em>{Math.round(smooth(0.2, 0.56, p) * 100)}% döşendi</em></div>}</div>; })}
          <div className="film-outro" style={{ opacity: outroOpacity, pointerEvents: outroOpacity > .5 ? 'auto' : 'none' }}><p className="eyebrow"><span className="eyebrow-line"/> SIRA SİZDE</p><h2>Kendi zemininizi<br/><em>şimdi tasarlayın.</em></h2><button type="button" className="finale-cta" onClick={() => scrollTo('tasarla')}>Zeminini Tasarla <ArrowDown size={18}/></button></div>
          <ol className="film-steps" aria-label="Dönüşüm adımları">{filmStages.map((st, i) => <li key={st.no} className={i === activeStage ? 'active' : p >= st.to ? 'done' : ''}><span>{st.no}</span>{st.name}</li>)}</ol>
          <div className="hero-bottom" style={{ opacity: introOpacity }}><div className="hero-index"><span>01 / 04</span><span>YAŞAM ALANLARINIZ İÇİN</span></div><button type="button" className="scroll-cue" onClick={() => scrollTo('hikaye')}>KEŞFETMEK İÇİN KAYDIR <span className="scroll-cue-icon"><ArrowDown size={17}/></span></button><span className="vertical-info">EST. PAMUKOVA</span></div>
          <span className="floor-progress-line" style={{ width: `${p * 100}%` }}/>
        </div>
      </section>

      <section id="hikaye" className="manifesto-section section-pad"><div className="manifesto-inner"><p className="section-tag reveal-in"><span className="tag-dot"/> BİZİM YAKLAŞIMIMIZ</p><h2 className="manifesto-title reveal-in">Bir mekânı özel yapan şey, <em>içindeki detaylardır.</em></h2><div className="manifesto-footer reveal-in"><span className="manifesto-number">/ 01</span><p>Parkeden kapıya, banyodan son dokunuşa. Yaşam alanlarınızı tamamlayan çözümleri bir araya getiriyoruz.</p></div></div></section>

      <section className="details-section section-pad"><div className="details-header"><div><p className="section-tag"><span className="tag-dot"/> TASARIMDA BÜTÜNLÜK</p><h2 className="detail-heading">Bir ev. <br/><em>Sonsuz ihtimal.</em></h2></div><p className="details-aside reveal-in">Her oda kendi hikâyesini anlatır. Biz o hikâyeyi tamamlayan dokunuşlara odaklanıyoruz.</p></div><div className="details-photo"><div className="details-image" style={{backgroundImage:`url('${media.details.image}')`}}/><div className="details-photo-label"><span>ÇETİN PARKE</span><span>MEKÂNIN RUHU DETAYLARDA.</span></div></div></section>

      <section id="koleksiyon" className="collection-section section-pad"><div className="collection-head"><div><p className="section-tag reveal-in"><span className="tag-dot"/> KOLEKSİYONU KEŞFEDİN</p><h2 className="collection-title reveal-in">Her köşeye<br/><em>yeni bir bakış.</em></h2></div><div className="collection-control"><button type="button" aria-label="Önceki ürün" onClick={() => setActive(v => (v + categories.length - 1) % categories.length)}><ArrowLeft size={23}/></button><button type="button" aria-label="Sonraki ürün" onClick={() => setActive(v => (v + 1) % categories.length)}><ArrowRight size={23}/></button></div></div>
        <div className="collection-feature"><div className="collection-feature-image" key={categories[active].slug} style={{backgroundImage:`url('${categories[active].image}')`}}><span className="feature-ordinal">{categories[active].no} / 04</span><span className="image-disclaimer">Temsili koleksiyon görseli</span></div><div className="collection-feature-info"><span className="collection-small">ÜRÜN GRUPLARI</span><h3>{categories[active].name}</h3><p>{categories[active].subtitle}</p><a href={whatsappLink(`Merhaba, ${categories[active].name} ürünleriniz hakkında bilgi almak istiyorum.`)} target="_blank" rel="noreferrer" className="collection-link">Bilgi Al <ArrowUpRight size={19}/></a><div className="collection-dots" aria-label="Ürün seçimi">{categories.map((item,i) => <button type="button" key={item.slug} className={active === i ? 'selected' : ''} onClick={() => setActive(i)} aria-label={`${item.name} ürününü göster`} aria-pressed={active === i}><span/></button>)}</div></div></div>
        <div className="category-rail">{categories.map((item,i) => <button type="button" key={item.slug} className={active===i?'is-active':''} onClick={() => setActive(i)}><span>{item.no}</span><strong>{item.name}</strong><MoveUpRight size={18}/></button>)}</div>
      </section>

      <section id="tasarla" className="designer-section section-pad" aria-labelledby="tasarla-title">
        <div className="designer-head"><div><p className="section-tag reveal-in"><span className="tag-dot"/> ZEMİNİNİ TASARLA</p><h2 id="tasarla-title" className="reveal-in">Salonunu <em>kendin döşe.</em></h2></div><p className="reveal-in">Dizilimi ve rengi seçin; parke aynı salona anında döşensin. Mobilyayı kaldırıp zemini tek başına da görebilirsiniz. Seçiminizi tek dokunuşla WhatsApp’tan bize iletin.</p></div>
        <FloorDesigner />
      </section>

      <ParkeGuide />

      <section id="finale" className="finale-stage scroll-stage"><div className="stage-pin finale-pin"><div className="finale-visual" style={{ transform: reduceMotion ? 'none' : `scale(${1.12 - .12 * finalProgress})` }}><ScrollFrameSequence folder={media.finale.sequence} count={media.finale.frames} poster={media.finale.image} progress={finalProgress} reducedMotion={reduceMotion} label="Tamamlanmış yaşam alanı"/></div><div className="finale-shade"/><div className="finale-content"><p className="eyebrow"><span className="eyebrow-line"/> YENİ BİR BAŞLANGIÇ</p><h2>Hayalindeki<br/><em>mekân burada başlar.</em></h2><a href={whatsappLink()} target="_blank" rel="noreferrer" className="finale-cta">Projen İçin Teklif Al <ArrowUpRight size={19}/></a></div><div className="finale-ordinal">04 / 04</div></div></section>

      <section id="iletisim" className="contact-section section-pad"><div className="contact-top"><p className="section-tag"><span className="tag-dot"/> İLETİŞİM</p><p>Bir fikrin mi var? Konuşalım.</p></div><a className="contact-title" href={whatsappLink()} target="_blank" rel="noreferrer">Birlikte<br/><em>başlayalım.</em> <ArrowUpRight className="contact-arrow" strokeWidth={1}/></a><div className="contact-grid"><div><span>ADRES</span><p>{business.address}</p></div><div><span>TELEFON</span><a href={`tel:+${business.phoneE164}`}>{business.phoneDisplay}</a></div><div><span>SOSYAL</span><a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={17}/> @cetin.parke</a></div></div></section>
    </main>
    <footer className="site-footer"><a className="footer-brand" href="#ust">ÇETİN<span>PARKE.</span></a><span>© {new Date().getFullYear()} ÇETİN PARKE</span><a href="#ust">YUKARI DÖN <ArrowUpRight size={15}/></a></footer>
    <a className="floating-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp'tan iletişime geç"><Phone size={21}/><span>TEKLİF AL</span></a>
    <div className="demo-tag" aria-label="Demo sürümü"><Check size={11}/> TASARIM ÖNİZLEMESİ</div>
  </div>;
}
