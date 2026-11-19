'use client';

import { usePathname } from 'next/navigation';
import { gsap, idleMatchMedia, MQ, ScrollTrigger, useGSAP } from './gsap';

/**
 * Tek noktadan yönetilen, veri-özniteliği tabanlı scroll animasyonları.
 *
 *  data-reveal                 → yumuşak yukarı kayarak görünme   (CSS geçişi, globals.css → .motion-ready)
 *  data-stagger                → doğrudan çocukları sırayla görünür (CSS geçişi)
 *  data-line                   → ince ayırıcı çizgi soldan çizilir  (CSS geçişi)
 *  data-clip                   → görsel aşağıdan yukarı klip ile açılır
 *  data-zoom                   → görsel kaydırmayla hafifçe uzaklaşır (masaüstü)
 *  data-parallax="0.12"        → hafif parallax (masaüstü)
 *  data-timeline / data-timeline-progress → süreç çizgisi ilerlemesi
 *  data-draw                   → içindeki SVG çizgileri kaydırmayla çizilir (pathLength=1 + stroke-dashoffset, scrub)
 *
 * prefers-reduced-motion: reduce → hiçbir animasyon kurulmaz, içerik olduğu gibi görünür.
 * Mobilde mesafeler ve süreler küçültülür, scrub efektleri kapatılır.
 * Tüm tetikleyiciler useGSAP + gsap.matchMedia ile kurulur ve rota değişiminde/unmount'ta revert edilir.
 * Sinematik sahneler (components/cinema) kendi tetikleyicilerini kurar; sticky kullandıkları için sıra sorun olmaz.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
    let cancelled = false;
    const cleanup = idleMatchMedia((mm) => {
    mm.add(
      { desktop: MQ.desktop, mobile: MQ.mobile },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
        const dist = desktop ? 70 : 42;
        const dur = desktop ? 1.15 : 0.85;
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

        // Görünme efektleri (reveal / stagger / line): GSAP tween'i yerine CSS geçişi + sınıf.
        // Her öğe için tween kurmak, açılışta öğe başına getComputedStyle okuması ve stil yeniden hesaplaması
        // yaptırıyordu (mobilde ~0,5 sn uzun görev). Burada yalnızca yazma yapılır, okuma yoktur; görünüm aynı.
        const root = document.documentElement;
        root.style.setProperty('--reveal-dist', `${dist}px`);
        root.style.setProperty('--reveal-dur', `${dur}s`);
        root.classList.add('motion-ready');
        q('[data-reveal]').forEach((el) => {
          if (el.dataset.revealDelay) el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}s`);
        });
        q('[data-stagger]').forEach((el) => {
          Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--reveal-delay', `${i * (desktop ? 0.09 : 0.06)}s`));
        });
        const reveal = (sel: string, start: string) =>
          ScrollTrigger.batch(q(sel), {
            start,
            once: true,
            onEnter: (els) => els.forEach((el) => el.classList.add('is-in')),
          });
        reveal('[data-reveal]', 'top 90%');
        reveal('[data-stagger]', 'top 88%');
        reveal('[data-line]', 'top 95%');

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

        // Teknik çizimler: çizgiler plotter gibi çizilir, yazılar ardından belirir.
        // Önce TÜM çizimlerin stilleri okunur, sonra hepsine yazılır (okuma/yazma iç içe geçmez → tek stil hesabı).
        const drawings = q('[data-draw]').map((root) => {
          const shapes = Array.from(root.querySelectorAll<SVGGeometryElement>('path, line, polyline, polygon, rect, circle, ellipse'));
          const info = shapes.map((el) => {
            const st = getComputedStyle(el);
            return { el, stroked: st.stroke !== 'none' && st.strokeWidth !== '0px', dashed: st.strokeDasharray !== 'none' };
          });
          return {
            root,
            // kesik desenli çizgiler çizilmez, belirir (deseni korunur)
            strokes: info.filter((x) => x.stroked && !x.dashed).map((x) => x.el),
            texts: [...Array.from(root.querySelectorAll('text, [data-draw-fade]')), ...info.filter((x) => x.stroked && x.dashed).map((x) => x.el)],
          };
        });
        drawings.forEach(({ root, strokes, texts }) => {
          if (!strokes.length) return;
          gsap.set(strokes, { attr: { pathLength: 1 }, strokeDasharray: 1, strokeDashoffset: 1 });
          if (texts.length) gsap.set(texts, { autoAlpha: 0 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root, start: 'top 88%', end: desktop ? 'center 42%' : 'center 50%', scrub: 0.6 },
          });
          const each = Math.min(0.03, 0.9 / strokes.length);
          tl.to(strokes, { strokeDashoffset: 0, duration: 0.6, ease: 'none', stagger: { each } }, 0);
          if (texts.length) tl.to(texts, { autoAlpha: 1, duration: 0.25, stagger: 0.02 }, '>-0.3');
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
        return () => {
          root.classList.remove('motion-ready');
          q('.is-in').forEach((el) => el.classList.remove('is-in'));
        };
      },
    );

    // Her tetikleyici oluşturulurken kendi konumunu zaten hesaplar; tam yenileme (tüm animasyonları geri alıp
    // yeniden ölçer, mobilde ~0,3 sn) yalnızca web fontları henüz yüklenmemişse, yüklendiklerinde bir kez yapılır.
    ScrollTrigger.sort();
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }
    });

    return () => {
      cancelled = true;
      cleanup();
    };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
