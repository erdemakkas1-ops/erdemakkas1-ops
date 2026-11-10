import { business, mapsLink, telLink, whatsappLink } from '@/lib/site';

export default function Footer() {
  return (
    <footer id="alt" className="gutter bg-ink pb-[calc(40px+env(safe-area-inset-bottom))] pt-[clamp(70px,9vw,140px)] text-paper max-[700px]:pb-[96px]">
      <a href="#teklif" className="display block text-[clamp(52px,10vw,180px)] leading-[0.92] hover:text-brass-soft">Konuşalım<span className="text-brass">.</span></a>
      <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-2 gap-8 border-t border-paper/15 pt-8 md:grid-cols-4">
        <div><p className="label text-paper/45">Telefon</p><a href={telLink} className="mt-3 block text-[16px] hover:text-brass-soft">{business.phoneDisplay}</a></div>
        <div><p className="label text-paper/45">WhatsApp</p><a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-3 block text-[16px] hover:text-brass-soft">Mesaj gönder ↗</a></div>
        <div><p className="label text-paper/45">Instagram</p><a href={business.instagram} target="_blank" rel="noreferrer" className="mt-3 block text-[16px] hover:text-brass-soft">{business.instagramHandle} ↗</a></div>
        <div><p className="label text-paper/45">Adres</p><a href={mapsLink} target="_blank" rel="noreferrer" className="mt-3 block text-[16px] hover:text-brass-soft">{business.addressLine}, {business.city} ↗</a></div>
      </div>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-[12px] text-paper/45">
        <p>© {new Date().getFullYear()} {business.name}</p>
        <p>Banyo ve mutfak sahneleri 3D konsept görselleştirmedir. Proje fotoğrafları {business.instagramHandle} paylaşımlarındandır.</p>
      </div>
    </footer>
  );
}
