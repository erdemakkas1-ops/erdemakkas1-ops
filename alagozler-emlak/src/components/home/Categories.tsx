import Link from "next/link";
import { listings } from "@/data/listings";
import { kindLabels, kindOrder } from "@/lib/listings";
import PropertyArt from "../listings/PropertyArt";
import { media, mediaSrc } from "@/data/media";
import SectionHeading from "./SectionHeading";

const blurbs: Record<string, string> = {
  arsa: "İmarlı, köşe ve yatırımlık parseller",
  tarla: "Sulu tarla, bahçe ve tarım arazileri",
  daire: "Satılık ve kiralık daireler",
  mustakil: "Bahçeli ve avlulu müstakil evler",
  diger: "Dükkan, depo ve işyerleri",
};

export default function Categories() {
  return <section aria-labelledby="kategoriler" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
    <SectionHeading id="kategoriler" eyebrow="Kategoriler" title={<>Aradığınız gayrimenkul<br className="hidden sm:block" /> türünü seçin.</>} />
    <ul data-reveal-stagger className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
      {kindOrder.map((kind, i) => {
        const count = listings.filter(listing => listing.kind === kind).length;
        return <li key={kind} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
          <Link href={`/ilanlar?tur=${kind}`} className={`group relative block aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#1c1b19] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a86a] ${i === 0 ? "max-lg:aspect-[16/10]" : ""}`}>
            <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]">{media.categories[kind]
              // eslint-disable-next-line @next/next/no-img-element -- static export
              ? <img src={mediaSrc(media.categories[kind])} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              : <PropertyArt kind={kind} seed={`kategori-${kind}`} className="h-full w-full" />}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/85 via-[#121110]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-serif text-2xl font-semibold leading-tight text-white sm:text-[1.7rem]">{kindLabels[kind].plural}</p>
              <p className="mt-1 hidden text-sm text-white/75 sm:block">{blurbs[kind]}</p>
              <p className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[#d9bd86]">{count} ilan<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></p>
            </div>
          </Link>
        </li>;
      })}
    </ul>
  </section>;
}
