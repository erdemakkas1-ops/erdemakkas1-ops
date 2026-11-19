import Link from 'next/link';
import { MessageCircle, Phone, Wrench } from 'lucide-react';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { serviceRequestHref } from '@/data/navigation';

/**
 * Mobilde sabit iletişim çubuğu. Ara / WhatsApp yalnızca numara tanımlıysa görünür;
 * tanımlı değilse çubukta yalnızca "Servis talebi" kalır (sahte numara veya başka yere giden buton yok).
 */
export function MobileContactBar() {
  const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold';
  const cols = 1 + (phoneHref ? 1 : 0) + (generalWhatsappUrl ? 1 : 0);
  return (
    <nav
      aria-label="Hızlı iletişim"
      className={`fixed inset-x-0 bottom-0 z-40 grid ${cols === 3 ? 'grid-cols-3' : cols === 2 ? 'grid-cols-2' : 'grid-cols-1'} border-t border-mist/15 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden`}
    >
      {phoneHref && (
        <a href={phoneHref} className={`${item} border-r border-mist/15 text-paper`}>
          <Phone className="h-5 w-5" aria-hidden="true" />
          Ara
        </a>
      )}
      {generalWhatsappUrl && (
        <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className={`${item} border-r border-mist/15 text-paper`}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp
        </a>
      )}
      <Link href={serviceRequestHref} className={`${item} ${cols === 1 ? 'flex-row gap-2 text-[13px]' : ''} bg-accent text-ink`}>
        <Wrench className="h-5 w-5" aria-hidden="true" />
        {cols === 1 ? 'Servis talebi oluştur' : 'Servis talebi'}
      </Link>
    </nav>
  );
}
