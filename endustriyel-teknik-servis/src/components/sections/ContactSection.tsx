import Link from 'next/link';
import { business } from '@/data/site';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { ServiceRequestForm } from '@/components/forms/ServiceRequestForm';

/** Maviron'daki "Ölçüyü alalım" bölümü gibi: solda başlık + bilgi tablosu, sağda form. */
export function ContactSection() {
  const rows: { k: string; v: React.ReactNode }[] = [
    { k: 'Telefon', v: business.phone && phoneHref ? <a href={phoneHref} className="underline decoration-mist/40 underline-offset-4 hover:text-accent">{business.phone}</a> : <span className="text-mist/55">Eklenecek</span> },
    {
      k: 'WhatsApp',
      v: generalWhatsappUrl ? (
        <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-mist/40 underline-offset-4 hover:text-accent">
          Mesaj gönder
        </a>
      ) : (
        <span className="text-mist/55">Eklenecek</span>
      ),
    },
    { k: 'E-posta', v: business.email ? <a href={`mailto:${business.email}`} className="underline decoration-mist/40 underline-offset-4 hover:text-accent">{business.email}</a> : <span className="text-mist/55">Eklenecek</span> },
    { k: 'Bölge', v: business.serviceArea ?? <span className="text-mist/55">Ön değerlendirmede netleşir</span> },
  ];
  return (
    <section id="servis-talebi" className="bg-ink py-24 sm:py-32" aria-labelledby="cta-baslik">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            İletişim · Servis talebi
          </p>
          <h2 id="cta-baslik" className="wide mt-5 text-[clamp(1.9rem,3.5vw,3.3rem)] leading-[0.95] text-paper" data-reveal>
            Makinenizde
            <br />
            <em>arıza mı var?</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist/80" data-reveal>
            Makineniz ve arızanız hakkında bilgi paylaşın. Teknik değerlendirme için iletişime geçin. Fotoğraf veya videoları
            WhatsApp konuşmasına ekleyebilirsiniz.
          </p>
          <dl className="mt-10 border-t border-mist/15" data-reveal>
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-mist/15 py-4">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist/50">{r.k}</dt>
                <dd className="text-paper">{r.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-mist/55">
            Ayrıntılı iletişim sayfası:{' '}
            <Link href="/iletisim" className="text-paper underline underline-offset-4 hover:text-accent">
              İletişim
            </Link>
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="border border-mist/15 bg-ink-2 p-6 sm:p-9" data-reveal>
            <p className="mb-8 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist/55">Arıza bildirim formu</p>
            <ServiceRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
}
