import { processSteps } from '@/data/process';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Process({ index = '04' }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-24 sm:py-32" aria-labelledby="surec-baslik">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          index={index}
          eyebrow="Servis Süreci"
          title={<span id="surec-baslik">Bildirimden teslime dört adım</span>}
          lead="Her adımda ne yapıldığını bilirsiniz. Süre ve kapsam, arızanın niteliğine göre sizinle birlikte netleştirilir."
        />

        <ol data-timeline className="relative mt-16 grid gap-12 pl-14 lg:mt-24 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-16">
          <span className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-mist/15 lg:left-0 lg:top-[19px] lg:h-px lg:w-full" aria-hidden="true" />
          <span
            data-timeline-progress
            className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-accent lg:left-0 lg:top-[19px] lg:h-px lg:w-full"
            aria-hidden="true"
          />
          {processSteps.map((step) => (
            <li key={step.index} className="relative" data-reveal>
              <span className="absolute -left-14 top-0 grid h-10 w-10 place-items-center border border-accent/60 bg-ink-2 font-mono text-xs text-accent lg:-top-16 lg:left-0">
                {step.index}
              </span>
              <h3 className="font-display text-2xl font-semibold uppercase leading-tight text-white sm:text-[1.65rem]">{step.title}</h3>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-mist/75">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
