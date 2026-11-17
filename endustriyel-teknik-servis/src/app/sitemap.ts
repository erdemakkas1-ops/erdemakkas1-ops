import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { services } from '@/data/services';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/hizmetler', priority: 0.9 },
    ...services.map((s) => ({ path: `/hizmetler/${s.slug}`, priority: 0.8 })),
    { path: '/makineler', priority: 0.8 },
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
