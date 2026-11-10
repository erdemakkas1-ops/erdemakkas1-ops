import type { LocationPoi } from "@/types/location";

// Illustrative coordinates and travel times; no real geography is represented.
export const locationProject = { name: "PROJECT", x: 450, y: 345 };
export const locationPois: LocationPoi[] = [
  { id: "coast", name: "Sahil", minutes: 4, x: 685, y: 410, route: "M450 345L510 352Q550 355 565 390L595 440Q620 462 645 440L685 410" },
  { id: "hospital", name: "Hastane", minutes: 7, x: 285, y: 220, route: "M450 345L390 340Q365 338 350 305L325 250Q312 222 285 220" },
  { id: "mall", name: "AVM", minutes: 9, x: 340, y: 510, route: "M450 345L440 420Q438 458 400 478L340 510" },
  { id: "metro", name: "Metro", minutes: 12, x: 540, y: 155, route: "M450 345L470 270Q480 238 510 215L540 195V155" },
  { id: "university", name: "Üniversite", minutes: 15, x: 170, y: 375, route: "M450 345L390 340L310 350Q270 360 230 370L170 375" },
  { id: "airport", name: "Havalimanı", minutes: 25, x: 195, y: 115, route: "M450 345L390 340L350 305L325 250L285 220Q255 200 235 165L195 115" },
];
