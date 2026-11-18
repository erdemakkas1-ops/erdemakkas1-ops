import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { machineBrands } from '@/data/machines';
import { guides } from '@/data/guides';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/hizmetler', priority: 0.9 },
    ...services.map((s) => ({ path: `/hizmetler/${s.slug}`, priority: 0.8 })),
    { path: '/makineler', priority: 0.8 },
    ...machineBrands.map((b) => ({ path: `/makineler/${b.id}`, priority: 0.8 })),
    { path: '/rehber', priority: 0.6 },
    ...guides.map((g) => ({ path: `/rehber/${g.slug}`, priority: 0.5 })),
    { path: '/calismalarimiz', priority: 0.6 },
    { path: '/hakkimizda', priority: 0.6 },
    { path: '/iletisim', priority: 0.9 },
    { path: '/gizlilik', priority: 0.2 },
  ];
  return paths.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  }));
}
