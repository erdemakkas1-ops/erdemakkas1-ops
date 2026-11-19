import { business } from '@/data/site';
import { normalizeWhatsappNumber, buildWhatsappUrl } from './whatsapp';

export const whatsappNumber = normalizeWhatsappNumber(business.whatsapp);
export const phoneHref = business.phone ? `tel:${business.phone.replace(/[^\d+]/g, '')}` : null;
export const emailHref = business.email ? `mailto:${business.email}` : null;

export const generalWhatsappUrl = whatsappNumber
  ? buildWhatsappUrl(whatsappNumber, 'Merhaba, makinemizdeki bir arıza için teknik destek almak istiyoruz.')
  : null;

/** Telefon veya WhatsApp'tan en az biri tanımlı mı (doğrudan iletişim kanalı var mı) */
export const hasDirectContact = Boolean(phoneHref || generalWhatsappUrl);
