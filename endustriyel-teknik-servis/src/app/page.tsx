import { Film } from '@/components/film/Film';
import { ProfileIntro } from '@/components/sections/ProfileIntro';
import { OrbitServices } from '@/components/sections/OrbitServices';
import { Machines } from '@/components/sections/Machines';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Film />
      <ProfileIntro />
      <OrbitServices />
      <Machines />
      <Process />
      <Projects />
      <Faq />
      <ContactSection />
    </>
  );
}
