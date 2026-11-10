"use client";

import Link from "next/link";
import { listings } from "@/data/listings";
import { useFavorites } from "@/lib/useFavorites";
import ListingCard from "./ListingCard";

export default function FavoritesList() {
  const { ids } = useFavorites();
  const saved = listings.filter(listing => ids.includes(listing.id));
  if (saved.length === 0) return <div className="mt-10 rounded-[1.4rem] border border-dashed border-[#1c1b19]/15 px-6 py-16 text-center">
    <p className="font-serif text-2xl">Henüz favori ilanınız yok.</p>
    <p className="mt-2 text-sm text-[#6b655c]">İlan kartlarındaki kalp simgesine dokunarak kaydedebilirsiniz.</p>
    <Link href="/ilanlar" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#1c1b19] px-6 text-sm font-semibold text-white">İlanları incele</Link>
  </div>;
  return <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{saved.map(listing => <li key={listing.id}><ListingCard listing={listing} headingLevel={2} /></li>)}</ul>;
}
