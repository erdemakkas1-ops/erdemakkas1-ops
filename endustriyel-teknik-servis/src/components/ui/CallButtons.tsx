import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { generalWhatsappUrl, hasDirectContact, phoneHref } from '@/lib/contact';
import { business } from '@/data/site';

/**
 * Telefon / WhatsApp butonları YALNIZCA ilgili numara tanımlıysa görünür (src/data/site.ts veya
 * NEXT_PUBLIC_PHONE / NEXT_PUBLIC_WHATSAPP_NUMBER). Numara yokken buton hiç çıkmaz: hazır olmayan bir kanal
 * gerçek iletişim seçeneği gibi gösterilmez, başka yere yönlendiren "sahte" buton oluşmaz.
 */
type Variant = 'primary' | 'ghost' | 'dark' | 'outline-dark';

export function CallButton({ className = '', variant = 'primary' }: { className?: string; variant?: Variant }) {
  if (!phoneHref || !business.phone) return null;
  return (
    <a href={phoneHref} className={`btn btn-${variant} ${className}`}>
      <Phone className="h-4 w-4" aria-hidden="true" />
      <span>Ara · {business.phone}</span>
    </a>
  );
}

export function WhatsappCta({ className = '', variant = 'ghost' }: { className?: string; variant?: Variant }) {
  if (!generalWhatsappUrl) return null;
  return (
    <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-${variant} ${className}`}>
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span>WhatsApp&apos;tan yaz</span>
    </a>
  );
}

/**
 * Ara + WhatsApp. İkisi de tanımlı değilse (numara henüz girilmemişse) yerine açıkça etiketlenmiş tek bir
 * "servis talebi" bağlantısı gösterilir; böylece bölüm boş kalmaz ve hiçbir buton yanıltıcı olmaz.
 */
export function ContactButtons({
  fallbackHref,
  fallbackLabel = 'Servis talebi oluştur',
  callVariant = 'primary',
  whatsappVariant = 'ghost',
  buttonClassName = '',
}: {
  fallbackHref: string;
  fallbackLabel?: string;
  callVariant?: Variant;
  whatsappVariant?: Variant;
  buttonClassName?: string;
}) {
  if (!hasDirectContact) {
    return (
      <Link href={fallbackHref} className={`btn btn-${callVariant} ${buttonClassName}`}>
        {fallbackLabel} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }
  return (
    <>
      <CallButton variant={callVariant} className={buttonClassName} />
      <WhatsappCta variant={whatsappVariant} className={buttonClassName} />
    </>
  );
}
