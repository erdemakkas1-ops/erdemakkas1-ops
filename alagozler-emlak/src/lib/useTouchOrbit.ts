"use client";

import { useEffect, type RefObject } from "react";
import { TOUCH } from "three";
import type { OrbitControls } from "three-stdlib";

/**
 * Touch devices: one finger rotates (the browser keeps vertical swipes for page scroll via
 * touch-action: pan-y in globals.css, so only horizontal drags reach the controls), two fingers
 * rotate or zoom where zoom is enabled.
 */
export function useTouchOrbit(ref: RefObject<OrbitControls | null>) {
  useEffect(() => {
    const controls = ref.current;
    if (!controls?.domElement) return;
    const target = controls.domElement;
    const touch = window.matchMedia("(pointer: coarse)");
    const original = { ...controls.touches };
    const configure = () => {
      controls.touches.ONE = touch.matches ? TOUCH.ROTATE : original.ONE;
      controls.touches.TWO = touch.matches ? TOUCH.DOLLY_ROTATE : original.TWO;
    };
    // Keep a two-finger gesture on the model instead of letting it pinch-zoom the page.
    const keepTwoFingerGesture = (event: TouchEvent) => {
      if (touch.matches && event.touches.length === 2 && event.cancelable) event.preventDefault();
    };
    configure();
    touch.addEventListener("change", configure);
    target.addEventListener("touchmove", keepTwoFingerGesture, { passive: false });
    return () => {
      touch.removeEventListener("change", configure);
      target.removeEventListener("touchmove", keepTwoFingerGesture);
      Object.assign(controls.touches, original);
    };
  }, [ref]);
}
