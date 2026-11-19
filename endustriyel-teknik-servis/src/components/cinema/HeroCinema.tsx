'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import { serviceRequestHref } from '@/data/navigation';
import { gsap, MQ, useGSAP } from '@/components/animations/gsap';
import { CoverImage } from './CoverImage';

const ZOOM_DESKTOP = 1.35;
const ZOOM_MOBILE = 1.22;

/**
 * SAHNE 1 — Açılış. Tam ekran baskı makinesi; kaydırdıkça görüntü makineye doğru büyür, başlık kademeli
 * kaybolur ve sahne kararıp bir sonraki bölüme doğal biçimde geçer. Otomatik oynayan animasyon yok.
 */
export function HeroCinema() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const zoom = desktop ? ZOOM_DESKTOP : ZOOM_MOBILE;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: desktop ? 0.7 : 0.4 },
        });
        tl.fromTo('[data-hero-zoom]', { scale: 1 }, { scale: zoom, duration: 1 }, 0)
          .to('[data-hero-copy] > *', { y: desktop ? -70 : -40, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'power1.in' }, 0.05)
          .to('[data-hero-hint]', { autoAlpha: 0, duration: 0.1 }, 0)
          .to('[data-hero-text-shade]', { opacity: 0, duration: 0.45 }, 0.15)
          .to('[data-hero-shade]', { opacity: 0.9, duration: 0.3 }, 0.7);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" className="scene scene--hero" aria-labelledby="hero-baslik">
      <div className="scene__stage grain">
        <div data-hero-zoom className="absolute inset-0 will-change-transform" style={{ transformOrigin: '66% 52%' }}>
          <CoverImage m={media.heroMachine} priority />
        </div>
        {/* okunabilirlik: yalnızca metin tarafı karartılır */}
        <div
          data-hero-text-shade
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,17,18,0.92)_0%,rgba(15,17,18,0.72)_32%,rgba(15,17,18,0.18)_62%,rgba(15,17,18,0.05)_100%)] max-md:bg-[linear-gradient(180deg,rgba(15,17,18,0.35)_0%,rgba(15,17,18,0.25)_38%,rgba(15,17,18,0.9)_72%,rgba(15,17,18,0.97)_100%)]"
          aria-hidden="true"
        />
        <div className="vignette" aria-hidden="true" />
        <div data-hero-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />

        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-24 pt-28 md:justify-center md:pb-16">
          <div data-hero-copy className="max-w-[44rem]">
            <p className="eyebrow">
              Bağımsız teknik servis · Baskı &amp; ambalaj makineleri
            </p>
            <h1 id="hero-baslik" className="wide mt-6 text-[clamp(2.3rem,6.4vw,5.6rem)] leading-[0.92] text-paper">
              Üretiminiz
              <br />
              <em>durmasın.</em>
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-mist/90 sm:text-lg">
              Endüstriyel makinelerde elektrik, mekanik, PLC ve servo sürücü arızalarına yerinde teknik servis. Arızanın
              kaynağını ölçerek bulur, ne yapılacağını açıkça anlatırım.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={serviceRequestHref} className="btn btn-primary">
                Servis Talebi Oluştur <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#mekanik" className="btn btn-ghost bg-ink/30 backdrop-blur-sm">
                Hizmetleri Keşfet
              </a>
            </div>
          </div>
        </div>

        <a
          href="#mekanik"
          data-hero-hint
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/70 hover:text-accent md:flex"
        >
          Kaydırın <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
