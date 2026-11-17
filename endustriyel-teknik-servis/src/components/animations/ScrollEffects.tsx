'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Tek noktadan yönetilen, veri-özniteliği tabanlı scroll animasyonları.
 *
 *  data-reveal                 → yumuşak yukarı kayarak görünme
 *  data-stagger                → doğrudan çocukları sırayla görünür
 *  data-line                   → ince ayırıcı çizgi soldan çizilir
 *  data-clip                   → görsel aşağıdan yukarı klip ile açılır
 *  data-zoom                   → görsel kaydırmayla hafifçe uzaklaşır (masaüstü)
 *  data-parallax="0.12"        → hafif parallax (masaüstü)
 *  data-hero / -media / -content → hero yakınlaşma + metin geri çekilmesi
 *  data-timeline / data-timeline-progress → süreç çizgisi ilerlemesi
 *
 * prefers-reduced-motion: reduce → hiçbir animasyon kurulmaz, içerik olduğu gibi görünür.
 * Mobilde mesafeler ve süreler küçültülür, scrub efektleri kapatılır.
 * Tüm tetikleyiciler gsap.matchMedia ile kurulur ve rota değişiminde/unmount'ta revert edilir.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
        const dist = desktop ? 44 : 22;
        const dur = desktop ? 1 : 0.7;
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

        if (desktop) {
          q('[data-zoom]').forEach((el) => {
            gsap.fromTo(
              el,
              { scale: 1.14 },
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

        // Hero: görsel hafif yakınlaşır, metin geri çekilir. Sabitleme (pin) yok.
        q('[data-hero]').forEach((hero) => {
          const media = hero.querySelector('[data-hero-media]');
          const content = hero.querySelector('[data-hero-content]');
          const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: desktop ? 0.6 : true };
          if (media) gsap.to(media, { scale: desktop ? 1.14 : 1.06, yPercent: desktop ? 6 : 3, ease: 'none', scrollTrigger: st });
          if (content)
            gsap.to(content, { y: desktop ? -120 : -50, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...st, end: '80% top' } });
        });

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

    // Web fontları yüklenince ölçüleri tazele
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [pathname]);

  return null;
}
