import { Plus } from 'lucide-react';
import { faqs } from '@/data/faq';
import { SectionHead } from '@/components/ui/SectionHead';
import { JsonLd } from '@/components/ui/JsonLd';

export function Faq() {
  return (
    <section id="sss" className="bg-ink py-24 sm:py-32" aria-labelledby="sss-baslik">
      <div className="container-x">
        <SectionHead
          id="sss-baslik"
          eyebrow="Sıkça sorulan sorular"
          title={
            <>
              Aklınızdaki
              <br />
              <em>sorular.</em>
            </>
          }
          note="Burada cevabını bulamadığınız her soru için arıza bildirim formunu kullanabilirsiniz."
        />
        <div className="max-w-4xl border-t border-mist/15" data-stagger>
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-mist/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-semibold text-paper transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-paper transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-3xl pb-6 leading-relaxed text-mist/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </section>
  );
}
