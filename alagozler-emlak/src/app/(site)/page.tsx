import HomeHero from "@/components/home/HomeHero";
import Categories from "@/components/home/Categories";
import ListingRow from "@/components/home/ListingRow";
import ProjectTeaser from "@/components/home/ProjectTeaser";
import Services from "@/components/home/Services";
import ContactSection from "@/components/home/ContactSection";
import { featuredListings, newestListings } from "@/lib/listings";

export default function Home() {
  const featured = featuredListings().slice(0, 3);
  const featuredIds = new Set(featured.map(listing => listing.id));
  const newest = newestListings(9).filter(listing => !featuredIds.has(listing.id)).slice(0, 3);
  return <>
    <HomeHero />
    <ListingRow id="one-cikan" eyebrow="Öne çıkan ilanlar" title="Seçili gayrimenkuller" intro="Danışmanlarımızın öne çıkardığı arsa, tarla ve konutlar." items={featured} href="/ilanlar" />
    <Categories />
    <ProjectTeaser />
    <ListingRow id="yeni-ilanlar" eyebrow="Yeni ilanlar" title="Son eklenenler" items={newest} href="/ilanlar?sirala=yeni" tinted />
    <Services />
    <ContactSection />
  </>;
}
