import type { Metadata, Viewport } from 'next';
import './globals.css';
import { business } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Çetin Parke | Mekânlara Değer Katıyoruz',
  description: 'Çetin Parke — Pamukova, Sakarya. Parke, iç kapı, banyo dolabı ve duşakabin çözümleri. Ürünleri keşfedin, WhatsApp üzerinden teklif alın.',
  robots: { index: false, follow: false }, // Demo: enable indexing after real assets/content are approved.
  openGraph: { title: 'Çetin Parke — Mekânlara Değer Katıyoruz', description: 'Yaşam alanlarınızda her detay önemlidir.', locale: 'tr_TR', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0d0c' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
