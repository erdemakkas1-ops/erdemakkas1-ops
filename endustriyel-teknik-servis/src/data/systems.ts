import type { MediaKey } from './media';

/**
 * SAHNE 2 — Teknik sistemler: bölümler, açıklamalar ve görsel üzerindeki etiketler.
 * Etiket konumları ilgili fotoğrafın yüzde koordinatlarıdır (data/media.ts). Gemini görseli gelince güncelleyin.
 */
export const systemChapters: {
  key: string;
  index: string;
  label: string;
  title: [string, string];
  text: string;
  points: string[];
  media: MediaKey;
  service: string;
  hotspots: { x: number; y: number; title: string; note?: string; left?: boolean }[];
}[] = [
  {
    key: 'elektrik',
    index: '01',
    label: 'Elektrik ve kontrol',
    title: ['Pano ve', 'kumanda devreleri.'],
    text: 'Besleme, koruma elemanları, kontaktörler ve kumanda hatları; şema ve ölçümle birlikte okunur. Arızanın elektriksel mi, başka bir yerden mi kaynaklandığı burada ayrışır.',
    points: ['Elektrik panoları', 'Motor kumanda sistemleri', 'Elektriksel arıza teşhisi'],
    media: 'electrical',
    service: 'elektrik-arizalari',
    hotspots: [
      { x: 72, y: 48, title: 'Kontaktör grubu', note: 'Motor kumandası', left: true },
      { x: 61, y: 67, title: 'Sigortalar', note: 'Koruma elemanları', left: true },
      { x: 66, y: 83, title: 'Klemens sırası', note: 'Bağlantı · gevşeklik' },
    ],
  },
  {
    key: 'plc',
    index: '02',
    label: 'PLC ve otomasyon',
    title: ['Makine neyi', 'bekliyor?'],
    text: 'Duruşların çoğu bir bekleyiştir: gelmeyen bir sensör sinyali ya da tamamlanmayan bir hareket. Giriş/çıkış durumları ve alarm geçmişi sahadan PLC’ye kadar izlenir.',
    points: ['PLC arıza teşhisi', 'Giriş/çıkış takibi', 'Sensör ve aktüatör kontrolü'],
    media: 'plc',
    service: 'plc-otomasyon',
    hotspots: [
      { x: 62, y: 27, title: 'PLC rafı', note: 'Giriş / çıkış modülleri', left: true },
      { x: 58, y: 36, title: 'Sinyal kabloları', note: 'Sahadan PLC’ye' },
    ],
  },
  {
    key: 'servo',
    index: '03',
    label: 'Sürücü ve servo',
    title: ['Hata kodundan', 'mekaniğe.'],
    text: 'Aşırı akım, enkoder ya da aşırı sıcaklık hatası; kaynağı sürücü, kablo, motor ya da sıkışan bir mekanizma olabilir. Hata geçmişi, motor-kablo ölçümleri ve yük tarafı birlikte değerlendirilir.',
    points: ['Motor sürücüsü arızaları', 'Servo motor ve sürücüler', 'Hareket kontrol bileşenleri'],
    media: 'servo',
    service: 'surucu-servo-sistemleri',
    hotspots: [
      { x: 78, y: 24, title: 'Servo sürücüler', note: 'Hata geçmişi · parametre', left: true },
      { x: 81, y: 38, title: 'Motor ve enkoder hatları', note: 'Kablo · konnektör' },
    ],
  },
  {
    key: 'mekanik',
    index: '04',
    label: 'Mekanik aktarma',
    title: ['Hareketin geçtiği', 'her nokta.'],
    text: 'Motor-redüktör grupları, rulmanlar, kaplinler ve lineer hareket elemanları; ses, titreşim, boşluk ve ısınma üzerinden değerlendirilir.',
    points: ['Rulman ve yataklama', 'Mekanik aktarma organları', 'Lineer hareket bileşenleri'],
    media: 'mechanical',
    service: 'mekanik-bakim',
    hotspots: [
      { x: 56, y: 47, title: 'Servo motor', note: 'Hareket kontrol', left: true },
      { x: 64, y: 58, title: 'Redüktör', note: 'Mekanik aktarma' },
      { x: 90, y: 32, title: 'Lineer kızak', note: 'Yataklama · yağlama', left: true },
    ],
  },
];
