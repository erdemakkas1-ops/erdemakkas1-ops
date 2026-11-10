import { business, telHref, whatsappHref } from "@/config/business";
import { IconInstagram, IconPhone, IconPin, IconWhatsApp } from "../site/icons";

export default function ContactSection() {
  const wa = whatsappHref("Merhaba, web sitenizden ulaşıyorum. Gayrimenkul hakkında bilgi almak istiyorum.");
  const card = "group flex items-center gap-4 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-[#c9a86a]";
  return <section id="iletisim" aria-labelledby="iletisim-baslik" className="scroll-mt-16 bg-[#1c1b19] text-[#e9e4da]">
    <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-32">
      <div data-reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9bd86]">İletişim</p>
        <h2 id="iletisim-baslik" className="mt-4 font-serif text-[clamp(2.4rem,5.4vw,4.4rem)] font-semibold leading-[0.95] text-[#f6f2ea]">Aradığınızı tarif edin,<br /><span className="text-[#d9bd86]">biz bulalım.</span></h2>
        <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[#b8afa2]">Listede olmayan bir arsa, tarla ya da ev mi arıyorsunuz? Bütçenizi ve bölgeyi yazın; portföyümüzden ve çevremizden size uygun seçenekleri iletelim.</p>
      </div>
      <div data-reveal-stagger className="grid gap-3">
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={card}><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f8f5a] text-white"><IconWhatsApp className="h-6 w-6" /></span><span><span className="block text-sm text-[#a69e91]">WhatsApp</span><span className="block text-lg font-semibold text-white">Mesaj gönderin</span></span><span aria-hidden="true" className="ml-auto text-[#c9a86a] transition-transform group-hover:translate-x-1">→</span></a>}
        {telHref && <a href={telHref} className={card}><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a86a] text-[#1c1b19]"><IconPhone className="h-6 w-6" /></span><span><span className="block text-sm text-[#a69e91]">Telefon</span><span className="block text-lg font-semibold text-white">{business.phoneDisplay}</span></span><span aria-hidden="true" className="ml-auto text-[#c9a86a] transition-transform group-hover:translate-x-1">→</span></a>}
        <a href={business.instagram} target="_blank" rel="noopener noreferrer" className={card}><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"><IconInstagram className="h-6 w-6" /></span><span><span className="block text-sm text-[#a69e91]">Instagram</span><span className="block text-lg font-semibold text-white">{business.instagramHandle}</span></span><span aria-hidden="true" className="ml-auto text-[#c9a86a] transition-transform group-hover:translate-x-1">→</span></a>
        <div className="flex items-center gap-4 rounded-2xl p-5 ring-1 ring-white/10"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"><IconPin className="h-6 w-6" /></span><span><span className="block text-sm text-[#a69e91]">Ofis</span><span className="block text-lg font-semibold text-white">{business.office}</span></span></div>
      </div>
    </div>
  </section>;
}
