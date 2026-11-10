import type { Listing, ListingImage, ListingKind } from "@/types/listing";

/*
 * DEMO LISTINGS — every record below is illustrative (demo: true): prices, areas, parcel details
 * and coordinates are examples, not Alagözler's real portfolio. To publish real listings, add
 * records in the same shape with demo: false and real photos in images[].src
 * (e.g. "/ilanlar/<slug>/1.jpg" under public/).
 */

const views: Record<ListingKind, string[]> = {
  arsa: ["genel görünüm", "parsel sınırları", "yol cephesi", "çevre"],
  tarla: ["genel görünüm", "ekili alan", "arazi sınırı", "çevre"],
  daire: ["bina cephesi", "salon", "yaşam alanı", "çevre"],
  mustakil: ["ev ve bahçe", "ön cephe", "bahçe", "çevre"],
  diger: ["cephe", "iç mekan", "giriş", "çevre"],
};

/** Representative illustrations until real photos are supplied. */
function illustrations(kind: ListingKind, title: string): ListingImage[] {
  return views[kind].map(view => ({ alt: `${title} — ${view} (temsili görsel)` }));
}

const SANLIURFA = "Şanlıurfa";

export const listings: Listing[] = [
  {
    id: "AE-1001", slug: "karakopru-1-5-donum-satilik-arsa", kind: "arsa", status: "satilik",
    title: "Karaköprü'de 1,5 Dönüm Satılık Arsa", price: 3_150_000, area: 1500,
    city: SANLIURFA, district: "Karaköprü", neighborhood: "Şenevler çevresi",
    coords: { lat: 37.2235, lng: 38.7812, approximate: true },
    summary: "Merkeze yakın, elektrik ve şebeke suyu bulunan, asfalt yola cepheli arsa.",
    description: [
      "Karaköprü'nün gelişen bölgesinde, şehir merkezine kısa mesafede konumlanan 1,5 dönümlük arsa; konut veya hobi bahçesi yatırımı için uygun.",
      "Parsele elektrik ve şebeke suyu ulaşmaktadır. Asfalt yola cephesi sayesinde ulaşım her mevsim kolaydır.",
    ],
    highlights: ["Asfalt yola cephe", "Elektrik mevcut", "Şebeke suyu mevcut", "Merkeze yakın"],
    zoning: "Tarla vasfında (imar durumu teyit edilecek)", deed: "Müstakil tapu", roadAccess: "Asfalt yola cepheli",
    utilities: ["Elektrik", "Şebeke suyu"], distanceToCenter: "Yaklaşık 12 km",
    images: illustrations("arsa", "Karaköprü 1,5 dönüm arsa"), publishedAt: "2026-11-06", featured: true, demo: true,
  },
  {
    id: "AE-1002", slug: "haliliye-konut-imarli-arsa", kind: "arsa", status: "satilik",
    title: "Haliliye'de Konut İmarlı Köşe Parsel", price: 4_200_000, area: 520,
    city: SANLIURFA, district: "Haliliye", neighborhood: "Batıkent",
    coords: { lat: 37.1702, lng: 38.8215, approximate: true },
    summary: "İki yola cepheli, konut imarlı, yapılaşmaya hazır köşe parsel.",
    description: [
      "Haliliye'nin yerleşik bölgesinde, iki yola cepheli köşe parsel. Konut imarlı olup apartman veya villa projesi için değerlendirilebilir.",
      "Okul, market ve toplu taşıma noktaları yürüme mesafesindedir.",
    ],
    highlights: ["Köşe parsel", "Konut imarlı", "İki yola cephe", "Altyapı hazır"],
    zoning: "Konut imarlı (demo)", deed: "Müstakil tapu", roadAccess: "İki yola cepheli",
    utilities: ["Elektrik", "Şebeke suyu", "Kanalizasyon"], distanceToCenter: "Yaklaşık 4 km",
    images: illustrations("arsa", "Haliliye köşe parsel"), publishedAt: "2026-10-28", featured: true, demo: true,
  },
  {
    id: "AE-1003", slug: "eyyubiye-yatirimlik-arsa", kind: "arsa", status: "satilik",
    title: "Eyyübiye'de Yatırımlık Arsa", price: 2_650_000, area: 2400,
    city: SANLIURFA, district: "Eyyübiye",
    coords: { lat: 37.1265, lng: 38.7628, approximate: true },
    summary: "Gelişim aksında, uzun vadeli yatırım için uygun geniş arsa.",
    description: [
      "Eyyübiye'nin gelişim aksında yer alan geniş arsa, uzun vadeli değer artışı hedefleyen yatırımcılar için uygundur.",
      "Bölgede yeni yol ve konut projeleri planlanmaktadır; güncel imar bilgisi için danışmanımızla görüşün.",
    ],
    highlights: ["Gelişim bölgesi", "Geniş cephe", "Yatırıma uygun"],
    zoning: "Teyit edilecek", deed: "Hisseli tapu (demo)", roadAccess: "Stabilize yola cephe",
    utilities: ["Elektrik yakında"], distanceToCenter: "Yaklaşık 9 km",
    images: illustrations("arsa", "Eyyübiye yatırımlık arsa"), publishedAt: "2026-10-12", demo: true,
  },
  {
    id: "AE-2001", slug: "harran-ovasi-sulu-tarla", kind: "tarla", status: "satilik",
    title: "Harran Ovası'nda 18 Dönüm Sulu Tarla", price: 7_900_000, area: 18000,
    city: SANLIURFA, district: "Harran",
    coords: { lat: 36.9012, lng: 39.0105, approximate: true },
    summary: "Sulama kanalına yakın, verimli toprak yapısına sahip düz tarla.",
    description: [
      "Harran Ovası'nın verimli topraklarında, sulama imkanı bulunan düz ve tek parça tarla. Pamuk, buğday ve mısır ekimine elverişlidir.",
      "Traktör ve iş makinelerinin rahatça ulaşabileceği köy yoluna cephelidir.",
    ],
    highlights: ["Sulama imkanı", "Düz arazi", "Tek parça", "Verimli toprak"],
    zoning: "Tarım arazisi", deed: "Müstakil tapu", roadAccess: "Köy yoluna cephe",
    utilities: ["Sulama kanalı", "Elektrik direği yakın"], distanceToCenter: "Yaklaşık 40 km",
    images: illustrations("tarla", "Harran sulu tarla"), publishedAt: "2026-11-03", featured: true, demo: true,
  },
  {
    id: "AE-2002", slug: "bozova-fistik-bahcesi", kind: "tarla", status: "satilik",
    title: "Bozova'da Fıstık Bahçesi", price: 2_950_000, area: 9500,
    city: SANLIURFA, district: "Bozova",
    coords: { lat: 37.3702, lng: 38.5121, approximate: true },
    summary: "Verim çağında fıstık ağaçlarıyla dikili, bakımlı bahçe.",
    description: [
      "Bozova'da, verim çağına girmiş antep fıstığı ağaçlarıyla dikili bakımlı bahçe.",
      "Bahçe çevresi sınırlandırılmış olup ulaşımı kolaydır.",
    ],
    highlights: ["Dikili fıstık ağaçları", "Bakımlı bahçe", "Kolay ulaşım"],
    zoning: "Tarım arazisi", deed: "Müstakil tapu", roadAccess: "Toprak yola cephe",
    utilities: ["Kuyu (teyit edilecek)"], distanceToCenter: "Bozova merkeze yaklaşık 6 km",
    images: illustrations("tarla", "Bozova fıstık bahçesi"), publishedAt: "2026-10-20", demo: true,
  },
  {
    id: "AE-2003", slug: "siverek-genis-tarim-arazisi", kind: "tarla", status: "satilik",
    title: "Siverek'te 25 Dönüm Tarım Arazisi", price: 4_600_000, area: 25000,
    city: SANLIURFA, district: "Siverek",
    coords: { lat: 37.7402, lng: 39.2905, approximate: true },
    summary: "Geniş, tek parça kuru tarım arazisi; hububat ekimine uygun.",
    description: [
      "Siverek'te geniş ve tek parça kuru tarım arazisi. Hububat ekimine uygun, hafif eğimli yapıdadır.",
    ],
    highlights: ["25 dönüm", "Tek parça", "Hububat ekimine uygun"],
    zoning: "Tarım arazisi", deed: "Müstakil tapu", roadAccess: "Köy yoluna cephe",
    distanceToCenter: "Siverek merkeze yaklaşık 14 km",
    images: illustrations("tarla", "Siverek tarım arazisi"), publishedAt: "2026-09-30", demo: true,
  },
  {
    id: "AE-3001", slug: "karakopru-3-1-satilik-daire", kind: "daire", status: "satilik",
    title: "Karaköprü'de 3+1 Geniş Daire", price: 3_450_000, area: 165,
    city: SANLIURFA, district: "Karaköprü", neighborhood: "Atatürk Mah.",
    coords: { lat: 37.1985, lng: 38.7978, approximate: true },
    summary: "Site içinde, asansörlü, otoparklı ve ebeveyn banyolu 3+1 daire.",
    description: [
      "Karaköprü'de site içinde, geniş salonlu ve ebeveyn banyolu 3+1 daire. Güneş alan cephesi ve açık mutfağıyla aileler için ideal.",
      "Sitede kapalı otopark, çocuk oyun alanı ve 7/24 güvenlik bulunmaktadır.",
    ],
    highlights: ["Site içinde", "Ebeveyn banyosu", "Kapalı otopark", "Asansör"],
    rooms: "3+1", netArea: 140, floor: "4", totalFloors: 10, buildingAge: "2 yıl", heating: "Kombi (doğalgaz)", bathrooms: 2,
    images: illustrations("daire", "Karaköprü 3+1 daire"), publishedAt: "2026-11-08", featured: true, demo: true,
  },
  {
    id: "AE-3002", slug: "haliliye-2-1-kiralik-daire", kind: "daire", status: "kiralik",
    title: "Haliliye'de Kiralık 2+1 Daire", price: 14_500, area: 110,
    city: SANLIURFA, district: "Haliliye", neighborhood: "Paşabağı",
    coords: { lat: 37.1598, lng: 38.8061, approximate: true },
    summary: "Merkezi konumda, toplu taşımaya yakın, bakımlı 2+1 kiralık daire.",
    description: [
      "Haliliye'nin merkezi bir noktasında, toplu taşımaya ve çarşıya yakın bakımlı 2+1 daire.",
    ],
    highlights: ["Merkezi konum", "Toplu taşımaya yakın", "Bakımlı"],
    rooms: "2+1", netArea: 95, floor: "2", totalFloors: 5, buildingAge: "12 yıl", heating: "Kombi (doğalgaz)", bathrooms: 1,
    images: illustrations("daire", "Haliliye 2+1 kiralık daire"), publishedAt: "2026-11-01", demo: true,
  },
  {
    id: "AE-3003", slug: "karakopru-4-1-lux-daire", kind: "daire", status: "satilik",
    title: "Karaköprü'de 4+1 Lüks Daire", price: 5_250_000, area: 210,
    city: SANLIURFA, district: "Karaköprü", neighborhood: "Doğukent",
    coords: { lat: 37.2118, lng: 38.8102, approximate: true },
    summary: "Şehir manzaralı, geniş balkonlu, yüksek tavanlı 4+1 daire.",
    description: [
      "Doğukent'te şehir manzaralı, geniş balkonlu ve yüksek tavanlı 4+1 daire. Ankastre mutfak ve giyinme odası mevcuttur.",
    ],
    highlights: ["Şehir manzarası", "Giyinme odası", "Ankastre mutfak", "Geniş balkon"],
    rooms: "4+1", netArea: 180, floor: "8", totalFloors: 12, buildingAge: "Sıfır", heating: "Yerden ısıtma", bathrooms: 2,
    images: illustrations("daire", "Karaköprü 4+1 daire"), publishedAt: "2026-10-25", demo: true,
  },
  {
    id: "AE-4001", slug: "karakopru-bahceli-mustakil-ev", kind: "mustakil", status: "satilik",
    title: "Karaköprü'de Bahçeli Müstakil Ev", price: 6_800_000, area: 240,
    city: SANLIURFA, district: "Karaköprü",
    coords: { lat: 37.2302, lng: 38.7655, approximate: true },
    summary: "600 m² bahçe içinde, iki katlı, müstakil girişli 4+1 ev.",
    description: [
      "600 m² arsa içinde konumlanan, iki katlı ve müstakil girişli 4+1 ev. Meyve ağaçlarıyla çevrili bahçesi ve kapalı garajı bulunur.",
    ],
    highlights: ["600 m² bahçe", "Kapalı garaj", "Meyve ağaçları", "İki kat"],
    rooms: "4+1", netArea: 210, totalFloors: 2, buildingAge: "5 yıl", heating: "Kombi (doğalgaz)", bathrooms: 2, landArea: 600,
    images: illustrations("mustakil", "Karaköprü bahçeli müstakil ev"), publishedAt: "2026-11-05", featured: true, demo: true,
  },
  {
    id: "AE-4002", slug: "eyyubiye-mustakil-ev", kind: "mustakil", status: "satilik",
    title: "Eyyübiye'de 3+1 Müstakil Ev", price: 2_450_000, area: 150,
    city: SANLIURFA, district: "Eyyübiye",
    coords: { lat: 37.1352, lng: 38.7801, approximate: true },
    summary: "Avlulu, tek katlı, yenilenmiş 3+1 müstakil ev.",
    description: [
      "Geleneksel avlu düzeninde, yakın zamanda yenilenmiş tek katlı 3+1 müstakil ev.",
    ],
    highlights: ["Avlulu", "Yenilenmiş", "Tek kat"],
    rooms: "3+1", netArea: 130, totalFloors: 1, buildingAge: "20+ yıl (yenilendi)", heating: "Soba / klima", bathrooms: 1, landArea: 300,
    images: illustrations("mustakil", "Eyyübiye müstakil ev"), publishedAt: "2026-10-16", demo: true,
  },
  {
    id: "AE-5001", slug: "haliliye-kiralik-dukkan", kind: "diger", status: "kiralik",
    title: "Haliliye'de Cadde Üzeri Kiralık Dükkan", price: 22_000, area: 85,
    city: SANLIURFA, district: "Haliliye",
    coords: { lat: 37.1632, lng: 38.7962, approximate: true },
    summary: "Yoğun yaya trafiğine sahip cadde üzerinde, vitrinli dükkan.",
    description: [
      "Haliliye'de yoğun yaya trafiğine sahip cadde üzerinde, geniş vitrinli ve depolu kiralık dükkan.",
    ],
    highlights: ["Cadde üzeri", "Geniş vitrin", "Depolu"],
    subtype: "Dükkan", frontage: "8 m vitrin",
    images: illustrations("diger", "Haliliye kiralık dükkan"), publishedAt: "2026-11-02", demo: true,
  },
  {
    id: "AE-5002", slug: "karakopru-satilik-depo-isyeri", kind: "diger", status: "satilik",
    title: "Karaköprü'de Satılık Depo / İşyeri", price: 5_900_000, area: 400,
    city: SANLIURFA, district: "Karaköprü",
    coords: { lat: 37.2405, lng: 38.8012, approximate: true },
    summary: "Tır girişine uygun, yüksek tavanlı depo ve ofis alanı.",
    description: [
      "Ana yola yakın, tır girişine uygun yüksek tavanlı depo; içinde ofis ve WC bulunmaktadır.",
    ],
    highlights: ["Tır girişi", "Yüksek tavan", "Ofis alanı"],
    subtype: "Depo / İşyeri", frontage: "Ana yola yakın",
    images: illustrations("diger", "Karaköprü depo"), publishedAt: "2026-10-08", demo: true,
  },
];
