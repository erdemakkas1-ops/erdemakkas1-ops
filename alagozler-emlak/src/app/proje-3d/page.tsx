import type { Metadata, Viewport } from "next";
import ProjectExperience from "@/components/ProjectExperience";

export const metadata: Metadata = {
  title: "3D Proje Deneyimi (Örnek)",
  description: "Temsili bir rezidans üzerinde kat ve daire seçimi, 2D/3D kat planları ve ödeme planı hesaplama demosu.",
};
export const viewport: Viewport = { themeColor: "#0e0d0c" };

export default function Project3DPage() {
  return <div className="experience-dark"><ProjectExperience /></div>;
}
