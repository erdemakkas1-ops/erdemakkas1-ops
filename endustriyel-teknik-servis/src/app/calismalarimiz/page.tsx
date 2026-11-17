import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ProjectsGallery } from '@/components/sections/ProjectsGallery';
import { ServiceCta } from '@/components/sections/ServiceCta';

export const metadata = pageMetadata({
  title: 'Çalışmalarımız – Teknik Servis Kayıtları',
  description:
    'Baskı ve ambalaj makinelerinde yapılan teknik servis çalışmaları: makine, arıza kategorisi, müdahale açıklaması ve yapılan işlem.',
  path: '/calismalarimiz',
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Çalışmalarımız', path: '/calismalarimiz' }]}
        eyebrow="Çalışmalarımız"
        title="Sahadan servis kayıtları"
        lead="Her kayıt; makine markası ve modeli, arıza kategorisi, müdahale açıklaması, yapılan işlem ve fotoğraflarla birlikte yayınlanır. Yalnızca gerçek ve paylaşımına izin verilen çalışmalar eklenir."
      />
      <section className="bg-ink py-20 sm:py-28" aria-label="Çalışma galerisi">
        <div className="container-x">
          <ProjectsGallery />
        </div>
      </section>
      <ServiceCta index="" />
    </>
  );
}
