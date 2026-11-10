import { business } from "@/config/business";
import { HeroHills, HeroPlain, HeroSky } from "./HeroScene";
import QuickSearch from "./QuickSearch";

export default function HomeHero() {
  return <section aria-labelledby="hero-baslik" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#1e1d22] text-white">
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div data-parallax="0.08" data-parallax-top className="absolute inset-0"><HeroSky /></div>
      <div data-parallax="0.16" data-parallax-top className="absolute inset-0"><HeroHills /></div>
      <div className="absolute inset-0"><HeroPlain /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#121110]/55 via-transparent to-[#121110]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#121110]/70 via-[#121110]/20 to-transparent" />
    </div>
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:pb-20">
      <div className="hero-copy max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9bd86]">{business.city} · Gayrimenkul danışmanlığı</p>
        <h1 id="hero-baslik" className="mt-5 font-serif text-[clamp(2.9rem,8.4vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.01em] text-[#f8f4ec]">
          ALAGÖZLER<span className="mt-2 block text-[0.52em] font-medium tracking-[0.06em] text-[#e7d3a8]">EMLAK & İNŞAAT</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#e4ddd0] sm:text-lg">Arsa, tarla ve konutta doğru yatırımı birlikte bulalım. Şanlıurfa ve çevresinde satış, danışmanlık ve proje tanıtımı tek adreste.</p>
      </div>
      <div className="hero-copy mt-9"><QuickSearch /></div>
      <p className="mt-6 text-[11px] text-white/55">Görsel temsilidir.</p>
    </div>
  </section>;
}
