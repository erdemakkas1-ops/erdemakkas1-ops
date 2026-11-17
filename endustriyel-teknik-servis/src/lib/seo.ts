import type { Metadata } from 'next';
import { business, displayName, hasVerifiedBusinessData, site } from '@/data/site';

type PageMeta = { title: string; description: string; path: string };

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = path === '/' ? '/' : path;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${displayName}`,
      description,
      url,
      siteName: displayName,
      locale: site.locale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** Yalnızca doğrulanmış işletme verisi varsa üretilir; aksi halde null. */
export function businessJsonLd() {
  if (!hasVerifiedBusinessData) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: business.name,
    url: site.url,
    description: site.description,
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.serviceArea ? { areaServed: business.serviceArea } : {}),
    ...(business.address ? { address: business.address } : {}),
    ...(business.ownerName ? { founder: { '@type': 'Person', name: business.ownerName } } : {}),
  };
}
