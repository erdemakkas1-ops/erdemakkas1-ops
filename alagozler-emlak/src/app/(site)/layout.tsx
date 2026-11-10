import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import ScrollMotion from "@/components/motion/ScrollMotion";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>
    <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[#1c1b19] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">İçeriğe geç</a>
    <SiteNav />
    <main id="icerik">{children}</main>
    <SiteFooter />
    <WhatsAppFab />
    <ScrollMotion />
  </>;
}
