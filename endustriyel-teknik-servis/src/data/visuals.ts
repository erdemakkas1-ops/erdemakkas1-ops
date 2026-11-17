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
  /** CSS object-position – makinenin kesilmemesi için (örn. '70% 50%') */
  position?: string;
  /** Temsilî (gerçek servis vakası olmayan) görsel ise küçük bir not gösterilir */
  representative?: boolean;
};

/**
 * Kullanıcı tarafından sağlanan endüstriyel fotoğraflar (public/images/industrial).
 * Temsilî görsellerdir: belirli bir marka/modeli veya gerçek bir servis vakasını göstermez.
 * Kullanım hakları işletme sahibi tarafından doğrulanmalıdır.
 */
export const industrial = {
  pressRollers: {
    src: '/images/industrial/printing-press-rollers.webp',
    alt: 'Endüstriyel baskı makinesinin silindir ve mekanik bileşenleri',
    width: 1536,
    height: 857,
    position: '72% 50%',
    representative: true,
  },
  electricalPanel: {
    src: '/images/industrial/electrical-panel.webp',
    alt: 'Elektrik panosu, PLC ve motor sürücü bileşenleri',
    width: 1536,
    height: 857,
    position: '74% 50%',
    representative: true,
  },
  motorGearbox: {
    src: '/images/industrial/motor-gearbox.webp',
    alt: 'Endüstriyel motor redüktör ve lineer hareket sistemi',
    width: 1536,
    height: 857,
    position: '68% 50%',
    representative: true,
  },
} satisfies Record<string, SiteImage>;

/** Sayfa bazlı görsel atamaları – gerçek fotoğraflar geldiğinde doldurun. */
export const images: Partial<Record<'hero' | 'about' | 'cta', SiteImage>> = {
  hero: industrial.pressRollers,
};

/** GitHub Pages gibi alt klasörde yayınlarda public/ yollarına basePath ekler. */
export const assetPath = (src: string) =>
  src.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}` : src;
