import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { GuideCards } from '@/components/sections/GuideCards';
import { ServiceCta } from '@/components/sections/ServiceCta';

export const metadata = pageMetadata({
  title: 'Teknik Rehber – Baskı ve Ambalaj Makinelerinde Arıza ve Bakım',
  description:
    'Baskı ve ambalaj makinelerinde arıza bildirimi, sürücü hata kodları ve planlı bakım üzerine kısa teknik yazılar.',
  path: '/rehber',
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Teknik Rehber', path: '/rehber' }]}
        eyebrow="Teknik rehber"
        title={
          <>
            Sahadan
            <br />
            <em>notlar.</em>
          </>
        }
        lead="Bakım ekipleri ve fabrika yetkilileri için kısa, genel teknik yazılar. Yazılar makineye özel talimatların yerine geçmez; iş güvenliği her zaman önceliklidir."
      />
      <section className="bg-ink py-20 sm:py-28" aria-labelledby="yazilar-baslik">
        <h2 id="yazilar-baslik" className="sr-only">Yazılar</h2>
        <div className="container-x">
          <GuideCards />
        </div>
      </section>
      <ServiceCta />
    </>
  );
}
