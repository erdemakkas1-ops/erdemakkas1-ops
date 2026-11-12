import Header from '@/components/Header';
import Experience from '@/components/Experience';
import { Services, Projects, Contact, Footer } from '@/components/sections/Sections';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Experience />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
