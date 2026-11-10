import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Manrope, Syne } from "next/font/google";
import { business } from "@/config/business";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const sans = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
// Used by the 3D project experience.
const display = Syne({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-syne", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${business.name} — Şanlıurfa Gayrimenkul`, template: `%s · ${business.shortName} Emlak` },
  description: "Şanlıurfa'da satılık arsa, tarla, daire ve müstakil ev ilanları; gayrimenkul danışmanlığı, yatırım ve 3D proje tanıtımı.",
};

export const viewport: Viewport = { themeColor: "#f6f3ee" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" className={`${serif.variable} ${sans.variable} ${display.variable} ${mono.variable}`}><body>{children}</body></html>;
}
