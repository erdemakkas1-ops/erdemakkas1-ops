import { business } from "@/config/business";
import { media, mediaSrc } from "@/data/media";
import AmbientVideo from "../motion/AmbientVideo";
import { HeroHills, HeroPlain, HeroSky } from "./HeroScene";
import QuickSearch from "./QuickSearch";

export default function HomeHero() {
  const hero = media.hero.video ? media.hero : null;
  return <section aria-labelledby="hero-baslik" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#141311] text-white lg:justify-center">
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {hero
        ? <>
            {/* Phones: the vertical clip fills the screen. Wide screens: a soft, blurred wash of it. */}
            <div className="absolute inset-0 lg:hidden"><AmbientVideo src={hero.video} poster={hero.poster} /></div>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img src={mediaSrc(hero.backdrop)} alt="" className="absolute inset-0 hidden h-full w-full scale-110 object-cover blur-2xl saturate-[1.1] lg:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121110]/60 via-[#121110]/25 to-[#121110]/90 lg:bg-gradient-to-r lg:from-[#121110]/92 lg:via-[#121110]/70 lg:to-[#121110]/35" />
          </>
        : <>
            <div data-parallax="0.08" data-parallax-top className="absolute inset-0"><HeroSky /></div>
            <div data-parallax="0.16" data-parallax-top className="absolute inset-0"><HeroHills /></div>
            <div className="absolute inset-0"><HeroPlain /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#121110]/55 via-transparent to-[#121110]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121110]/70 via-[#121110]/20 to-transparent" />
          </>}
    </div>
    <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-16 lg:pt-28">
      <div>
        <div className="hero-copy max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9bd86]">{business.city} · Gayrimenkul danışmanlığı</p>
          <h1 id="hero-baslik" className="mt-5 font-serif text-[clamp(2.9rem,8.4vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.01em] text-[#f8f4ec]">
            ALAGÖZLER<span className="mt-2 block text-[0.52em] font-medium tracking-[0.06em] text-[#e7d3a8]">EMLAK & İNŞAAT</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#e4ddd0] sm:text-lg">Arsa, tarla ve konutta doğru yatırımı birlikte bulalım. Şanlıurfa ve çevresinde satış, danışmanlık ve proje tanıtımı tek adreste.</p>
        </div>
        <div className="hero-copy mt-9"><QuickSearch /></div>
        <p className="mt-6 text-[11px] text-white/55">Görseller temsilidir.</p>
      </div>
      {hero && <figure data-parallax="0.1" className="hero-copy relative hidden h-[min(74svh,720px)] aspect-[9/16] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15 lg:block">
        <AmbientVideo src={hero.video} poster={hero.poster} />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-4 pt-12 text-xs text-white/80">Temsili görsel · Şanlıurfa çevresi</figcaption>
      </figure>}
    </div>
  </section>;
}
