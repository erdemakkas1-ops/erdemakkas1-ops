import SectionHeading from "./SectionHeading";

const services = [
  { title: "Gayrimenkul danışmanlığı", text: "İhtiyacınızı dinliyor, bütçenize ve hedefinize uygun seçenekleri birlikte değerlendiriyoruz." },
  { title: "Arsa ve tarla satışı", text: "İmar, tapu, yol ve altyapı bilgilerini netleştirerek arazi alım-satımında yanınızdayız." },
  { title: "Konut satışı", text: "Daire ve müstakil evlerde yerinde gösterim, pazarlık ve tapu sürecinde eşlik." },
  { title: "Yatırım danışmanlığı", text: "Bölgenin gelişim akslarını takip ediyor, uzun vadeli değer potansiyelini birlikte okuyoruz." },
  { title: "İnşaat ve proje tanıtımı", text: "Yeni projeleri 3D sunum, kat planı ve ödeme planı araçlarıyla alıcıya anlatıyoruz." },
];
const steps = ["Tanışma ve ihtiyaç analizi", "Uygun gayrimenkullerin seçimi", "Yerinde gösterim", "Pazarlık ve tapu süreci"];

export default function Services() {
  return <section id="danismanlik" aria-labelledby="danismanlik-baslik" className="scroll-mt-20 mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
      <div>
        <SectionHeading id="danismanlik-baslik" eyebrow="Gayrimenkul danışmanlığı" title={<>Toprağı da, evi de<br />bilen bir danışman.</>} intro="Alagözler Emlak & İnşaat; Şanlıurfa'da arsa, tarla, konut ve ticari gayrimenkulde alıcıyla satıcıyı doğru bilgiyle buluşturur." />
        <ol data-reveal-stagger className="mt-10 space-y-3">
          {steps.map((step, i) => <li key={step} className="flex items-center gap-4 rounded-2xl bg-[#efebe4] px-5 py-4">
            <span className="font-serif text-2xl font-semibold text-[#a88a55]">0{i + 1}</span><span className="text-[15px] font-medium text-[#1c1b19]">{step}</span>
          </li>)}
        </ol>
      </div>
      <ul data-reveal-stagger className="grid content-start gap-px overflow-hidden rounded-[1.6rem] bg-[#1c1b19]/[0.08] sm:grid-cols-2">
        {services.map((service, i) => <li key={service.title} className={`bg-[#f6f3ee] p-7 transition-colors hover:bg-white sm:p-8 ${i === 0 ? "sm:col-span-2" : ""}`}>
          <span aria-hidden="true" className="block h-px w-10 bg-[#c9a86a]" />
          <h3 className="mt-5 font-serif text-[1.65rem] font-semibold leading-tight text-[#1c1b19]">{service.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5d574e]">{service.text}</p>
        </li>)}
      </ul>
    </div>
  </section>;
}
