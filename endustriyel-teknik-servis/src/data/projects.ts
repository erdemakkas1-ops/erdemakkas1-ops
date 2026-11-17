/**
 * ÇALIŞMALARIMIZ
 * ------------------------------------------------------------------
 * Yalnızca gerçek ve müşterinin paylaşımına izin verdiği işleri ekleyin.
 * Dizi boşken galeride açıkça "Örnek içerik" etiketli yer tutucular görünür.
 *
 * Fotoğrafları public/images/projects/ altına koyup aşağıdaki gibi ekleyin:
 * {
 *   slug: 'bobst-platin-servo-arizasi',
 *   brand: 'BOBST',
 *   model: 'Model adı',
 *   category: 'Servo / Sürücü',
 *   problem: 'Arızanın kısa açıklaması',
 *   work: 'Yapılan işlem',
 *   date: '2026-03',               // isteğe bağlı
 *   photos: [{ src: '/images/projects/ornek-1.webp', alt: '...', width: 1600, height: 1200 }],
 * }
 */

import type { SiteImage } from './visuals';

export type Project = {
  slug: string;
  brand: string;
  model: string;
  category: string;
  problem: string;
  work: string;
  date?: string;
  photos: SiteImage[];
};

export const projects: Project[] = [];

/** Boş durumda gösterilen yer tutucu kartların alan şablonu (gerçek iş değildir). */
export const projectPlaceholders = [
  { category: 'Elektrik', visual: 'panel' as const },
  { category: 'Servo / Sürücü', visual: 'drive' as const },
  { category: 'Mekanik', visual: 'mechanical' as const },
  { category: 'PLC / Otomasyon', visual: 'plc' as const },
  { category: 'Periyodik Bakım', visual: 'maintenance' as const },
  { category: 'Revizyon', visual: 'press' as const },
];
