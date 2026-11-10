"use client";

import type { Apartment } from "@/types/apartment";
import { DOWN_PAYMENT, PAYMENT_TERM } from "@/lib/paymentConfig";
import { calculatePayment, formatTRY } from "@/lib/paymentUtils";
import PaymentSlider from "./PaymentSlider";

type Props = {
  apartment: Apartment;
  floor: number;
  downPaymentPercent: number;
  termMonths: number;
  onDownPaymentChange: (value: number) => void;
  onTermChange: (value: number) => void;
  onRequest: () => void;
};

export default function PaymentSection({ apartment, floor, downPaymentPercent, termMonths, onDownPaymentChange, onTermChange, onRequest }: Props) {
  const payment = calculatePayment(apartment.price, downPaymentPercent, termMonths);
  return <section id="odeme" aria-labelledby="payment-title" className="border-y border-white/[0.05] bg-[#100f0e]">
    <div className="mx-auto max-w-[1520px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16">
      <div className="motion-in-view grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9a86a]">Ödeme planı</p>
          <h2 id="payment-title" className="mt-4 font-display text-[clamp(2.1rem,4.6vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#f4efe4]">Size özel ödeme planı.</h2>
        </div>
        <p className="text-sm leading-relaxed text-[#aaa196]">Peşinatı ve vadeyi ayarlayın; aylık taksitiniz anında hesaplansın. Planı tek tıkla satış danışmanına iletin.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/[0.07] bg-[#1a1916] p-6 sm:p-8">
          <div className="space-y-8">
            <PaymentSlider label="Peşinat oranı" value={downPaymentPercent} {...DOWN_PAYMENT} formatValue={value => `%${value}`} onChange={onDownPaymentChange} />
            <PaymentSlider label="Vade" value={termMonths} {...PAYMENT_TERM} formatValue={value => `${value} ay`} onChange={onTermChange} />
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.07] pt-6">
            <p className="text-sm text-[#aaa196]">Daire {apartment.id} · {floor}. kat · {apartment.type} · {apartment.area} m²</p>
            <p className="text-right">
              <span className="block text-xs text-[#9b9387]">Toplam fiyat</span>
              <span className="mt-1 block font-display text-2xl font-semibold tabular-nums text-[#f1ebdf] sm:text-3xl">{formatTRY(payment.totalPrice)}</span>
            </p>
          </div>
        </div>

        <aside aria-label="Aylık taksit özeti" className="@container flex flex-col rounded-3xl bg-gradient-to-br from-[#e2c48d] via-[#d4b073] to-[#b98f52] p-6 text-[#1a140b] sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5a4527]">Aylık taksit</p>
          <p key={payment.monthlyPayment} className="motion-number mt-3 font-display text-[clamp(2.4rem,15cqw,4.2rem)] font-bold leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">{formatTRY(payment.monthlyPayment)}</p>
          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[#1a140b]/15 pb-3"><dt className="text-[#4f3c22]">Peşinat tutarı</dt><dd className="font-semibold tabular-nums">{formatTRY(payment.downPayment)}</dd></div>
            <div className="flex justify-between gap-4 border-b border-[#1a140b]/15 pb-3"><dt className="text-[#4f3c22]">Kalan tutar</dt><dd className="font-semibold tabular-nums">{formatTRY(payment.remaining)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#4f3c22]">Vade</dt><dd className="font-semibold tabular-nums">{payment.termMonths} ay</dd></div>
          </dl>
          <p className="mt-5 w-fit rounded-full bg-[#1a140b]/10 px-3 py-1 text-xs font-medium text-[#3d2f1a]">Faizsiz · demo ödeme planı</p>
          <button type="button" onClick={onRequest} className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1a1916] text-sm font-semibold text-[#f1ebdf] transition-colors hover:bg-[#26241f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1916]">
            Satış danışmanına gönder →
          </button>
        </aside>
      </div>
    </div>
  </section>;
}
