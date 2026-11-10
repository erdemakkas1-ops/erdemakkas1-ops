"use client";

import { useEffect, useRef } from "react";
import { mediaSrc } from "@/data/media";

/**
 * Muted, looping background clip. Loads nothing until needed (preload="none" + poster), plays only
 * while visible ("view") or while the parent link/card is hovered on a mouse ("hover"), and stays a
 * still image for prefers-reduced-motion and data-saver visitors.
 */
export default function AmbientVideo({ src, poster, mode = "view", fit = "cover", label, className = "" }: { src: string; poster: string; mode?: "view" | "hover"; fit?: "cover" | "contain"; label?: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const play = () => { node.play().catch(() => { /* autoplay blocked: poster stays */ }); };
    const pause = () => node.pause();
    if (mode === "hover") {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const host = node.closest("a, article, li") ?? node.parentElement;
      host?.addEventListener("pointerenter", play);
      host?.addEventListener("pointerleave", pause);
      return () => { host?.removeEventListener("pointerenter", play); host?.removeEventListener("pointerleave", pause); };
    }
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);
  return <video ref={video} src={mediaSrc(src)} poster={mediaSrc(poster)} muted loop playsInline preload="none" aria-hidden={label ? undefined : true} aria-label={label} tabIndex={-1} className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`} />;
}
