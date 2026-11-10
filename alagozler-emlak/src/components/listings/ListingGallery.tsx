"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/types/listing";
import { IconArrow, IconClose } from "../site/icons";
import ListingVisual, { isIllustration } from "./ListingVisual";

/** Large gallery with crossfading slides, thumbnails, swipe, keyboard and a full-screen view. */
export default function ListingGallery({ listing }: { listing: Listing }) {
  const count = listing.images.length;
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const go = (step: number) => setIndex(current => (current + step + count) % count);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (full && !node.open) node.showModal();
    if (!full && node.open) node.close();
  }, [full]);

  const swipe = {
    onTouchStart: (event: React.TouchEvent) => { touchX.current = event.touches[0].clientX; },
    onTouchEnd: (event: React.TouchEvent) => {
      if (touchX.current === null) return;
      const delta = event.changedTouches[0].clientX - touchX.current;
      if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
      touchX.current = null;
    },
  };
  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const slides = (sizing: string) => listing.images.map((image, i) =>
    <div key={i} aria-hidden={i !== index} className={`gallery-slide absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${i === index ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0"}`}>
      <ListingVisual listing={listing} index={i} sizes={sizing} priority={i === 0} />
    </div>);

  const arrows = (dark: boolean) => count > 1 && <>
    <button type="button" onClick={() => go(-1)} aria-label="Önceki görsel" className={`absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full backdrop-blur transition-colors ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#f6f3ee]/85 text-[#1c1b19] hover:bg-white"}`}><IconArrow className="h-5 w-5 rotate-180" /></button>
    <button type="button" onClick={() => go(1)} aria-label="Sonraki görsel" className={`absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full backdrop-blur transition-colors ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#f6f3ee]/85 text-[#1c1b19] hover:bg-white"}`}><IconArrow className="h-5 w-5" /></button>
  </>;

  return <div role="region" aria-roledescription="galeri" aria-label={`${listing.title} görselleri`} onKeyDown={onKey}>
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#e9e4dc] sm:aspect-[16/10]" {...swipe}>
      {slides("(min-width: 1024px) 60vw, 100vw")}
      <button type="button" onClick={() => setFull(true)} className="absolute inset-0 cursor-zoom-in" aria-label="Görseli tam ekran aç" />
      {arrows(false)}
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#1c1b19]/60 px-3 py-1 text-xs text-white backdrop-blur" aria-live="polite">
        {index + 1} / {count}{isIllustration(listing, index) && " · Temsili görsel"}
      </p>
    </div>
    {count > 1 && <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
      {listing.images.map((image, i) => <li key={i}>
        <button type="button" onClick={() => setIndex(i)} aria-label={`${i + 1}. görsel: ${image.alt}`} aria-current={i === index} className={`block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl ring-offset-2 ring-offset-[#f6f3ee] transition-[opacity,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a86a] ${i === index ? "ring-2 ring-[#1c1b19]" : "opacity-60 hover:opacity-100"}`}>
          <ListingVisual listing={listing} index={i} sizes="20vw" />
        </button>
      </li>)}
    </ul>}

    <dialog ref={dialog} aria-label={`${listing.title} tam ekran galeri`} onClose={() => setFull(false)} onKeyDown={onKey} className="m-0 h-full max-h-none w-full max-w-none bg-[#0e0d0c] p-0 text-white backdrop:bg-black">
      <div className="relative h-full w-full" {...swipe}>
        {full && slides("100vw")}
        {arrows(true)}
        <button type="button" onClick={() => setFull(false)} aria-label="Tam ekranı kapat" className="absolute right-4 top-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"><IconClose className="h-6 w-6" /></button>
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm">{index + 1} / {count}</p>
      </div>
    </dialog>
  </div>;
}
