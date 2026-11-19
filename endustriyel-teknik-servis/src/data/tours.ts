import type { MediaKey } from './media';

/**
 * Kamera turu sahneleri (tek fotoğraf üzerinde kaydırmaya bağlı yakınlaşma ve bölge vurgusu).
 * focus: görselin yüzde koordinatı; zoom: o adımdaki yakınlaşma (1 = tüm görsel).
 * hotspots: YALNIZCA görselde gerçekten görünen parçalar; ölçüm değeri / teşhis yazılmaz.
 * Görsel değişirse koordinatları yeni görsele göre güncelleyin.
 */
export type TourStep = {
  title: string;
  text: string;
  focus: { x: number; y: number; zoom: number };
  hotspots: { x: number; y: number; title: string; note?: string; left?: boolean }[];
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
      focus: { x: 34, y: 28, zoom: 1.45 },
      hotspots: [
        { x: 33, y: 22, title: 'Silindir grubu' },
        { x: 35, y: 57, title: 'Yağlama hattı', left: true },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Rulman ve mil sistemleri',
      text: 'Miller, yataklar ve kaplinler boşluk, aşınma ve hizalama açısından kontrol edilir; montajda ayar değerleri korunur.',
      focus: { x: 44, y: 66, zoom: 1.75 },
      hotspots: [
        { x: 31, y: 68, title: 'Mil', left: true },
        { x: 43.5, y: 61, title: 'Yatak' },
        { x: 50.5, y: 69, title: 'Kaplin' },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Aktarma organları',
      text: 'Dişli kademeleri, kayış ve zincirler; diş aşınması, boşluk ve yağlama durumu üzerinden değerlendirilir.',
      focus: { x: 73, y: 58, zoom: 1.6 },
      hotspots: [
        { x: 78, y: 44, title: 'Dişli çark', left: true },
        { x: 68, y: 73, title: 'Dişli kademesi', left: true },
        { x: 85, y: 63, title: 'Yağlama hattı' },
      ],
      link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
    },
    {
      title: 'Makine revizyonu',
      text: 'Belirli bir ünite planlı biçimde elden geçirilir; bulgular öncelik sırasıyla paylaşılır.',
      focus: { x: 50, y: 48, zoom: 1.05 },
      hotspots: [
        { x: 4, y: 24, title: 'Yan çerçeve yatakları' },
        { x: 62, y: 22, title: 'Silindir grubu', left: true },
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
      focus: { x: 56, y: 22, zoom: 1.55 },
      hotspots: [
        { x: 48.5, y: 19, title: 'PLC CPU', left: true },
        { x: 58.5, y: 21, title: 'G/Ç modülleri' },
        { x: 72.5, y: 19, title: 'Haberleşme modülleri' },
      ],
      link: { href: '/hizmetler/plc-otomasyon', label: 'PLC ve otomasyon' },
    },
    {
      title: 'Endüstriyel sürücüler',
      text: 'Frekans sürücülerinde hata kaydı, motor ve kablo ölçümleri ile yük tarafı birlikte değerlendirilir.',
      focus: { x: 42, y: 50, zoom: 1.9 },
      hotspots: [{ x: 41, y: 47, title: 'Frekans sürücüsü', left: true }],
      link: { href: '/hizmetler/surucu-servo-sistemleri', label: 'Sürücü ve servo sistemleri' },
    },
    {
      title: 'Servo kontrol sistemleri',
      text: 'Servo eksenlerde geri besleme, parametre ve mekanik yük birlikte ele alınır; parametreler değiştirilmeden önce yedeklenir.',
      focus: { x: 49, y: 50, zoom: 2 },
      hotspots: [
        { x: 49.5, y: 45, title: 'Sürücü modülü' },
        { x: 49.5, y: 64, title: 'Motor kabloları' },
      ],
      link: { href: '/hizmetler/surucu-servo-sistemleri', label: 'Sürücü ve servo sistemleri' },
    },
    {
      title: 'Elektriksel arıza tespiti',
      text: 'Besleme, koruma elemanları, kontaktörler ve bağlantılar şema ve ölçümle kontrol edilir; arızanın kaynağı somut veriye dayandırılır.',
      focus: { x: 62, y: 58, zoom: 1.35 },
      hotspots: [
        { x: 60, y: 42, title: 'Sigortalar', left: true },
        { x: 67.5, y: 44, title: 'Kontaktörler' },
        { x: 54, y: 81, title: 'Klemens sırası' },
      ],
      link: { href: '/hizmetler/elektrik-arizalari', label: 'Elektrik arızaları' },
    },
  ],
};
