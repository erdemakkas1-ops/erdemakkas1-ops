import Image from 'next/image';
import { processSteps } from '@/data/process';
import { assetPath } from '@/data/visuals';
import { SectionHead } from '@/components/ui/SectionHead';

export function Process({ index }: { index?: string } = {}) {
  void index;
  return (
    <section className="relative bg-surface py-24 text-ink sm:py-32" aria-labelledby="surec-baslik">
      <div className="container-x">
        <SectionHead
          id="surec-baslik"
          tone="light"
          eyebrow="Nasıl çalışıyoruz"
          title={
            <>
              Bildirimden
              <br />
              <em>teslime.</em>
            </>
          }
          note="Dört adımın her birinde muhatabınız aynı teknik kişidir. Süre ve kapsam, arızanın niteliğine göre sizinle birlikte netleştirilir."
        />
        <ol data-timeline className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step) => (
            <li key={step.index} className="relative" data-reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#18212d]">
                <Image src={assetPath(step.image)} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="relative mt-6 h-px bg-ink/80" aria-hidden="true">
                <span className="absolute -top-[5px] left-0 h-[11px] w-[11px] bg-accent" />
              </div>
              <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-ink/50">{step.index}</p>
              <h3 className="mt-2 font-display text-[1.45rem] uppercase leading-[1.05] text-ink">{step.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
