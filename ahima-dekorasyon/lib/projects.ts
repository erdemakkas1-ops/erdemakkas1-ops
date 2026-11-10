import { asset } from './asset';

/**
 * Completed work, ONLY from Ahima Dekorasyon's own Instagram reels (stills taken from the videos).
 * Each entry links to its post. Captions describe what is visible; place names come from the post text.
 */
export type Photo = { src: string; small: string; alt: string };
export type Project = { id: string; title: string; place?: string; summary: string; post: string; photos: Photo[] };

const p = (name: string, alt: string): Photo => ({ src: asset(`/projects/${name}.webp`), small: asset(`/projects/${name}-s.webp`), alt });

export const projects: Project[] = [
  {
    id: 'batikent',
    title: 'Anahtar teslim daire',
    place: 'Batıkent',
    summary: 'Dairenin anahtar teslim işi: gizli LED’li asma tavanlar, cam kapaklı ve aydınlatmalı mutfak dolapları, mermer görünümlü zeminler, banyo ve duşakabin.',
    post: 'https://www.instagram.com/p/DXUhXYGCFZX/',
    photos: [
      p('batikent-mutfak', 'Batıkent dairesi: LED aydınlatmalı asma tavan altında mermer tezgâhlı mutfak'),
      p('batikent-yemek', 'Batıkent dairesi: boydan boya cam cepheli yemek alanı'),
      p('batikent-vitrin', 'Batıkent dairesi: içi LED aydınlatmalı cam vitrin dolap'),
      p('batikent-koridor', 'Batıkent dairesi: gizli LED’li tavan ve parlak mermer görünümlü zeminli koridor'),
      p('batikent-boy-dolap', 'Batıkent dairesi: ankastre fırınlı boy dolap ve cam kapaklı üst dolaplar'),
      p('batikent-banyo', 'Batıkent dairesi: gri mermer görünümlü seramik, asma klozet ve banyo dolabı'),
      p('batikent-dus', 'Batıkent dairesi: cam duşakabin ve gri seramik kaplama'),
    ],
  },
  {
    id: 'incek',
    title: 'Komple banyo yenileme',
    place: 'İncek',
    summary: 'Pudra pembe lake dolap, altın detaylı lavabo ve klozet, altın profilli duşakabin ve bitki desenli vurgu duvarı.',
    post: 'https://www.instagram.com/p/C2aAb2ONZ9j/',
    photos: [
      p('incek-lavabo', 'İncek banyosu: pudra pembe dolap üzerinde altın detaylı tezgâh üstü lavabo'),
      p('incek-dus', 'İncek banyosu: altın profilli duşakabin ve bitki desenli duvar'),
      p('incek-genel', 'İncek banyosu: genel görünüm, asma klozet ve duşakabin'),
    ],
  },
];

export const moreWork: (Photo & { title: string; post: string })[] = [
  { ...p('lavabo-mermer', 'Mermer görünümlü çift gözlü lavabo, kırmızı seramik duvar ve LED aynalar'), title: 'Çift gözlü mermer lavabo', post: 'https://www.instagram.com/p/DeSCtIIIJhZ/' },
  { ...p('dus-siyah-mermer', 'Siyah mermer görünümlü duş duvarı ve cam bölme'), title: 'Siyah mermer duş', post: 'https://www.instagram.com/p/DeRJxC5oVeT/' },
  { ...p('led-merdiven', 'LED aydınlatmalı basamaklar ve cam korkuluklu merdiven'), title: 'LED’li merdiven', post: 'https://www.instagram.com/p/DeRKcOOIkpc/' },
  { ...p('yesil-seramik-banyo', 'Yeşil metro seramikli duş alanı, banyo dolabı ve boy dolap'), title: 'Yeşil seramikli banyo', post: 'https://www.instagram.com/p/DePrPwnR-eV/' },
  { ...p('kurna', 'Çizgili mermer kaplama ve taş kurna'), title: 'Kurnalı ıslak hacim', post: 'https://www.instagram.com/p/DeRJxC5oVeT/' },
  { ...p('beyaz-mutfak', 'Beyaz lake mutfak dolapları, teslim aşaması'), title: 'Beyaz mutfak, teslim', post: 'https://www.instagram.com/p/DePj99vxAZA/' },
];

export const projectPhoto = (name: string) => p(name, '');
