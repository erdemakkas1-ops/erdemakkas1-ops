import { Film } from '@/components/film/Film';
import { Expertise } from '@/components/sections/Expertise';
import { Machines } from '@/components/sections/Machines';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { Faq } from '@/components/sections/Faq';
import { GuidesTeaser } from '@/components/sections/GuidesTeaser';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Film />
      <Expertise />
      <Process />
      <Machines />
      <Projects />
      <About />
      <GuidesTeaser />
      <Faq />
      <ContactSection />
    </>
  );
}
