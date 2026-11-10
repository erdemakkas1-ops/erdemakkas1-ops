import type { Metadata } from "next";
import { Suspense } from "react";
import ListingCatalog from "@/components/listings/ListingCatalog";

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Şanlıurfa'da satılık ve kiralık arsa, tarla, daire, müstakil ev ve ticari gayrimenkul ilanları.",
};

export default function ListingsPage() {
  return <Suspense fallback={<div className="min-h-svh" />}><ListingCatalog /></Suspense>;
}
