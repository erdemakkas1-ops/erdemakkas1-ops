/**
 * Görsel yer tutucu sistemi.
 * Gerçek fotoğraf eklenene kadar her alan için CSS/SVG teknik çizim gösterilir.
 * Fotoğraf eklemek için ilgili veri kaydına `image` alanı girin:
 *   image: { src: '/images/services/elektrik.webp', alt: 'Açıklayıcı alt metin', width: 1600, height: 1000 }
 */

export type VisualKind =
  | 'press'
  | 'panel'
  | 'mechanical'
  | 'plc'
  | 'drive'
  | 'maintenance'
  | 'diecutter'
  | 'offset'
  | 'photo';

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Sayfa bazlı görsel atamaları – gerçek fotoğraflar geldiğinde doldurun. */
export const images: Partial<Record<'hero' | 'about' | 'cta', SiteImage>> = {
  // hero: { src: '/images/hero.webp', alt: '...', width: 2400, height: 1400 },
};
