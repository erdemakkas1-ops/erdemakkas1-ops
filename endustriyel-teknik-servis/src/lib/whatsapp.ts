/**
 * Servis talebi -> WhatsApp mesajı.
 * Bağımlılıksız tutulmuştur; scripts/test-whatsapp.mjs doğrudan içe aktarır.
 */

export type ServiceRequest = {
  urgency: string;
  brand: string;
  otherBrand: string;
  model: string;
  faultType: string;
  description: string;
  city: string;
  district: string;
  contactName: string;
};

export type FieldErrors = Partial<Record<keyof ServiceRequest, string>>;

export const LIMITS = {
  model: 80,
  otherBrand: 60,
  description: { min: 20, max: 1200 },
  city: 40,
  district: 40,
  contactName: 60,
} as const;

const clean = (v: string) => v.replace(/\s+/g, ' ').trim();

export function validateRequest(r: ServiceRequest): FieldErrors {
  const e: FieldErrors = {};
  if (!r.urgency) e.urgency = 'Makinenin durumunu seçin.';
  if (!r.brand) e.brand = 'Makine markasını seçin.';
  if (r.brand === 'Diğer' && !clean(r.otherBrand)) e.otherBrand = 'Makinenin markasını yazın.';
  else if (clean(r.otherBrand).length > LIMITS.otherBrand) e.otherBrand = `En fazla ${LIMITS.otherBrand} karakter.`;
  if (!clean(r.model)) e.model = 'Makine modelini yazın. Bilmiyorsanız “Bilinmiyor” yazabilirsiniz.';
  else if (clean(r.model).length > LIMITS.model) e.model = `En fazla ${LIMITS.model} karakter.`;
  if (!r.faultType) e.faultType = 'Arıza türünü seçin.';
  const d = r.description.trim();
  if (d.length < LIMITS.description.min)
    e.description = `Arızayı biraz daha ayrıntılı anlatın (en az ${LIMITS.description.min} karakter).`;
  else if (d.length > LIMITS.description.max) e.description = `En fazla ${LIMITS.description.max} karakter.`;
  if (!clean(r.city)) e.city = 'Makinenin bulunduğu ili yazın.';
  else if (clean(r.city).length > LIMITS.city) e.city = `En fazla ${LIMITS.city} karakter.`;
  if (clean(r.district).length > LIMITS.district) e.district = `En fazla ${LIMITS.district} karakter.`;
  if (clean(r.contactName).length > LIMITS.contactName) e.contactName = `En fazla ${LIMITS.contactName} karakter.`;
  return e;
}

export function buildServiceMessage(r: ServiceRequest): string {
  const brand = r.brand === 'Diğer' ? `${clean(r.otherBrand)} (Diğer)` : r.brand;
  const location = [clean(r.city), clean(r.district)].filter(Boolean).join(' / ');
  const lines = [
    '*SERVİS TALEBİ*',
    '',
    `*Durum:* ${r.urgency}`,
    `*Makine markası:* ${brand}`,
    `*Makine modeli:* ${clean(r.model)}`,
    `*Arıza türü:* ${r.faultType}`,
    `*Konum (il / ilçe):* ${location}`,
  ];
  if (clean(r.contactName)) lines.push(`*İletişim adı:* ${clean(r.contactName)}`);
  lines.push(
    '',
    '*Arıza açıklaması:*',
    r.description.trim().replace(/\n{3,}/g, '\n\n'),
    '',
    'Arızayla ilgili fotoğraf/videoları bu konuşmada paylaşabilirim.',
  );
  return lines.join('\n');
}

/** Yalnızca rakamlar; 0 ile başlayan yerel numarayı 90 ile başlatır. */
export function normalizeWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `90${digits.slice(1)}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function buildWhatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
