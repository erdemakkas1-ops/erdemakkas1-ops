/**
 * HAKKIMIZDA
 * ------------------------------------------------------------------
 * Deneyim yılı, sertifikalar ve geçmiş yalnızca doğrulanmış bilgilerle doldurulmalıdır.
 * `null` / boş dizi bırakılan alanlar sitede gösterilmez.
 */

import type { SiteImage } from './visuals';

export type AboutConfig = {
  /** Örn. 12 – doğrulanmadan girmeyin */
  experienceYears: number | null;
  /** Örn. "Elektrik Teknikeri", "Mesleki Yeterlilik Belgesi – ..." */
  certifications: string[];
  /** Kısa kariyer geçmişi maddeleri */
  background: string[];
  /** Ustanın fotoğrafı */
  portrait?: SiteImage;
};

export const about: AboutConfig = {
  experienceYears: null,
  certifications: [],
  background: [],
};

/** Teknik yaklaşım – iddia değil, çalışma prensipleri. */
export const principles = [
  {
    title: 'Önce teşhis',
    text: 'Parça değiştirerek deneme yerine; şema, ölçüm ve makinenin davranışı birlikte okunur.',
  },
  {
    title: 'Elektrik ve mekanik birlikte',
    text: 'Bir sürücü hatasının mekanik bir zorlanmadan, bir mekanik sorunun da elektriksel bir sinyalden kaynaklanabileceği göz önünde tutulur.',
  },
  {
    title: 'Açık iletişim',
    text: 'Bulunan neden, yapılan işlem ve kapsam dışı kalan konular işletmeyle açıkça paylaşılır.',
  },
  {
    title: 'Doğrudan muhatap',
    text: 'Talebinizle doğrudan işi yapacak teknik kişi ilgilenir; bilgi aracılar arasında kaybolmaz.',
  },
];
