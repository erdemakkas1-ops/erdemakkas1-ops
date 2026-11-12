'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { story, STAGES } from '@/lib/story';
import Overlay from './Overlay';
import Loader from './Loader';

// WebGL never renders on the server
const SceneCanvas = dynamic(() => import('./scene/SceneCanvas'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    story.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // One ScrollTrigger, one timeline: scroll position -> story.p (0..1), scrubbed for smoothness.
  useEffect(() => {
    if (!section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    // ?shot: let headless screenshot runs (software WebGL, ~1 fps) advance the scrub in real time
    if (new URLSearchParams(window.location.search).has('shot')) gsap.ticker.lagSmoothing(0);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: story.reducedMotion ? true : 0.9,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(story, { p: 0 }, { p: 1, duration: 1 });
    }, section);
    return () => ctx.revert();
  }, []);

  // pause rendering when the story is off-screen
  useEffect(() => {
    if (!section.current) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  const scrollToStage = (p: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + p * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y + 2, behavior: story.reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="donusum" ref={section} className={`story ${webgl === false ? 'story--fallback' : ''}`} aria-label="Boş salondan tamamlanmış yaşam alanına 3D dönüşüm">
      <div className="story__sticky">
        {webgl && <SceneCanvas active={active} />}
        {webgl === false && (
          <div className="fallback" role="note">
            <p className="eyebrow">3D görüntülenemiyor</p>
            <p>
              Tarayıcınız veya cihazınız WebGL desteklemiyor ya da donanım hızlandırma kapalı. Etkileşimli 3D dönüşüm bu
              cihazda gösterilemiyor; aşağıda süreci adım adım okuyabilirsiniz.
            </p>
            <ol>
              {STAGES.map((s) => (
                <li key={s.id}>
                  <strong>{s.title}.</strong> {s.text}
                </li>
              ))}
            </ol>
          </div>
        )}
        {webgl && <Loader />}
        <Overlay onStage={scrollToStage} />
      </div>
    </section>
  );
}
