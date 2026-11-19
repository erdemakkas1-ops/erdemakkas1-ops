/**
 * SİNEMATİK SAHNE GÖRSELLERİ (asset slot'ları)
 * ------------------------------------------------------------------
 * Her slot bir fotoğraf alanıdır. `file` uzantısız yoldur; aynı adla hem `.avif` hem `.webp` beklenir.
 * Gemini görselleri hazır olduğunda:
 *   1. Görseli `public/images/cinema/<gemini dosya adı>.webp` ve `.avif` olarak koyun
 *      (en az 2400×1350, 16:9; AVIF/WebP'ye çevirmek için: python3 scripts/optimize-images.py)
 *   2. Aşağıdaki ilgili slotta `file` değerini `/images/cinema/<ad>` yapın, `position` ile odak noktasını ayarlayın.
 * Görsel istemleri (prompt) ve kurallar: GEMINI-GORSELLER.md
 *
 * Şu an elimizdeki 3 gerçek fotoğraf kullanılıyor (temsilî). Aynı fotoğrafın farklı bölgesine
 * `position` + `zoom` ile odaklanılıyor (ör. pano fotoğrafındaki PLC ve servo sürücüler).
 */

export type MediaSlot = {
  /** Uzantısız yol: /images/... (.avif ve .webp) */
  file: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position: odak noktası */
  position: string;
  /** Sahnedeki başlangıç yakınlaşması (1 = yok) */
  zoom?: number;
  /** Gemini ile üretilecek görselin hedef dosya adı (public/images/cinema/) */
  gemini: string;
  /** Temsilî görsel mi (gerçek servis işi değil) */
  representative: boolean;
};

const PRESS = '/images/industrial/printing-press-rollers';
const PANEL = '/images/industrial/electrical-panel';
const GEARBOX = '/images/industrial/motor-gearbox';

export const media = {
  /** SAHNE 1 – açılış: fabrikada büyük baskı makinesi */
  heroMachine: {
    file: PRESS,
    alt: 'Fabrika ortamında endüstriyel baskı makinesinin silindir grubu ve yan çerçeveleri',
    width: 1536,
    height: 857,
    position: '68% 50%',
    gemini: 'hero-baski-makinesi',
    representative: true,
  },
  /** SAHNE 2 – elektrik ve kontrol panosu */
  electrical: {
    file: PANEL,
    alt: 'Kontaktör, sigorta ve klemens sıraları görünen endüstriyel elektrik panosu',
    width: 1536,
    height: 857,
    position: '74% 60%',
    gemini: 'sistem-elektrik-pano',
    representative: true,
  },
  /** SAHNE 2 – PLC */
  plc: {
    file: PANEL,
    alt: 'Elektrik panosunda PLC modül rafı ve kablo bağlantıları',
    width: 1536,
    height: 857,
    position: '62% 26%',
    zoom: 1.9,
    gemini: 'sistem-plc',
    representative: true,
  },
  /** SAHNE 2 – servo sürücüler */
  servo: {
    file: PANEL,
    alt: 'Panoda yan yana montajlı iki motor sürücüsü ve kabloları',
    width: 1536,
    height: 857,
    position: '82% 28%',
    zoom: 2.2,
    gemini: 'sistem-servo-surucu',
    representative: true,
  },
  /** SAHNE 2 – mekanik tahrik */
  mechanical: {
    file: GEARBOX,
    alt: 'Lineer hareket sistemine bağlı motor-redüktör grubu ve kablo zinciri',
    width: 1536,
    height: 857,
    position: '68% 50%',
    gemini: 'sistem-mekanik-tahrik',
    representative: true,
  },
  /** SAHNE 3 – servis ve müdahale (Gemini görseli gelene kadar baskı makinesi detayı) */
  service: {
    file: PRESS,
    alt: 'Baskı makinesinde silindir yatakları ve hidrolik hatların yakın görünümü',
    width: 1536,
    height: 857,
    position: '58% 40%',
    zoom: 1.35,
    gemini: 'servis-mudahale',
    representative: true,
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;

/** Sahne 1'de görselin üzerinde beliren teknik detay etiketleri (yüzde konumlar görsele göre) */
export const heroHotspots = [
  { x: 56, y: 26, title: 'Hidrolik ve pnömatik hatlar', note: 'Bağlantı · kaçak kontrolü' },
  { x: 57, y: 47, title: 'Rulman yatağı', note: 'Ses · ısı · boşluk' },
  { x: 86, y: 36, title: 'Silindir grubu', note: 'Yüzey · yataklama · tahrik' },
];
