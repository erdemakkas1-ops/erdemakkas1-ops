'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { media } from '@/data/media';
import { serviceRequestHref } from '@/data/navigation';
import { gsap, MQ, useGSAP } from '@/components/animations/gsap';
import { CallButton, WhatsappCta } from '@/components/ui/CallButtons';
import { CoverImage } from './CoverImage';

const services = [
  {
    title: 'Arıza tespiti',
    text: 'Belirti makine başında dinlenir, ölçülür ve kaynağına kadar izlenir; tahmine dayalı parça değişimi yapılmaz.',
  },
  {
    title: 'Teknik müdahale',
    text: 'Arızalı bileşen onarılır ya da değiştirilir; ayar ve parametreler değiştirilmeden önce kayıt altına alınır.',
  },
  {
    title: 'Bakım ve revizyon',
    text: 'Planlı duruşlarda periyodik bakım ve ünite bazında revizyon; yapılan işler ve bulgular açıkça paylaşılır.',
  },
  {
    title: 'Üretim sürekliliği için teknik destek',
    text: 'Tekrarlayan arızalarda kök nedene yönelik öneriler ve öncelik sırasıyla yapılacaklar listesi.',
  },
];

/**
 * SAHNE 4 — Sahada müdahale. Sabitlenmeyen, geniş sinematik bölüm: görsel kaydırmayla çerçeveden tam genişliğe
 * açılır (clip-path), hafif parallax; ardından dört hizmet ve iletişim çağrısı. Görsel temsilîdir.
 */
export function ServiceScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q('[data-window]'),
          { clipPath: desktop ? 'inset(14% 16% 14% 16% round 6px)' : 'inset(10% 5% 10% 5% round 6px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: q('[data-window]')[0], start: 'top 95%', end: 'top 15%', scrub: 0.5 },
          },
        );
        gsap.fromTo(
          q('[data-kenburns]'),
          // ölçek her an ≥ 1 + 2·|kayma| → kenarda boşluk açılmaz (önceki sürümde sonda üstte boşluk kalıyordu)
          { scale: 1.16, yPercent: -3 },
          {
            scale: 1.07,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-window]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        gsap.fromTo(
          q('[data-service-title] > *'),
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-window]')[0], start: 'top 45%', end: 'top 5%', scrub: 0.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servis" className="relative bg-ink" aria-labelledby="servis-baslik">
      <div data-window className="relative h-[92svh] min-h-[520px] overflow-hidden">
        <div data-kenburns className="absolute inset-0 will-change-transform">
          <CoverImage m={media.service} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,18,0.45)_0%,rgba(15,17,18,0.15)_40%,rgba(15,17,18,0.92)_100%)]" />
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-12 md:pb-16">
          <div data-service-title>
            <p className="eyebrow">Sahada müdahale</p>
            <h2 id="servis-baslik" className="wide mt-4 max-w-4xl text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[0.95] text-paper">
              Arızanın başında,
              <br />
              <em>makinenin yanında.</em>
            </h2>
          </div>
        </div>
        <p className="absolute right-4 top-24 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/60 md:right-8">
          Temsilî görsel
        </p>
      </div>

      <div className="container-x pb-20 pt-10 md:pb-28 md:pt-14">
        <ul data-stagger className="grid gap-px bg-mist/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.title} className="bg-ink p-5 sm:p-6">
              <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-display text-[1.02rem] uppercase leading-tight text-paper">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist/75">{s.text}</p>
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={serviceRequestHref} className="btn btn-primary">
            Servis Talebi Oluştur <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <CallButton variant="ghost" fallbackHref="#iletisim-bilgileri" />
          <WhatsappCta fallbackHref="#servis-formu" className="max-sm:hidden" />
        </div>
      </div>
    </section>
  );
}
