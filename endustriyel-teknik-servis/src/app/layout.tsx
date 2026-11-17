import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileCta } from '@/components/layout/MobileCta';
import { ScrollEffects } from '@/components/animations/ScrollEffects';
import { JsonLd } from '@/components/ui/JsonLd';
import { displayName, site } from '@/data/site';
import { businessJsonLd } from '@/lib/seo';

const heading = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});
const body = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-code', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.defaultTitle, template: `%s | ${displayName}` },
  description: site.description,
  applicationName: displayName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: displayName,
    title: site.defaultTitle,
    description: site.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: site.defaultTitle, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#101820',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          İçeriğe geç
        </a>
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
        <MobileCta />
        <ScrollEffects />
        <JsonLd data={businessJsonLd()} />
      </body>
    </html>
  );
}
