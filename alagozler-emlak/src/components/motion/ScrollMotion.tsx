"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Page-wide scroll motion (GSAP + ScrollTrigger), driven by data attributes:
 *   data-reveal            heading / block rises in once when scrolled into view
 *   data-reveal-stagger    direct children rise in one after another (cards)
 *   data-parallax="0.15"   gentle vertical drift while the element crosses the viewport (desktop only)
 *   data-parallax-top      with data-parallax: drift starts from rest at the top of the page
 * Native scrolling is untouched; nothing runs with prefers-reduced-motion, and phones get
 * shorter reveals without parallax. Content is fully visible if JS never runs.
 */
export default function ScrollMotion() {
  const pathname = usePathname();
  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
        const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) return;
        const distance = desktop ? 42 : 22;
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
          gsap.from(element, { y: distance, opacity: 0, duration: desktop ? 1 : 0.6, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach(group => {
          gsap.from(group.children, { y: distance, opacity: 0, duration: desktop ? 0.9 : 0.55, stagger: desktop ? 0.09 : 0.05, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 88%", once: true } });
        });
        if (desktop) gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach(element => {
          const strength = Number(element.dataset.parallax) || 0.12;
          // data-parallax-top: element starts at rest (e.g. the hero) and drifts as the page scrolls away.
          if (element.hasAttribute("data-parallax-top")) {
            gsap.to(element, { yPercent: strength * 100, ease: "none", scrollTrigger: { trigger: element.parentElement ?? element, start: "top top", end: "bottom top", scrub: true } });
          } else {
            gsap.fromTo(element, { yPercent: -strength * 50 }, { yPercent: strength * 50, ease: "none", scrollTrigger: { trigger: element.parentElement ?? element, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });
      });
      // Lazy content (fonts, maps) changes heights after first layout.
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 800);
      revert = () => { window.clearTimeout(refresh); mm.revert(); };
    })();
    return () => { cancelled = true; revert?.(); };
  }, [pathname]);
  return null;
}
