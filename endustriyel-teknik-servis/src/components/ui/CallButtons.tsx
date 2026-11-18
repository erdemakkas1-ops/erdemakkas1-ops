import { MessageCircle, Phone } from 'lucide-react';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { profile } from '@/data/site';
import { Ph } from './Ph';

/**
 * Usta sitelerindeki gibi telefon önce. Numara tanımlıysa tel: / wa.me; tanımlı değilse şablon numara
 * görünür ve buton iletişim bölümüne gider (çalışmayan arama bağlantısı oluşmaz).
 */
type Variant = 'primary' | 'ghost' | 'dark' | 'outline-dark';

export function CallButton({ className = '', variant = 'primary', fallbackHref = '/iletisim#iletisim-bilgileri' }: { className?: string; variant?: Variant; fallbackHref?: string }) {
  return (
    <a href={phoneHref ?? fallbackHref} className={`btn btn-${variant} ${className}`}>
      <Phone className="h-4 w-4" aria-hidden="true" />
      <span>
        Ara · <Ph f={profile.phone} />
      </span>
    </a>
  );
}

export function WhatsappCta({ className = '', variant = 'ghost', fallbackHref = '/iletisim#servis-formu' }: { className?: string; variant?: Variant; fallbackHref?: string }) {
  const href = generalWhatsappUrl ?? fallbackHref;
  return (
    <a href={href} {...(generalWhatsappUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`btn btn-${variant} ${className}`}>
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span>WhatsApp&apos;tan yaz</span>
    </a>
  );
}
