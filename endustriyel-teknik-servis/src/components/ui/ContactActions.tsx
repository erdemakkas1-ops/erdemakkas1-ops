import { MessageCircle, Phone, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { business } from '@/data/site';

/**
 * Telefon butonu: numara tanımlıysa tel: bağlantısı; değilse iletişim bilgileri bölümüne gider
 * (çalışmayan buton oluşmaz, hayali numara gösterilmez).
 */
export function PhoneButton({ className = '', variant = 'ghost' }: { className?: string; variant?: 'ghost' | 'dark' | 'primary' }) {
  if (phoneHref) {
    return (
      <a href={phoneHref} className={`btn btn-${variant} ${className}`}>
        <Phone className="h-4 w-4" aria-hidden="true" />
        <span>Telefon ile İletişim</span>
      </a>
    );
  }
  return (
    <Link href="/iletisim#iletisim-bilgileri" className={`btn btn-${variant} ${className}`}>
      <Phone className="h-4 w-4" aria-hidden="true" />
      <span>İletişim Bilgileri</span>
    </Link>
  );
}

export function WhatsappButton({ className = '', variant = 'ghost' }: { className?: string; variant?: 'ghost' | 'dark' | 'primary' }) {
  if (!generalWhatsappUrl) return null;
  return (
    <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-${variant} ${className}`}>
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}

/** İletişim kanallarının listesi (iletişim sayfası ve footer) */
export function ContactList({ compact = false }: { compact?: boolean }) {
  const rows = [
    business.phone && { label: 'Telefon', value: business.phone, href: phoneHref! },
    generalWhatsappUrl && { label: 'WhatsApp', value: 'Mesaj gönder', href: generalWhatsappUrl },
    business.email && { label: 'E-posta', value: business.email, href: `mailto:${business.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  if (rows.length === 0) {
    return (
      <p className={`flex gap-3 text-sm leading-relaxed text-mist/70 ${compact ? '' : 'border border-dashed border-mist/25 p-4'}`}>
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>
          Telefon, WhatsApp ve e-posta bilgileri henüz tanımlanmadı. Servis talebinizi{' '}
          <Link href="/iletisim#servis-formu" className="text-white underline decoration-accent underline-offset-4">
            arıza bildirim formu
          </Link>{' '}
          ile hazırlayabilirsiniz.
        </span>
      </p>
    );
  }

  return (
    <ul className={compact ? 'space-y-2' : 'divide-y divide-mist/10 border-y border-mist/10'}>
      {rows.map((r) => (
        <li key={r.label}>
          <a
            href={r.href}
            {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`group flex items-center justify-between gap-4 ${compact ? 'py-1' : 'py-4'}`}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/50">{r.label}</span>
            <span className="flex items-center gap-2 text-right font-medium text-white group-hover:text-accent">
              {r.value}
              {!compact && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
