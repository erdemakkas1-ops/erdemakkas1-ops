'use client';

import { useEffect, useState } from 'react';
import { business, mapsLink, SERVICES, telLink, whatsappLink } from '@/lib/site';
import type { QuotePrefill } from './Configurator';

/**
 * There is no backend in the demo, so the form does not pretend to "send": it composes a WhatsApp
 * message from the answers and opens it, and the visitor sends it from their own WhatsApp.
 */
export default function QuoteForm() {
  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<QuotePrefill>).detail;
      if (d.services) setServices(s => Array.from(new Set([...s, ...d.services!])));
      if (d.note) setNote(n => (n.includes(d.note!) ? n : [n, d.note].filter(Boolean).join('\n')));
    };
    window.addEventListener('ahima:quote', onPrefill);
    // ?hizmet=Mutfak%20Dekorasyonu#teklif preselects a service
    const q = new URLSearchParams(location.search).get('hizmet');
    if (q && (SERVICES as readonly string[]).includes(q)) setServices([q]);
    return () => window.removeEventListener('ahima:quote', onPrefill);
  }, []);

  const toggle = (s: string) => setServices(cur => (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (name.trim().length < 2) return setError('Lütfen adınızı yazın.');
    if (digits.length < 10) return setError('Lütfen size ulaşabileceğimiz bir telefon numarası yazın.');
    if (!services.length) return setError('En az bir hizmet seçin.');
    setError('');
    const details = [
      `Ad Soyad: ${name.trim()}`,
      `Telefon: ${phone.trim()}`,
      `Hizmet: ${services.join(', ')}`,
      district.trim() ? `Semt / ilçe: ${district.trim()}` : '',
      area.trim() ? `Yaklaşık alan: ${area.trim()} m²` : '',
      note.trim() ? `Not: ${note.trim()}` : '',
    ].filter(Boolean);
    const lines = ['Merhaba, Ahima Dekorasyon web siteniz üzerinden ulaşıyorum. Ücretsiz keşif / teklif talep ediyorum.', '', ...details];
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener');
    setOpened(true);
  };

  return (
    <section id="teklif" className="gutter bg-paper py-[clamp(80px,11vw,170px)]" aria-labelledby="teklif-title">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-wood md:col-span-3">§ 07 — Ücretsiz keşif</p>
        <h2 id="teklif-title" className="display col-span-12 text-[clamp(40px,5.4vw,88px)] md:col-span-9">Mekânınızı görelim, <em className="text-wood">birlikte planlayalım.</em></h2>
      </div>
      <div className="mt-[clamp(40px,6vw,90px)] grid grid-cols-12 gap-x-[clamp(20px,4vw,72px)] gap-y-14">
        <form className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-8 lg:col-span-7" onSubmit={submit} noValidate>
          <fieldset className="col-span-2">
            <legend className="label mb-4 text-ink/60">Hangi hizmet? <span className="normal-case tracking-normal text-ink/40">(birden fazla seçebilirsiniz)</span></legend>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => <button key={s} type="button" className="chip" aria-pressed={services.includes(s)} onClick={() => toggle(s)}>{s}</button>)}
            </div>
          </fieldset>
          <label className="field col-span-2 sm:col-span-1"><span className="label text-ink/60">Ad Soyad *</span><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></label>
          <label className="field col-span-2 sm:col-span-1"><span className="label text-ink/60">Telefon *</span><input value={phone} onChange={e => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required /></label>
          <label className="field col-span-2 sm:col-span-1"><span className="label text-ink/60">Semt / ilçe</span><input value={district} onChange={e => setDistrict(e.target.value)} placeholder="ör. Çankaya" /></label>
          <label className="field col-span-2 sm:col-span-1"><span className="label text-ink/60">Yaklaşık alan (m²)</span><input value={area} onChange={e => setArea(e.target.value)} inputMode="numeric" placeholder="ör. 6" /></label>
          <label className="field col-span-2"><span className="label text-ink/60">Kısaca anlatın</span><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="ör. 20 yıllık banyo, küvet yerine duşakabin istiyoruz." /></label>
          <div className="col-span-2 flex flex-col gap-4">
            {error && <p role="alert" className="text-[14px] font-semibold text-[#9a3b26]">{error}</p>}
            <button type="submit" className="btn btn-ink w-full sm:w-auto sm:self-start">Talebi WhatsApp ile gönder <span className="arrow" aria-hidden>→</span></button>
            <p className="max-w-[56ch] text-[13px] leading-relaxed text-ink/55">
              Gönder’e bastığınızda bilgileriniz WhatsApp’ta hazır bir mesaja dönüşür; göndermeden önce kontrol edebilirsiniz. Site bilgilerinizi kaydetmez.
              {opened && <span className="mt-2 block font-semibold text-wood">WhatsApp açıldı. Açılmadıysa: {business.phoneDisplay} numarasını arayabilirsiniz.</span>}
            </p>
          </div>
        </form>

        <aside className="col-span-12 lg:col-span-5">
          <dl className="grid grid-cols-1 border-t border-ink/15">
            <div className="border-b border-ink/15 py-5"><dt className="label text-ink/50">Telefon</dt><dd className="display mt-2 text-[30px]"><a href={telLink} className="hover:text-wood">{business.phoneDisplay}</a></dd></div>
            <div className="border-b border-ink/15 py-5"><dt className="label text-ink/50">WhatsApp</dt><dd className="mt-2 text-[17px] font-semibold"><a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-wood">Hemen yazın ↗</a></dd></div>
            <div className="border-b border-ink/15 py-5"><dt className="label text-ink/50">Instagram</dt><dd className="mt-2 text-[17px] font-semibold"><a href={business.instagram} target="_blank" rel="noreferrer" className="hover:text-wood">{business.instagramHandle} ↗</a></dd></div>
            <div className="border-b border-ink/15 py-5"><dt className="label text-ink/50">Adres</dt><dd className="mt-2 text-[17px] font-semibold">{business.addressLine}<br />{business.city} <a href={mapsLink} target="_blank" rel="noreferrer" className="ml-2 border-b border-ink text-[14px] hover:text-wood">Haritada aç ↗</a></dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
