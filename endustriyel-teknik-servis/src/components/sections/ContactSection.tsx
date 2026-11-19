import { business, profile } from '@/data/site';
import { ServiceRequestForm } from '@/components/forms/ServiceRequestForm';
import { ContactButtons } from '@/components/ui/CallButtons';
import { hasDirectContact, whatsappNumber } from '@/lib/contact';
import { Ph } from '@/components/ui/Ph';

/** Telefon önce: büyük numara, ara / WhatsApp; form yazmayı tercih edenler için. */
export function ContactSection() {
  const rows = [
    { k: 'Çalışma saatleri', v: <Ph f={profile.hours} /> },
    { k: 'Gittiğim bölgeler', v: <Ph f={profile.region} /> },
    { k: 'E-posta', v: business.email ? <a href={`mailto:${business.email}`} className="underline underline-offset-4 hover:text-accent">{business.email}</a> : <span className="text-mist/55">—</span> },
  ];
  return (
    <section id="servis-talebi" className="bg-ink py-24 sm:py-32" aria-labelledby="cta-baslik">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            İletişim
          </p>
          <h2 id="cta-baslik" className="wide mt-5 text-[clamp(1.9rem,3.5vw,3.3rem)] leading-[0.95] text-paper" data-reveal>
            Makinenizde
            <br />
            <em>arıza mı var?</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist/80" data-reveal>
            {hasDirectContact
              ? 'Arayın, makineyi ve arızayı anlatın. Uygun değilsem bunu da hemen söylerim.'
              : 'Formu doldurun; makineyi ve arızayı anlatan servis metniniz hazırlansın. Uygun değilsem bunu da açıkça söylerim.'}
          </p>
          <p id="iletisim-bilgileri" className="wide mt-10 scroll-mt-28 text-[clamp(1.4rem,2.6vw,2.4rem)] leading-none text-paper" data-reveal>
            <Ph f={profile.phone} />
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row" data-reveal>
            <ContactButtons fallbackHref="#servis-formu" fallbackLabel="Servis formunu doldurun" />
          </div>
          <dl className="mt-10 border-t border-mist/15" data-reveal>
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[9.5rem_1fr] items-baseline gap-4 border-b border-mist/15 py-4">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist/50">{r.k}</dt>
                <dd className="text-paper">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-7">
          <div id="servis-formu" className="scroll-mt-28 border border-mist/15 bg-ink-2 p-6 sm:p-9" data-reveal>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist/55">Yazmayı tercih ederseniz</p>
            <p className="mt-3 mb-8 text-sm leading-relaxed text-mist/70">
              {whatsappNumber
                ? 'Formu doldurun; bilgileriniz düzenli bir WhatsApp mesajına dönüşür, mesajı siz gönderirsiniz.'
                : 'Formu doldurun; bilgileriniz düzenli bir servis metnine dönüşür, kopyalayıp iletebilirsiniz.'}
            </p>
            <ServiceRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
}
