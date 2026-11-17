import Link from 'next/link';
import { MessageCircle, Phone, Wrench } from 'lucide-react';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { serviceRequestHref } from '@/data/navigation';

/** Mobilde ekranın altında sabit, kolay erişilebilir servis/iletişim çubuğu */
export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist/15 bg-ink/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <Link href={serviceRequestHref} className="btn btn-primary min-h-12 flex-1 px-3 text-[0.95rem]">
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Arıza Bildir
        </Link>
        {generalWhatsappUrl && (
          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost min-h-12 px-4"
            aria-label="WhatsApp ile yazın"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </a>
        )}
        {phoneHref && (
          <a href={phoneHref} className="btn btn-ghost min-h-12 px-4" aria-label="Telefonla arayın">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
