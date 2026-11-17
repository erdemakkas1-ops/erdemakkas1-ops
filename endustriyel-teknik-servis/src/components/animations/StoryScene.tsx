'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, MQ, useGSAP } from './gsap';

/**
 * Uzmanlık hikâyesi sahnesi (yalnızca masaüstü, ≥768px):
 * Bölüm kısa süre sabitlenir; scroll ilerlemesine göre
 *   1. fotoğraf hafifçe uzaklaşır, 2. fotoğraf clip-path (alttan yukarı) + opacity ile gelir,
 *   metin blokları opacity/y ile yer değiştirir, ilerleme çubuğu dolar. scrub → tersinir.
 * Mobilde bu sahne gizlidir; içerik normal akışta, hafif reveal ile gösterilir.
 */
export function StoryScene({ children, className = '' }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap.set('[data-story-text="2"]', { autoAlpha: 0, y: 40 });
        gsap.set('[data-story-img="2"]', { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to('[data-story-progress]', { scaleY: 1, duration: 1 }, 0)
          // 0 – 0.3: ilk bölüm sabit, görsel çok hafif yakınlaşır
          .fromTo('[data-story-img="1"] img', { scale: 1.06 }, { scale: 1, duration: 0.35 }, 0)
          // 0.3 – 0.75: geçiş
          .to('[data-story-text="1"]', { autoAlpha: 0, y: -40, duration: 0.25, ease: 'power1.in' }, 0.32)
          .to('[data-story-img="1"] img', { scale: 1.08, duration: 0.45 }, 0.32)
          .to('[data-story-img="2"]', { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.43, ease: 'power2.inOut' }, 0.32)
          .fromTo('[data-story-img="2"] img', { scale: 1.12 }, { scale: 1, duration: 0.6 }, 0.32)
          .to('[data-story-text="2"]', { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power1.out' }, 0.55)
          .to('[data-story-step="1"]', { opacity: 0.35, duration: 0.1 }, 0.45)
          .to('[data-story-step="2"]', { opacity: 1, duration: 0.1 }, 0.45);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
