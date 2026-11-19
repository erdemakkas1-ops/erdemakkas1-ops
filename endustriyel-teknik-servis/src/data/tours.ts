import type { MediaKey } from './media';

/**
 * Kamera turu sahneleri (tek fotoğraf üzerinde kaydırmaya bağlı yakınlaşma ve bölge vurgusu).
 * focus: görselin yüzde koordinatı; zoom: o adımdaki yakınlaşma (1 = tüm görsel).
 * hotspots: YALNIZCA görselde gerçekten görünen parçalar; ölçüm değeri / teşhis yazılmaz.
 * Koordinatlar onaylı görseller üzerine %5'lik ızgara konarak ölçüldü (x: soldan, y: yukarıdan, görselin %'si).
 * Nokta parçanın gövdesine konur. `side`: tercih edilen etiket yönü (varsayılan sağ) (ekrana sığmazsa FocusTour çevirir).
 * Görsel değişirse koordinatları yeni görsele göre yeniden ölçün (geliştirme ortamında ?debug ile kontrol).
 */
export type LabelSide = 'right' | 'left' | 'top' | 'bottom';

export type TourStep = {
  title: string;
  text: string;
  focus: { x: number; y: number; zoom: number };
  hotspots: { x: number; y: number; title: string; note?: string; side?: LabelSide }[];
  link?: { href: string; label: string };
};

export type Tour = {
  id: string;
  media: MediaKey;
  eyebrow: string;
  heading: [string, string];
  intro: string;
  steps: TourStep[];
};

export const mechanicalTour: Tour = {
  id: 'mekanik',
  media: 'mechanical',
  eyebrow: 'Mekanik sistemler',
  heading: ['Hareketin geçtiği', 'her nokta.'],
  intro: 'Silindirler, miller, yataklar ve dişli aktarması birbirine bağlıdır; bir noktadaki boşluk zamanla diğerlerini de etkiler.',
  steps: [
    {
      title: 'Mekanik arıza tespiti',
      text: 'Ses, titreşim, ısınma ve baskıdaki kayma gibi belirtiler makine başında dinlenir, gözlenir ve elle kontrol edilir; gereksiz söküm yapılmaz.',
      focus: { x: 36, y: 34, zoom: 1.45 },
      hotspots: [
        // sol silindir demeti (gövde ortası)
        { x: 33, y: 24, title: 'Silindir grubu' },
        // bakır yağlama borusu, yatağın solundaki düz kısım
        { x: 36, y: 57.3, title: 'Yağlama hattı' },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Rulman ve mil sistemleri',
      text: 'Miller, yataklar ve kaplinler boşluk, aşınma ve hizalama açısından kontrol edilir; montajda ayar değerleri korunur.',
      focus: { x: 44, y: 68, zoom: 1.75 },
      hotspots: [
        // parlak mil gövdesi
        { x: 33.5, y: 68.5, title: 'Mil', side: 'left' },
        // yataklı mil desteği (pillow block) gövdesi
        { x: 44, y: 66, title: 'Rulman yatağı', side: 'left' },
        // yatağın sağındaki kaplin
        { x: 51, y: 70, title: 'Kaplin' },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Aktarma organları',
      text: 'Dişli kademeleri, kayış ve zincirler; diş aşınması, boşluk ve yağlama durumu üzerinden değerlendirilir.',
      focus: { x: 74, y: 62, zoom: 1.55 },
      hotspots: [
        // üstteki büyük dişli çarkın göbeği
        { x: 78.4, y: 46.8, title: 'Dişli çark', side: 'left' },
        // alttaki eşleşen dişli (göbek)
        { x: 70.3, y: 76.7, title: 'Dişli kademesi', side: 'left' },
        // sağdaki bakır yağlama borusu (dikey kısım)
        { x: 83.8, y: 70, title: 'Yağlama hattı' },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Makine revizyonu',
      text: 'Belirli bir ünite planlı biçimde elden geçirilir; bulgular öncelik sırasıyla paylaşılır.',
      focus: { x: 58, y: 50, zoom: 1.08 },
      hotspots: [
        // sağ silindir demeti
        { x: 63, y: 24, title: 'Silindir grubu', side: 'left' },
        // dişli aktarması (üst dişli)
        { x: 78.4, y: 46.8, title: 'Dişli aktarması' },
        // mil hattı: yatak + kaplin
        { x: 47.5, y: 70, title: 'Mil hattı', side: 'left' },
      ],
      link: { href: '/hizmetler/makine-revizyonu', label: 'Revizyon ve periyodik bakım' },
    },
  ],
};

export const controlTour: Tour = {
  id: 'otomasyon',
  media: 'electrical',
  eyebrow: 'PLC ve otomasyon',
  heading: ['Panonun içinden', 'başlayan teşhis.'],
  intro: 'Makinenin kumanda tarafı tek bir panoda buluşur: PLC, sürücüler, koruma elemanları ve yüzlerce bağlantı.',
  steps: [
    {
      title: 'PLC ve otomasyon arızaları',
      text: 'Makinenin hangi adımda beklediği, alarm geçmişi ve giriş/çıkış durumları üzerinden bulunur; sinyal sahadan PLC’ye kadar izlenir.',
      focus: { x: 59, y: 20, zoom: 1.55 },
      hotspots: [
        // rafın en solundaki CPU modülü (havalandırma ızgaralı ön yüz)
        { x: 47.8, y: 16.5, title: 'PLC CPU', side: 'left' },
        // açık mavi etiketli giriş/çıkış modülleri
        { x: 57.5, y: 18, title: 'G/Ç modülleri', side: 'bottom' },
        // RJ45 portlu haberleşme / ağ modülleri
        { x: 73.5, y: 16, title: 'Haberleşme modülleri' },
      ],
      link: { href: '/hizmetler/plc-otomasyon', label: 'PLC ve otomasyon' },
    },
    {
      title: 'Endüstriyel sürücüler',
      text: 'Frekans sürücülerinde hata kaydı, motor ve kablo ölçümleri ile yük tarafı birlikte değerlendirilir.',
      focus: { x: 42, y: 50, zoom: 1.9 },
      // tuş takımlı sürücünün ekran / tuş takımı bölgesi
      hotspots: [{ x: 41.2, y: 46.5, title: 'Frekans sürücüsü' }],
      link: { href: '/hizmetler/surucu-servo-sistemleri', label: 'Sürücü ve servo sistemleri' },
    },
    {
      title: 'Servo kontrol sistemleri',
      text: 'Servo eksenlerde geri besleme, parametre ve mekanik yük birlikte ele alınır; parametreler değiştirilmeden önce yedeklenir.',
      focus: { x: 49.5, y: 52, zoom: 2 },
      hotspots: [
        // ikinci (dar) sürücü modülünün ön yüzü
        { x: 49.5, y: 45, title: 'Sürücü modülü' },
        // modülün altından çıkan ekranlı motor kabloları
        { x: 49.2, y: 65, title: 'Motor kabloları' },
      ],
      link: { href: '/hizmetler/surucu-servo-sistemleri', label: 'Sürücü ve servo sistemleri' },
    },
    {
      title: 'Elektriksel arıza tespiti',
      text: 'Besleme, koruma elemanları, kontaktörler ve bağlantılar şema ve ölçümle kontrol edilir; arızanın kaynağı somut veriye dayandırılır.',
      focus: { x: 63, y: 60, zoom: 1.35 },
      hotspots: [
        // üst raydaki beyaz, kırmızı kollu otomatik sigortalar
        { x: 59.5, y: 44, title: 'Sigortalar', side: 'left' },
        // sigortaların sağındaki kontaktörler
        { x: 67.3, y: 44.5, title: 'Kontaktörler' },
        // alt raydaki klemens grubu
        { x: 61, y: 81, title: 'Klemens sırası' },
      ],
      link: { href: '/hizmetler/elektrik-arizalari', label: 'Elektrik arızaları' },
    },
  ],
};
