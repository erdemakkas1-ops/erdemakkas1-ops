import { FLOOR_COUNT } from "@/lib/buildingConfig";
import { apartmentsByFloor } from "./apartments";

// Representative residence used to demonstrate the 3D project presentation.
// It is NOT a building developed by Alagözler; replace with a real project when one is supplied.
export const project = {
  name: "ÖRNEK",
  descriptor: "Rezidans · 3D Demo",
  eyebrow: "Temsili proje · 3D tanıtım deneyimi",
  headline: ["Projenizi", "katı katı gezin."],
  intro: "Bu bölüm, Alagözler'in yeni projelerinin nasıl sunulabileceğini gösteren temsili bir rezidans demosudur. Kat ve daire seçin, planları inceleyin, ödeme planını hesaplayın.",
  delivery: "2027",
};

const allApartments = Object.values(apartmentsByFloor).flat();

export const projectStats = [
  { value: String(allApartments.length), label: "Konut" },
  { value: String(FLOOR_COUNT), label: "Kat" },
  { value: String(new Set(allApartments.map(apartment => apartment.type)).size), label: "Daire tipi" },
  { value: project.delivery, label: "Teslim" },
];

/** Shown in the plan and payment sections before a visitor picks an apartment. */
export const DEFAULT_APARTMENT_ID = "12A";

export const sections = [
  { id: "proje", label: "Proje" },
  { id: "kat-planlari", label: "Kat Planları" },
  { id: "odeme", label: "Ödeme" },
  { id: "konum", label: "Konum" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
