import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { business } from '@/data/site';
import { whatsappNumber } from '@/lib/contact';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceRequestForm } from '@/components/forms/ServiceRequestForm';
import { ContactList } from '@/components/ui/ContactActions';
import { processSteps } from '@/data/process';

export const metadata = pageMetadata({
  title: 'İletişim ve Servis Talebi – Arıza Bildirim Formu',
  description:
    'Makinenizin markası, modeli ve arıza bilgileriyle servis talebi oluşturun. Talebiniz düzenli bir servis metni olarak hazırlanır; ön teknik değerlendirme için iletişime geçin.',
  path: '/iletisim',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'İletişim', path: '/iletisim' }]}
        eyebrow="İletişim · Servis Talebi"
        title="Makinenizde arıza mı var?"
        lead="Makineniz ve arızanız hakkında bilgi paylaşın. Form, bilgilerinizi düzenli bir servis mesajına dönüştürür; ön teknik değerlendirme bu bilgilerle başlar."
      />

      <section className="bg-ink-2 py-16 sm:py-24" aria-labelledby="form-baslik">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div id="servis-formu" className="scroll-mt-28 lg:col-span-7 lg:order-1">
            <div className="sm:border sm:border-mist/10 sm:bg-ink/40 sm:p-8 lg:p-10">
              <p className="eyebrow">Arıza bildirim formu</p>
              <h2 id="form-baslik" className="display-md mt-4 text-white">
                Servis talebi oluşturun
              </h2>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-mist/75">
                <span className="text-accent">*</span> ile işaretli alanlar zorunludur.{' '}
                {whatsappNumber
                  ? 'Talebiniz, siz WhatsApp’ta gönderdiğinizde iletilmiş olur.'
                  : 'Form, talebinizi kopyalanabilir bir servis metni olarak hazırlar.'}
              </p>
              <div className="mt-10">
                <ServiceRequestForm />
              </div>
            </div>
          </div>

          <aside className="space-y-10 lg:col-span-5 lg:order-2" aria-label="İletişim bilgileri">
            <div id="iletisim-bilgileri" className="scroll-mt-28">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">İletişim kanalları</h2>
              <div className="mt-5">
                <ContactList />
              </div>
            </div>

            <div className="grid gap-px overflow-hidden border border-mist/10 bg-mist/10">
              <div className="flex gap-4 bg-ink-2 p-6">
                <MapPin className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-white">Hizmet bölgesi</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist/70">
                    {business.serviceArea ??
                      'Makinenin bulunduğu il ve ilçeyi formda belirtin; yerinde hizmetin mümkün olup olmadığı ön değerlendirmede netleştirilir.'}
                  </p>
                </div>
              </div>
              {business.workingHours && (
                <div className="flex gap-4 bg-ink-2 p-6">
                  <Clock3 className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-white">Çalışma saatleri</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist/70">{business.workingHours}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-4 bg-ink-2 p-6">
                <MessageCircle className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-white">Fotoğraf ve video</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist/70">
                    Alarm ekranı, makine etiketi, ses veya hareketin kısa videosu teşhisi kolaylaştırır.{' '}
                    {whatsappNumber
                      ? 'Bunları WhatsApp konuşmasına ekleyebilirsiniz.'
                      : 'Talebinizi ilettikten sonra paylaşabilirsiniz.'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Sonraki adımlar</h2>
              <ol className="mt-5 space-y-5">
                {processSteps.map((s) => (
                  <li key={s.index} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-accent/50 font-mono text-[11px] text-accent">
                      {s.index}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-mist/65">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
