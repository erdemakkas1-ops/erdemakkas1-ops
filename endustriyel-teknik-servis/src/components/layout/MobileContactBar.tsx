import Link from 'next/link';
import { MessageCircle, Phone, Wrench } from 'lucide-react';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { serviceRequestHref } from '@/data/navigation';

/**
 * Mobilde sabit iletişim çubuğu: Ara · WhatsApp · Servis talebi.
 * Numara tanımlı değilse sahte numara yok: Ara → iletişim bilgileri, WhatsApp → form.
 */
export function MobileContactBar() {
  const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold';
  return (
    <nav
      aria-label="Hızlı iletişim"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-mist/15 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <a href={phoneHref ?? '/iletisim#iletisim-bilgileri'} className={`${item} text-paper`}>
        <Phone className="h-5 w-5" aria-hidden="true" />
        Ara
      </a>
      <a
        href={generalWhatsappUrl ?? '/iletisim#servis-formu'}
        {...(generalWhatsappUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${item} border-x border-mist/15 text-paper`}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        WhatsApp
      </a>
      <Link href={serviceRequestHref} className={`${item} bg-accent text-ink`}>
        <Wrench className="h-5 w-5" aria-hidden="true" />
        Servis talebi
      </Link>
    </nav>
  );
}
