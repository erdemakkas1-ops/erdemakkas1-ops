"use client";

import { useEffect, useRef, useState } from "react";
import { formatTRY } from "@/lib/paymentUtils";

export type AppointmentContext = {
  apartmentId: string;
  floor: number;
  type: string;
  area: number;
  downPaymentPercent: number;
  termMonths: number;
  monthlyPayment: number;
};

export default function AppointmentDialog({ open, context, onClose }: { open: boolean; context: AppointmentContext | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const historyEntry = useRef(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      window.history.pushState(window.history.state, "", window.location.href);
      historyEntry.current = true;
      node.showModal();
    }
    if (!open && node.open) node.close();
    const handleBack = () => {
      historyEntry.current = false;
      if (node.open) node.close();
    };
    if (open) window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [open]);

  const fieldClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#0e0d0c]/70 px-4 py-3 text-base text-[#f1ebdf] outline-none transition-colors placeholder:text-[#6b655c] focus:border-[#c9a86a]/70";

  return <dialog
    ref={dialog}
    aria-labelledby="appointment-title"
    onClose={() => {
      if (historyEntry.current) {
        historyEntry.current = false;
        window.history.back();
      }
      setSubmitted(false);
      onClose();
    }}
    onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}
    className="m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl border border-white/10 bg-[#181715] p-0 text-[#e9e4da] shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
  >
    <div className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9a86a]">Randevu</p>
          <h2 id="appointment-title" className="mt-2 font-display text-2xl font-semibold text-[#f4efe4]">{submitted ? "Talebiniz alındı." : "Satış ofisinde tanışalım."}</h2>
        </div>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Pencereyi kapat" className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-xl text-[#9b9387] transition-colors hover:bg-white/5 hover:text-[#f1ebdf] focus-visible:outline-2 focus-visible:outline-[#c9a86a]">×</button>
      </div>

      {context && <div className="mt-5 rounded-2xl border border-[#c9a86a]/20 bg-[#c9a86a]/[0.06] p-4 text-sm">
        <p className="font-semibold text-[#f1ebdf]">Daire {context.apartmentId} · {context.floor}. kat · {context.type} · {context.area} m²</p>
        <p className="mt-1 text-[#b8afa2]">%{context.downPaymentPercent} peşinat · {context.termMonths} ay · aylık {formatTRY(context.monthlyPayment)}</p>
      </div>}

      {submitted ? <div role="status" className="motion-form mt-6">
        <p className="text-sm leading-relaxed text-[#b8afa2]">Demo ortamındasınız: bilgileriniz gönderilmedi ve kaydedilmedi. Gerçek projede satış danışmanı sizi bu bilgilerle arar.</p>
        <button type="button" onClick={() => dialog.current?.close()} className="mt-6 h-12 w-full cursor-pointer rounded-full border border-white/15 text-sm font-semibold text-[#f1ebdf] transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#c9a86a]">Tamam</button>
      </div> : <form className="mt-6 space-y-4" onSubmit={event => {
        event.preventDefault();
        // Local demo only: no network request, persistence or CRM integration.
        event.currentTarget.reset();
        setSubmitted(true);
      }}>
        {context && <input type="hidden" name="apartment" value={`${context.apartmentId}|%${context.downPaymentPercent}|${context.termMonths}ay`} />}
        <label className="block text-sm text-[#b8afa2]">Ad soyad<input name="name" autoComplete="name" required minLength={2} maxLength={100} pattern=".*\S.*" className={fieldClass} /></label>
        <label className="block text-sm text-[#b8afa2]">Telefon<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} pattern="[+0-9\(\) .\-]{7,25}" placeholder="+90 5xx xxx xx xx" className={fieldClass} /></label>
        <label className="block text-sm text-[#b8afa2]">E-posta<input name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} /></label>
        <p className="text-xs leading-relaxed text-[#8a8378]">Demo formdur; bilgiler herhangi bir sunucuya gönderilmez.</p>
        <button type="submit" className="h-12 w-full cursor-pointer rounded-full bg-[#c9a86a] text-sm font-semibold text-[#14110b] transition-colors hover:bg-[#d8bd86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a]">Randevu talebini gönder →</button>
      </form>}
    </div>
  </dialog>;
}
