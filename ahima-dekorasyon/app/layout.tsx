import type { Metadata, Viewport } from 'next';
import './globals.css';
import { business } from '@/lib/site';
import { media } from '@/lib/media';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://erdemakkas1-ops.github.io/erdemakkas1-ops/ahima-dekorasyon';
// Demo: kept out of search results until the business approves it. Set NEXT_PUBLIC_INDEXABLE=1 at launch.
const indexable = process.env.NEXT_PUBLIC_INDEXABLE === '1';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Ahima Dekorasyon — Anahtar Teslim Tadilat, Banyo ve Mutfak Dekorasyonu | Ankara',
  description: 'Ankara Rüzgarlı’da Ahima Dekorasyon: anahtar teslim tadilat, banyo ve mutfak dekorasyonu, seramik ve zemin kaplama, duşakabin ve yapı malzemeleri. Ücretsiz keşif için 0546 226 06 38.',
  alternates: { canonical: '/' },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: 'Ahima Dekorasyon — Hayalinizdeki Mekânı Gerçeğe Dönüştürüyoruz',
    description: 'Anahtar teslim tadilat, modern dekorasyon ve kaliteli yapı malzemeleri. Ankara.',
    locale: 'tr_TR', type: 'website', siteName: 'Ahima Dekorasyon',
    images: [{ url: `${SITE}/media/og.jpg`, width: 1200, height: 630, alt: 'Ahima Dekorasyon — yenilenmiş banyo konsepti' }],
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1c1d1c', viewportFit: 'cover' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: business.name,
  telephone: '+90 546 226 06 38',
  address: { '@type': 'PostalAddress', streetAddress: business.addressLine, addressLocality: 'Altındağ', addressRegion: 'Ankara', addressCountry: 'TR' },
  areaServed: 'Ankara',
  sameAs: [business.instagram],
  url: SITE,
  knowsAbout: ['Anahtar teslim tadilat', 'Banyo dekorasyonu', 'Mutfak dekorasyonu', 'Seramik ve zemin kaplama', 'Duşakabin', 'Yapı malzemeleri'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preload" as="image" href={`${media.bath.desktop.folder}/0001.webp?v=1`} media="(min-aspect-ratio: 4/5)" />
        <link rel="preload" as="image" href={`${media.bath.mobile.folder}/0001.webp?v=1`} media="(max-aspect-ratio: 4/5)" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#icerik" className="label sr-only z-[60] bg-paper p-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">İçeriğe geç</a>
        {children}
      </body>
    </html>
  );
}
