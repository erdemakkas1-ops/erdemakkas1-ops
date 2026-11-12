import type { Metadata, Viewport } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource-variable/manrope';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahima Dekorasyon — Mekân, sizinle anlam kazanır',
  description:
    'Boş bir salonun kaydırdıkça parke, duvar kaplaması, mobilya ve aydınlatmayla tamamlanan dönüşümü. Demo tasarım.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#231E1A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
