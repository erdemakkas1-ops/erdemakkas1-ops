"use client";

import { useEffect, useRef, useState } from "react";

// Convert label pixels to SVG units without changing the drawing's viewBox.
export function useSvgScale(viewWidth: number, viewHeight: number) {
  const ref = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (width > 0 && height > 0) setScale(Math.min(width / viewWidth, height / viewHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [viewWidth, viewHeight]);
  return { ref, scale };
}
