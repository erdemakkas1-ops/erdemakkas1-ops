export const business = {
  name: 'Çetin Parke',
  instagram: 'https://www.instagram.com/cetin.parke/',
  phoneDisplay: '0543 457 63 64',
  phoneE164: '905434576364',
  location: 'Pamukova, Sakarya',
  address: 'Türkocağı Cad. No:56, Pamukova / Sakarya',
  tagline: 'Parke · Duvar Paneli · Kapı · Banyo — Türkiye geneli kargo',
};
export function whatsappLink(message = 'Merhaba, Çetin Parke ürünleri hakkında bilgi ve fiyat teklifi almak istiyorum.') {
  return `https://wa.me/${business.phoneE164}?text=${encodeURIComponent(message)}`;
}
