import { Film } from '@/components/film/Film';
import { ProfileIntro } from '@/components/sections/ProfileIntro';
import { OrbitServices } from '@/components/sections/OrbitServices';
import { Machines } from '@/components/sections/Machines';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { ContactSection } from '@/components/sections/ContactSection';
import { SchematicDivider } from '@/components/ui/SchematicDivider';

export default function HomePage() {
  return (
    <>
      <Film />
      <ProfileIntro />
      <OrbitServices />
      <SchematicDivider code="A-02" label="Makine grupları" />
      <Machines />
      <Process />
      <Projects />
      <Faq />
      <SchematicDivider code="A-07" label="İletişim" />
      <ContactSection />
    </>
  );
}
