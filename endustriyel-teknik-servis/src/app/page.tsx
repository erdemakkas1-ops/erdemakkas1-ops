import { HeroCinema } from '@/components/cinema/HeroCinema';
import { SystemsScene } from '@/components/cinema/SystemsScene';
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
 * Akış: SAHNE 1 (makineye yaklaşma) → hızlı cevaplar → SAHNE 2 (teknik sistemler) → uzman →
 * makine grupları → SAHNE 3 (servis ve müdahale) → süreç → çalışmalar → SSS → iletişim
 */
export default function HomePage() {
  return (
    <>
      <HeroCinema />
      <QuickAnswers />
      <SystemsScene />
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
