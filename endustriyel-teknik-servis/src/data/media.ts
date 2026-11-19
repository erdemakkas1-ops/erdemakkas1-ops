/**
 * SİNEMATİK SAHNE GÖRSELLERİ (asset slot'ları)
 * ------------------------------------------------------------------
 * Onaylanmış 4 fotogerçekçi görsel (Gemini). Her görsel duyarlı set olarak tutulur:
 *   public/images/cinema/<ad>-<genişlik>.avif / .webp  (960, 1600, 2400)
 * Yeni görsel eklemek / değiştirmek:
 *   python3 scripts/optimize-images.py <kaynak.jpg> public/images/cinema/<ad>
 * ardından aşağıdaki slotta `file`, `width`, `height`, `widths` değerlerini güncelleyin.
 * Görseller temsilîdir; gerçek bir müşteri işi gibi sunulmaz. Kurallar ve istemler: GEMINI-GORSELLER.md
 */

export type MediaSlot = {
  /** Uzantısız yol: /images/... */
  file: string;
  alt: string;
  width: number;
  height: number;
  /** Duyarlı genişlikler (dosya adında -<w> soneki); yoksa tek dosya */
  widths?: number[];
  /** CSS object-position: odak noktası (mobil kırpma için önemli) */
  position: string;
  /** Başlangıç yakınlaşması (1 = yok) */
  zoom?: number;
  representative: boolean;
};

const C = '/images/cinema';

export const media = {
  /** Görsel 01 – açılış: fabrikada endüstriyel baskı makinesi (makine sağda, sol taraf başlık için boş) */
  heroMachine: {
    file: `${C}/hero-baski-makinesi`,
    alt: 'Loş fabrika salonunda çok üniteli endüstriyel ofset baskı makinesi ve kâğıt istifi',
    width: 2752,
    height: 1536,
    widths: [960, 1600, 2400],
    position: '72% 50%',
    representative: true,
  },
  /** Görsel 02 – mekanik: dişliler, miller, yatak ve baskı silindirleri */
  mechanical: {
    file: `${C}/sistem-mekanik-tahrik`,
    alt: 'Baskı makinesi iç görünümü: dişli çarklar, mil, yatak, kaplin, yağlama hatları ve silindirler',
    width: 2752,
    height: 1536,
    widths: [960, 1600, 2400],
    position: '55% 50%',
    representative: true,
  },
  /** Görsel 03 – PLC ve otomasyon: elektrik panosu */
  electrical: {
    file: `${C}/sistem-elektrik-pano`,
    alt: 'Kapağı açık endüstriyel elektrik panosu: PLC rafı, motor sürücüleri, sigortalar, kontaktörler ve klemensler',
    width: 1600,
    height: 900,
    widths: [960, 1600],
    position: '58% 45%',
    representative: true,
  },
  /** Görsel 04 – saha teknisyeni */
  service: {
    file: `${C}/servis-mudahale`,
    alt: 'Teknisyen, kapağı açık baskı ünitesinin silindirlerini el feneriyle kontrol ediyor; yerde alet çantası ve multimetre',
    width: 2752,
    height: 1536,
    widths: [960, 1600, 2400],
    position: '45% 50%',
    representative: true,
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
