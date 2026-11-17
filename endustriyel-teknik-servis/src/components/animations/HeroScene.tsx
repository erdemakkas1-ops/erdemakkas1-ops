'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, MQ, ScrollTrigger, useGSAP } from './gsap';

/**
 * Hero sahnesi
 * Masaüstü: bölüm kısa süre (görünüm yüksekliğinin %70'i kadar) sabitlenir; scrub'lı timeline
 *   fotoğraf scale 1 → 1.12 + hafif x/y kayma, metin opacity ve y geri çekilmesi. Tersinir.
 * Mobil: pin yok; fotoğraf çok hafif yakınlaşır, metin hafifçe yukarı kayar.
 * prefers-reduced-motion: hiçbir sahne kurulmaz.
 */
export function HeroScene({ children, className = '', labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=70%',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo('[data-hero-media]', { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.12, xPercent: -2.5, yPercent: 2, duration: 1 }, 0)
          .fromTo('[data-hero-shade]', { opacity: 0 }, { opacity: 0.55, duration: 1 }, 0)
          .fromTo('[data-hero-content]', { y: 0, autoAlpha: 1 }, { y: -90, autoAlpha: 0.1, duration: 0.85, ease: 'power1.in' }, 0.15)
          .fromTo('[data-hero-meta]', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, 0);
      });
      mm.add(MQ.mobile, () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.fromTo('[data-hero-media]', { scale: 1 }, { scale: 1.05, ease: 'none', scrollTrigger: st });
        gsap.fromTo('[data-hero-content]', { y: 0 }, { y: -40, ease: 'none', scrollTrigger: st });
      });
      // Görsel/font yüklemesinden sonra konumları tazele
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
