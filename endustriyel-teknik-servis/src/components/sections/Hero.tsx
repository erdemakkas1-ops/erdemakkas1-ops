import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { RepresentativeNote, Visual } from '@/components/visuals/Visual';
import { HeroScene } from '@/components/animations/HeroScene';
import { images } from '@/data/visuals';
import { serviceRequestHref } from '@/data/navigation';

export function Hero() {
  const photo = images.hero;
  return (
    <HeroScene labelledBy="hero-baslik" className="relative isolate flex h-[100svh] min-h-[560px] flex-col overflow-hidden bg-ink">
      <div data-hero-media className="absolute inset-0 -z-10 origin-[65%_50%] will-change-transform">
        <Visual kind="press" image={photo} note={false} priority sizes="100vw" className="fade h-full w-full" />
      </div>

      {/* Okunabilirlik: yalnızca başlığın bulunduğu sol/alt alan karartılır, makine (sağ) açık kalır */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,24,32,0.9)_0%,rgba(16,24,32,0.72)_34%,rgba(16,24,32,0.22)_62%,rgba(16,24,32,0.08)_100%)] max-md:bg-[linear-gradient(180deg,rgba(16,24,32,0.45)_0%,rgba(16,24,32,0.35)_35%,rgba(16,24,32,0.88)_68%,rgba(16,24,32,0.97)_100%)]"
        aria-hidden="true"
      />
      <div data-hero-shade className="pointer-events-none absolute inset-0 -z-10 bg-ink opacity-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

      <div data-hero-content className="container-x flex flex-1 flex-col justify-end pb-12 pt-28 sm:pb-16 md:justify-center md:pb-20 lg:pt-32">
        <p className="eyebrow rise" style={{ ['--d' as string]: '100ms' }}>
          Bağımsız Teknik Servis · Baskı &amp; Ambalaj
        </p>
        <h1 id="hero-baslik" className="display-xl mt-6 max-w-[11ch] text-white [text-shadow:0_2px_30px_rgba(16,24,32,0.35)]">
          <span className="rise block" style={{ ['--d' as string]: '200ms' }}>
            Üretiminiz
          </span>
          <span className="rise block text-accent" style={{ ['--d' as string]: '320ms' }}>
            durmasın.
          </span>
        </h1>
        <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-mist sm:text-xl" style={{ ['--d' as string]: '460ms' }}>
          Endüstriyel baskı ve ambalaj makinelerinde elektrik, mekanik ve otomasyon bakım çözümleri.
        </p>
        <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '580ms' }}>
          <Link href={serviceRequestHref} className="btn btn-primary">
            Servis Talebi Oluştur
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/hizmetler" className="btn btn-ghost bg-ink/30 backdrop-blur-sm">
            Hizmetleri İncele
          </Link>
        </div>
      </div>

      <div data-hero-meta className="container-x relative hidden pb-8 sm:block">
        <div className="hairline" />
        <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mist/70">
          <ul className="flex gap-8">
            <li>Elektrik</li>
            <li>Mekanik</li>
            <li>PLC / Otomasyon</li>
            <li className="hidden md:block">Servo / Sürücü</li>
          </ul>
          <a href="#uzmanlik-hikaye" className="flex items-center gap-2 py-2 transition-colors hover:text-accent">
            Kaydır <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
      {photo?.representative && <RepresentativeNote className="right-4 top-24 sm:right-8 lg:top-28" />}
    </HeroScene>
  );
}
