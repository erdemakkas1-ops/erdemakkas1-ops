import Link from "next/link";
import { business, telHref, whatsappHref } from "@/config/business";
import { kindLabels, kindOrder } from "@/lib/listings";
import Logo from "./Logo";

export default function SiteFooter() {
  const wa = whatsappHref("Merhaba, gayrimenkul danışmanlığı hakkında bilgi almak istiyorum.");
  return <footer className="bg-[#161513] text-[#bdb5a8]">
    <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:py-20">
      <div>
        <Logo tone="light" />
        <p className="mt-6 max-w-sm text-sm leading-relaxed">{business.city} ve çevresinde arsa, tarla, konut ve yatırım amaçlı gayrimenkullerde danışmanlık; inşaat ve proje tanıtımı.</p>
        <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-[#d9bd86] underline-offset-4 hover:underline">Instagram {business.instagramHandle}</a>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a8378]">Kategoriler</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {kindOrder.map(kind => <li key={kind}><Link href={`/ilanlar?tur=${kind}`} className="hover:text-white">{kindLabels[kind].plural}</Link></li>)}
          <li><Link href="/proje-3d" className="hover:text-white">3D Proje Deneyimi</Link></li>
        </ul>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a8378]">İletişim</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {telHref && <li><a href={telHref} className="hover:text-white">{business.phoneDisplay}</a></li>}
          {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp ile yazın</a></li>}
          <li>{business.office}</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/[0.06]">
      <p className="mx-auto max-w-[1400px] px-5 py-6 text-xs leading-relaxed text-[#7d766b] sm:px-8">
        © {new Date().getFullYear()} {business.name}. Bu site bir tanıtım demosudur: ilanlar, fiyatlar, görseller ve harita konumları örnek içeriktir; gerçek ilanlar eklendiğinde güncellenecektir.
      </p>
    </div>
  </footer>;
}
