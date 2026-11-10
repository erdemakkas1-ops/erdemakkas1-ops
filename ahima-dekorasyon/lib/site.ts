/** Business details. Source: the brief + @ahima_dekorasyon Instagram (phone and "ankara ruzgarli" in post captions). */
export const business = {
  name: 'Ahima Dekorasyon',
  instagram: 'https://www.instagram.com/ahima_dekorasyon/',
  instagramHandle: '@ahima_dekorasyon',
  phoneDisplay: '0546 226 06 38',
  phoneE164: '905462260638',
  addressLine: 'Rüzgarlı, Çapar İş Hanı',
  city: 'Ankara',
  mapsQuery: 'Çapar İş Hanı Rüzgarlı Ankara',
};

export const DEFAULT_WA_MESSAGE =
  'Merhaba, Ahima Dekorasyon web siteniz üzerinden ulaşıyorum. Tadilat/dekorasyon hizmetiniz hakkında bilgi almak ve keşif talep etmek istiyorum.';

export function whatsappLink(message: string = DEFAULT_WA_MESSAGE) {
  return `https://wa.me/${business.phoneE164}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+${business.phoneE164}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;

export const SERVICES = [
  'Anahtar Teslim Tadilat',
  'Banyo Dekorasyonu',
  'Mutfak Dekorasyonu',
  'Seramik ve Zemin Kaplama',
  'Duşakabin ve Banyo Ürünleri',
  'Yapı ve Dekorasyon Malzemeleri',
] as const;
export type Service = (typeof SERVICES)[number];
