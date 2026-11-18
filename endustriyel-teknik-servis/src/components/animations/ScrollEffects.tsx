'use client';

import { usePathname } from 'next/navigation';
import { gsap, MQ, ScrollTrigger, useGSAP } from './gsap';

/**
 * Tek noktadan yönetilen, veri-özniteliği tabanlı scroll animasyonları.
 *
 *  data-reveal                 → yumuşak yukarı kayarak görünme
 *  data-stagger                → doğrudan çocukları sırayla görünür
 *  data-line                   → ince ayırıcı çizgi soldan çizilir
 *  data-clip                   → görsel aşağıdan yukarı klip ile açılır
 *  data-zoom                   → görsel kaydırmayla hafifçe uzaklaşır (masaüstü)
 *  data-parallax="0.12"        → hafif parallax (masaüstü)
 *  data-timeline / data-timeline-progress → süreç çizgisi ilerlemesi
 *
 * prefers-reduced-motion: reduce → hiçbir animasyon kurulmaz, içerik olduğu gibi görünür.
 * Mobilde mesafeler ve süreler küçültülür, scrub efektleri kapatılır.
 * Tüm tetikleyiciler useGSAP + gsap.matchMedia ile kurulur ve rota değişiminde/unmount'ta revert edilir.
 * Açılış filmi sticky ile sabitlenir (pin-spacer yok); bu yüzden tetikleyici sırası sorun olmaz.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
    const mm = gsap.matchMedia();

    mm.add(
      { desktop: MQ.desktop, mobile: MQ.mobile },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
        const dist = desktop ? 70 : 42;
        const dur = desktop ? 1.15 : 0.85;
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

        q('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: dist,
            autoAlpha: 0,
            duration: dur,
            delay: Number(el.dataset.revealDelay || 0),
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });

        q('[data-stagger]').forEach((el) => {
          gsap.from(el.children, {
            y: dist,
            autoAlpha: 0,
            duration: dur,
            ease: 'power3.out',
            stagger: desktop ? 0.09 : 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        q('[data-line]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: desktop ? 1.4 : 0.9,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
          });
        });

        q('[data-clip]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: desktop ? 1.3 : 0.8,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
          );
        });

        {
          q('[data-zoom]').forEach((el) => {
            gsap.fromTo(
              el,
              { scale: desktop ? 1.14 : 1.08 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });

          q('[data-parallax]').forEach((el) => {
            const amount = Number(el.dataset.parallax || 0.12);
            gsap.fromTo(
              el,
              { yPercent: -amount * 50 },
              {
                yPercent: amount * 50,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        }

        q('[data-timeline]').forEach((tl) => {
          const bar = tl.querySelector<HTMLElement>('[data-timeline-progress]');
          if (!bar) return;
          const vertical = bar.offsetHeight > bar.offsetWidth;
          gsap.fromTo(
            bar,
            vertical ? { scaleY: 0 } : { scaleX: 0 },
            {
              ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
              transformOrigin: vertical ? 'top center' : 'left center',
              ease: 'none',
              scrollTrigger: { trigger: tl, start: 'top 75%', end: 'bottom 60%', scrub: true },
            },
          );
        });
      },
    );

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    // Web fontları yüklenince ölçüleri tazele
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
