import { Hero } from '@/components/sections/Hero';
import { Expertise } from '@/components/sections/Expertise';
import { Machines } from '@/components/sections/Machines';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { ServiceCta } from '@/components/sections/ServiceCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Expertise />
      <Machines />
      <Process />
      <Projects />
      <About />
      <ServiceCta />
    </>
  );
}
