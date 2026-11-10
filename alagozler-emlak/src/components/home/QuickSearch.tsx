"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { districtsOf, kindLabels, kindOrder } from "@/lib/listings";
import { IconArrow } from "../site/icons";

/** Hero search: sends the visitor straight into the filtered catalogue. */
export default function QuickSearch() {
  const router = useRouter();
  const [kind, setKind] = useState("");
  const [district, setDistrict] = useState("");
  const field = "h-13 w-full cursor-pointer appearance-none rounded-full bg-white/95 px-5 text-[15px] font-medium text-[#1c1b19] outline-none focus:ring-2 focus:ring-[#c9a86a]";
  return <form role="search" aria-label="Hızlı ilan arama" onSubmit={event => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (kind) params.set("tur", kind);
    if (district) params.set("ilce", district);
    router.push(`/ilanlar${params.size ? `?${params}` : ""}`);
  }} className="flex max-w-3xl flex-col gap-2 rounded-[1.8rem] bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur-md sm:flex-row sm:rounded-full">
    <label className="flex-1"><span className="sr-only">Gayrimenkul türü</span>
      <select value={kind} onChange={event => setKind(event.target.value)} className={field}>
        <option value="">Tüm gayrimenkuller</option>
        {kindOrder.map(item => <option key={item} value={item}>{kindLabels[item].single}</option>)}
      </select>
    </label>
    <label className="flex-1"><span className="sr-only">İlçe</span>
      <select value={district} onChange={event => setDistrict(event.target.value)} className={field}>
        <option value="">Tüm ilçeler</option>
        {districtsOf("").map(item => <option key={item}>{item}</option>)}
      </select>
    </label>
    <button type="submit" className="flex h-13 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#c9a86a] px-7 text-[15px] font-semibold text-[#1c1b19] transition-colors hover:bg-[#d8bd86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      Gayrimenkulleri incele <IconArrow className="h-4 w-4" />
    </button>
    <noscript><Link href="/ilanlar">İlanlar</Link></noscript>
  </form>;
}
