import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { About } from '@/components/sections/About';
import { Process } from '@/components/sections/Process';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { business } from '@/data/site';

export const metadata = pageMetadata({
  title: 'Hakkımda – Bağımsız Teknik Servis',
  description:
    'Baskı ve ambalaj makinelerinde elektrik, mekanik ve otomasyon bilgisini bir arada kullanan bağımsız teknik servis uzmanının çalışma yaklaşımı.',
  path: '/hakkimizda',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Hakkımda', path: '/hakkimizda' }]}
        eyebrow="Hakkımda"
        title={business.ownerName ?? 'Doğrudan ulaşılabilir teknik uzmanlık'}
        lead="Fabrika yetkilileri için en değerli şey; arızayı anlayan, açıkça konuşan ve makinenin başına gelen bir muhataptır."
      />
      <About full />
      <Process index="" />
      <ServiceCta index="" />
    </>
  );
}
