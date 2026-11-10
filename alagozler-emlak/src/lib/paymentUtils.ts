const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatTRY(value: number) {
  return currencyFormatter.format(value);
}

/** Short list-price form, e.g. "₺28,5M". */
export function formatMillionsTRY(value: number) {
  return `₺${(value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}M`;
}

export function calculatePayment(totalPrice: number, downPaymentPercent: number, termMonths: number) {
  const downPayment = totalPrice * (downPaymentPercent / 100);
  const remaining = totalPrice - downPayment;
  return { totalPrice, downPayment, remaining, monthlyPayment: remaining / termMonths, termMonths };
}

export type PaymentCalculation = ReturnType<typeof calculatePayment>;
