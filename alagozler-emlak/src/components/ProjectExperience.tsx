"use client";

import { useCallback, useState } from "react";
import type { Apartment } from "@/types/apartment";
import type { ApartmentDetailMode } from "@/types/floorPlan";
import { findApartment } from "@/data/apartments";
import { DEFAULT_APARTMENT_ID } from "@/data/project";
import { DOWN_PAYMENT, PAYMENT_TERM } from "@/lib/paymentConfig";
import { calculatePayment } from "@/lib/paymentUtils";
import SiteHeader from "./SiteHeader";
import HeroSection from "./HeroSection";
import FloorPlanSection from "./floor-plan/FloorPlanSection";
import PaymentSection from "./payment/PaymentSection";
import LocationSection from "./location/LocationSection";
import ClosingSection from "./ClosingSection";
import AppointmentDialog, { type AppointmentContext } from "./AppointmentDialog";

const fallback = (() => {
  const found = findApartment(DEFAULT_APARTMENT_ID);
  if (!found) throw new Error(`DEFAULT_APARTMENT_ID ${DEFAULT_APARTMENT_ID} veride bulunamadı.`);
  return found;
})();

export default function ProjectExperience() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [apartmentId, setApartmentId] = useState(DEFAULT_APARTMENT_ID);
  const [planMode, setPlanMode] = useState<ApartmentDetailMode>("2d");
  const [downPaymentPercent, setDownPaymentPercent] = useState(DOWN_PAYMENT.default);
  const [termMonths, setTermMonths] = useState(PAYMENT_TERM.default);
  // The appointment form only quotes an apartment once the visitor has actually chosen or priced one.
  const [engaged, setEngaged] = useState(false);
  const [appointment, setAppointment] = useState<{ open: boolean; withContext: boolean }>({ open: false, withContext: false });

  const { apartment, floor } = findApartment(apartmentId) ?? fallback;

  const selectApartment = useCallback((next: Apartment) => {
    if (next.status !== "available") return;
    setApartmentId(next.id);
    setEngaged(true);
  }, []);
  const selectFromPlan = useCallback((next: Apartment, nextFloor: number) => {
    selectApartment(next);
    setSelectedFloor(current => current === null ? null : nextFloor);
  }, [selectApartment]);

  const viewPlan = useCallback(() => {
    const target = document.getElementById("kat-planlari");
    target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    document.getElementById("plan-title")?.focus({ preventScroll: true });
  }, []);

  const context: AppointmentContext = {
    apartmentId: apartment.id,
    floor,
    type: apartment.type,
    area: apartment.area,
    downPaymentPercent,
    termMonths,
    monthlyPayment: calculatePayment(apartment.price, downPaymentPercent, termMonths).monthlyPayment,
  };

  return <>
    <a href="#kat-planlari" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[#c9a86a] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#14110b]">Kat planlarına geç</a>
    <SiteHeader onAppointment={() => setAppointment({ open: true, withContext: engaged })} />
    <main>
      <HeroSection
        selectedFloor={selectedFloor}
        selectedApartment={apartment}
        onSelectFloor={setSelectedFloor}
        onSelectApartment={selectApartment}
        onViewPlan={viewPlan}
      />
      <FloorPlanSection apartment={apartment} floor={floor} mode={planMode} onModeChange={setPlanMode} onSelectApartment={selectFromPlan} />
      <PaymentSection
        apartment={apartment}
        floor={floor}
        downPaymentPercent={downPaymentPercent}
        termMonths={termMonths}
        onDownPaymentChange={value => { setDownPaymentPercent(value); setEngaged(true); }}
        onTermChange={value => { setTermMonths(value); setEngaged(true); }}
        onRequest={() => setAppointment({ open: true, withContext: true })}
      />
      <LocationSection />
    </main>
    <ClosingSection onAppointment={() => setAppointment({ open: true, withContext: engaged })} />
    <AppointmentDialog open={appointment.open} context={appointment.withContext ? context : null} onClose={() => setAppointment(current => ({ ...current, open: false }))} />
  </>;
}
