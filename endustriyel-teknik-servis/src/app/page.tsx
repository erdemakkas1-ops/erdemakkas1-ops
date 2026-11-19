import { HeroCinema } from '@/components/cinema/HeroCinema';
import { FocusTour } from '@/components/cinema/FocusTour';
import { controlTour, mechanicalTour } from '@/data/tours';
import { ServiceScene } from '@/components/cinema/ServiceScene';
import { QuickAnswers } from '@/components/sections/QuickAnswers';
import { ProfileIntro } from '@/components/sections/ProfileIntro';
import { Machines } from '@/components/sections/Machines';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { ContactSection } from '@/components/sections/ContactSection';
import { SchematicDivider } from '@/components/ui/SchematicDivider';

/**
 * Akış: SAHNE 1 (açılış) → hızlı cevaplar → SAHNE 2 (mekanik kamera turu) → SAHNE 3 (PLC/pano turu) → uzman →
 * makine grupları → SAHNE 4 (sahada müdahale) → süreç → çalışmalar → SSS → iletişim
 */
export default function HomePage() {
  return (
    <>
      <HeroCinema />
      <QuickAnswers />
      <FocusTour tour={mechanicalTour} />
      <FocusTour tour={controlTour} />
      <ProfileIntro />
      <SchematicDivider code="A-02" label="Makine grupları" />
      <Machines />
      <ServiceScene />
      <Process />
      <Projects />
      <Faq />
      <SchematicDivider code="A-07" label="İletişim" />
      <ContactSection />
    </>
  );
}
