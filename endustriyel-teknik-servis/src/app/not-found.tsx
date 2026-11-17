import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ink pt-24">
      <div className="tech-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x">
        <p className="eyebrow">Hata 404</p>
        <h1 className="display-lg mt-5 text-white">Bu sayfa bulunamadı</h1>
        <p className="mt-6 max-w-xl text-lg text-mist/80">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Ana sayfaya dön <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/iletisim#servis-formu" className="btn btn-ghost">
            Servis talebi oluştur
          </Link>
        </div>
      </div>
    </section>
  );
}
