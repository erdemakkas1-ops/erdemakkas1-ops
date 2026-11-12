'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { story } from '@/lib/story';
import FilmScrub from './FilmScrub';
import Overlay from './Overlay';
import Loader from './Loader';

export default function Experience() {
  const section = useRef<HTMLElement>(null);

  // One ScrollTrigger, one timeline: scroll position -> story.p (0..1), scrubbed for smoothness.
  useEffect(() => {
    if (!section.current) return;
    story.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);
    // ?shot: lets headless screenshot runs advance the scrub in real time
    if (new URLSearchParams(window.location.search).has('shot')) gsap.ticker.lagSmoothing(0);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: story.reducedMotion ? true : 0.7,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(story, { p: 0 }, { p: 1, duration: 1 });
    }, section);
    return () => ctx.revert();
  }, []);

  const scrollToStage = (p: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + p * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y + 2, behavior: story.reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="donusum" ref={section} className="story" aria-label="Boş salondan tamamlanmış yaşam alanına dönüşüm">
      <div className="story__sticky">
        <FilmScrub />
        <Loader />
        <Overlay onStage={scrollToStage} />
      </div>
    </section>
  );
}
