import BathFilm from '@/components/BathFilm';
import BeforeAfter from '@/components/BeforeAfter';
import Configurator from '@/components/Configurator';
import FloatingContact from '@/components/FloatingContact';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import KitchenFilm from '@/components/KitchenFilm';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import QuoteForm from '@/components/QuoteForm';
import Services from '@/components/Services';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <BathFilm />
        <div id="icerik" />
        <BeforeAfter />
        <KitchenFilm />
        <Configurator />
        <Services />
        <Projects />
        <Process />
        <QuoteForm />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
