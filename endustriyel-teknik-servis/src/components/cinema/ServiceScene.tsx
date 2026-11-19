'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import { principles } from '@/data/about';
import { serviceRequestHref } from '@/data/navigation';
import { gsap, MQ, useGSAP } from '@/components/animations/gsap';
import { CallButton, WhatsappCta } from '@/components/ui/CallButtons';
import { CoverImage } from './CoverImage';

/**
 * SAHNE 3 — Servis ve müdahale. Fotoğraf küçük bir pencereden tam ekrana açılır (maske + ölçek),
 * ardından güven mesajları (çalışma prensipleri, uydurma rakam yok) tek tek belirir; sonunda iletişim.
 */
export function ServiceScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: desktop ? 0.7 : 0.4 },
        });
        tl.fromTo(
          q('[data-window]'),
          { clipPath: desktop ? 'inset(22% 30% 22% 30% round 4px)' : 'inset(26% 10% 30% 10% round 4px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.4, ease: 'power2.inOut' },
          0,
        )
          .fromTo(q('[data-window] [data-kenburns]'), { scale: desktop ? 1.35 : 1.15 }, { scale: 1, duration: 1 }, 0)
          .fromTo(q('[data-service-title]'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.3)
          .fromTo(q('[data-trust]'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.09 }, 0.45)
          .fromTo(q('[data-service-cta]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.82);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servis" className="scene scene--service" aria-labelledby="servis-baslik">
      <div className="scene__stage">
        <div data-window className="absolute inset-0">
          <div data-kenburns className="absolute inset-0 will-change-transform">
            <CoverImage m={media.service} />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,18,0.55)_0%,rgba(15,17,18,0.35)_40%,rgba(15,17,18,0.92)_100%)]" />
          <div className="grain absolute inset-0" />
        </div>
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-24 pt-24 md:pb-16">
          <div data-service-title>
            <p className="eyebrow">Servis ve müdahale</p>
            <h2 id="servis-baslik" className="wide mt-4 max-w-4xl text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[0.95] text-paper">
              Arızanın başında,
              <br />
              <em>makinenin yanında.</em>
            </h2>
          </div>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} data-trust className="border border-mist/15 bg-ink/80 p-4 backdrop-blur-md sm:p-5">
                <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1.5 font-display text-[1rem] uppercase leading-tight text-paper">{p.title}</h3>
                <p className="mt-2 hidden text-sm leading-relaxed text-mist/75 sm:block">{p.text}</p>
              </li>
            ))}
          </ul>
          <div data-service-cta className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={serviceRequestHref} className="btn btn-primary">
              Teknik Servis Talebi <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <CallButton variant="ghost" fallbackHref="#iletisim-bilgileri" />
            <WhatsappCta fallbackHref="#servis-formu" className="max-sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
