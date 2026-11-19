'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Tek noktadan kayıt: client bileşenleri buradan içe aktarır.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const MQ = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
} as const;

/**
 * gsap.matchMedia kurulumunu tarayıcı boşta kalana kadar erteler (en geç `timeout` ms).
 * Tüm sahne animasyonları kaydırmaya bağlı ve başlangıç durumları CSS'te tanımlı olduğu için kurulumun
 * ilk boyamadan sonraya kayması görünümü değiştirmez; ama her bileşenin kurulumu ayrı bir göreve bölünür ve
 * hidrasyondaki tek uzun görev (mobilde ~0,9 sn) parçalanır → sayfa daha erken etkileşime hazır olur (TBT/INP).
 * Dönen fonksiyon bekleyen kurulumu iptal eder ve kurulanları geri alır (useGSAP temizliğinde çağrılır).
 */
export function idleMatchMedia(build: (mm: gsap.MatchMedia) => void, timeout = 600) {
  const mm = gsap.matchMedia();
  let cancelled = false;
  const run = () => {
    if (!cancelled) build(mm);
  };
  const ric = typeof window !== 'undefined' && 'requestIdleCallback' in window;
  const id = ric ? window.requestIdleCallback(run, { timeout }) : window.setTimeout(run, 1);
  return () => {
    cancelled = true;
    if (ric) window.cancelIdleCallback(id);
    else window.clearTimeout(id);
    mm.revert();
  };
}
