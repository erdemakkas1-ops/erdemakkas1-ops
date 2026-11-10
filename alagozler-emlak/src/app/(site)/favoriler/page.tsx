import type { Metadata } from "next";
import FavoritesList from "@/components/listings/FavoritesList";

export const metadata: Metadata = { title: "Favorilerim", robots: { index: false } };

export default function FavoritesPage() {
  return <div className="mx-auto min-h-[70svh] max-w-[1400px] px-5 pb-24 pt-28 sm:px-8 lg:pt-36">
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a88a55]">Kaydettikleriniz</p>
    <h1 className="mt-3 font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.95]">Favorilerim</h1>
    <p className="mt-4 max-w-2xl text-[15px] text-[#5d574e]">Favoriler bu tarayıcıda saklanır; hesap gerekmez.</p>
    <FavoritesList />
  </div>;
}
