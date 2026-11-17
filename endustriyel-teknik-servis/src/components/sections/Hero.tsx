import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Visual } from '@/components/visuals/Visual';
import { images } from '@/data/visuals';
import { serviceRequestHref } from '@/data/navigation';

export function Hero() {
  return (
    <section data-hero className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-labelledby="hero-baslik">
      <div data-hero-media className="absolute inset-0 -z-10 origin-[60%_45%] will-change-transform">
        <Visual kind="press" image={images.hero} priority sizes="100vw" className="fade h-full w-full" />
      </div>
      {/* okunabilirlik katmanları */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,24,32,0.96)_0%,rgba(16,24,32,0.78)_38%,rgba(16,24,32,0.15)_75%,rgba(16,24,32,0.35)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(16,24,32,0.55)_0%,rgba(16,24,32,0.7)_45%,rgba(16,24,32,0.97)_80%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden opacity-40" aria-hidden="true">
        <div className="scanline h-1/3 w-full bg-gradient-to-b from-transparent via-accent/[0.06] to-transparent" />
      </div>

      <div data-hero-content className="container-x flex flex-1 flex-col justify-end pb-14 pt-32 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-36">
        <p className="eyebrow rise" style={{ ['--d' as string]: '100ms' }}>
          Bağımsız Teknik Servis · Baskı &amp; Ambalaj
        </p>
        <h1 id="hero-baslik" className="display-xl mt-6 max-w-[11ch] text-white">
          <span className="rise block" style={{ ['--d' as string]: '200ms' }}>
            Üretiminiz
          </span>
          <span className="rise block text-accent" style={{ ['--d' as string]: '320ms' }}>
            durmasın.
          </span>
        </h1>
        <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-mist/90 sm:text-xl" style={{ ['--d' as string]: '460ms' }}>
          Endüstriyel baskı ve ambalaj makinelerinde elektrik, mekanik ve otomasyon bakım çözümleri.
        </p>
        <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '580ms' }}>
          <Link href={serviceRequestHref} className="btn btn-primary">
            Servis Talebi Oluştur
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/hizmetler" className="btn btn-ghost">
            Hizmetleri İncele
          </Link>
        </div>
      </div>

      <div className="container-x relative hidden pb-8 sm:block">
        <div className="hairline" />
        <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mist/55">
          <ul className="flex gap-8">
            <li>Elektrik</li>
            <li>Mekanik</li>
            <li>PLC / Otomasyon</li>
            <li className="hidden md:block">Servo / Sürücü</li>
          </ul>
          <a href="#uzmanlik" className="flex items-center gap-2 py-2 transition-colors hover:text-accent">
            Kaydır <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
