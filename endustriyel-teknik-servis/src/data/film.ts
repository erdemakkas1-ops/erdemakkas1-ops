/**
 * Scroll filmi: sahne metinleri ve 3D etiketler (film saniyesi cinsinden).
 * Sahne zamanlaması components/film/scene.ts içindeki yapım sırasıyla eşleşir.
 */

export const FILM_DURATION = 10;

export const filmScenes = [
  {
    from: 1.4,
    to: 3.3,
    eyebrow: '01 · Teşhis',
    title: ['Makine', 'çizgi çizgi', 'okunur.'],
    lede: 'Teşhise makinenin yapısını anlayarak başlarım: ünite ünite, silindir silindir, devre devre.',
  },
  {
    from: 3.9,
    to: 5.7,
    eyebrow: '02 · Elektrik ve otomasyon',
    title: ['Pano,', 'sinyal,', 'sürücü.'],
    lede: 'Kumanda devrelerini, PLC giriş/çıkışlarını ve motor sürücülerini şema ve ölçümle birlikte okurum.',
    link: { href: '/hizmetler/elektrik-arizalari', label: 'Elektrik arızaları' },
  },
  {
    from: 6.0,
    to: 7.8,
    eyebrow: '03 · Mekanik ve hareket',
    title: ['Hareketin', 'geçtiği', 'her nokta.'],
    lede: 'Silindirleri, rulman yataklarını, redüktör ve servo eksenleri ses, titreşim ve boşluk üzerinden değerlendiririm.',
    link: { href: '/hizmetler/mekanik-bakim', label: 'Mekanik arıza ve onarım' },
  },
] as const;

export const filmFinale = { from: 8.3, to: 10.5 };

export type FilmLabel = {
  at: [number, number, number];
  from: number;
  to: number;
  title: string;
  note: string;
  left?: boolean;
};

export const filmLabels: FilmLabel[] = [
  { at: [-6.42, 1.7, 0.86], from: 4.3, to: 5.8, title: 'PLC', note: 'Giriş / çıkış', left: true },
  { at: [-5.92, 1.63, 0.91], from: 4.4, to: 5.8, title: 'Servo sürücü', note: 'Sürücü sistemleri' },
  { at: [-6.3, 1.25, 0.86], from: 4.5, to: 5.8, title: 'Kumanda', note: 'Kontaktör · koruma' },
  { at: [0.48, 0.8, 1.04], from: 6.5, to: 7.9, title: 'Servo motor', note: 'Hareket kontrol', left: true },
  { at: [0.8, 0.78, 1.25], from: 6.6, to: 7.9, title: 'Redüktör', note: 'Mekanik aktarma' },
  { at: [0.94, 1.33, 0.86], from: 6.7, to: 7.9, title: 'Rulman yatağı', note: 'Yataklama' },
  { at: [-0.8, 2.6, 0.83], from: 8.7, to: 10.5, title: 'Baskı üniteleri', note: 'Silindir grupları' },
  { at: [4.25, 2.36, 0.83], from: 8.8, to: 10.5, title: 'Çıkış', note: 'Delivery' },
];
